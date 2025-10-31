
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
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
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

  const loadStationData = async (stationId: string, year: number | null = selectedYear, month: number | null = selectedMonth) => {
    if (!stationId) return;
    
    setIsLoading(true);
    try {
      let data;
      if (year && month) {
        data = await meteorologicalService.getStationDataByTimePeriod(stationId, "month", year, month);
      } else if (year) {
        data = await meteorologicalService.getStationDataByTimePeriod(stationId, "year", year);
      } else {
        data = await meteorologicalService.getStationDataByTimePeriod(stationId, "all");
      }
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

  const handleYearChange = async (year: number | null) => {
    setSelectedYear(year);
    setSelectedMonth(null); // Reset month when year changes
    if (selectedStation) {
      await loadStationData(selectedStation, year, null);
    }
  };

  const handleMonthChange = async (month: number | null) => {
    setSelectedMonth(month);
    if (selectedStation && selectedYear) {
      await loadStationData(selectedStation, selectedYear, month);
    }
  };

  const handleDataCleared = async () => {
    // Reload stations with data list
    await loadStations();
    
    // Check if the currently selected station still has data
    if (selectedStation) {
      try {
        await loadStationData(selectedStation);
        if (stationData.length === 0) {
          // Current station has no data, clear selection and data
          setStationData([]);
          setSelectedStation("");
          toast({
            title: "Data Cleared",
            description: "The selected station no longer has data. Please select a station with data.",
          });
        }
      } catch {
        // Error loading data, clear selection
        setStationData([]);
        setSelectedStation("");
      }
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
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={handleYearChange}
              onMonthChange={handleMonthChange}
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
                timePeriod={selectedYear && selectedMonth ? `${selectedYear}-${selectedMonth}` : selectedYear ? `${selectedYear}` : "all"}
                stationsWithData={stationsWithData}
              />
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
