
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemperatureChart } from "./charts/TemperatureChart";
import { RainfallChart } from "./charts/RainfallChart";
import { SolarRadiationChart } from "./charts/SolarRadiationChart";
import { HumidityChart } from "./charts/HumidityChart";
import { CombinedChart } from "./charts/CombinedChart";
import { MetricsOverview } from "./MetricsOverview";
import { CreteMap } from "./CreteMap";
import { PDFExportButtons } from "./PDFExportButtons";
import { DatabaseView } from "./DatabaseView";
import { MeteoData } from "./Dashboard";

interface DashboardContentProps {
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  stationData: MeteoData[];
  availableStations: string[];
  currentView: string;
  timePeriod: string;
  stationsWithData: string[];
}

export const DashboardContent = ({ selectedStation, onStationSelect, stationData, availableStations, currentView, timePeriod, stationsWithData }: DashboardContentProps) => {
  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return (
          <>
            <CreteMap 
              selectedStation={selectedStation} 
              onStationSelect={onStationSelect}
              availableStations={availableStations}
              stationsWithData={stationsWithData}
            />
            <MetricsOverview stationData={stationData} />
          </>
        );
      
      case "temperature":
        return (
          <Card className="border-temperature/20" id="temperature-chart-container">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-temperature">Temperature Analysis</CardTitle>
                  <CardDescription>
                    Detailed temperature data with hourly, daily, and monthly views
                  </CardDescription>
                </div>
                <PDFExportButtons 
                  title="Temperature Analysis"
                  station={selectedStation}
                  timePeriod={timePeriod}
                  elementId="temperature-chart-container"
                />
              </div>
            </CardHeader>
            <CardContent>
              <TemperatureChart data={stationData} detailed />
            </CardContent>
          </Card>
        );
      
      case "rainfall":
        return (
          <Card className="border-rainfall/20" id="rainfall-chart-container">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-rainfall">Rainfall Analysis</CardTitle>
                  <CardDescription>
                    Precipitation patterns and seasonal variations
                  </CardDescription>
                </div>
                <PDFExportButtons 
                  title="Rainfall Analysis"
                  station={selectedStation}
                  timePeriod={timePeriod}
                  elementId="rainfall-chart-container"
                />
              </div>
            </CardHeader>
            <CardContent>
              <RainfallChart data={stationData} detailed />
            </CardContent>
          </Card>
        );
      
      case "solar":
        return (
          <Card className="border-solar/20" id="solar-chart-container">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-solar">Solar Radiation Analysis</CardTitle>
                  <CardDescription>
                    Solar energy potential and radiation patterns
                  </CardDescription>
                </div>
                <PDFExportButtons 
                  title="Solar Radiation Analysis"
                  station={selectedStation}
                  timePeriod={timePeriod}
                  elementId="solar-chart-container"
                />
              </div>
            </CardHeader>
            <CardContent>
              <SolarRadiationChart data={stationData} />
            </CardContent>
          </Card>
        );
      
      case "humidity":
        return (
          <Card className="border-humidity/20" id="humidity-chart-container">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-humidity">Humidity Analysis</CardTitle>
                  <CardDescription>
                    Relative humidity patterns and variations
                  </CardDescription>
                </div>
                <PDFExportButtons 
                  title="Humidity Analysis"
                  station={selectedStation}
                  timePeriod={timePeriod}
                  elementId="humidity-chart-container"
                />
              </div>
            </CardHeader>
            <CardContent>
              <HumidityChart data={stationData} detailed />
            </CardContent>
          </Card>
        );
      
      case "trends":
        return (
          <Card className="border-primary/20" id="trends-chart-container">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Multi-Variable Analysis</CardTitle>
                  <CardDescription>
                    Comprehensive view of all meteorological parameters
                  </CardDescription>
                </div>
                <PDFExportButtons 
                  title="Multi-Variable Analysis"
                  station={selectedStation}
                  timePeriod={timePeriod}
                  elementId="trends-chart-container"
                />
              </div>
            </CardHeader>
            <CardContent>
              <CombinedChart data={stationData} detailed />
            </CardContent>
          </Card>
        );
      
      case "database":
        return (
          <DatabaseView 
            stationData={stationData}
            selectedStation={selectedStation}
            timePeriod={timePeriod}
          />
        );
      
      default:
        return (
          <>
            <CreteMap 
              selectedStation={selectedStation} 
              onStationSelect={onStationSelect}
              availableStations={availableStations}
              stationsWithData={stationsWithData}
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
