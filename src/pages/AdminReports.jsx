import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Blue Icon for "New Selection"
const BlueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Helper: Handles map clicks to set location
const LocationSelector = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const AdminReports = () => {
  // Athens Default
  const [selectedPosition, setSelectedPosition] = useState([37.9838, 23.7275]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'High',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Styles reused for consistency
  const inputClass =
    'w-full p-3 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-[#555] rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:4000/api/disasters',
        {
          title: formData.title,
          description: formData.description,
          severity: formData.severity,
          latitude: selectedPosition[0],
          longitude: selectedPosition[1],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setMessage('✅ Disaster Report Published Successfully!');
      setFormData({ title: '', description: '', severity: 'High' });
      // Don't reset map so they can see where they placed it
    } catch (err) {
      console.error(err);
      setMessage('❌ Error publishing report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in">
      {/* LEFT: FORM SECTION */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Report Disaster</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Click on the map to set the location, then fill out the details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#252535] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-[#333] space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              className={inputClass}
              placeholder="e.g. Forest Fire in Parnitha"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Severity</label>
            <select
              className={inputClass}
              value={formData.severity}
              onChange={e => setFormData({ ...formData, severity: e.target.value })}
            >
              <option value="High">High (Critical)</option>
              <option value="Moderate">Moderate (Warning)</option>
              <option value="Low">Low (Advisory)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              className={`${inputClass} h-32`}
              placeholder="Describe the situation..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <strong>Selected Coordinates:</strong> <br />
            Lat: {selectedPosition[0].toFixed(4)}, Lng: {selectedPosition[1].toFixed(4)}
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-center font-bold ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-500/30 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Report'}
          </button>
        </form>
      </div>

      {/* RIGHT: INTERACTIVE MAP */}
      <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-[#444] relative z-0">
        <MapContainer center={selectedPosition} zoom={11} className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationSelector setPosition={setSelectedPosition} />

          <Marker position={selectedPosition} icon={BlueIcon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default AdminReports;
