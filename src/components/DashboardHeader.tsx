
import { Moon, Sun, Upload, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AdvancedFilters } from "./AdvancedFilters";

interface DashboardHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  selectedStation: string;
  timePeriod: string;
  onTimePeriodChange: (period: string) => void;
  onAdvancedFilter: (filterType: string, year?: number, month?: number) => void;
}

const stationNames: Record<string, string> = {
  Tympaki: "Tympaki Station",
  Potamies: "Potamies Station",
  Doxaro: "Doxaro Station",
  Pyrgos: "Pyrgos Station",
  Ziros: "Ziros Station"
};

export const DashboardHeader = ({ isDarkMode, toggleTheme, selectedStation, timePeriod, onTimePeriodChange, onAdvancedFilter }: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Weather Dashboard</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Live Data
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stationNames[selectedStation] || "Unknown Station"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={onTimePeriodChange}>
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <AdvancedFilters 
            onFilterChange={onAdvancedFilter}
            currentFilter={timePeriod}
          />

          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4" />
            Import Data
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
