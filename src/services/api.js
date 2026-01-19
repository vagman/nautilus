const API_URL = 'http://localhost:4000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authService = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    // This catches 400/401 errors so you can see them in the frontend
    if (!res.ok) throw await res.json();
    return res.json(); // Returns { user, token }
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

  // You might need this for the Change Password page too!
  changePassword: async (userId, currentPassword, newPassword) => {
    const res = await fetch(`${API_URL}/api/users/${userId}/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};
