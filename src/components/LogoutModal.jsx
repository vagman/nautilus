import { useTranslation } from 'react-i18next';

function LogoutModal({ onCancel, onConfirm }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#2d2d2d] rounded-xl shadow-2xl p-6 text-center transform transition-all scale-100">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {t('logout.title')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t('logout.message')}
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="px-5 py-2.5 rounded-lg font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            onClick={onCancel}
          >
            {t('logout.cancel')}
          </button>
          <button
            className="px-5 py-2.5 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 shadow-md transition-colors"
            onClick={onConfirm}
          >
            {t('logout.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
