import { useState } from 'react';
import { MapPin, Radio, Thermometer, CloudRain, Sun } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Station {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  active: boolean;
  elevation: number;
  lastUpdate: string;
}

const meteorologicalStations: Station[] = [
  {
    id: "Tympaki",
    name: "Tympaki Station",
    location: "Tympaki",
    coordinates: { lat: 35.0667, lng: 24.7667 }, // South-central Crete
    active: true,
    elevation: 15,
    lastUpdate: "2 min ago"
  },
  {
    id: "Potamies",
    name: "Potamies Station", 
    location: "Potamies",
    coordinates: { lat: 35.3, lng: 25.5 }, // Northeast Crete
    active: true,
    elevation: 120,
    lastUpdate: "3 min ago"
  },
  {
    id: "Pyrgos",
    name: "Pyrgos Station",
    location: "Pyrgos",
    coordinates: { lat: 35.3, lng: 23.75 }, // Western Crete
    active: true,
    elevation: 85,
    lastUpdate: "1 min ago"
  },
  {
    id: "Doxaro",
    name: "Doxaro Station",
    location: "Doxaro", 
    coordinates: { lat: 35.2, lng: 25.9 }, // Eastern Crete
    active: true,
    elevation: 210,
    lastUpdate: "4 min ago"
  },
  {
    id: "Ziros",
    name: "Ziros Station",
    location: "Ziros",
    coordinates: { lat: 35.15, lng: 26.2 }, // Far eastern Crete
    active: true,
    elevation: 95,
    lastUpdate: "2 min ago"
  }
];

interface CreteMapProps {
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  availableStations: string[];
  stationsWithData?: string[];
}

// Create custom marker icons
const createCustomIcon = (hasData: boolean, isSelected: boolean, isActive: boolean) => {
  const size = isSelected ? 32 : 24;
  const color = hasData 
    ? (isActive ? '#1a91d1' : '#8b9298') 
    : 'rgba(128, 128, 128, 0.5)';
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      ${isActive && hasData ? '<circle cx="12" cy="12" r="4" fill="white"/>' : ''}
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export const CreteMap = ({ selectedStation, onStationSelect, availableStations = [], stationsWithData = [] }: CreteMapProps) => {
  const isStationAvailable = (stationId: string) => availableStations?.includes(stationId) || false;
  const hasStationData = (stationId: string) => stationsWithData?.includes(stationId) || false;
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  // Center of Crete
  const creteCenter: [number, number] = [35.24, 25.0];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Meteorological Stations - Crete, Greece
        </CardTitle>
        <CardDescription>
          Select a weather station to view localized meteorological data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* OpenStreetMap with Leaflet */}
          <div className="relative w-full h-96 rounded-lg border overflow-hidden">
            <MapContainer
              center={creteCenter}
              zoom={9}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {meteorologicalStations.map((station) => {
                const hasData = hasStationData(station.id);
                const isSelected = selectedStation === station.id;
                
                return (
                  <Marker
                    key={station.id}
                    position={[station.coordinates.lat, station.coordinates.lng]}
                    icon={createCustomIcon(hasData, isSelected, station.active)}
                    eventHandlers={{
                      click: () => {
                        if (hasData) {
                          onStationSelect(station.id);
                        }
                      },
                      mouseover: () => setHoveredStation(station.id),
                      mouseout: () => setHoveredStation(null),
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
                          <p>Coordinates: {station.coordinates.lat.toFixed(4)}, {station.coordinates.lng.toFixed(4)}</p>
                          <p>Updated: {station.lastUpdate}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Station List */}
        <div className="mt-6 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Radio className="w-4 h-4" />
            Available Stations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {meteorologicalStations.map((station) => (
              <Button
                key={station.id}
                variant={selectedStation === station.id ? "default" : "outline"}
                size="sm"
                className="justify-start h-auto p-3"
                onClick={() => hasStationData(station.id) && onStationSelect(station.id)}
                disabled={!station.active || !isStationAvailable(station.id) || !hasStationData(station.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`w-2 h-2 rounded-full ${station.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div className="text-left flex-1">
                    <div className="font-medium text-xs">{station.name}</div>
                    <div className="text-xs text-muted-foreground">{station.location}</div>
                  </div>
                  {selectedStation === station.id && (
                    <div className="flex gap-1">
                      <Thermometer className="w-3 h-3" />
                      <CloudRain className="w-3 h-3" />
                      <Sun className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
