import { useState, useEffect } from 'react';

// Components
import Map from './Map.jsx';
import AuthForm from './AuthForm.jsx';
import LogoutModal from './LogoutModal.jsx';
import Footer from './Footer.jsx';
import { generateSurroundingCoordinates } from '../utils/generateSurroundingCoordinates.js';

// Hooks
import { useGeolocation } from '../hooks/useGeolocation';

function App() {
  const [tempRadius, setTempRadius] = useState(2000);
  const [radius, setRadius] = useState(2000);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Custom Hook for Geolocation
  const {
    position,
    isLoading: isLoadingGeo,
    error: geoError,
  } = useGeolocation();

  // Combine API errors (if any) with Geolocation errors
  const [fetchError, setFetchError] = useState(null);
  const error = geoError || fetchError;

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Weather Fetch Effect
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
              `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`
            ).then(res => {
              if (!res.ok) throw new Error('Failed to fetch weather data');
              return res.json();
            })
          )
        );

        const mergedForecasts = responses.flatMap(res => res.list);
        setForecast(mergedForecasts);
      } catch (err) {
        console.error('Fetch error:', err);
        setFetchError(err.message);
      }
    }

    fetchForecasts();
  }, [user, position, radius, apiKey]);

  if (!user) {
    return <AuthForm onAuthSuccess={setUser} />;
  }

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

  // Handle Errors
  if (error) {
    return (
      <div className="app">
        <h1>Management of Environmental Phenomena and Natural Disasters</h1>
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  // Handle Loading (Wait for Position OR Forecast)
  if (isLoadingGeo || (!forecast && !error)) {
    return (
      <div className="app">
        <h1>Management of Environmental Phenomena and Natural Disasters</h1>
        <p>Loading location and weather data...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Management of Environmental Phenomena and Natural Disasters</h1>

      {user && (
        <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
          Logout
        </button>
      )}

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => {
            logout();
            setShowLogoutModal(false);
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <div
        className="slider-container"
        style={{ marginBottom: '1rem', width: '100%' }}
      >
        <label htmlFor="radius-slider">
          Forecast Radius: {Math.round(tempRadius / 1000)} km
        </label>
        <input
          id="radius-slider"
          type="range"
          min="2000"
          max="30000"
          step="1000"
          value={tempRadius}
          onChange={e => setTempRadius(Number(e.target.value))}
          onMouseUp={() => setRadius(tempRadius)}
          onTouchEnd={() => setRadius(tempRadius)}
        />
      </div>

      <div className="map">
        <Map position={position} radius={radius} />
      </div>

      <div className="forecast-container">
        <h2>🗓️ 5-Day Weather Forecast</h2>
        {groupForecastByDay(forecast).map(([date, entries]) => {
          const temps = entries.map(e => e.main.temp);
          const min = Math.min(...temps);
          const max = Math.max(...temps);
          const hasRain = entries.some(e =>
            ['rain', 'drizzle', 'shower'].some(word =>
              e.weather[0].main.toLowerCase().includes(word)
            )
          );
          const hasHeat = max > 35;
          const hasWind = entries.some(e => e.wind.speed > 10);

          return (
            <div key={date} className="forecast-day">
              <h3>{new Date(date).toDateString()}</h3>
              <p>
                <strong>Min:</strong> {min.toFixed(1)}°C, <strong>Max:</strong>{' '}
                {max.toFixed(1)}°C
              </p>

              <h4>👕 What to Wear / Prepare For:</h4>
              <ul>
                {hasHeat && (
                  <li>
                    🔥 Very hot — wear light clothes, drink water, avoid sun
                  </li>
                )}
                {hasRain && (
                  <li>☔ Rain expected — bring umbrella or raincoat</li>
                )}
                {hasWind && <li>💨 Windy — consider a windbreaker</li>}
                {max > 30 && !hasRain && (
                  <li>🧢 Sunny — wear a hat, sunglasses, and sunscreen</li>
                )}
                {min < 10 && <li>🧥 Cold — bring a jacket or coat</li>}
                {!hasHeat && !hasRain && !hasWind && max <= 30 && min >= 10 && (
                  <li>🙂 Mild weather — dress comfortably</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}

export default App;
