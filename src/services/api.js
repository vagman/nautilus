const API_URL = 'http://localhost:4000';

// Helper to get headers (including token if it exists)
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ✅ NEW: Centralized Response Handler
// This checks if the server said "401 Unauthorized" (Expired Token)
// and automatically logs the user out.
const handleResponse = async res => {
  if (res.status === 401) {
    console.warn('Session expired. Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Force redirect to login
    return null;
  }

  // If some other error (like 400 or 500), throw it so the page can handle it
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
    // We don't use handleResponse here because we want to handle "Wrong Password" manually in the form
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

  // ... add forgot/reset password methods here if needed
};

export const userService = {
  updateLanguage: async (userId, language) => {
    const res = await fetch(`${API_URL}/api/users/${userId}/language`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ language }),
    });
    return handleResponse(res); // ✅ Uses auto-logout logic
  },

  updateTheme: async (userId, theme) => {
    const res = await fetch(`${API_URL}/api/users/${userId}/theme`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ theme }),
    });
    return handleResponse(res); // ✅ Uses auto-logout logic
  },

  deleteAccount: async userId => {
    const res = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// Add other services (disasters, volunteer) using the same pattern:
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
  // ... createEvent etc.
};
