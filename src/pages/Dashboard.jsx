import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import RadiusSlider from '../components/RadiusSlider';
import Map from '../components/Map';
import ForecastList from '../components/ForecastList';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useGeolocation } from '../hooks/useGeolocation';
import { generateSurroundingCoordinates } from '../utils/generateSurroundingCoordinates';

function Dashboard({ user }) {
  const { t } = useTranslation();
  const [tempRadius, setTempRadius] = useState(2000);
  const [radius, setRadius] = useState(2000);
  const [forecast, setForecast] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const { position, isLoading, error: geoError } = useGeolocation();

  const error = geoError || fetchError;

  useEffect(() => {
    if (!user || !position || !radius) return;
    const surrounding = generateSurroundingCoordinates(position, radius, 8);
    const allCoords = [position, ...surrounding];

    async function fetchForecasts() {
      try {
        setFetchError(null);
        const responses = await Promise.all(
          allCoords.map(coord =>
            fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`,
            ).then(res => {
              if (!res.ok) throw new Error('Failed');
              return res.json();
            }),
          ),
        );
        const mergedForecasts = responses.flatMap(res => res.list);
        setForecast(mergedForecasts);
      } catch (err) {
        setFetchError(err.message);
      }
    }
    fetchForecasts();
  }, [user, position, radius, apiKey]);

  if (error) return <ErrorMessage message={error} />;
  if (isLoading || !forecast) return <LoadingSpinner message={t('common.loading')} />;

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
      <PageTitle>{t('common.appTitle')}</PageTitle>

      <RadiusSlider value={tempRadius} onChange={setTempRadius} onFinalChange={setRadius} />

      <div className="w-full max-w-4xl h-[400px] rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-[#444] mb-8 z-0 relative">
        <Map position={position} radius={radius} />
      </div>

      <ForecastList forecast={forecast} />
      <Footer />
    </div>
  );
}

export default Dashboard;
