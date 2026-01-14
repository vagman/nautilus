import { useState, useEffect } from 'react';

import Sidebar from './Sidebar'; // Ensure this path is correct based on previous step
import Map from './Map.jsx';
import AuthForm from './AuthForm.jsx';
import LogoutModal from './LogoutModal.jsx';
import Footer from './Footer.jsx';
import { generateSurroundingCoordinates } from '../utils/generateSurroundingCoordinates.js';

import { useGeolocation } from '../hooks/useGeolocation';

function App() {
  const [tempRadius, setTempRadius] = useState(2000);
  const [radius, setRadius] = useState(2000);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [forecast, setForecast] = useState(null);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
    setForecast(null); // Clear data on logout
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

  // --- RENDER LOGIC ---

  // 1. If NOT logged in, show AuthForm
  if (!user) {
    return <AuthForm onAuthSuccess={setUser} />;
  }

  // Common Layout Wrapper for consistency
  const AppLayout = ({ children }) => (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 bg-[#f0f2f5] dark:bg-[#1a1a1a] text-[#333] dark:text-white transition-colors duration-300">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        user={user}
      />
      {/* Hamburger Button (Replaced inline styles with Tailwind) */}
      <button
        className="absolute top-5 left-5 z-30 text-3xl bg-transparent border-none cursor-pointer text-[#333] dark:text-white hover:text-blue-500 transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>
      {children}
    </div>
  );

  // 2. If logged in but Error exists
  if (error) {
    return (
      <AppLayout>
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 mt-12 md:mt-4">
          Management of Environmental Phenomena
        </h1>
        <p className="text-red-500 font-bold bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
          Error: {error}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
        {showLogoutModal && (
          <LogoutModal
            onConfirm={() => {
              logout();
              setShowLogoutModal(false);
            }}
            onCancel={() => setShowLogoutModal(false)}
          />
        )}
      </AppLayout>
    );
  }

  // 3. If logged in but Loading
  if (isLoadingGeo || (!forecast && !error)) {
    return (
      <AppLayout>
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 mt-12 md:mt-4">
          Management of Environmental Phenomena
        </h1>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg animate-pulse">
            Loading location and weather data...
          </p>
        </div>
      </AppLayout>
    );
  }

  // 4. MAIN DASHBOARD (Logged in + Data Loaded)
  return (
    <AppLayout>
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 mt-12 md:mt-4 leading-tight">
        Management of Environmental Phenomena and Natural Disasters
      </h1>

      <button
        className="mb-6 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors shadow-md"
        onClick={() => setShowLogoutModal(true)}
      >
        Logout
      </button>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => {
            logout();
            setShowLogoutModal(false);
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {/* Slider Container */}
      <div className="w-full max-w-3xl mb-6 bg-white dark:bg-[#2d2d2d] p-4 rounded-lg shadow-md transition-colors">
        <label
          htmlFor="radius-slider"
          className="block mb-2 font-bold text-gray-700 dark:text-gray-200"
        >
          Forecast Radius: {Math.round(tempRadius / 1000)} km
        </label>
        <input
          id="radius-slider"
          type="range"
          min="2000"
          max="30000"
          step="1000"
          value={tempRadius}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-blue-600"
          onChange={e => setTempRadius(Number(e.target.value))}
          onMouseUp={() => setRadius(tempRadius)}
          onTouchEnd={() => setRadius(tempRadius)}
        />
      </div>

      {/* Map Container */}
      <div className="w-full max-w-4xl h-[400px] rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-[#444] mb-8 z-0 relative">
        <Map position={position} radius={radius} />
      </div>

      {/* Forecast Container */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4 ml-1">
          🗓️ 5-Day Weather Forecast
        </h2>

        <div className="grid gap-4">
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
              <div
                key={date}
                className="p-4 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-sm border border-gray-200 dark:border-[#444] transition-colors"
              >
                <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-[#444] pb-2 mb-2 text-gray-800 dark:text-gray-100">
                  {new Date(date).toDateString()}
                </h3>

                <p className="mb-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    Min: {min.toFixed(1)}°C
                  </span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    Max: {max.toFixed(1)}°C
                  </span>
                </p>

                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  👕 What to Wear / Prepare For:
                </h4>

                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {hasHeat && (
                    <li className="text-red-500 dark:text-red-400 font-medium">
                      🔥 Very hot — wear light clothes, drink water, avoid sun
                    </li>
                  )}
                  {hasRain && (
                    <li className="text-blue-500 dark:text-blue-400 font-medium">
                      ☔ Rain expected — bring umbrella or raincoat
                    </li>
                  )}
                  {hasWind && <li>💨 Windy — consider a windbreaker</li>}
                  {max > 30 && !hasRain && (
                    <li>🧢 Sunny — wear a hat, sunglasses, and sunscreen</li>
                  )}
                  {min < 10 && <li>🧥 Cold — bring a jacket or coat</li>}
                  {!hasHeat &&
                    !hasRain &&
                    !hasWind &&
                    max <= 30 &&
                    min >= 10 && <li>🙂 Mild weather — dress comfortably</li>}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </AppLayout>
  );
}

export default App;
