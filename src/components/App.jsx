import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import Hook

import DashboardLayout from './DashboardLayout';
import PageTitle from './PageTitle';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import LogoutButton from './LogoutButton';
import RadiusSlider from './RadiusSlider';
import ForecastList from './ForecastList';
import Map from './Map';
import LogoutModal from './LogoutModal';
import Footer from './Footer';
import AuthForm from './AuthForm';
import DeleteAccountModal from './DeleteAccountModal';

import { generateSurroundingCoordinates } from '../utils/generateSurroundingCoordinates';

import { useGeolocation } from '../hooks/useGeolocation';
import { useTheme } from '../context/ThemeContext';

function App() {
  const { t } = useTranslation(); // 2. Init Hook
  const [tempRadius, setTempRadius] = useState(2000);
  const [radius, setRadius] = useState(2000);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setForecast(null);
    clearUserThemeSync();
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${user.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      setShowDeleteModal(false);
      logout();
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Error deleting account: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (!user) return <AuthForm onAuthSuccess={setUser} />;

  const layoutProps = {
    user,
    isSidebarOpen,
    setSidebarOpen,
    onRequestDelete: () => setShowDeleteModal(true),
  };

  const modalProps = {
    onConfirm: () => {
      logout();
      setShowLogoutModal(false);
    },
    onCancel: () => setShowLogoutModal(false),
  };

  if (error) {
    return (
      <DashboardLayout {...layoutProps}>
        <PageTitle>{t('common.appTitle')}</PageTitle>
        <ErrorMessage message={error} />
        <LogoutButton onClick={() => setShowLogoutModal(true)} />
        {showLogoutModal && <LogoutModal {...modalProps} />}
      </DashboardLayout>
    );
  }

  if (isLoadingGeo || (!forecast && !error)) {
    return (
      <DashboardLayout {...layoutProps}>
        <PageTitle>{t('common.appTitle')}</PageTitle>
        <LoadingSpinner message={t('common.loading')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout {...layoutProps}>
      {/* ✅ Translated Title */}
      <PageTitle className="leading-tight">{t('common.appTitle')}</PageTitle>

      <LogoutButton onClick={() => setShowLogoutModal(true)} />

      {showLogoutModal && <LogoutModal {...modalProps} />}
      {showDeleteModal && (
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeleting}
        />
      )}

      <RadiusSlider
        value={tempRadius}
        onChange={setTempRadius}
        onFinalChange={setRadius}
      />

      <div className="w-full max-w-4xl h-[400px] rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-[#444] mb-8 z-0 relative">
        <Map position={position} radius={radius} />
      </div>

      <ForecastList forecast={forecast} />

      <Footer />
    </DashboardLayout>
  );
}

export default App;
