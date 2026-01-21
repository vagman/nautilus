import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '../hooks/useThemes';

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
import Volunteer from '../pages/Volunteer';
import Help from '../pages/Help';
import AdminMap from '../pages/AdminMap';
import DisasterViewer from '../pages/DisasterViewer';

function App() {
  const { clearUserThemeSync } = useTheme();

  // USER STATE
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved && saved !== 'undefined') {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('⚠️ LocalStorage Error:', error);
      localStorage.removeItem('user');
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
          <Route element={<DashboardLayout user={user} onLogout={logout} />}>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={handleUpdateUser} />} />
            <Route path="/settings" element={<Settings user={user} updateUser={handleUpdateUser} />} />
            <Route path="/help" element={<Help />} />
            <Route path="/change-password" element={<ChangePassword user={user} onLogout={logout} />} />
            <Route path="/disasters" element={<DisasterViewer />} />
            <Route path="/volunteer" element={<Volunteer user={user} />} />
            <Route
              path="/admin-reports"
              element={user?.role === 'admin' ? <AdminMap /> : <Navigate to="/disasters" />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
