import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map({ position }) {
  return (
    <MapContainer
      center={[position.lat, position.lon]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[position.lat, position.lon]}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  );
}
