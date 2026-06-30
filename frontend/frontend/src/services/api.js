
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generic fetch wrapper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getMe: () => apiRequest('/auth/me'),
};

// Leads API
export const leadsAPI = {
  getLeads: () => apiRequest('/leads'),
  createLead: (leadData) => apiRequest('/leads', {
    method: 'POST',
    body: JSON.stringify(leadData),
  }),
  updateLead: (id, leadData) => apiRequest(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(leadData),
  }),
  deleteLead: (id) => apiRequest(`/leads/${id}`, {
    method: 'DELETE',
  }),
};

// Scraper API
export const scraperAPI = {
  scrapeLeads: (query, location) => apiRequest('/scraper/scrape', {
    method: 'POST',
    body: JSON.stringify({ query, location }),
  }),
  auditWebsite: (site) => apiRequest('/scraper/audit', {
    method: 'POST',
    body: JSON.stringify({ site }),
  }),
};

export default apiRequest;
