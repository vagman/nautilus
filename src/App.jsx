import { useEffect, useState } from 'react';

function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const lat = 44.3;
    const lon = 7.15;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Weather data:', data);
        setWeather(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  if (!weather) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>Weather Alert App</h1>
        <p>Loading weather data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Weather Alert App</h1>
      <p>
        <strong>City:</strong> {weather.name}
      </p>
      <p>
        <strong>Temperature:</strong> {weather.main.temp}°C
      </p>
      <p>
        <strong>Condition:</strong> {weather.weather[0].description}
      </p>

      {/* ⚠️ Alerts */}
      {weather.main.temp > 35 && (
        <p style={{ color: 'red' }}>
          🔥 Extreme Heat Alert! Stay hydrated and wear light clothing.
        </p>
      )}

      {weather.weather[0].main.toLowerCase().includes('thunderstorm') && (
        <p style={{ color: 'purple' }}>
          ⛈️ Thunderstorm Warning! Stay indoors if possible.
        </p>
      )}

      {weather.wind.speed > 10 && (
        <p style={{ color: 'blue' }}>
          💨 Strong Wind Alert! Secure loose items outdoors.
        </p>
      )}

      {/* 👕 Clothing Suggestions */}
      <div style={{ marginTop: '1rem' }}>
        <h2>👕 What to Wear</h2>

        {weather.main.temp > 30 && (
          <ul>
            <li>🧢 Wear a hat</li>
            <li>😎 Sunglasses recommended</li>
            <li>🧴 Use sunscreen</li>
          </ul>
        )}

        {weather.main.temp < 10 && (
          <ul>
            <li>🧥 Wear a warm jacket</li>
            <li>🧤 Consider gloves</li>
          </ul>
        )}

        {['rain', 'drizzle', 'shower'].some(word =>
          weather.weather[0].main.toLowerCase().includes(word)
        ) && (
          <ul>
            <li>☔ Bring an umbrella</li>
            <li>🧥 Wear a raincoat</li>
          </ul>
        )}

        {weather.wind.speed > 10 && (
          <ul>
            <li>💨 Consider a windbreaker</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
