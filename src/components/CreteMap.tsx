
import { useState, useEffect } from 'react';
import { MapPin, Radio, Thermometer, CloudRain, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

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
    coordinates: { x: 45, y: 75 }, // South-central Crete - randomized
    active: true,
    elevation: 15,
    lastUpdate: "2 min ago"
  },
  {
    id: "Potamies",
    name: "Potamies Station", 
    location: "Potamies",
    coordinates: { x: 82, y: 45 }, // Northeast Crete - randomized
    active: true,
    elevation: 120,
    lastUpdate: "3 min ago"
  },
  {
    id: "Pyrgos",
    name: "Pyrgos Station",
    location: "Pyrgos",
    coordinates: { x: 25, y: 60 }, // Western Crete - randomized
    active: true,
    elevation: 85,
    lastUpdate: "1 min ago"
  },
  {
    id: "Doxaro",
    name: "Doxaro Station",
    location: "Doxaro", 
    coordinates: { x: 75, y: 65 }, // Eastern Crete - randomized
    active: true,
    elevation: 210,
    lastUpdate: "4 min ago"
  },
  {
    id: "Ziros",
    name: "Ziros Station",
    location: "Ziros",
    coordinates: { x: 95, y: 50 }, // Far eastern Crete - randomized
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
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          try {
            const blob = await removeBackground(img);
            const url = URL.createObjectURL(blob);
            setProcessedImageUrl(url);
          } catch (error) {
            console.error('Background removal failed, using original image:', error);
            setProcessedImageUrl('/lovable-uploads/8c372d57-b569-484c-9466-2a6172bed9b2.png');
          }
        };
        img.src = '/lovable-uploads/8c372d57-b569-484c-9466-2a6172bed9b2.png';
      } catch (error) {
        console.error('Image processing failed:', error);
        setProcessedImageUrl('/lovable-uploads/8c372d57-b569-484c-9466-2a6172bed9b2.png');
      }
    };

    processImage();

    return () => {
      if (processedImageUrl && processedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
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
          {/* Crete Map with Image */}
          <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border overflow-hidden">
            {/* Crete Island Image */}
            {processedImageUrl ? (
              <img 
                src={processedImageUrl}
                alt="Crete Island Map"
                className="absolute inset-0 w-full h-full object-contain scale-125 filter dark:brightness-90 dark:contrast-110 transition-all duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* Weather Stations overlay */}
            <svg
              viewBox="0 0 500 200"
              className="absolute inset-0 w-full h-full"
            >
              {meteorologicalStations.map((station) => (
                <g key={station.id}>
                  <circle
                    cx={station.coordinates.x * 5}
                    cy={station.coordinates.y * 2}
                    r={selectedStation === station.id ? "10" : hoveredStation === station.id ? "8" : "7"}
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
                      cx={station.coordinates.x * 5}
                      cy={station.coordinates.y * 2}
                      r="4"
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
