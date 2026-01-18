import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/api';

const DEFAULT_AVATAR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function Profile({ user, setUser }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  // Local state for the form inputs
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert image to Base64 and upload immediately
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const updatedUser = await userService.updateProfile(user.id, {
          ...formData,
          profile_picture: base64String,
        });
        setUser(updatedUser); // Update Global State
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist
      } catch (err) {
        console.error('Failed to upload image', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const updatedUser = await userService.updateProfile(user.id, formData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      // ✅ FIX: Log the error so the variable is used
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white border-b pb-4 border-gray-200 dark:border-[#444]">
        {t('profile.settings') || 'Profile Settings'}
      </h2>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group w-24 h-24">
          <img
            src={user.profile_picture || DEFAULT_AVATAR}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-gray-100 dark:border-[#444] shadow-md"
          />
          <div
            className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <span className="text-white text-xs font-bold">CHANGE</span>
          </div>
        </div>

        <div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
          >
            Upload New Picture
          </button>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-[#444]">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-md transition-transform active:scale-95"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
