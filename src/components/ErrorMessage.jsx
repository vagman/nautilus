import { useTranslation } from 'react-i18next';

function ErrorMessage({ message }) {
  const { t } = useTranslation();

  return (
    <p className="text-red-500 font-bold bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
      {t('common.error')}: {message}
    </p>
  );
}

export default ErrorMessage;
