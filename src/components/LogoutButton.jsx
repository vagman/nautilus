import { useTranslation } from 'react-i18next';

function LogoutButton({ onClick }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="mb-6 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors shadow-md cursor-pointer"
    >
      {t('logout.confirm')}
    </button>
  );
}

export default LogoutButton;
