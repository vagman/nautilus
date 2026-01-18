import { useTranslation } from 'react-i18next';
import AuthForm from '../components/AuthForm';

const AuthPage = ({ onAuthSuccess }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a1a2e] p-6 transition-colors duration-300">
      {/* Main Container: Stacks on mobile, Side-by-Side on Desktop */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE: Branding & Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-blue-600/20">
              N
            </div>
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white tracking-tight">Nautilus</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Weather Intelligence <br /> for a Safer Tomorrow.
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
            {t('auth.appDescription')}
          </p>

          {/* Optional: Add some trust badges or small feature icons here later */}
        </div>

        {/* RIGHT SIDE: Auth Form */}
        <div className="flex justify-center md:justify-end w-full animate-in fade-in slide-in-from-right-4 duration-700">
          <AuthForm onAuthSuccess={onAuthSuccess} />
        </div>
      </div>

      {/* Footer (Absolute bottom) */}
      <div className="absolute bottom-4 text-gray-400 text-sm">&copy; {new Date().getFullYear()} Nautilus Project</div>
    </div>
  );
};

export default AuthPage;
