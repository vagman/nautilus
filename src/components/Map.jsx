import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ position, radius = 2000 }) {
  return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
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
