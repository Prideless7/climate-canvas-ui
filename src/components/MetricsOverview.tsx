
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, CloudRain, Sun, Droplets, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MeteoData } from "./Dashboard";

interface MetricsOverviewProps {
  stationData: MeteoData[];
}

const calculateMetrics = (data: MeteoData[]) => {
  if (data.length === 0) {
    return {
      avgTemp: 0,
      totalRainfall: 0,
      avgSolarRadiation: 0,
      avgHumidity: 0,
    };
  }

  const avgTemp = data.reduce((sum, item) => sum + item.temperature, 0) / data.length;
  const totalRainfall = data.reduce((sum, item) => sum + item.precipitation, 0);
  const avgSolarRadiation = data.reduce((sum, item) => sum + item.solarRadiation, 0) / data.length;
  const avgHumidity = data.reduce((sum, item) => sum + item.humidity, 0) / data.length;

  return {
    avgTemp: Number(avgTemp.toFixed(1)),
    totalRainfall: Number(totalRainfall.toFixed(1)),
    avgSolarRadiation: Number(avgSolarRadiation.toFixed(1)),
    avgHumidity: Number(avgHumidity.toFixed(1)),
  };
};

export const MetricsOverview = ({ stationData }: MetricsOverviewProps) => {
  const stats = calculateMetrics(stationData);
  
  const metrics = [
    {
      title: "Avg Temperature",
      value: stationData.length > 0 ? `${stats.avgTemp}°C` : "No data",
      change: stationData.length > 0 ? `${stationData.length} records` : "Import data",
      trend: "up",
      icon: Thermometer,
      color: "temperature",
      bgColor: "bg-temperature/10",
    },
    {
      title: "Total Rainfall",
      value: stationData.length > 0 ? `${stats.totalRainfall}mm` : "No data",
      change: stationData.length > 0 ? `${stationData.length} records` : "Import data",
      trend: "down",
      icon: CloudRain,
      color: "rainfall",
      bgColor: "bg-rainfall/10",
    },
    {
      title: "Solar Radiation",
      value: stationData.length > 0 ? `${stats.avgSolarRadiation} W/m²` : "No data",
      change: stationData.length > 0 ? `${stationData.length} records` : "Import data",
      trend: "up",
      icon: Sun,
      color: "solar",
      bgColor: "bg-solar/10",
    },
    {
      title: "Avg Humidity",
      value: stationData.length > 0 ? `${stats.avgHumidity}%` : "No data",
      change: stationData.length > 0 ? `${stationData.length} records` : "Import data",
      trend: "up",
      icon: Droplets,
      color: "humidity",
      bgColor: "bg-humidity/10",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className={`${metric.bgColor} border-${metric.color}/20 shadow-sm hover:shadow-md transition-shadow`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 text-${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {metric.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <Badge 
                variant={metric.trend === "up" ? "default" : "destructive"} 
                className="text-xs px-1 py-0"
              >
                {metric.change}
              </Badge>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
