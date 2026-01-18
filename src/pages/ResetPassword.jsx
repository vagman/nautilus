import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function ResetPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Reset Password</h2>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#555] bg-gray-50 dark:bg-[#333] text-gray-900 dark:text-white"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Check your email for the reset link.</p>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
