import { useState } from "react";
import { Calendar, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AdvancedFiltersProps {
  onFilterChange: (filterType: string, year?: number, month?: number) => void;
  currentFilter: string;
}

export const AdvancedFilters = ({ onFilterChange, currentFilter }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedMonth, setSelectedMonth] = useState<number>();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
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

  const handleQuickFilter = (filterType: string) => {
    onFilterChange(filterType);
    setIsOpen(false);
  };

  const handleYearFilter = () => {
    if (selectedYear) {
      onFilterChange("year", selectedYear);
      setIsOpen(false);
    }
  };

  const handleMonthFilter = () => {
    if (selectedYear && selectedMonth) {
      onFilterChange("month", selectedYear, selectedMonth);
      setIsOpen(false);
    }
  };

  const handleClearFilters = () => {
    onFilterChange("all");
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Advanced Date Filters
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Filters */}
          <div>
            <Label className="text-sm font-medium">Quick Filters</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={currentFilter === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickFilter("7d")}
              >
                Last 7 days
              </Button>
              <Button
                variant={currentFilter === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickFilter("30d")}
              >
                Last 30 days
              </Button>
              <Button
                variant={currentFilter === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickFilter("90d")}
              >
                Last 3 months
              </Button>
              <Button
                variant={currentFilter === "1y" ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickFilter("1y")}
              >
                Last year
              </Button>
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <Label className="text-sm font-medium">Filter by Year</Label>
            <div className="flex gap-2 mt-2">
              <Select value={selectedYear?.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleYearFilter} 
                disabled={!selectedYear}
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Month Filter */}
          <div>
            <Label className="text-sm font-medium">Filter by Month</Label>
            <div className="space-y-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedYear?.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedMonth?.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleMonthFilter} 
                disabled={!selectedYear || !selectedMonth}
                size="sm"
                className="w-full"
              >
                Apply Month Filter
              </Button>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};