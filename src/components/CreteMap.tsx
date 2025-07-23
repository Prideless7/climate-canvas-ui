
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
    id: "Tympaki",
    name: "Tympaki Station",
    location: "Tympaki",
    coordinates: { x: 55, y: 65 }, // South-central Crete
    active: true,
    elevation: 15,
    lastUpdate: "2 min ago"
  },
  {
    id: "Potamies",
    name: "Potamies Station", 
    location: "Potamies",
    coordinates: { x: 75, y: 35 }, // Northeast Crete
    active: true,
    elevation: 120,
    lastUpdate: "3 min ago"
  },
  {
    id: "Pyrgos",
    name: "Pyrgos Station",
    location: "Pyrgos",
    coordinates: { x: 30, y: 50 }, // Western Crete
    active: true,
    elevation: 85,
    lastUpdate: "1 min ago"
  },
  {
    id: "Doxaro",
    name: "Doxaro Station",
    location: "Doxaro", 
    coordinates: { x: 85, y: 55 }, // Eastern Crete
    active: true,
    elevation: 210,
    lastUpdate: "4 min ago"
  },
  {
    id: "Ziros",
    name: "Ziros Station",
    location: "Ziros",
    coordinates: { x: 90, y: 40 }, // Far eastern Crete
    active: true,
    elevation: 95,
    lastUpdate: "2 min ago"
  }
];

interface CreteMapProps {
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  availableStations: string[];
}

export const CreteMap = ({ selectedStation, onStationSelect, availableStations = [] }: CreteMapProps) => {
  const isStationAvailable = (stationId: string) => availableStations?.includes(stationId) || false;
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
          {/* Crete Map with Image */}
          <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border overflow-hidden">
            {/* Crete Island Image */}
            <img 
              src="/lovable-uploads/8c372d57-b569-484c-9466-2a6172bed9b2.png"
              alt="Crete Island Map"
              className="absolute inset-0 w-full h-full object-contain p-4 filter brightness-75 dark:brightness-50 dark:invert transition-all duration-300"
            />
            
            {/* Weather Stations overlay */}
            <svg
              viewBox="0 0 400 150"
              className="absolute inset-0 w-full h-full"
            >
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
          </div>

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
