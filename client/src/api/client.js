const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('wardrobe_auth_token') || sessionStorage.getItem('wardrobe_auth_token') || null;
}

export function setAuthToken(token, remember = true) {
  if (token) {
    if (remember) {
      localStorage.setItem('wardrobe_auth_token', token);
      sessionStorage.removeItem('wardrobe_auth_token');
    } else {
      sessionStorage.setItem('wardrobe_auth_token', token);
      localStorage.removeItem('wardrobe_auth_token');
    }
  } else {
    localStorage.removeItem('wardrobe_auth_token');
    sessionStorage.removeItem('wardrobe_auth_token');
  }
}

export function getStoredUser() {
  const userJson = localStorage.getItem('wardrobe_auth_user') || sessionStorage.getItem('wardrobe_auth_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setStoredUser(user, remember = true) {
  if (user) {
    if (remember) {
      localStorage.setItem('wardrobe_auth_user', JSON.stringify(user));
      sessionStorage.removeItem('wardrobe_auth_user');
    } else {
      sessionStorage.setItem('wardrobe_auth_user', JSON.stringify(user));
      localStorage.removeItem('wardrobe_auth_user');
    }
  } else {
    localStorage.removeItem('wardrobe_auth_user');
    sessionStorage.removeItem('wardrobe_auth_user');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    // Session expired or unauthenticated
    setAuthToken(null);
    setStoredUser(null);
    window.dispatchEvent(new CustomEvent('wardrobe-auth-invalid'));
    throw new Error(data.error || 'Authentication required. Please log in.');
  }

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
  }

  return data;
}

export const api = {
  // Auth
  async login(identifierOrParams, passwordMaybe) {
    let email, username, password, rememberMe = true;
    if (typeof identifierOrParams === 'object' && identifierOrParams !== null) {
      email = identifierOrParams.email;
      username = identifierOrParams.username;
      password = identifierOrParams.password;
      if (identifierOrParams.rememberMe !== undefined) rememberMe = !!identifierOrParams.rememberMe;
    } else {
      if (typeof identifierOrParams === 'string' && identifierOrParams.includes('@')) {
        email = identifierOrParams;
      } else {
        username = identifierOrParams;
      }
      password = passwordMaybe;
    }

    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, username, password })
    });
    if (res.token) {
      setAuthToken(res.token, rememberMe);
      setStoredUser(res.user, rememberMe);
    }
    return res;
  },

  async register(paramsOrUsername, nameMaybe, passwordMaybe, seedSampleMaybe = true) {
    let email, username, name, password, seedSample = true, rememberMe = true, autoLogin = true;
    if (typeof paramsOrUsername === 'object' && paramsOrUsername !== null) {
      email = paramsOrUsername.email;
      username = paramsOrUsername.username;
      name = paramsOrUsername.name;
      password = paramsOrUsername.password;
      if (paramsOrUsername.seedSample !== undefined) seedSample = !!paramsOrUsername.seedSample;
      if (paramsOrUsername.rememberMe !== undefined) rememberMe = !!paramsOrUsername.rememberMe;
      if (paramsOrUsername.autoLogin !== undefined) autoLogin = !!paramsOrUsername.autoLogin;
    } else {
      username = paramsOrUsername;
      name = nameMaybe;
      password = passwordMaybe;
      seedSample = seedSampleMaybe;
    }

    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, name, password, seedSample })
    });
    if (res.token && autoLogin) {
      setAuthToken(res.token, rememberMe);
      setStoredUser(res.user, rememberMe);
    }
    return res;
  },

  async loginDemo() {
    const res = await request('/auth/demo', {
      method: 'POST'
    });
    if (res.token) {
      setAuthToken(res.token, true);
      setStoredUser(res.user, true);
    }
    return res;
  },

  logout() {
    setAuthToken(null);
    setStoredUser(null);
    window.dispatchEvent(new CustomEvent('wardrobe-auth-change'));
  },

  async getCurrentUser() {
    return request('/auth/me');
  },

  // Upload image
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return request('/upload', {
      method: 'POST',
      body: formData,
      isFormData: true
    });
  },

  // Items
  async getItems(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.sub_category && filters.sub_category !== 'All') params.append('sub_category', filters.sub_category);
    if (filters.color && filters.color !== 'All') params.append('color', filters.color);
    if (filters.weather && filters.weather !== 'All') params.append('weather', filters.weather);
    if (filters.season && filters.season !== 'All') params.append('season', filters.season);
    if (filters.occasion && filters.occasion !== 'All') params.append('occasion', filters.occasion);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return request(`/items${queryStr}`);
  },

  async getItem(id) {
    return request(`/items/${id}`);
  },

  async createItem(item) {
    return request('/items', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  async updateItem(id, item) {
    return request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    });
  },

  async deleteItem(id) {
    return request(`/items/${id}`, {
      method: 'DELETE'
    });
  },

  async resetSampleWardrobe() {
    return request('/items/reset-sample', {
      method: 'POST'
    });
  },

  async clearAllItems() {
    return request('/items/clear-all', {
      method: 'DELETE'
    });
  },

  // Recommendations
  async getWardrobeStatus() {
    return request('/recommendations/status');
  },

  async generateRecommendations(paramsOrWeather, occasionMaybe, seasonOrMax = 'All Seasons', maxRecommendations = 5) {
    let body = {};
    if (typeof paramsOrWeather === 'object' && paramsOrWeather !== null) {
      body = paramsOrWeather;
    } else {
      let season = 'All Seasons';
      let max = 5;
      if (typeof seasonOrMax === 'number') {
        max = seasonOrMax;
      } else if (typeof seasonOrMax === 'string') {
        season = seasonOrMax;
        max = maxRecommendations;
      }
      body = {
        weather: paramsOrWeather,
        occasion: occasionMaybe,
        season,
        maxRecommendations: max
      };
    }
    return request('/recommendations/generate', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  // Saved Outfits
  async getSavedOutfits() {
    return request('/outfits');
  },

  async saveOutfit(outfit) {
    return request('/outfits', {
      method: 'POST',
      body: JSON.stringify(outfit)
    });
  },

  async deleteOutfit(id) {
    return request(`/outfits/${id}`, {
      method: 'DELETE'
    });
  },

  async getRecommendationHistory() {
    return request('/outfits/history');
  },

  // Preferences
  async getPreferences() {
    return request('/preferences');
  },

  async updatePreferences(preferences) {
    return request('/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }
};
