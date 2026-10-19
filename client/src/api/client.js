const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('wardrobe_auth_token') || null;
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('wardrobe_auth_token', token);
  } else {
    localStorage.removeItem('wardrobe_auth_token');
  }
}

export function getStoredUser() {
  const userJson = localStorage.getItem('wardrobe_auth_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('wardrobe_auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('wardrobe_auth_user');
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
  async login(username, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.token) {
      setAuthToken(res.token);
      setStoredUser(res.user);
    }
    return res;
  },

  async register(username, name, password, seedSample = true) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, name, password, seedSample })
    });
    if (res.token) {
      setAuthToken(res.token);
      setStoredUser(res.user);
    }
    return res;
  },

  async loginDemo() {
    const res = await request('/auth/demo', {
      method: 'POST'
    });
    if (res.token) {
      setAuthToken(res.token);
      setStoredUser(res.user);
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
    if (filters.weather && filters.weather !== 'All') params.append('weather', filters.weather);
    if (filters.occasion && filters.occasion !== 'All') params.append('occasion', filters.occasion);
    if (filters.search) params.append('search', filters.search);

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

  async generateRecommendations(weather, occasion, maxRecommendations = 5) {
    return request('/recommendations/generate', {
      method: 'POST',
      body: JSON.stringify({ weather, occasion, maxRecommendations })
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
