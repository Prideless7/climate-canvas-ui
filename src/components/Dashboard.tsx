
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
  };

  const getCurrentStationData = (): MeteoData[] => {
    return selectedStation ? stationData[selectedStation] || [] : [];
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader 
              isDarkMode={isDarkMode} 
              toggleTheme={toggleTheme}
              selectedStation={selectedStation}
            />
            {!isDataImported ? (
              <div className="flex-1 p-6">
                <DataImport onDataImport={handleDataImport} />
              </div>
            ) : (
              <DashboardContent 
                selectedStation={selectedStation}
                onStationSelect={setSelectedStation}
                stationData={getCurrentStationData()}
                availableStations={Object.keys(stationData)}
              />
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
