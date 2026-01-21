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
      {/* 2. The Sidebar Component (Fixed Position) */}
      <Sidebar user={user} isOpen={isSidebarOpen} toggle={toggleSidebar} onLogout={onLogout} />

      {/* 3. MAIN CONTENT AREA 
          If sidebar is open, push content 256px to the right so it doesn't hide behind the sidebar.
      */}
      <div
        className={`flex-1 flex flex-col h-full relative transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-64' : ''
        }`}
      >
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex items-center p-4 bg-white dark:bg-[#1e1e2d] border-b border-gray-200 dark:border-[#333]">
          <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300 mr-4">
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-800 dark:text-white">Nautilus</span>
        </div>

        {/* Desktop Toggle Button (Visible only when sidebar is closed on desktop) */}
        {!isSidebarOpen && (
          <div className="hidden md:block absolute top-4 left-4 z-50">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-white dark:bg-[#2d2d44] text-gray-700 dark:text-gray-200 rounded-md shadow-md hover:bg-gray-50 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        )}

        {/* 4. THE OUTLET */}
        {/* This is where your Profile, Dashboard, etc. render */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
