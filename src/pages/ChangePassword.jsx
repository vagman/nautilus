import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

function ChangePassword({ user, onLogout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate Regex (Same as Backend)
  const isStrong = pwd => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(pwd);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch') || 'Passwords do not match');
      return;
    }

    if (!isStrong(formData.newPassword)) {
      setError('New password must be 8+ chars with 1 uppercase, 1 number, and 1 symbol.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword(user.id, formData.currentPassword, formData.newPassword);
      setSuccess(true);

      // Auto logout after 2 seconds so they can log in with new password
      setTimeout(() => {
        onLogout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.error || err.message || 'Failed to change password');
      setIsLoading(false);
    }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <Check size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Password Changed!</h2>
        <p className="text-gray-500 dark:text-gray-400">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg p-8 mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b border-gray-100 dark:border-[#444] pb-4">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 number, 1 symbol.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
