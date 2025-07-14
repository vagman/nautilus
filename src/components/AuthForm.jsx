// AuthForm.jsx
import { useState } from 'react';
import './AuthForm.css';
import nautilusLightLogo from '../assets/nautilus-white-bg.png';
import nautilusDarkLogo from '../assets/nautilus.png';

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`auth-container ${darkMode ? 'dark' : ''}`}>
      <div className="auth-left">
        <img
          src={darkMode ? nautilusDarkLogo : nautilusLightLogo}
          alt="Nautilus logo"
          className="auth-logo"
        />
        <h2>Welcome to Nautilus</h2>
        <p>
          Receive real-time alerts for natural disasters and extreme weather
          phenomena in your area.
        </p>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="auth-card">
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon">🔒</span>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="submit-btn" type="submit">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button className="switch-btn" onClick={switchMode}>
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
