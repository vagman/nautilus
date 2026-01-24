import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // <--- Import Hook
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import axios from 'axios';
import { Calendar, MapPin, Package, Clock, Users, Hand } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- ICONS ---
const HouseIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [32, 32],
  shadowAnchor: [10, 32],
});

const EventIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Helper: Haversine Distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const Volunteer = () => {
  const { t } = useTranslation(); // <--- Init Translation
  const [events, setEvents] = useState([]);

  const [radius, setRadius] = useState(50);
  const [userLocation, setUserLocation] = useState([37.9838, 23.7275]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:4000/api/volunteer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const validEvents = res.data.data.filter(e => e.latitude && e.longitude);
        setEvents(validEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => console.log('Location denied, using default.'),
      );
    }
  }, []);

  const filteredEvents = useMemo(() => {
    if (events.length === 0) return [];

    return events.filter(event => {
      const dist = getDistanceFromLatLonInKm(
        userLocation[0],
        userLocation[1],
        parseFloat(event.latitude),
        parseFloat(event.longitude),
      );
      return dist <= radius;
    });
  }, [radius, userLocation, events]);

  const handleMarkerClick = id => {
    setSelectedEventId(id);
    const element = document.getElementById(`card-${id}`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-in fade-in">
      {/* MAP SECTION */}
      <div className="relative h-[60%] w-full z-0">
        <MapContainer center={userLocation} zoom={9} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Circle
            center={userLocation}
            radius={radius * 1000}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
          />

          <Marker position={userLocation} icon={HouseIcon}>
            {/* Translated Popup */}
            <Popup>{t('volunteer.youAreHere')}</Popup>
          </Marker>

          {filteredEvents.map(event => (
            <Marker
              key={event.id}
              position={[event.latitude, event.longitude]}
              icon={EventIcon}
              eventHandlers={{ click: () => handleMarkerClick(event.id) }}
            >
              <Popup>{event.title}</Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-white dark:bg-[#1a1a2e] px-6 py-3 rounded-full shadow-xl border border-gray-200 dark:border-[#444] flex items-center gap-4 w-[90%] max-w-md">
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {/* Translated Radius Label */}
            {t('volunteer.radius')}: {radius} km
          </span>
          <input
            type="range"
            min="1"
            max="100" // Adjusted max to be more reasonable
            value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* CARDS SECTION */}
      <div className="flex-1 bg-gray-50 dark:bg-[#0f0f1a] p-4 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users className="text-blue-500" />
              {t('volunteer.title')} ({filteredEvents.length})
            </h2>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center p-10 text-gray-400">
              {/* Translated "No Events" with Radius Variable */}
              {t('volunteer.noEventsRadius', { radius: radius })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <div
                  id={`card-${event.id}`}
                  key={event.id}
                  className={`bg-white dark:bg-[#252535] rounded-xl overflow-hidden shadow-sm border transition-all duration-300 flex flex-col ${
                    selectedEventId === event.id
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-gray-100 dark:border-[#333]'
                  }`}
                >
                  <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 relative">
                    <img
                      src={event.event_image || DEFAULT_IMAGE}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                    {event.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md flex items-center gap-1">
                        <Clock size={12} /> {event.duration}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">{event.title}</h3>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2 flex-grow">
                      {event.description}
                    </p>

                    <div className="space-y-2 mt-auto pt-3 border-t border-gray-100 dark:border-[#333]">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} className="text-blue-500" />
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>

                      {event.items_needed && (
                        <div className="flex items-center gap-2 text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded">
                          {/* Translated "Needs" Label */}
                          <Package size={12} /> {t('volunteer.needs')}: {event.items_needed}
                        </div>
                      )}
                    </div>

                    <button className="mt-3 w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                      {/* Translated Button */}
                      <Hand size={16} /> {t('volunteer.join')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
