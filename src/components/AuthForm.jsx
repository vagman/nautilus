import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import ReactCountryFlag from 'react-country-flag';
import { Sun, Moon, ChevronDown, Check } from 'lucide-react';
import { authService } from '../services/api'; // ✅ Correct Import

import nautilusWhite from '../assets/nautilus-white.svg';
import nautilusDark from '../assets/nautilus-dark.svg';

function AuthForm({ onAuthSuccess }) {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme } = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown state
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let data;

      // ✅ Use authService instead of raw fetch
      if (isLogin) {
        // Login only needs email/password
        data = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Signup needs everything
        data = await authService.signup(formData);
      }

      // Save to LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Apply saved language preference
      if (data.user.language_preference) {
        i18n.changeLanguage(data.user.language_preference);
      }

      onAuthSuccess(data.user);
    } catch (err) {
      console.error(err);
      // ✅ Handle errors from the service (which throws the JSON response)
      setError(err.error || err.message || t('auth.authenticationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLangLabel = () => {
    if (i18n.language === 'el') return { code: 'GR', label: 'Ελληνικά' };
    return { code: 'US', label: 'English' };
  };

  const currentLang = getCurrentLangLabel();

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-slate-900 dark:to-indigo-950 transition-colors duration-500 z-50">
      {/* TOP RIGHT CONTROLS */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/80 dark:bg-black/40 text-gray-800 dark:text-yellow-400 hover:bg-white dark:hover:bg-black/60 shadow-sm backdrop-blur-md transition-all cursor-pointer"
        >
          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-black/40 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-black/60 shadow-sm backdrop-blur-md transition-all min-w-[130px] justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={currentLang.code}
                svg
                style={{ width: '1.2em', height: '1.2em' }}
              />
              <span className="text-sm font-medium">{currentLang.label}</span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isLangMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-full bg-white dark:bg-[#2d2d2d] rounded-lg shadow-xl border border-gray-100 dark:border-[#444] overflow-hidden animate-in fade-in zoom-in-50 duration-200">
              <button
                onClick={() => changeLanguage('en')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-[#444] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ReactCountryFlag countryCode="US" svg />
                  <span>English</span>
                </div>
                {i18n.language === 'en' && (
                  <Check size={14} className="text-blue-500" />
                )}
              </button>
              <button
                onClick={() => changeLanguage('el')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ReactCountryFlag countryCode="GR" svg />
                  <span>Ελληνικά</span>
                </div>
                {i18n.language === 'el' && (
                  <Check size={14} className="text-blue-500" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-[#2d2d44] rounded-2xl shadow-2xl flex max-w-4xl w-full overflow-hidden transition-colors duration-300 relative">
        {/* Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 w-1/2 bg-blue-50 dark:bg-[#252535] relative text-center">
          <div className="w-full flex flex-row items-center justify-center gap-5 mb-4 flex-nowrap">
            <img
              src={darkMode ? nautilusWhite : nautilusDark}
              alt="Nautilus logo"
              className="w-24 h-24 object-contain"
            />
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white m-0 whitespace-nowrap leading-none">
              Nautilus
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-3">
            {t('auth.welcome')}
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed opacity-90">
            {t('auth.appDescription')}
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
            {isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('auth.usernameLabel')}
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white outline-none"
                  value={formData.username}
                  onChange={e =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.emailLabel')}
              </label>
              <input
                type="email"
                required
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white outline-none"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.passwordLabel')}
              </label>
              <input
                type="password"
                required
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white outline-none"
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 p-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-md transition-transform transform active:scale-95 cursor-pointer ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading
                ? t('auth.processing') || 'Processing...'
                : isLogin
                  ? t('auth.loginBtn')
                  : t('auth.signupBtn')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {isLogin ? t('auth.switchToSignup') : t('auth.switchToLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
