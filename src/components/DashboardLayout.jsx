import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

import Sidebar from './Sidebar';

const DashboardLayout = ({ user, onLogout }) => {
  // 1. State for Sidebar (Open/Close)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle function to pass down
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#1a1a2e] transition-colors duration-300 overflow-hidden">
      {/* 2. The Sidebar Component */}
      <Sidebar user={user} isOpen={isSidebarOpen} toggle={toggleSidebar} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative transition-all duration-300">
        {/* Mobile Toggle Button (Visible only when sidebar is closed or on mobile) */}
        {!isSidebarOpen && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-white dark:bg-[#2d2d44] text-gray-700 dark:text-gray-200 rounded-md shadow-md hover:bg-gray-50 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        )}

        {/* 3. THE OUTLET */}
        {/* This is where the Dashboard, Profile, or ChangePassword pages get rendered */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
