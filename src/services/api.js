const API_URL = 'http://localhost:4000';

// Helper to get headers (including token if it exists)
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authService = {
  // ✅ FIX 1: Accept email and password as separate arguments
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // ✅ FIX 2: Wrap them in an object before stringifying
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  signup: async userData => {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

export const userService = {
  updateLanguage: async (userId, language) => {
    const res = await fetch(`${API_URL}/api/users/${userId}/language`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ language }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  updateTheme: async (userId, theme) => {
    // ✅ FIX 3: Added '/api' to match the other routes for consistency
    const res = await fetch(`${API_URL}/api/users/${userId}/theme`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ theme }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  deleteAccount: async userId => {
    const res = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};
