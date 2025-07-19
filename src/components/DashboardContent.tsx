
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
}

export const DashboardContent = ({ selectedStation, onStationSelect, stationData, availableStations }: DashboardContentProps) => {
  return (
    <main className="flex-1 p-6 space-y-6 bg-gradient-to-br from-blue-50/50 via-green-50/30 to-yellow-50/20 dark:from-blue-950/20 dark:via-green-950/10 dark:to-yellow-950/10">
      {/* Station Selection Map */}
      <CreteMap 
        selectedStation={selectedStation} 
        onStationSelect={onStationSelect}
        availableStations={availableStations}
      />
      
      <MetricsOverview stationData={stationData} />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="rainfall">Rainfall</TabsTrigger>
          <TabsTrigger value="solar">Solar</TabsTrigger>
          <TabsTrigger value="combined">Combined</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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

          <Card className="border-solar/20 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-solar">
                Environmental Correlation Analysis
              </CardTitle>
              <CardDescription>
                Combined view of temperature, humidity, and solar radiation relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CombinedChart data={stationData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature">
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
        </TabsContent>

        <TabsContent value="rainfall">
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
        </TabsContent>

        <TabsContent value="solar">
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
        </TabsContent>

        <TabsContent value="combined">
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
        </TabsContent>
      </Tabs>
    </main>
  );
};
