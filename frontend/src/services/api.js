
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
  updateProfile: (data) => apiRequest('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updatePassword: (data) => apiRequest('/auth/update-password', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Leads API
export const leadsAPI = {
  getLeads: () => apiRequest('/leads'),
  getScrapedLeads: () => apiRequest('/leads/scraped'),
  moveToLeads: (leadIds) => apiRequest('/leads/move', {
    method: 'POST',
    body: JSON.stringify({ leadIds }),
  }),
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
  scrapeLeads: (query, location, webhookUrl) => apiRequest('/scraper/scrape', {
    method: 'POST',
    body: JSON.stringify({ query, location, webhookUrl }),
  }),
  auditWebsite: (site, leadId, forceRegenerate = false) => apiRequest('/scraper/audit', {
    method: 'POST',
    body: JSON.stringify({ site, leadId, forceRegenerate }),
  }),
  getUserAudits: () => apiRequest('/scraper/audits'),
  getAuditById: (id) => apiRequest(`/scraper/audits/${id}`),
  getGroupedAudits: () => apiRequest('/scraper/audits/grouped'),
  getAuditByLead: (leadId) => apiRequest(`/scraper/audits/lead/${leadId}`),
  clearSavedLeads: () => apiRequest('/scraper/clear', {
    method: 'DELETE',
  }),
};

// Meetings API
export const meetingsAPI = {
  getMeetings: () => apiRequest('/meetings'),
  createMeeting: (data) => apiRequest('/meetings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMeeting: (id, data) => apiRequest(`/meetings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMeeting: (id) => apiRequest(`/meetings/${id}`, {
    method: 'DELETE',
  }),
};

// Analytics API
export const analyticsAPI = {
  getStats: () => apiRequest('/analytics/stats'),
};

// AI API
export const aiAPI = {
  chatWithAI: (messages) => apiRequest('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  }),
  getChats: () => apiRequest('/ai/chats'),
  createChat: (chatData) => apiRequest('/ai/chats', {
    method: 'POST',
    body: JSON.stringify(chatData),
  }),
  updateChat: (id, chatData) => apiRequest(`/ai/chats/${id}`, {
    method: 'PUT',
    body: JSON.stringify(chatData),
  }),
  deleteChat: (id) => apiRequest(`/ai/chats/${id}`, {
    method: 'DELETE',
  }),
};

export default apiRequest;
