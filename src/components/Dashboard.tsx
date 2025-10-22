
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
  const [stationsWithData, setStationsWithData] = useState<string[]>([]);
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
      const stationIds = stations.map(s => s.id);
      setAvailableStations(stationIds);
      
      // Check which stations have data
      const stationsWithDataPromises = stationIds.map(async (stationId) => {
        try {
          const data = await meteorologicalService.getStationDataByTimePeriod(stationId, "all");
          return data.length > 0 ? stationId : null;
        } catch {
          return null;
        }
      });
      
      const stationsWithDataResults = await Promise.all(stationsWithDataPromises);
      const stationsWithDataList = stationsWithDataResults.filter(Boolean) as string[];
      setStationsWithData(stationsWithDataList);
      
      if (stationIds.length > 0) {
        setIsDataImported(true);
      }
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  };

  const loadStationData = async (stationId: string) => {
    if (!stationId) return;
    
    setIsLoading(true);
    try {
      const data = await meteorologicalService.getStationDataByTimePeriod(stationId, timePeriod);
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

  const handleDataImport = async (stationId: string) => {
    setSelectedStation(stationId);
    setCurrentView("overview");
    await loadStations();
    await loadStationData(stationId);
  };

  const handleNavigationChange = (viewId: string) => {
    if (viewId === "import") {
      setCurrentView("import");
    } else if (isDataImported) {
      setCurrentView(viewId);
    }
  };

  const handleStationSelect = async (stationId: string) => {
    setSelectedStation(stationId);
    await loadStationData(stationId);
  };

  const handleTimePeriodChange = async (newTimePeriod: string) => {
    setTimePeriod(newTimePeriod);
    if (selectedStation) {
      await loadStationData(selectedStation);
    }
  };

  const handleAdvancedFilter = async (filterType: string, year?: number, month?: number) => {
    setTimePeriod(filterType);
    if (selectedStation) {
      const data = await meteorologicalService.getStationDataByTimePeriod(selectedStation, filterType, year, month);
      setStationData(data);
    }
  };

  const handleDataCleared = async () => {
    // Reload stations with data list and current station data after clearing
    await loadStations();
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
              onAdvancedFilter={handleAdvancedFilter}
              onDataCleared={handleDataCleared}
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
                stationsWithData={stationsWithData}
              />
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
