import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Trash2, Globe, Check } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

function Sidebar({
  isOpen,
  toggleSidebar,
  user,
  onOpenHelp,
  onOpenAbout,
  onRequestDelete,
}) {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const handleLanguageChange = async langCode => {
    i18n.changeLanguage(langCode);

    if (user) {
      const updatedUser = { ...user, language_preference: langCode };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      try {
        await fetch(`http://localhost:4000/api/users/${user.id}/language`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ language: langCode }),
        });
      } catch (err) {
        console.error('Failed to sync language:', err);
      }
    }
  };

  if (!user) return null;

  const menuItems = [
    {
      key: 'volunteer',
      icon: '🤝',
      label: t('sidebar.volunteer'),
      action: () => {},
    },
    { key: 'help', icon: '❓', label: t('sidebar.help'), action: onOpenHelp },
    {
      key: 'about',
      icon: 'ℹ️',
      label: t('sidebar.about'),
      action: onOpenAbout,
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999] transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <div
        className={`fixed top-0 left-0 w-[280px] h-screen bg-white dark:bg-[#2d2d2d] text-[#333] dark:text-white shadow-[4px_0_15px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-in-out z-[2000] flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-[#444]">
          <h3 className="text-xl font-bold m-0">{t('sidebar.menu')}</h3>
          <button
            onClick={toggleSidebar}
            className="text-3xl bg-transparent border-none cursor-pointer text-[#333] dark:text-white hover:text-blue-500 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 bg-black/5 dark:bg-white/5">
          <p className="m-0">
            👤 <span className="font-semibold">{user.username}</span>
          </p>
        </div>

        <ul className="list-none p-0 m-0 flex flex-col">
          {/* Settings Toggle */}
          <li
            className="p-4 pl-6 cursor-pointer border-b border-gray-200 dark:border-[#444] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            onClick={() => setShowSettings(!showSettings)}
          >
            <div className="flex justify-between items-center font-medium">
              <span>⚙️ {t('sidebar.settings')}</span>
              <span className="text-sm">{showSettings ? '▼' : '▶'}</span>
            </div>
          </li>

          {/* Settings Submenu */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showSettings ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <ul className="list-none p-0 bg-black/5 dark:bg-black/20 shadow-inner">
              {/* Theme Toggle */}
              <li
                className="pl-10 p-4 cursor-pointer text-sm border-b border-gray-200 dark:border-[#444] hover:text-[#646cff] transition-colors"
                onClick={e => {
                  e.stopPropagation();
                  toggleTheme();
                }}
              >
                {darkMode
                  ? `☀️ ${t('sidebar.themeLight')}`
                  : `🌙 ${t('sidebar.themeDark')}`}
              </li>

              {/* Language Section Header */}
              <li className="pl-10 p-3 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">
                {t('sidebar.language')}
              </li>

              {/* English Option */}
              <li
                onClick={e => {
                  e.stopPropagation();
                  handleLanguageChange('en');
                }}
                className={`pl-10 pr-6 p-3 cursor-pointer text-sm flex items-center justify-between transition-colors ${
                  i18n.language === 'en'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ReactCountryFlag
                    countryCode="US"
                    svg
                    style={{ width: '1.2em', height: '1.2em' }}
                  />
                  <span>English</span>
                </div>
                {i18n.language === 'en' && <Check size={16} />}
              </li>

              {/* Greek Option */}
              <li
                onClick={e => {
                  e.stopPropagation();
                  handleLanguageChange('el');
                }}
                className={`pl-10 pr-6 p-3 border-b border-gray-200 dark:border-[#444] cursor-pointer text-sm flex items-center justify-between transition-colors ${
                  i18n.language === 'el'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ReactCountryFlag
                    countryCode="GR"
                    svg
                    style={{ width: '1.2em', height: '1.2em' }}
                  />
                  <span>Ελληνικά</span>
                </div>
                {i18n.language === 'el' && <Check size={16} />}
              </li>

              {/* ✅ Delete Account - Sidebar stays OPEN now */}
              <li
                className="pl-10 p-4 cursor-pointer text-sm border-b border-gray-200 dark:border-[#444] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium flex items-center gap-2"
                onClick={e => {
                  e.stopPropagation();
                  onRequestDelete();
                  // toggleSidebar();  <-- REMOVED THIS LINE
                }}
              >
                <Trash2 size={16} />
                {t('sidebar.deleteAccount')}
              </li>
            </ul>
          </div>

          {/* Standard Menu Items */}
          {menuItems.map(item => (
            <li
              key={item.key}
              className="p-4 pl-6 cursor-pointer border-b border-gray-200 dark:border-[#444] hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium"
              onClick={() => {
                if (item.action) item.action();
              }}
            >
              {item.icon} {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
