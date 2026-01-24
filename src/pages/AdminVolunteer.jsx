import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // <--- Import this
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import { Calendar, MapPin, Package, Type, FileText, Save, Clock, Image as ImageIcon, Info } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- 1. DEFINE ICONS EXPLICITLY (Like in AdminMap) ---
const BlueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map clicks
function MapClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

const AdminVolunteer = () => {
  const { t } = useTranslation(); // <--- Initialize hook
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locationName: '',
    date: '',
    duration: '',
    items: '',
  });

  const [position, setPosition] = useState(null);
  const [existingEvents, setExistingEvents] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full pl-10 p-3 bg-gray-50 dark:bg-[#2d2d3d] border border-gray-200 dark:border-[#444] rounded-xl dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all';

  // Fetch existing events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/api/volunteer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingEvents(res.data.data.filter(e => e.latitude && e.longitude));
      } catch (err) {
        console.error('Error fetching existing events:', err);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!position) {
      alert(t('adminVolunteer.alertNoLocation')); // Translatred alert
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const data = new FormData();

    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.locationName);
    data.append('latitude', position.lat);
    data.append('longitude', position.lng);
    data.append('event_date', formData.date);
    data.append('duration', formData.duration);
    data.append('items_needed', formData.items);
    if (selectedFile) data.append('image', selectedFile);

    try {
      await axios.post('http://localhost:4000/api/volunteer', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(t('adminVolunteer.alertSuccess')); // Translated alert

      // Reset Form & Position
      setFormData({ title: '', description: '', locationName: '', date: '', duration: '', items: '' });
      setPosition(null);
      setSelectedFile(null);

      // Refresh map events
      const res = await axios.get('http://localhost:4000/api/volunteer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingEvents(res.data.data.filter(e => e.latitude && e.longitude));
    } catch (error) {
      console.error(error);
      alert(t('adminVolunteer.alertError')); // Translated alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-3 animate-in fade-in">
      {/* LEFT: FORM SECTION */}
      <div className="p-6 bg-white dark:bg-[#1a1a2e] overflow-y-auto border-r border-gray-200 dark:border-[#333] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          {t('adminVolunteer.title')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
          <div className="relative">
            <Type className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              required
              className={inputClass}
              placeholder={t('adminVolunteer.titlePlaceholder')}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="relative">
            <FileText className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <textarea
              required
              rows="3"
              className={inputClass}
              placeholder={t('adminVolunteer.descPlaceholder')}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="datetime-local"
                required
                className={inputClass}
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('adminVolunteer.durationPlaceholder')}
                className={inputClass}
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              required
              className={inputClass}
              placeholder={t('adminVolunteer.locationPlaceholder')}
              value={formData.locationName}
              onChange={e => setFormData({ ...formData, locationName: e.target.value })}
            />
          </div>

          <div className="relative">
            <Package className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              className={inputClass}
              placeholder={t('adminVolunteer.itemsPlaceholder')}
              value={formData.items}
              onChange={e => setFormData({ ...formData, items: e.target.value })}
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-[#444] rounded-xl p-4 text-center relative hover:bg-gray-50 dark:hover:bg-[#2a2a3a] cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <ImageIcon size={24} />
              <span className="text-xs">{selectedFile ? selectedFile.name : t('adminVolunteer.uploadText')}</span>
            </div>
          </div>

          {/* Prompt / Status Box */}
          <div
            className={`p-4 rounded-xl border text-sm flex items-center gap-2 transition-colors ${position ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}
          >
            <Info size={18} />
            {position
              ? `${t('adminVolunteer.locationSelected')}: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
              : t('adminVolunteer.locationInstruction')}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/30 mt-auto"
          >
            <Save size={20} />
            {loading ? t('adminVolunteer.btnCreating') : t('adminVolunteer.btnPublish')}
          </button>
        </form>
      </div>

      {/* RIGHT: MAP SECTION */}
      <div className="col-span-1 lg:col-span-2 relative z-0 h-full">
        <MapContainer center={[37.9838, 23.7275]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler setPosition={setPosition} />

          {/* 1. Show Existing Events (Blue Pins) */}
          {existingEvents.map(event => (
            <Marker key={event.id} position={[event.latitude, event.longitude]} icon={BlueIcon}>
              <Popup>
                <strong>{event.title}</strong>
                <br />
                {event.location}
              </Popup>
            </Marker>
          ))}

          {/* 2. Show NEW Event Selection (Red Pin) */}
          {position && (
            <Marker position={position} icon={RedIcon}>
              <Popup>{t('adminVolunteer.mapPopupNew')}</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating Text Prompt */}
        {!position && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur dark:bg-[#1a1a2e]/90 px-6 py-3 rounded-full shadow-xl border border-blue-200 z-[1000] animate-bounce">
            <p className="text-blue-700 dark:text-blue-300 font-bold flex items-center gap-2">
              <MapPin size={20} />
              {t('adminVolunteer.floatingPrompt')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVolunteer;
