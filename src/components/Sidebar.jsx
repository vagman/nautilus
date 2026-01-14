import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function Sidebar({ isOpen, toggleSidebar, user }) {
  const { darkMode, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  if (!user) return null;

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
        {/* HEADER */}
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-[#444]">
          <h3 className="text-xl font-bold m-0">Menu</h3>
          <button
            onClick={toggleSidebar}
            className="text-3xl bg-transparent border-none cursor-pointer text-[#333] dark:text-white hover:text-blue-500 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* USER INFO */}
        <div className="p-6 bg-black/5 dark:bg-white/5">
          <p className="m-0">
            👤 <span className="font-semibold">{user.username}</span>
          </p>
        </div>

        {/* MENU ITEMS */}
        <ul className="list-none p-0 m-0 flex flex-col">
          {/* Settings Item with Dropdown */}
          <li
            className="p-4 pl-6 cursor-pointer border-b border-gray-200 dark:border-[#444] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            onClick={() => setShowSettings(!showSettings)}
          >
            <div className="flex justify-between items-center font-medium">
              <span>⚙️ Settings</span>
              <span className="text-sm">{showSettings ? '▼' : '▶'}</span>
            </div>
          </li>

          {/* Submenu */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showSettings ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <ul className="list-none p-0 bg-black/5 dark:bg-black/20 shadow-inner">
              <li
                className="pl-10 p-4 cursor-pointer text-sm border-b border-gray-200 dark:border-[#444] hover:text-[#646cff] transition-colors"
                onClick={e => {
                  e.stopPropagation();
                  toggleTheme();
                }}
              >
                {darkMode ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
              </li>
            </ul>
          </div>

          {/* Other Links */}
          {['🤝 Volunteer', '❓ Help', 'ℹ️ About'].map(item => (
            <li
              key={item}
              className="p-4 pl-6 cursor-pointer border-b border-gray-200 dark:border-[#444] hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
