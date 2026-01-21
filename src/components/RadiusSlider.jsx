import { useTranslation } from 'react-i18next';

function RadiusSlider({ value, onChange, onFinalChange }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-3xl mb-6 bg-white dark:bg-[#2d2d2d] p-4 rounded-lg shadow-md transition-colors">
      <label htmlFor="radius-slider" className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
        {t('forecast.radiusLabel')}: {Math.round(value / 1000)} km
      </label>
      <input
        id="radius-slider"
        type="range"
        min="2000"
        max="30000"
        step="1000"
        value={value}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-blue-600"
        onChange={event => onChange(Number(event.target.value))}
        onMouseUp={() => onFinalChange?.(value)}
        onTouchEnd={() => onFinalChange?.(value)}
      />
    </div>
  );
}

export default RadiusSlider;
