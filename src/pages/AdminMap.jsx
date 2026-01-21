import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { Image as ImageIcon, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const BlueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const AdminMap = () => {
  const { t } = useTranslation();
  const [selectedPos, setSelectedPos] = useState([37.9838, 23.7275]);
  const [formData, setFormData] = useState({ title: '', description: '', severity: 'High' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('severity', formData.severity);
    data.append('latitude', selectedPos[0]);
    data.append('longitude', selectedPos[1]);
    if (selectedFile) data.append('event_image', selectedFile);

    try {
      await axios.post('http://localhost:4000/api/disasters', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: t('adminMap.successMsg') });
      setFormData({ title: '', description: '', severity: 'High' });
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: t('adminMap.errorMsg') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in">
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{t('adminMap.title')}</h1>
          <p className="text-gray-500 text-sm">{t('adminMap.instruction')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#252535] p-6 rounded-2xl shadow-lg border dark:border-[#444] space-y-4"
        >
          <input
            type="text"
            placeholder={t('adminMap.titlePlaceholder')}
            required
            className="w-full p-3 rounded-xl border dark:bg-[#333] dark:text-white"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <select
            className="w-full p-3 rounded-xl border dark:bg-[#333] dark:text-white"
            value={formData.severity}
            onChange={e => setFormData({ ...formData, severity: e.target.value })}
          >
            <option value="High">{t('disasters.severity.high')}</option>
            <option value="Moderate">{t('disasters.severity.moderate')}</option>
            <option value="Low">{t('disasters.severity.low')}</option>
          </select>

          <textarea
            placeholder={t('adminMap.descPlaceholder')}
            required
            className="w-full p-3 rounded-xl border dark:bg-[#333] dark:text-white h-24"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="border-2 border-dashed border-gray-200 dark:border-[#444] p-4 rounded-xl text-center relative">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="text-gray-400" />
              <span className="text-xs text-gray-500">
                {selectedFile ? selectedFile.name : t('adminMap.uploadImg')}
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs font-mono text-blue-700">
            {t('adminMap.coordinates')}: {selectedPos[0].toFixed(4)}, {selectedPos[1].toFixed(4)}
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-center font-bold text-sm ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              t('adminMap.publishing')
            ) : (
              <>
                <Send size={18} /> {t('adminMap.publishBtn')}
              </>
            )}
          </button>
        </form>
      </div>

      <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-[#444] relative z-0">
        <MapContainer center={selectedPos} zoom={11} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler onLocationSelect={setSelectedPos} />
          <Marker position={selectedPos} icon={BlueIcon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default AdminMap;
