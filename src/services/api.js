const API_URL = 'http://localhost:4000';

// Helper to get headers (including token if it exists)
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ✅ Centralized Response Handler
const handleResponse = async res => {
  if (res.status === 401) {
    console.warn('Session expired. Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return null;
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw errorData;
  }

  return res.json();
};

export const authService = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  signup: async userData => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

export const userService = {
  // ✅ UPDATED: Accepts FormData for file uploads
  updateProfile: async (userId, formData) => {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        // ⚠️ IMPORTANT: No 'Content-Type' here! Browser detects multipart/form-data automatically.
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Sending the FormData object directly
    });
    return handleResponse(res);
  },

  updateLanguage: async (userId, language) => {
    const res = await fetch(`${API_URL}/api/users/${userId}/language`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ language }),
    });
    return handleResponse(res);
  },

  updateTheme: async (userId, theme) => {
    const res = await fetch(`${API_URL}/api/users/${userId}/theme`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ theme }),
    });
    return handleResponse(res);
  },

  deleteAccount: async userId => {
    const res = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

export const disasterService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/api/disasters`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

export const volunteerService = {
  getAllEvents: async () => {
    const res = await fetch(`${API_URL}/api/volunteer`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createEvent: async formData => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/volunteer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(res);
  },
};
