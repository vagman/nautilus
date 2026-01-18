import openWeatherLogo from '../assets/openweathermap.png';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full mt-12 py-8 border-t border-gray-200 dark:border-[#444] text-center transition-colors">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {t('footer.providedBy')}{' '}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            OpenWeather
          </a>
        </p>

        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <img src={openWeatherLogo} alt="OpenWeather logo" className="h-10 w-auto" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
