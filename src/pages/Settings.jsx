import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
// 1. Removed 'Github' from here to stop the warning
import { Moon, Sun, Monitor, Languages, Check, Info } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

// 2. Custom Github Icon Component (Replica of the deprecated one)
const GithubIcon = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme } = useTheme();

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 dark:border-[#333] pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('sidebar.settings')}</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your application preferences and appearance.</p>
      </div>

      <div className="grid gap-6">
        {/* --- THEME SECTION --- */}
        <div className="bg-white dark:bg-[#252535] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#333]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl text-yellow-600 dark:text-yellow-400">
              <Monitor size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize how Nautilus looks on your device.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Light Mode Button */}
            <button
              onClick={() => darkMode && toggleTheme()}
              className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                !darkMode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : 'border-gray-200 dark:border-[#444] hover:border-gray-300 dark:hover:border-[#555]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun size={20} className={!darkMode ? 'text-blue-600' : 'text-gray-400'} />
                <span
                  className={`font-semibold ${!darkMode ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {t('sidebar.themeLight')}
                </span>
              </div>
              {!darkMode && <Check size={20} className="text-blue-600" />}
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => !darkMode && toggleTheme()}
              className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                darkMode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : 'border-gray-200 dark:border-[#444] hover:border-gray-300 dark:hover:border-[#555]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon size={20} className={darkMode ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} />
                <span
                  className={`font-semibold ${darkMode ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {t('sidebar.themeDark')}
                </span>
              </div>
              {darkMode && <Check size={20} className="text-blue-600 dark:text-blue-400" />}
            </button>
          </div>
        </div>

        {/* --- LANGUAGE SECTION --- */}
        <div className="bg-white dark:bg-[#252535] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#333]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
              <Languages size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Language</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language interface.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* English Option */}
            <button
              onClick={() => changeLanguage('en')}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                i18n.language === 'en'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : 'border-gray-200 dark:border-[#444] hover:border-gray-300 dark:hover:border-[#555]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ReactCountryFlag countryCode="US" svg style={{ width: '2em', height: '2em', borderRadius: '4px' }} />
                <span
                  className={`font-semibold ${i18n.language === 'en' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  English
                </span>
              </div>
              {i18n.language === 'en' && <Check size={20} className="text-blue-600 dark:text-blue-400" />}
            </button>

            {/* Greek Option */}
            <button
              onClick={() => changeLanguage('el')}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                i18n.language === 'el'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : 'border-gray-200 dark:border-[#444] hover:border-gray-300 dark:hover:border-[#555]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ReactCountryFlag countryCode="GR" svg style={{ width: '2em', height: '2em', borderRadius: '4px' }} />
                <span
                  className={`font-semibold ${i18n.language === 'el' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  Ελληνικά
                </span>
              </div>
              {i18n.language === 'el' && <Check size={20} className="text-blue-600 dark:text-blue-400" />}
            </button>
          </div>
        </div>

        {/* --- ABOUT SECTION --- */}
        <div className="bg-white dark:bg-[#252535] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#333]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">About Application</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Version info and credits.</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#2d2d3d] p-5 rounded-xl border border-gray-200 dark:border-[#444]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                N
              </div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">Nautilus</h3>
              <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full font-mono">v1.0.0</span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              A comprehensive disaster management and volunteering platform designed to connect communities and provide
              real-time environmental alerts.
            </p>

            <div className="flex items-center gap-4 text-sm pt-4 border-t border-gray-200 dark:border-[#444]">
              <a
                href="https://github.com/vagman/nautilus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                {/* 3. Using the custom icon here */}
                <GithubIcon size={16} />
                <span>View Source</span>
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 dark:text-gray-400">© 2024 Nautilus Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
