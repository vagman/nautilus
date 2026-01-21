import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Calendar, MapPin, Package, Plus, X as XIcon, Image as ImageIcon, Send, Clock } from 'lucide-react';

const Volunteer = ({ user }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    duration: '',
    items: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const inputClass =
    'w-full p-3 bg-gray-50 dark:bg-[#333] border border-gray-200 dark:border-[#555] rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all';

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:4000/api/volunteer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, [dataVersion]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('event_date', formData.date);
    data.append('duration', formData.duration);
    data.append('items_needed', formData.items);

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    try {
      await axios.post('http://localhost:4000/api/volunteer', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowForm(false);
      setDataVersion(prev => prev + 1);
      setFormData({ title: '', description: '', location: '', date: '', duration: '', items: '' });
      setSelectedFile(null);
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event. Check console for Multer field mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#333] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('volunteer.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('volunteer.subtitle')}</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            {showForm ? <XIcon size={20} /> : <Plus size={20} />}
            {showForm ? t('volunteer.cancel') : t('volunteer.newEvent')}
          </button>
        )}
      </div>

      {/* ADMIN FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#252535] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-[#333] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4"
        >
          <div className="col-span-2">
            <input
              className={inputClass}
              placeholder={t('volunteer.form.titlePlaceholder')}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="col-span-2">
            <textarea
              className={`${inputClass} h-24`}
              placeholder={t('volunteer.form.descPlaceholder')}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <input
            className={inputClass}
            placeholder={t('volunteer.form.locationPlaceholder')}
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            required
          />

          <input
            className={inputClass}
            type="datetime-local"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <input
            className={inputClass}
            placeholder={t('volunteer.form.durationPlaceholder')}
            value={formData.duration}
            onChange={e => setFormData({ ...formData, duration: e.target.value })}
          />

          <select
            className={inputClass}
            value={formData.items}
            onChange={e => setFormData({ ...formData, items: e.target.value })}
          >
            <option value="">{t('volunteer.form.toolsPlaceholder')}</option>
            <option value="Gloves, Bags">{t('volunteer.form.toolGloves')}</option>
            <option value="Shovels, Boots">{t('volunteer.form.toolShovels')}</option>
            <option value="Water, Food">{t('volunteer.form.toolWater')}</option>
            <option value="Medical Kits">{t('volunteer.form.toolMedical')}</option>
          </select>

          {/* FILE UPLOAD BOX */}
          <div className="col-span-2 border-2 border-dashed border-gray-200 dark:border-[#444] p-4 rounded-xl text-center relative hover:bg-gray-50 dark:hover:bg-[#2a2a3a] transition-colors">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : t('volunteer.form.imagePlaceholder')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              t('auth.processing')
            ) : (
              <>
                <Send size={18} /> {t('volunteer.form.publishButton')}
              </>
            )}
          </button>
        </form>
      )}

      {/* USER GRID: Compact & Clean Viewing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400 bg-white/50 dark:bg-[#252535]/50 rounded-2xl border border-dashed border-gray-200 dark:border-[#333]">
            <p>{t('volunteer.noEvents')}</p>
          </div>
        ) : (
          events.map(event => (
            <div
              key={event.id}
              className="bg-white dark:bg-[#252535] rounded-2xl shadow-sm border border-gray-100 dark:border-[#333] overflow-hidden hover:shadow-md transition-all flex flex-col group h-full"
            >
              {/* Image Section */}
              <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                <img
                  src={
                    event.event_image ||
                    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80'
                  }
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {event.duration && (
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <Clock size={12} /> {event.duration}
                  </div>
                )}
              </div>

              {/* Text Section */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-1" title={event.title}>
                    {event.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-4 h-16">
                    {event.description}
                  </p>
                </div>

                {/* Metadata Table-like Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#333] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin size={14} className="text-blue-500" />
                      <span className="truncate max-w-[120px]">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar size={14} className="text-blue-500" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {event.items_needed && (
                    <div className="flex items-center gap-2 text-[11px] text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                      <Package size={14} />
                      <span className="truncate font-medium">
                        {t('volunteer.needs')}: {event.items_needed}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Volunteer;
