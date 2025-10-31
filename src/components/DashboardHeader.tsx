
import { Moon, Sun, Upload, LogOut, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClearDataButtons } from "./ClearDataButtons";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useStations } from "@/hooks/useStations";
import { useState } from "react";

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
  const [filterMode, setFilterMode] = useState<"year" | "month">("year");
  const [tempYear, setTempYear] = useState<number | null>(selectedYear);
  const [tempMonth, setTempMonth] = useState<number | null>(selectedMonth);
  const [isOpen, setIsOpen] = useState(false);
  
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

  const handleApplyFilter = () => {
    if (filterMode === "year") {
      onYearChange(tempYear);
      onMonthChange(null);
    } else {
      onYearChange(tempYear);
      onMonthChange(tempMonth);
    }
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setTempYear(null);
    setTempMonth(null);
    onYearChange(null);
    onMonthChange(null);
    setIsOpen(false);
  };

  // Generate years from 2015 to 2025
  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);
  
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
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
                Filters
                {(selectedYear || selectedMonth) && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                    {selectedMonth ? `${selectedYear}/${selectedMonth}` : selectedYear}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Filter Data</h4>
                  <RadioGroup value={filterMode} onValueChange={(value) => setFilterMode(value as "year" | "month")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="year" id="year" />
                      <Label htmlFor="year">By Year</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="month" id="month" />
                      <Label htmlFor="month">By Year and Month</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select 
                      value={tempYear?.toString() || ""} 
                      onValueChange={(value) => setTempYear(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {filterMode === "month" && (
                    <div className="space-y-2">
                      <Label>Month</Label>
                      <Select 
                        value={tempMonth?.toString() || ""} 
                        onValueChange={(value) => setTempMonth(parseInt(value))}
                        disabled={!tempYear}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleApplyFilter} disabled={!tempYear} className="flex-1">
                    Apply
                  </Button>
                  <Button onClick={handleClearFilter} variant="outline">
                    Clear
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

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
