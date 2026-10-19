const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function getActiveUserId() {
  return localStorage.getItem('wardrobe_user_id') || 'default-user';
}

export function setActiveUserId(userId) {
  localStorage.setItem('wardrobe_user_id', userId);
}

async function request(endpoint, options = {}) {
  const userId = getActiveUserId();
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId,
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
  }

  return data;
}

export const api = {
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
  },

  // Users
  async getCurrentUser() {
    return request('/users/current');
  },

  async getUsers() {
    return request('/users');
  },

  async createUser(username, name, loadSample = true) {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify({ username, name, loadSample })
    });
  }
};
