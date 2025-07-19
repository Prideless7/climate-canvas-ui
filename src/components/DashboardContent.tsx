
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemperatureChart } from "./charts/TemperatureChart";
import { RainfallChart } from "./charts/RainfallChart";
import { SolarRadiationChart } from "./charts/SolarRadiationChart";
import { CombinedChart } from "./charts/CombinedChart";
import { MetricsOverview } from "./MetricsOverview";
import { CreteMap } from "./CreteMap";
import { MeteoData } from "./Dashboard";

interface DashboardContentProps {
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  stationData: MeteoData[];
  availableStations: string[];
  currentView: string;
}

export const DashboardContent = ({ selectedStation, onStationSelect, stationData, availableStations, currentView }: DashboardContentProps) => {
  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return (
          <>
            <CreteMap 
              selectedStation={selectedStation} 
              onStationSelect={onStationSelect}
              availableStations={availableStations}
            />
            <MetricsOverview stationData={stationData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-temperature/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-temperature">
                    Temperature Trends
                  </CardTitle>
                  <CardDescription>
                    Monthly average temperature over the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TemperatureChart data={stationData} />
                </CardContent>
              </Card>

              <Card className="border-rainfall/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rainfall">
                    Rainfall Distribution
                  </CardTitle>
                  <CardDescription>
                    Monthly precipitation totals and patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RainfallChart data={stationData} />
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      case "temperature":
        return (
          <Card className="border-temperature/20">
            <CardHeader>
              <CardTitle className="text-temperature">Temperature Analysis</CardTitle>
              <CardDescription>
                Detailed temperature data with hourly, daily, and monthly views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemperatureChart data={stationData} detailed />
            </CardContent>
          </Card>
        );
      
      case "rainfall":
        return (
          <Card className="border-rainfall/20">
            <CardHeader>
              <CardTitle className="text-rainfall">Rainfall Analysis</CardTitle>
              <CardDescription>
                Precipitation patterns and seasonal variations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RainfallChart data={stationData} detailed />
            </CardContent>
          </Card>
        );
      
      case "solar":
        return (
          <Card className="border-solar/20">
            <CardHeader>
              <CardTitle className="text-solar">Solar Radiation Analysis</CardTitle>
              <CardDescription>
                Solar energy potential and radiation patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SolarRadiationChart data={stationData} />
            </CardContent>
          </Card>
        );
      
      case "humidity":
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Humidity Analysis</CardTitle>
              <CardDescription>
                Relative humidity patterns and variations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CombinedChart data={stationData} />
            </CardContent>
          </Card>
        );
      
      case "trends":
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Multi-Variable Analysis</CardTitle>
              <CardDescription>
                Comprehensive view of all meteorological parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CombinedChart data={stationData} detailed />
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <>
            <CreteMap 
              selectedStation={selectedStation} 
              onStationSelect={onStationSelect}
              availableStations={availableStations}
            />
            <MetricsOverview stationData={stationData} />
          </>
        );
    }
  };

  return (
    <main className="flex-1 p-6 space-y-6 bg-gradient-to-br from-blue-50/50 via-green-50/30 to-yellow-50/20 dark:from-blue-950/20 dark:via-green-950/10 dark:to-yellow-950/10">
      {renderContent()}
    </main>
  );
};
