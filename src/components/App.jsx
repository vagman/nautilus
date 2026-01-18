import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Components
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import AuthPage from '../pages/AuthPage';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import ChangePassword from '../pages/ChangePassword';
import Settings from '../pages/Settings';
import ResetPassword from '../pages/ResetPassword';
import Disasters from '../pages/Disasters';
import Volunteer from '../pages/Volunteer';
import AdminReports from '../pages/AdminReports';

function App() {
  const { clearUserThemeSync } = useTheme();

  // ✅ 1. CRASH-PROOF USER STATE
  // This prevents the "Unexpected token u in JSON" error if localStorage gets corrupted
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      // Only parse if it exists and isn't the string "undefined"
      if (saved && saved !== 'undefined') {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('⚠️ LocalStorage Error:', error);
      localStorage.removeItem('user'); // Auto-clean bad data
      return null;
    }
  });

  // Logout Logic
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    clearUserThemeSync();
  };

  // Update user state (e.g., after profile picture change)
  const handleUpdateUser = updatedUser => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={!user ? <AuthPage onAuthSuccess={setUser} /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* --- Protected Routes (Require Login) --- */}
        <Route element={<ProtectedRoute user={user} />}>
          {/* Dashboard Layout (The "Frame" with Sidebar) */}
          <Route element={<DashboardLayout user={user} onLogout={logout} />}>
            {/* 1. Dashboard (Home) */}
            <Route path="/" element={<Dashboard user={user} />} />

            {/* 2. Profile */}
            <Route path="/profile" element={<Profile user={user} setUser={handleUpdateUser} />} />

            {/* 3. Settings */}
            <Route path="/settings" element={<Settings />} />

            {/* 4. Change Password */}
            <Route path="/change-password" element={<ChangePassword user={user} onLogout={logout} />} />

            {/* ✅ 5. DISASTERS MAP */}
            <Route path="/disasters" element={<Disasters />} />

            {/* ✅ 6. VOLUNTEER HUB */}
            <Route path="/volunteer" element={<Volunteer user={user} />} />

            {/* ✅ 7. ADMIN REPORTS */}
            <Route path="/admin/reports" element={user?.role === 'admin' ? <AdminReports /> : <Navigate to="/" />} />
          </Route>
        </Route>

        {/* Catch-all: Redirect unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
