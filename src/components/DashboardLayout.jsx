import { useState } from 'react';
import Sidebar from './Sidebar';
import HelpModal from './HelpModal';
import AboutModal from './AboutModal';

function DashboardLayout({
  children,
  user,
  isSidebarOpen,
  setSidebarOpen,
  onRequestDelete,
}) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-[#f0f2f5] dark:bg-[#1a1a1a] text-[#333] dark:text-white transition-colors duration-300">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        user={user}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenAbout={() => setShowAboutModal(true)}
        onRequestDelete={onRequestDelete} // ✅ Pass it down
      />

      <button
        className="absolute top-5 left-5 z-30 text-3xl bg-transparent border-none cursor-pointer text-[#333] dark:text-white hover:text-blue-500 transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {children}
    </div>
  );
}

export default DashboardLayout;
