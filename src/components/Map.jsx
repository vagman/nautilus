import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // <--- KEEP THIS!

export default function Map({ position, radius = 2000 }) {
  return (
    <MapContainer
      center={position}
      zoom={12}
      // Replaced inline style with Tailwind classes to fill the parent container
      className="h-full w-full outline-none z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} />
      <Circle
        center={position}
        radius={radius}
        pathOptions={{ fillColor: 'rgba(0, 123, 255, 0.3)', color: '#007bff' }}
      />
    </MapContainer>
  );
}
