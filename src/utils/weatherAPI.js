export async function fetchNearbyWeather(lat, lon, count = 30) {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${count}&units=metric&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  const data = await res.json();
  return data.list; // array of weather points
}
