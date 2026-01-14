function ForecastList({ forecast }) {
  function groupForecastByDay(forecastList) {
    if (!forecastList) return [];
    const days = {};
    forecastList.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!days[date]) days[date] = [];
      days[date].push(entry);
    });
    return Object.entries(days).slice(0, 5);
  }

  // 2. Render Logic
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-4 ml-1">🗓️ 5-Day Weather Forecast</h2>
      <div className="grid gap-4">
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
            <div
              key={date}
              className="p-4 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-sm border border-gray-200 dark:border-[#444] transition-colors"
            >
              <h3 className="text-lg font-semibold border-b border-gray-100 dark:border-[#444] pb-2 mb-2 text-gray-800 dark:text-gray-100">
                {new Date(date).toDateString()}
              </h3>
              <p className="mb-3">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  Min: {min.toFixed(1)}°C
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  Max: {max.toFixed(1)}°C
                </span>
              </p>
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                👕 What to Wear / Prepare For:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                {hasHeat && (
                  <li className="text-red-500 dark:text-red-400 font-medium">
                    🔥 Very hot — wear light clothes, drink water, avoid sun
                  </li>
                )}
                {hasRain && (
                  <li className="text-blue-500 dark:text-blue-400 font-medium">
                    ☔ Rain expected — bring umbrella or raincoat
                  </li>
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

export default ForecastList;
