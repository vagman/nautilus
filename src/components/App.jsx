import { useState, useEffect } from 'react';

// Components
import DashboardLayout from './DashboardLayout';
import PageTitle from './PageTitle';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import LogoutButton from './LogoutButton';
import RadiusSlider from './RadiusSlider';
import ForecastList from './ForecastList';
import Map from './Map';
import AuthForm from './AuthForm';
import LogoutModal from './LogoutModal';
import Footer from './Footer';

// Logic
import { generateSurroundingCoordinates } from '../utils/generateSurroundingCoordinates';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTheme } from '../context/ThemeContext';

function App() {
  // --- STATE ---
  const [tempRadius, setTempRadius] = useState(2000);
  const [radius, setRadius] = useState(2000);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { clearUserThemeSync } = useTheme();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const {
    position,
    isLoading: isLoadingGeo,
    error: geoError,
  } = useGeolocation();
  const [fetchError, setFetchError] = useState(null);
  const error = geoError || fetchError;

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // --- HANDLERS ---
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setForecast(null);
    clearUserThemeSync();
  };

  // --- EFFECTS ---
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

  // --- RENDER ---
  // 1. Auth View
  if (!user) return <AuthForm onAuthSuccess={setUser} />;

  // Props shared across all Dashboard states
  const layoutProps = { user, isSidebarOpen, setSidebarOpen };
  const modalProps = {
    onConfirm: () => {
      logout();
      setShowLogoutModal(false);
    },
    onCancel: () => setShowLogoutModal(false),
  };

  // 2. Error View
  if (error) {
    return (
      <DashboardLayout {...layoutProps}>
        <PageTitle>Management of Environmental Phenomena</PageTitle>
        <ErrorMessage message={error} />
        <LogoutButton onClick={() => setShowLogoutModal(true)} />
        {showLogoutModal && <LogoutModal {...modalProps} />}
      </DashboardLayout>
    );
  }

  // 3. Loading View
  if (isLoadingGeo || (!forecast && !error)) {
    return (
      <DashboardLayout {...layoutProps}>
        <PageTitle>Management of Environmental Phenomena</PageTitle>
        <LoadingSpinner message="Loading location and weather data..." />
      </DashboardLayout>
    );
  }

  // 4. Main Dashboard View
  return (
    <DashboardLayout {...layoutProps}>
      <PageTitle className="leading-tight">
        Management of Environmental Phenomena and Natural Disasters
      </PageTitle>

      <LogoutButton onClick={() => setShowLogoutModal(true)} />

      {showLogoutModal && <LogoutModal {...modalProps} />}

      <RadiusSlider
        value={tempRadius}
        onChange={setTempRadius}
        onFinalChange={setRadius}
      />

      <Map position={position} radius={radius} />

      <ForecastList forecast={forecast} />

      <Footer />
    </DashboardLayout>
  );
}

export default App;
