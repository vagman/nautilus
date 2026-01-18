import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ position, radius = 2000 }) {
  return (
    <div className="w-full max-w-4xl h-[400px] rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-[#444] mb-8 z-0 relative">
      <MapContainer center={position} zoom={12} className="h-full w-full outline-none">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
        <Circle
          center={position}
          radius={radius}
          pathOptions={{
            fillColor: 'rgba(0, 123, 255, 0.3)',
            color: '#007bff',
          }}
        />
      </MapContainer>
    </div>
  );
}
