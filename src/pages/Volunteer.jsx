import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // ✅ Import translation hook
import axios from 'axios';
import { Calendar, MapPin, Package, Plus, X as XIcon } from 'lucide-react';

const Volunteer = ({ user }) => {
  const { t } = useTranslation(); // ✅ Initialize hook
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    duration: '',
    items: '',
    image: '',
  });

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
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:4000/api/volunteer',
        {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          event_date: formData.date,
          duration: formData.duration,
          items_needed: formData.items,
          image_url: formData.image,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowForm(false);
      setDataVersion(prev => prev + 1);
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        duration: '',
        items: '',
        image: '',
      });
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event. See console for details.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-[#333] pb-6">
        <div>
          {/* ✅ Translated Title & Subtitle */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('volunteer.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('volunteer.subtitle')}</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            {showForm ? <XIcon size={20} /> : <Plus size={20} />}
            {/* ✅ Translated Button Text */}
            {showForm ? t('volunteer.cancel') : t('volunteer.newEvent')}
          </button>
        )}
      </div>

      {/* ADMIN FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#252535] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-[#333] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4"
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
            {/* ✅ Translated Options */}
            <option value="">{t('volunteer.form.toolsPlaceholder')}</option>
            <option value="Gloves, Bags">{t('volunteer.form.toolGloves')}</option>
            <option value="Shovels, Boots">{t('volunteer.form.toolShovels')}</option>
            <option value="Water, Food">{t('volunteer.form.toolWater')}</option>
            <option value="Medical Kits">{t('volunteer.form.toolMedical')}</option>
          </select>

          <div className="col-span-2">
            <input
              className={inputClass}
              placeholder={t('volunteer.form.imagePlaceholder')}
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
          >
            {t('volunteer.form.publishButton')}
          </button>
        </form>
      )}

      {/* USER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <p>{t('volunteer.noEvents')}</p>
          </div>
        )}

        {events.map(event => (
          <div
            key={event.id}
            className="bg-white dark:bg-[#252535] rounded-2xl shadow-sm border border-gray-100 dark:border-[#333] overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={
                  event.image_url ||
                  'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80'
                }
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {event.duration && (
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                  {event.duration}
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1" title={event.title}>
                {event.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 h-10">{event.description}</p>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500 shrink-0" />
                  <span>{new Date(event.event_date).toLocaleString()}</span>
                </div>
                {event.items_needed && (
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-orange-500 shrink-0" />
                    <span className="truncate">
                      {t('volunteer.needs')}: {event.items_needed}
                    </span>
                  </div>
                )}
              </div>

              <button className="w-full mt-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2.5 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                {t('volunteer.viewDetails')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Volunteer;
