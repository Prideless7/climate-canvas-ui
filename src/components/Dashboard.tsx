
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { DataImport } from "./DataImport";

export interface MeteoData {
  date: string;
  time: string;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  temperature: number;
  solarRadiation: number;
  windDirection: number;
  pressure: number;
  eto: number;
}

export const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedStation, setSelectedStation] = useState("");
  const [stationData, setStationData] = useState<Record<string, MeteoData[]>>({});
  const [isDataImported, setIsDataImported] = useState(false);
  const [timePeriod, setTimePeriod] = useState("30d");
  const [currentView, setCurrentView] = useState("import");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleDataImport = (stationName: string, data: MeteoData[]) => {
    setStationData(prev => ({
      ...prev,
      [stationName]: data
    }));
    setIsDataImported(true);
    setSelectedStation(stationName);
    setCurrentView("overview");
  };

  const handleNavigationChange = (viewId: string) => {
    if (viewId === "import") {
      setCurrentView("import");
    } else if (isDataImported) {
      setCurrentView(viewId);
    }
  };

  const filterDataByTimePeriod = (data: MeteoData[]): MeteoData[] => {
    if (!data.length) return data;
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timePeriod) {
      case "7d":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }
    
    return data.filter(item => {
      const [day, month, year] = item.date.split('/');
      const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return itemDate >= cutoffDate;
    });
  };

  const getCurrentStationData = (): MeteoData[] => {
    const rawData = selectedStation ? stationData[selectedStation] || [] : [];
    return filterDataByTimePeriod(rawData);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar 
            currentView={currentView}
            onNavigationChange={handleNavigationChange}
            isDataImported={isDataImported}
          />
          <div className="flex-1 flex flex-col">
            <DashboardHeader 
              isDarkMode={isDarkMode} 
              toggleTheme={toggleTheme}
              selectedStation={selectedStation}
              timePeriod={timePeriod}
              onTimePeriodChange={setTimePeriod}
            />
            {currentView === "import" ? (
              <div className="flex-1 p-6">
                <DataImport onDataImport={handleDataImport} />
              </div>
            ) : (
              <DashboardContent 
                selectedStation={selectedStation}
                onStationSelect={setSelectedStation}
                stationData={getCurrentStationData()}
                availableStations={Object.keys(stationData)}
                currentView={currentView}
              />
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
