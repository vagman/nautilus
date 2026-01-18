import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, CheckCircle2, Check } from 'lucide-react';
import { authService } from '../services/api';

const AuthForm = ({ onAuthSuccess }) => {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });

  // Password Requirements State
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    number: false,
    symbol: false,
    match: false,
  });

  // Real-time Validation
  useEffect(() => {
    const { password, confirmPassword } = formData;
    setPasswordValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password.length > 0 && password === confirmPassword,
    });
  }, [formData]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      const allMet = Object.values(passwordValidations).every(Boolean);
      if (!allMet) {
        if (!passwordValidations.match) {
          setError(t('auth.passwordsDoNotMatch') || 'Passwords do not match');
        } else {
          setError(t('auth.passwordTooShort') || 'Password does not meet requirements');
        }
        return;
      }
    }

    setIsLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authService.login(formData.email, formData.password);
      } else {
        const { ...signupData } = formData;
        response = await authService.signup(signupData);
      }

      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.language_preference) {
        i18n.changeLanguage(user.language_preference);
      }

      onAuthSuccess(user);
    } catch (err) {
      console.error('Auth Error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Authentication failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showMismatchError = !isLogin && formData.confirmPassword.length > 0 && !passwordValidations.match;

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#2d2d2d] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-[#333]">
      {/* Toggle Tabs */}
      <div className="flex border-b border-gray-100 dark:border-[#444]">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-4 text-sm font-semibold transition-colors cursor-pointer ${
            isLogin
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          {t('auth.login')}
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-4 text-sm font-semibold transition-colors cursor-pointer ${
            !isLogin
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          {t('auth.signup')}
        </button>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          {isLogin ? 'Enter your credentials to access your account' : 'Fill in your details to get started'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up Names */}
          {!isLogin && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="relative flex-1">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  name="first_name"
                  type="text"
                  placeholder={t('auth.firstName')}
                  required
                  // ✅ Tell browser this is a Given Name
                  autoComplete="given-name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-[#555] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="relative flex-1">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  name="last_name"
                  type="text"
                  placeholder={t('auth.lastName')}
                  required
                  // ✅ Tell browser this is a Family Name
                  autoComplete="family-name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-[#555] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              name="email"
              type="email"
              placeholder={t('auth.email')}
              required
              // ✅ CRITICAL: "username" works better than "email" for login forms in most browsers
              autoComplete="username"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-[#555] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              name="password"
              type="password"
              placeholder={t('auth.password')}
              required
              // ✅ CRITICAL: Changes based on Login vs Signup
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#333] border rounded-xl focus:ring-2 outline-none transition-all dark:text-white ${
                showMismatchError
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-200 dark:border-[#555] focus:ring-blue-500'
              }`}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div className="relative animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                name="confirmPassword"
                type="password"
                placeholder={t('auth.confirmPassword') || 'Confirm Password'}
                required
                // ✅ Helps browser know this is part of setting a new password
                autoComplete="new-password"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#333] border rounded-xl focus:ring-2 outline-none transition-all dark:text-white ${
                  showMismatchError
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 dark:border-[#555] focus:ring-blue-500'
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Checklist (Only on Signup) */}
          {!isLogin && (
            <div className="bg-gray-50 dark:bg-[#333] p-4 rounded-xl space-y-2 text-sm animate-in fade-in">
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider mb-2">
                {t('auth.passwordRequirements')}
              </p>

              <div className="grid grid-cols-1 gap-2">
                <div
                  className={`flex items-center gap-2 ${passwordValidations.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {passwordValidations.length ? (
                    <Check size={16} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-current opacity-50" />
                  )}
                  <span>{t('auth.reqLength')}</span>
                </div>
                <div
                  className={`flex items-center gap-2 ${passwordValidations.upper ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {passwordValidations.upper ? (
                    <Check size={16} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-current opacity-50" />
                  )}
                  <span>{t('auth.reqUpper')}</span>
                </div>
                <div
                  className={`flex items-center gap-2 ${passwordValidations.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {passwordValidations.number ? (
                    <Check size={16} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-current opacity-50" />
                  )}
                  <span>{t('auth.reqNumber')}</span>
                </div>
                <div
                  className={`flex items-center gap-2 ${passwordValidations.symbol ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {passwordValidations.symbol ? (
                    <Check size={16} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-current opacity-50" />
                  )}
                  <span>{t('auth.reqSymbol')}</span>
                </div>
                <div
                  className={`flex items-center gap-2 ${passwordValidations.match ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {passwordValidations.match ? (
                    <Check size={16} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-current opacity-50" />
                  )}
                  <span>{t('auth.passwordsMatch') || 'Passwords match'}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg animate-in fade-in">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? t('auth.loginButton') : t('auth.signupButton')}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {isLogin && (
          <div className="mt-4 text-center">
            <a href="/reset-password" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              {t('auth.forgotPassword')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
