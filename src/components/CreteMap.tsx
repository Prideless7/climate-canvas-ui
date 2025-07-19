
import { useState } from 'react';
import { MapPin, Radio, Thermometer, CloudRain, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Station {
  id: string;
  name: string;
  location: string;
  coordinates: { x: number; y: number };
  active: boolean;
  elevation: number;
  lastUpdate: string;
}

const meteorologicalStations: Station[] = [
  {
    id: "heraklion",
    name: "Heraklion Central",
    location: "Heraklion",
    coordinates: { x: 60, y: 45 },
    active: true,
    elevation: 39,
    lastUpdate: "2 min ago"
  },
  {
    id: "chania",
    name: "Chania Airport",
    location: "Chania",
    coordinates: { x: 20, y: 35 },
    active: true,
    elevation: 151,
    lastUpdate: "5 min ago"
  },
  {
    id: "rethymno",
    name: "Rethymno Port",
    location: "Rethymno",
    coordinates: { x: 40, y: 30 },
    active: true,
    elevation: 12,
    lastUpdate: "3 min ago"
  },
  {
    id: "sitia",
    name: "Sitia Observatory",
    location: "Sitia",
    coordinates: { x: 85, y: 40 },
    active: true,
    elevation: 78,
    lastUpdate: "1 min ago"
  },
  {
    id: "ierapetra",
    name: "Ierapetra Coastal",
    location: "Ierapetra",
    coordinates: { x: 75, y: 60 },
    active: true,
    elevation: 5,
    lastUpdate: "4 min ago"
  },
  {
    id: "kissamos",
    name: "Kissamos Bay",
    location: "Kissamos",
    coordinates: { x: 15, y: 25 },
    active: false,
    elevation: 25,
    lastUpdate: "2 hours ago"
  }
];

interface CreteMapProps {
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  availableStations: string[];
}

export const CreteMap = ({ selectedStation, onStationSelect, availableStations }: CreteMapProps) => {
  const isStationAvailable = (stationId: string) => availableStations.includes(stationId);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

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
          {/* SVG Map of Crete */}
          <svg
            viewBox="0 0 400 150"
            className="w-full h-48 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border"
          >
            {/* Crete Island Shape */}
            <path
              d="M50 80 C80 70, 120 65, 160 70 L200 75 C240 80, 280 85, 320 90 L350 95 C360 100, 365 110, 360 115 L350 120 C320 125, 280 120, 240 115 L200 110 C160 105, 120 100, 80 105 L50 100 C40 95, 40 85, 50 80 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* Water areas */}
            <circle cx="100" cy="50" r="8" fill="hsl(var(--primary))" opacity="0.3" />
            <circle cx="250" cy="40" r="6" fill="hsl(var(--primary))" opacity="0.3" />
            
            {/* Mountain ranges */}
            <polygon points="150,85 160,75 170,85" fill="hsl(var(--muted-foreground))" opacity="0.2" />
            <polygon points="220,90 235,78 250,90" fill="hsl(var(--muted-foreground))" opacity="0.2" />
            
            {/* Weather Stations */}
            {meteorologicalStations.map((station) => (
              <g key={station.id}>
                <circle
                  cx={station.coordinates.x * 4}
                  cy={station.coordinates.y * 1.5}
                  r={selectedStation === station.id ? "8" : hoveredStation === station.id ? "7" : "6"}
                  fill={station.active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  stroke={selectedStation === station.id ? "hsl(var(--ring))" : "white"}
                  strokeWidth={selectedStation === station.id ? "3" : "2"}
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  onClick={() => onStationSelect(station.id)}
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                />
                {station.active && (
                  <circle
                    cx={station.coordinates.x * 4}
                    cy={station.coordinates.y * 1.5}
                    r="3"
                    fill="white"
                    className="pointer-events-none animate-pulse"
                  />
                )}
              </g>
            ))}
          </svg>

          {/* Station Info Panel */}
          {hoveredStation && (
            <div className="absolute top-2 right-2 bg-card border rounded-lg p-3 shadow-lg min-w-48">
              {(() => {
                const station = meteorologicalStations.find(s => s.id === hoveredStation);
                return station ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
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
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
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
                onClick={() => onStationSelect(station.id)}
                disabled={!station.active || !isStationAvailable(station.id)}
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
