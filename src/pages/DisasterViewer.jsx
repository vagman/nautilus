import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { X, MapPin, Calendar, Hash, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RadiusSlider from '../components/RadiusSlider';
import Footer from '../components/Footer';

const createIcon = color =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

const RedIcon = createIcon('red');
const OrangeIcon = createIcon('orange');
const YellowIcon = createIcon('gold');

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const DisasterViewer = () => {
  const { t } = useTranslation();
  const [radius, setRadius] = useState(10000);
  const [disasters, setDisasters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userLoc, setUserLoc] = useState([37.9838, 23.7275]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => setUserLoc([p.coords.latitude, p.coords.longitude]),
        err => console.error('Geolocation error:', err),
      );
    }

    const fetchDisasters = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/disasters', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDisasters(res.data.data);
      } catch (err) {
        console.error('Failed to fetch disasters', err);
      }
    };
    fetchDisasters();
  }, []);

  const filtered = disasters.filter(d => {
    const dist = L.latLng(userLoc).distanceTo([d.latitude, d.longitude]);
    return dist <= radius;
  });

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 max-w-7xl mx-auto h-auto">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-2xl font-bold dark:text-white mb-2">{t('disasters.title')}</h1>
        <div className="max-w-xl mx-auto">
          <RadiusSlider value={radius} onChange={setRadius} onFinalChange={() => {}} />
        </div>
      </div>

      {/* MAP SECTION: Constrained height to keep card visible below */}
      <div className="h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border-2 dark:border-[#333] z-0">
        <MapContainer center={userLoc} zoom={11} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap center={userLoc} />
          <Circle center={userLoc} radius={radius} pathOptions={{ color: '#3b82f6', fillOpacity: 0.1 }} />
          {filtered.map(d => (
            <Marker
              key={d.id}
              position={[d.latitude, d.longitude]}
              icon={d.severity === 'High' ? RedIcon : d.severity === 'Moderate' ? OrangeIcon : YellowIcon}
              eventHandlers={{ click: () => setSelected(d) }}
            />
          ))}
        </MapContainer>
      </div>

      {/*  DETAILS CARD */}
      {selected && (
        <div className="bg-white dark:bg-[#252535] rounded-2xl shadow-xl border dark:border-[#444] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2">
          {/* IMAGE AREA: Height is limited to 200-300px max */}
          {selected.event_image && (
            <div className="w-full bg-black flex items-center justify-center relative h-[200px] md:h-[280px]">
              <img src={selected.event_image} className="h-full w-full object-contain" alt={selected.title} />
            </div>
          )}

          {/* CONTENT AREA */}
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold dark:text-white">{selected.title}</h2>
                <div className="flex gap-2 mt-1">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white ${
                      selected.severity === 'High' ? 'bg-red-600' : 'bg-orange-500'
                    }`}
                  >
                    {selected.severity}
                  </span>
                  <span className="text-gray-400 text-[10px] flex items-center gap-1 bg-gray-100 dark:bg-white/10 px-2 rounded">
                    <Hash size={10} /> {selected.id}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-snug line-clamp-3 md:line-clamp-none">
              {selected.description}
            </p>

            {/* FOOTER */}
            <div className="mt-4 pt-3 border-t dark:border-[#444] flex justify-between items-center text-[11px] text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(selected.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <MapPin size={12} />
                  <span>
                    {Number(selected.latitude).toFixed(4)}, {Number(selected.longitude).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DisasterViewer;
