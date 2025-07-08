
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, CloudRain, Sun, Droplets, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const metrics = [
  {
    title: "Avg Temperature",
    value: "24.5°C",
    change: "+2.1°C",
    trend: "up",
    icon: Thermometer,
    color: "temperature",
    bgColor: "bg-temperature/10",
  },
  {
    title: "Total Rainfall",
    value: "145.2mm",
    change: "-12.8mm",
    trend: "down",
    icon: CloudRain,
    color: "rainfall",
    bgColor: "bg-rainfall/10",
  },
  {
    title: "Solar Radiation",
    value: "18.4 MJ/m²",
    change: "+3.2 MJ/m²",
    trend: "up",
    icon: Sun,
    color: "solar",
    bgColor: "bg-solar/10",
  },
  {
    title: "Avg Humidity",
    value: "68.3%",
    change: "+4.7%",
    trend: "up",
    icon: Droplets,
    color: "humidity",
    bgColor: "bg-humidity/10",
  },
];

export const MetricsOverview = () => {
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
