import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings as SettingsIcon,
  Map as MapIcon,
  Users,
  LogOut,
  UserCircle,
  X,
  HelpCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import logoDark from '../assets/nautilus-dark.svg';
import logoWhite from '../assets/nautilus-white.svg';

const Sidebar = ({ user, isOpen, toggle, onLogout }) => {
  const { t } = useTranslation();

  const getLinkClass = ({ isActive }) => {
    return `flex items-center gap-4 px-6 py-3 transition-colors duration-200 ${
      isActive
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252535] hover:text-gray-900 dark:hover:text-white'
    }`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm" onClick={toggle} />}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-[#1e1e2d] border-r border-gray-200 dark:border-[#333] transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 1. APP LOGO HEADER (Fixed to swap themes) */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-[#333]">
          <div className="flex items-center gap-3">
            {/* Logo Wrapper */}
            <div className="w-8 h-8 flex items-center justify-center">
              {/* Show Dark Logo in Light Mode */}
              <img src={logoDark} alt="Nautilus" className="w-full h-full object-contain dark:hidden" />
              {/* Show White Logo in Dark Mode */}
              <img src={logoWhite} alt="Nautilus" className="w-full h-full object-contain hidden dark:block" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Nautilus</span>
          </div>
          <button onClick={toggle} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* 2. USER PROFILE SECTION */}
        <div className="p-6 border-b border-gray-100 dark:border-[#333]">
          <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div className="relative shrink-0">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-[#444]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border-2 border-transparent">
                  <UserCircle size={24} />
                </div>
              )}
              {/* Online Status Dot */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1e1e2d] rounded-full"></div>
            </div>

            {/* User Name & Role */}
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-gray-800 dark:text-white truncate text-sm">
                {user ? `${user.first_name || ''} ${user.last_name || ''}` : 'Guest User'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                {user?.role || 'Visitor'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. NAVIGATION LINKS */}
        <nav className="mt-6 flex flex-col gap-1">
          <NavLink to="/" className={getLinkClass} end>
            <LayoutDashboard size={20} />
            <span className="font-medium">{t('sidebar.dashboard')}</span>
          </NavLink>

          <NavLink to="/profile" className={getLinkClass}>
            <UserCircle size={20} />
            <span className="font-medium">{t('sidebar.profile')}</span>
          </NavLink>

          <NavLink to="/disasters" className={getLinkClass}>
            <MapIcon size={20} />
            <span className="font-medium">{t('sidebar.disasterMap')}</span>
          </NavLink>

          <NavLink to="/volunteer" className={getLinkClass}>
            <Users size={20} />
            <span className="font-medium">{t('sidebar.volunteerHub')}</span>
          </NavLink>

          <NavLink to="/help" className={getLinkClass}>
            <HelpCircle size={20} />
            <span className="font-medium">{t('help.title')}</span>
          </NavLink>

          <NavLink to="/settings" className={getLinkClass}>
            <SettingsIcon size={20} />
            <span className="font-medium">{t('sidebar.settings')}</span>
          </NavLink>

          <button
            onClick={onLogout}
            className="flex items-center gap-4 px-6 py-3 mt-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">{t('sidebar.logout')}</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
