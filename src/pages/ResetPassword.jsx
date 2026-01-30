import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  // --- MODE A: REQUEST LINK (No Token) ---
  const handleRequestLink = async event => {
    event.preventDefault();
    setStatus('loading');

    try {
      await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setStatus('success');
      setMessage('If an account exists, we sent a link!');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Network error. Is the server running?');
    }
  };

  // --- MODE B: RESET PASSWORD ---
  const handleResetPassword = async event => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Token expired or invalid');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Failed to connect to server');
    }
  };

  // RENDER: MODE SELECTION
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a1a2e] p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#2d2d2d] rounded-xl shadow-xl p-8 border border-gray-100 dark:border-[#444]">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Set New Password</h2>

          {status === 'success' ? (
            <div className="text-center animate-in fade-in">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Password Changed!</h3>
              <p className="text-gray-500 mb-6">Redirecting you to login...</p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-[#555] rounded-xl dark:text-white"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-[#555] rounded-xl dark:text-white"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} /> {message}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center gap-2"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- DEFAULT RENDER: FORGOT PASSWORD (Enter Email) ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a1a2e] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#2d2d2d] rounded-xl shadow-xl p-8 border border-gray-100 dark:border-[#444]">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white text-center">Reset Password</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Enter your email and we'll send you a link.</p>

        {status === 'success' ? (
          <div className="text-center animate-in fade-in">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRequestLink} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-[#555] rounded-xl dark:text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
            </button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-gray-500 hover:text-blue-600">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
