import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RadiusSlider from '../components/RadiusSlider';
import Footer from '../components/Footer';

import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// --- 1. DEFINE ICONS ---
const createIcon = color => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const RedIcon = createIcon('red');
const OrangeIcon = createIcon('orange');
const YellowIcon = createIcon('gold');

const getSeverityIcon = severity => {
  if (!severity) return RedIcon;
  switch (severity.toLowerCase()) {
    case 'high':
      return RedIcon;
    case 'moderate':
      return OrangeIcon;
    case 'low':
      return YellowIcon;
    default:
      return RedIcon;
  }
};

// --- 2. DISTANCE CALCULATION HELPER ---
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return in meters
};

// Helper: Moves map
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const Disasters = () => {
  const { t } = useTranslation();
  const [radius, setRadius] = useState(10000);
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [userLocation, setUserLocation] = useState([37.9838, 23.7275]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        err => console.error(err),
      );
    }
  }, []);

  useEffect(() => {
    const fetchDisasters = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:4000/api/disasters', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisasters(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDisasters();
  }, []);

  const filteredDisasters = disasters.filter(disaster => {
    const distance = getDistance(userLocation[0], userLocation[1], disaster.latitude, disaster.longitude);
    return distance <= radius;
  });

  return (
    <div className="h-full flex flex-col animate-in fade-in">
      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col gap-6">
        {/* HEADER & SLIDER */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('disasters.title')}</h1>
          <div className="w-full max-w-3xl">
            <RadiusSlider value={radius} onChange={setRadius} onFinalChange={() => {}} />
          </div>
        </div>

        {/* MAP */}
        <div className="w-full min-h-[500px] flex-1 rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-[#444] relative z-0">
          <MapContainer center={userLocation} zoom={12} className="h-full w-full outline-none">
            <RecenterMap center={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
              center={userLocation}
              radius={radius}
              pathOptions={{
                fillColor: 'rgba(0, 123, 255, 0.3)',
                color: '#007bff',
              }}
            />
            {filteredDisasters.map(disaster => (
              <Marker
                key={disaster.id}
                position={[disaster.latitude, disaster.longitude]}
                icon={getSeverityIcon(disaster.severity)}
                eventHandlers={{ click: () => setSelectedDisaster(disaster) }}
              >
                <Popup>
                  <strong className="text-lg">{disaster.title}</strong>
                  <br />
                  <span
                    className={`font-bold ${
                      disaster.severity === 'High'
                        ? 'text-red-600'
                        : disaster.severity === 'Moderate'
                          ? 'text-orange-500'
                          : 'text-yellow-600'
                    }`}
                  >
                    {disaster.severity} Priority
                  </span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* DETAILS CARD */}
        {selectedDisaster && (
          <div
            className={`
            p-6 rounded-2xl shadow-lg border animate-in slide-in-from-bottom-4 mb-6
            bg-white dark:bg-[#252535]
            ${
              selectedDisaster.severity === 'High'
                ? 'border-red-100 dark:border-red-900/30'
                : selectedDisaster.severity === 'Moderate'
                  ? 'border-orange-100 dark:border-orange-900/30'
                  : 'border-yellow-100 dark:border-yellow-900/30'
            }
          `}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      selectedDisaster.severity === 'High'
                        ? 'bg-red-500'
                        : selectedDisaster.severity === 'Moderate'
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                    }`}
                  />
                  {selectedDisaster.title}
                </h2>
                <p
                  className={`text-sm font-semibold uppercase mt-1 ${
                    selectedDisaster.severity === 'High'
                      ? 'text-red-500'
                      : selectedDisaster.severity === 'Moderate'
                        ? 'text-orange-500'
                        : 'text-yellow-600'
                  }`}
                >
                  {selectedDisaster.severity} Priority
                </p>
              </div>
              <button
                onClick={() => setSelectedDisaster(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">{selectedDisaster.description}</p>
            <div className="mt-4 text-xs text-gray-400">
              Reported on: {new Date(selectedDisaster.created_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      {/* ✅ FOOTER ADDED HERE */}
      <Footer />
    </div>
  );
};

export default Disasters;
