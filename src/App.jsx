import { useEffect, useState } from 'react';
import Map from './components/Map';
import './App.css';

function App() {
  const [position, setPosition] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setPosition({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setError('Unable to retrieve your location');
      }
    );
  }, []);

  // Step 2: Fetch 5-day forecast when position is available
  useEffect(() => {
    if (!position) return;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.lat}&lon=${position.lon}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Forecast data:', data);
        setForecast(data.list); // contains 5 days of data in 3-hour intervals
      })
      .catch(err => console.error('Fetch error:', err));
  }, [position, apiKey]);

  // Helper: Group forecast into 5 days
  function groupForecastByDay(forecastList) {
    const days = {};

    forecastList.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0]; // "YYYY-MM-DD"
      if (!days[date]) {
        days[date] = [];
      }
      days[date].push(entry);
    });

    return Object.entries(days).slice(0, 5); // Only next 5 days
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>Μanagement of environmental phenomena and natural disasters</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (!position || !forecast) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>Μanagement of environmental phenomena and natural disasters</h1>
        <p>Loading location and weather data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Μanagement of environmental phenomena and natural disasters</h1>
      <div className="map">
        <Map position={position} />
      </div>

      <div className="forecast-container">
        <h2>🗓️ 5-Day Weather Forecast</h2>
        {groupForecastByDay(forecast).map(([date, entries]) => {
          const temps = entries.map(e => e.main.temp);
          const min = Math.min(...temps);
          const max = Math.max(...temps);
          const hasRain = entries.some(e =>
            ['rain', 'drizzle', 'shower'].some(word =>
              e.weather[0].main.toLowerCase().includes(word)
            )
          );
          const hasHeat = max > 35;
          const hasWind = entries.some(e => e.wind.speed > 10);

          return (
            <div key={date} className="forecast-day">
              <h3>{new Date(date).toDateString()}</h3>
              <p>
                <strong>Min:</strong> {min.toFixed(1)}°C, <strong>Max:</strong>{' '}
                {max.toFixed(1)}°C
              </p>

              <h4>👕 What to Wear / Prepare For:</h4>
              <ul>
                {hasHeat && (
                  <li>
                    🔥 Very hot — wear light clothes, drink water, avoid sun
                  </li>
                )}
                {hasRain && (
                  <li>☔ Rain expected — bring umbrella or raincoat</li>
                )}
                {hasWind && <li>💨 Windy — consider a windbreaker</li>}
                {max > 30 && !hasRain && (
                  <li>🧢 Sunny — wear a hat, sunglasses, and sunscreen</li>
                )}
                {min < 10 && <li>🧥 Cold — bring a jacket or coat</li>}
                {!hasHeat && !hasRain && !hasWind && max <= 30 && min >= 10 && (
                  <li>🙂 Mild weather — dress comfortably</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
