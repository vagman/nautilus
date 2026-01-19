import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings as SettingsIcon,
  LogOut,
  User,
  HelpCircle,
  X as CloseIcon,
  AlertTriangle,
  Users,
  FilePlus,
} from 'lucide-react';

import logoDark from '../assets/nautilus-dark.svg';
import logoWhite from '../assets/nautilus-white.svg';

const Sidebar = ({ user, isOpen, toggle, onLogout }) => {
  const { t } = useTranslation();

  // Helper to determine link styling
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group mb-1 ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400'
    }`;

  return (
    <aside
      className={`
        ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full opacity-0'} 
        bg-white dark:bg-[#252535] border-r border-gray-200 dark:border-[#333]
        flex flex-col h-full transition-all duration-300 ease-in-out
        fixed md:relative z-40 shadow-2xl md:shadow-none
      `}
    >
      {/* 1. Header with Logo */}
      <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-[#333]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Show this in Light Mode */}
          <img src={logoDark} alt="Nautilus Logo" className="w-10 h-10 object-contain dark:hidden shrink-0" />

          {/* Show this in Dark Mode */}
          <img src={logoWhite} alt="Nautilus Logo" className="w-10 h-10 object-contain hidden dark:block shrink-0" />

          <h1 className="font-bold text-xl text-gray-800 dark:text-white truncate tracking-tight">Nautilus</h1>
        </div>

        <button
          onClick={toggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors md:hidden"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
        {/* MENU SECTION */}
        <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 mb-3 mt-2">
          {t('sidebar.menu')}
        </div>

        {/* My Profile */}
        <NavLink to="/profile" className={getLinkClass}>
          <User size={20} />
          <span className="font-medium">{t('profile.title')}</span>
        </NavLink>

        {/* Dashboard */}
        <NavLink to="/" className={getLinkClass}>
          <LayoutDashboard size={20} />
          <span className="font-medium">{t('sidebar.dashboard')}</span>
        </NavLink>

        {/* 1. DISASTER MAP (Visible to Everyone) */}
        <NavLink to="/disasters" className={getLinkClass}>
          <AlertTriangle size={20} />
          <span className="font-medium">{t('sidebar.disastersMap')}</span>
        </NavLink>

        {/* 2. ADMIN ONLY: Report Creator */}
        {user?.role === 'admin' && (
          <NavLink to="/admin/reports" className={getLinkClass}>
            <FilePlus size={20} />
            <span className="font-medium">{t('sidebar.manageReports')}</span>
          </NavLink>
        )}

        {/* 3. VOLUNTEER (Visible to Everyone) */}
        <NavLink to="/volunteer" className={getLinkClass}>
          <Users size={20} />
          <span className="font-medium">{t('sidebar.volunteerHub')}</span>
        </NavLink>

        {/* HELP */}
        <NavLink to="/help" className={getLinkClass}>
          <HelpCircle size={20} />
          <span className="font-medium">{t('help.title')}</span>
        </NavLink>

        {/* SETTINGS SECTION */}
        <NavLink to="/settings" className={getLinkClass}>
          <SettingsIcon size={20} />
          <span className="font-medium">{t('sidebar.settings')}</span>
        </NavLink>

        {/* Log Out */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all text-left mt-2"
        >
          <LogOut size={20} />
          <span className="font-medium">{t('sidebar.logout')}</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
