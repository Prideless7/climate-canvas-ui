import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Station {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  active: boolean;
  elevation: number;
  lastUpdate: string;
}

interface LeafletMapProps {
  stations: Station[];
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  hasStationData: (stationId: string) => boolean;
}

// Create custom icon based on station status
const createCustomIcon = (isActive: boolean, hasData: boolean, isSelected: boolean) => {
  const color = hasData ? (isActive ? '#1a91d1' : '#8b9298') : 'rgba(128, 128, 128, 0.5)';
  const size = isSelected ? 32 : 24;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: ${isSelected ? '3px' : '2px'} solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${hasData ? 'cursor: pointer;' : 'cursor: not-allowed; opacity: 0.5;'}
      ">
        ${isActive ? `<div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; animation: pulse 2s infinite;"></div>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

export const LeafletMap = ({ stations, selectedStation, onStationSelect, hasStationData }: LeafletMapProps) => {
  return (
    <MapContainer
      center={[35.2401, 24.8093]}
      zoom={9}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.coordinates.lat, station.coordinates.lng]}
          icon={createCustomIcon(station.active, hasStationData(station.id), selectedStation === station.id)}
          eventHandlers={{
            click: () => {
              if (hasStationData(station.id)) {
                onStationSelect(station.id);
              }
            }
          }}
        >
          <Popup>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-sm">{station.name}</h4>
                <Badge variant={station.active ? "default" : "secondary"} className="text-xs">
                  {station.active ? "Online" : "Offline"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {station.location}
                </p>
                <p>Elevation: {station.elevation}m</p>
                <p>Updated: {station.lastUpdate}</p>
                <p className="text-xs">
                  Lat: {station.coordinates.lat.toFixed(4)}, Lng: {station.coordinates.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
