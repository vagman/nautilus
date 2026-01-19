import Modal from './Modal';
import { useTranslation } from 'react-i18next';

function DeleteAccountModal({ isOpen, onClose, onConfirm, isDeleting }) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('deleteAccount.title')}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">{t('deleteAccount.confirmation')}</p>

        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 font-bold">{t('deleteAccount.warningTitle')}</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{t('deleteAccount.warningText')}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors font-bold flex items-center gap-2"
          >
            {isDeleting ? t('common.deleting') : t('deleteAccount.confirmButton')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteAccountModal;
