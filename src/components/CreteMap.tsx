
import { MapPin, Radio, Thermometer, CloudRain, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SimpleLeafletMap from './SimpleLeafletMap';
import { useStations } from '@/hooks/useStations';
import { Skeleton } from "@/components/ui/skeleton";

interface CreteMapProps {
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  availableStations: string[];
  stationsWithData?: string[];
}

export const CreteMap = ({ selectedStation, onStationSelect, availableStations = [], stationsWithData = [] }: CreteMapProps) => {
  const { stations, isLoading } = useStations();
  const isStationAvailable = (stationId: string) => availableStations?.includes(stationId) || false;
  const hasStationData = (stationId: string) => stationsWithData?.includes(stationId) || false;

  // Transform database stations to map format
  const mapStations = stations.map(station => ({
    id: station.id,
    name: station.name,
    location: station.location,
    coordinates: { lat: station.latitude, lng: station.longitude },
    active: station.active,
    elevation: station.elevation,
    lastUpdate: new Date(station.last_update).toLocaleString(),
  }));

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Meteorological Stations - Crete, Greece
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-96" />
        </CardContent>
      </Card>
    );
  }

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
            <SimpleLeafletMap 
              stations={mapStations}
              selectedStation={selectedStation}
              onStationSelect={onStationSelect}
              hasStationData={hasStationData}
            />
          </div>
        </div>

        {/* Station List */}
        <div className="mt-6 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Radio className="w-4 h-4" />
            Available Stations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mapStations.map((station) => (
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
