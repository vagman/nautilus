import Modal from './Modal';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import nautilusWhite from '../assets/nautilus-white.svg';
import nautilusDark from '../assets/nautilus-dark.svg';

function AboutModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('about.title')}>
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Logo & Version */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <img
              src={darkMode ? nautilusWhite : nautilusDark}
              alt="Nautilus Logo"
              className="w-12 h-12"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nautilus
          </h3>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">
            v1.0.0 (Beta)
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {t('about.description')}
        </p>

        {/* Key Info Grid */}
        <div className="w-full grid grid-cols-2 gap-4 text-left bg-gray-50 dark:bg-[#252525] p-4 rounded-xl border border-gray-100 dark:border-[#444]">
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
              {t('about.developer')}
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Evangelos Manousakis
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
              {t('about.license')}
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              MIT Open Source
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
              {t('about.stack')}
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              React, Vite, Tailwind
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
              {t('about.build')}
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              2026.01.14
            </span>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="w-full border-t border-gray-200 dark:border-[#444] pt-6 mt-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {currentYear} Evangelos Manousakis. {t('about.rights')}
            <br />
            {t('about.unauthorized')}
          </p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-blue-500 dark:text-blue-400 font-medium">
            <a href="#" className="hover:underline">
              {t('about.privacy')}
            </a>
            <span>•</span>
            <a href="#" className="hover:underline">
              {t('about.terms')}
            </a>
            <span>•</span>
            <a
              href="https://github.com/vagman/nautilus"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {t('about.github')}
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AboutModal;
