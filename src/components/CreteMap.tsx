
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Radio, Thermometer, CloudRain, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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
    coordinates: { lat: 35.0697, lng: 24.7661 }, // South-central Crete
    active: true,
    elevation: 15,
    lastUpdate: "2 min ago"
  },
  {
    id: "Potamies",
    name: "Potamies Station", 
    location: "Potamies",
    coordinates: { lat: 35.2854, lng: 25.4556 }, // Northeast Crete
    active: true,
    elevation: 120,
    lastUpdate: "3 min ago"
  },
  {
    id: "Pyrgos",
    name: "Pyrgos Station",
    location: "Pyrgos",
    coordinates: { lat: 35.3340, lng: 24.0500 }, // Western Crete
    active: true,
    elevation: 85,
    lastUpdate: "1 min ago"
  },
  {
    id: "Doxaro",
    name: "Doxaro Station",
    location: "Doxaro", 
    coordinates: { lat: 35.2200, lng: 25.7800 }, // Eastern Crete
    active: true,
    elevation: 210,
    lastUpdate: "4 min ago"
  },
  {
    id: "Ziros",
    name: "Ziros Station",
    location: "Ziros",
    coordinates: { lat: 35.1397, lng: 26.1300 }, // Far eastern Crete
    active: true,
    elevation: 95,
    lastUpdate: "2 min ago"
  }
];

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

interface CreteMapProps {
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  availableStations: string[];
  stationsWithData?: string[];
}

export const CreteMap = ({ selectedStation, onStationSelect, availableStations = [], stationsWithData = [] }: CreteMapProps) => {
  const isStationAvailable = (stationId: string) => availableStations?.includes(stationId) || false;
  const hasStationData = (stationId: string) => stationsWithData?.includes(stationId) || false;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          {/* Dynamic OpenStreetMap */}
          <div className="relative w-full h-96 rounded-lg border overflow-hidden">
            {isMounted && (
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
                {meteorologicalStations.map((station) => (
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
            )}
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
