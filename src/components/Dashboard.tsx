
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { DataImport } from "./DataImport";
import { meteorologicalService } from "@/services/meteorological";
import { useToast } from "@/hooks/use-toast";

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
  rainDuration: number;
}

export const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedStation, setSelectedStation] = useState("");
  const [stationData, setStationData] = useState<MeteoData[]>([]);
  const [availableStations, setAvailableStations] = useState<string[]>([]);
  const [isDataImported, setIsDataImported] = useState(false);
  const [timePeriod, setTimePeriod] = useState("all");
  const [currentView, setCurrentView] = useState("import");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const loadStations = async () => {
    try {
      const stations = await meteorologicalService.getStations();
      const stationNames = stations.map(s => s.name);
      setAvailableStations(stationNames);
      
      if (stationNames.length > 0) {
        setIsDataImported(true);
      }
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  };

  const loadStationData = async (stationName: string) => {
    if (!stationName) return;
    
    setIsLoading(true);
    try {
      const data = await meteorologicalService.getStationDataByTimePeriod(stationName, timePeriod);
      setStationData(data);
    } catch (error: any) {
      console.error('Error loading station data:', error);
      toast({
        title: "Error loading data",
        description: error.message || "Failed to load meteorological data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataImport = async (stationName: string) => {
    setSelectedStation(stationName);
    setCurrentView("overview");
    await loadStations();
    await loadStationData(stationName);
  };

  const handleNavigationChange = (viewId: string) => {
    if (viewId === "import") {
      setCurrentView("import");
    } else if (isDataImported) {
      setCurrentView(viewId);
    }
  };

  const handleStationSelect = async (stationName: string) => {
    setSelectedStation(stationName);
    await loadStationData(stationName);
  };

  const handleTimePeriodChange = async (newTimePeriod: string) => {
    setTimePeriod(newTimePeriod);
    if (selectedStation) {
      await loadStationData(selectedStation);
    }
  };

  // Load stations on component mount
  useEffect(() => {
    loadStations();
  }, []);

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
              onTimePeriodChange={handleTimePeriodChange}
            />
            {currentView === "import" ? (
              <div className="flex-1 p-6">
                <DataImport onDataImport={handleDataImport} />
              </div>
            ) : (
              <DashboardContent 
                selectedStation={selectedStation}
                onStationSelect={handleStationSelect}
                stationData={stationData}
                availableStations={availableStations}
                currentView={currentView}
                timePeriod={timePeriod}
              />
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
