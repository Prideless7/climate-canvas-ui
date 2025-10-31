
import { Moon, Sun, Upload, LogOut } from "lucide-react";
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
import { ClearDataButtons } from "./ClearDataButtons";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useStations } from "@/hooks/useStations";

interface DashboardHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  selectedStation: string;
  selectedYear: number | null;
  selectedMonth: number | null;
  onYearChange: (year: number | null) => void;
  onMonthChange: (month: number | null) => void;
  onDataCleared: () => void;
}

export const DashboardHeader = ({ isDarkMode, toggleTheme, selectedStation, selectedYear, selectedMonth, onYearChange, onMonthChange, onDataCleared }: DashboardHeaderProps) => {
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

  // Generate years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
  
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

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
          <Select 
            value={selectedYear?.toString() || "all"} 
            onValueChange={(value) => onYearChange(value === "all" ? null : parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedYear && (
            <Select 
              value={selectedMonth?.toString() || "all"} 
              onValueChange={(value) => onMonthChange(value === "all" ? null : parseInt(value))}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

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
