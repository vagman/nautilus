import Sidebar from './Sidebar';

function DashboardLayout({ children, user, isSidebarOpen, setSidebarOpen }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-[#f0f2f5] dark:bg-[#1a1a1a] text-[#333] dark:text-white transition-colors duration-300">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        user={user}
      />
      <button
        className="absolute top-5 left-5 z-30 text-3xl bg-transparent border-none cursor-pointer text-[#333] dark:text-white hover:text-blue-500 transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>
      {children}
    </div>
  );
}

export default DashboardLayout;
