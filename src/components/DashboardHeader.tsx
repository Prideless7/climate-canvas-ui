
import { Moon, Sun, Upload, Calendar, LogOut } from "lucide-react";
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
import { ClearDataButtons } from "./ClearDataButtons";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useStations } from "@/hooks/useStations";

interface DashboardHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  selectedStation: string;
  timePeriod: string;
  onTimePeriodChange: (period: string) => void;
  onAdvancedFilter: (filterType: string, year?: number, month?: number) => void;
  onDataCleared: () => void;
}

export const DashboardHeader = ({ isDarkMode, toggleTheme, selectedStation, timePeriod, onTimePeriodChange, onAdvancedFilter, onDataCleared }: DashboardHeaderProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stations } = useStations();
  
  const currentStation = stations.find(s => s.id === selectedStation);
  const stationDisplayName = currentStation?.name || "Unknown Station";

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

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
              {stationDisplayName}
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

          <ClearDataButtons
            selectedStation={selectedStation}
            onDataCleared={onDataCleared}
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

          <div className="flex items-center gap-2 ml-2 border-l pl-2">
            {user && (
              <span className="text-sm text-muted-foreground">
                {user.user_metadata?.username || "User"}
                {isAdmin && " (Admin)"}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
