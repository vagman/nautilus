import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

import nautilusDarkLogo from '../assets/nautilus.png';

function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { darkMode, toggleTheme, syncUserTheme } = useTheme();

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
  };

  const handleChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
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

      syncUserTheme(data.user);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-slate-900 dark:to-indigo-950 transition-colors duration-500 z-50">
      <div className="hidden md:flex flex-col items-start justify-center p-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-l-2xl shadow-2xl h-[500px] transition-colors duration-300">
        <img
          src={darkMode ? nautilusDarkLogo : '/nautilus-white-bg.png'}
          alt="Nautilus logo"
          className="w-20 mb-6"
        />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to Nautilus
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Receive real-time alerts for natural disasters and extreme weather
          phenomena in your area.
        </p>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Right Side: Form */}
      <div className="w-full max-w-sm md:max-w-xs bg-indigo-900 dark:bg-black/40 p-8 rounded-2xl md:rounded-l-none md:rounded-r-2xl shadow-2xl h-auto md:h-[500px] flex flex-col justify-center text-white">
        <h2 className="text-2xl font-bold text-center mb-8">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div className="flex items-center bg-white rounded-lg px-3 py-2">
              <span className="text-gray-500 mr-2">👤</span>
              <input
                className="bg-transparent border-none outline-none text-gray-800 w-full placeholder-gray-400"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="flex items-center bg-white rounded-lg px-3 py-2">
            <span className="text-gray-500 mr-2">📧</span>
            <input
              className="bg-transparent border-none outline-none text-gray-800 w-full placeholder-gray-400"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-lg px-3 py-2 relative">
            <span className="text-gray-500 mr-2">🔒</span>
            <input
              className="bg-transparent border-none outline-none text-gray-800 w-full placeholder-gray-400"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && (
            <p className="text-red-300 text-sm font-bold text-center mt-1">
              {error}
            </p>
          )}

          <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold py-2 rounded-lg transition-colors shadow-md">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button
          className="mt-6 text-sm text-indigo-200 hover:text-white underline"
          onClick={switchMode}
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
