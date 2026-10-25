// Centralized API Service for Krishi Mitra AI Platform

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.origin}/api/v1`
    : 'http://127.0.0.1:8000/api/v1'
);

function getAuthHeader() {
  try {
    const saved = localStorage.getItem('farmerAuth');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.token) {
        return { Authorization: `Bearer ${parsed.token}` };
      }
    }
  } catch (e) {
    // ignore
  }
  return {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeader(),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Authentication
  auth: {
    register: (data) => request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    login: (data) => request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    guest: () => request('/auth/guest', { method: 'POST' }),
    me: () => request('/auth/me')
  },

  // AI Assistant & Voice
  assistant: {
    chat: (query, language = 'English', location = 'Ludhiana, Punjab') => request('/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, location })
    }),
    processVoice: (transcriptText, language = 'Hindi', location = 'Ludhiana, Punjab') => request('/assistant/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript_text: transcriptText, language, location })
    }),
    getVoiceConfig: () => request('/assistant/voice-config')
  },

  // Crop Disease Detection
  disease: {
    predict: async (formData) => {
      const url = `${API_BASE_URL}/disease/predict`;
      const headers = getAuthHeader();
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Disease diagnosis request failed');
      }
      return await res.json();
    },
    getClasses: () => request('/disease/classes'),
    getHistory: () => request('/disease/history')
  },

  // Market Prices
  market: {
    getPrices: (commodity = '', state = '', category = '') => {
      const params = new URLSearchParams();
      if (commodity) params.append('commodity', commodity);
      if (state) params.append('state', state);
      if (category) params.append('category', category);
      return request(`/market/prices?${params.toString()}`);
    },
    getHistory: (commodity) => request(`/market/history/${encodeURIComponent(commodity)}`),
    sync: () => request('/market/sync', { method: 'POST' })
  },

  // Government Schemes
  schemes: {
    getAll: () => request('/schemes'),
    getById: (id) => request(`/schemes/${id}`),
    verifyLinks: () => request('/schemes/verify-links/status')
  },

  // Marketplace & Direct Procurement
  marketplace: {
    getListings: (commodity = '', minPrice = '', maxPrice = '', status = 'active') => {
      const params = new URLSearchParams();
      if (commodity) params.append('commodity', commodity);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      if (status) params.append('status', status);
      return request(`/marketplace/listings?${params.toString()}`);
    },
    createListing: (data) => request('/marketplace/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    getListing: (id) => request(`/marketplace/listings/${id}`),
    updateListing: (id, data) => request(`/marketplace/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    createEnquiry: (data) => request('/marketplace/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    getEnquiries: (listingId = null) => {
      const q = listingId ? `?listing_id=${listingId}` : '';
      return request(`/marketplace/enquiries${q}`);
    }
  },

  // Weather Advisory
  weather: {
    getWeather: (location = 'Ludhiana, Punjab') => request(`/weather?location=${encodeURIComponent(location)}`)
  },

  // System Administration
  admin: {
    getHealth: () => request('/admin/health'),
    getMetrics: () => request('/admin/metrics')
  }
};
