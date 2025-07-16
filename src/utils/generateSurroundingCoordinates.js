export function generateSurroundingCoordinates(center, radius, count = 8) {
  const EARTH_RADIUS = 6371000; // in meters
  const coords = [];

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);

    const deltaLat = (dy / EARTH_RADIUS) * (180 / Math.PI);
    const deltaLon =
      (dx / (EARTH_RADIUS * Math.cos((center.lat * Math.PI) / 180))) *
      (180 / Math.PI);

    coords.push({
      lat: center.lat + deltaLat,
      lon: center.lon + deltaLon,
    });
  }

  return coords;
}
