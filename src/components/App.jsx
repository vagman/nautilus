import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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

// ✅ 1. IMPORT THE MISSING MODALS
import HelpModal from './HelpModal';
import AboutModal from './AboutModal';

import { generateSurroundingCoordinates } from '../utils/generateSurroundingCoordinates';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/api';

function App() {
  const { t } = useTranslation();
  const [tempRadius, setTempRadius] = useState(2000);
  const [radius, setRadius] = useState(2000);

  // ✅ 2. ADD STATE FOR NEW MODALS
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

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
      await userService.deleteAccount(user.id);
      setShowDeleteModal(false);
      logout();
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Error deleting account: ' + (err.error || err.message));
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
    // ✅ 3. PASS OPEN HANDLERS TO LAYOUT (which passes them to Sidebar)
    onOpenHelp: () => setShowHelpModal(true),
    onOpenAbout: () => setShowAboutModal(true),
  };

  const modalProps = {
    onConfirm: () => {
      logout();
      setShowLogoutModal(false);
    },
    onCancel: () => setShowLogoutModal(false),
  };

  const TopRightLogout = () => (
    <div className="fixed top-6 right-6 z-50">
      <LogoutButton onClick={() => setShowLogoutModal(true)} />
    </div>
  );

  // Helper to keep return statement clean
  const renderModals = () => (
    <>
      {showLogoutModal && <LogoutModal {...modalProps} />}
      {showDeleteModal && (
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeleting}
        />
      )}
      {/* ✅ 4. RENDER THE NEW MODALS */}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}
    </>
  );

  if (error) {
    return (
      <DashboardLayout {...layoutProps}>
        <TopRightLogout />
        <PageTitle>{t('common.appTitle')}</PageTitle>
        <ErrorMessage message={error} />
        {renderModals()}
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
      <TopRightLogout />

      <PageTitle className="leading-tight">{t('common.appTitle')}</PageTitle>

      {/* Render all modals here */}
      {renderModals()}

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
