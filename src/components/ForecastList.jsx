import { useTranslation } from 'react-i18next';

function ForecastList({ forecast }) {
  const { t, i18n } = useTranslation();

  function groupForecastByDay(forecastList) {
    if (!forecastList) return [];
    const days = {};
    forecastList.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!days[date]) days[date] = [];
      days[date].push(entry);
    });
    return Object.entries(days).slice(0, 5);
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-4 ml-1 text-gray-800 dark:text-white transition-colors">
        {t('forecast.title')}
      </h2>

      <div className="grid gap-4">
        {groupForecastByDay(forecast).map(([date, entries]) => {
          const temps = entries.map(e => e.main.temp);
          const min = Math.min(...temps);
          const max = Math.max(...temps);
          const hasRain = entries.some(e =>
            ['rain', 'drizzle', 'shower'].some(word => e.weather[0].main.toLowerCase().includes(word)),
          );
          const hasHeat = max > 35;
          const hasWind = entries.some(e => e.wind.speed > 10);

          return (
            <div
              key={date}
              className="p-4 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-sm border border-gray-200 dark:border-[#444] transition-colors"
            >
              <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-[#444] pb-2 mb-2 text-gray-800 dark:text-gray-100">
                {new Date(date).toLocaleDateString(i18n.language, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <p className="mb-3">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {t('forecast.min')}: {min.toFixed(1)}°C
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {t('forecast.max')}: {max.toFixed(1)}°C
                </span>
              </p>
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {t('forecast.adviceTitle')}
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                {hasHeat && <li className="text-red-500 dark:text-red-400 font-medium">{t('forecast.heat')}</li>}
                {hasRain && <li className="text-blue-500 dark:text-blue-400 font-medium">{t('forecast.rain')}</li>}
                {hasWind && <li>{t('forecast.wind')}</li>}
                {max > 30 && !hasRain && <li>{t('forecast.sunny')}</li>}
                {min < 10 && <li>{t('forecast.cold')}</li>}
                {!hasHeat && !hasRain && !hasWind && max <= 30 && min >= 10 && <li>{t('forecast.mild')}</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForecastList;
