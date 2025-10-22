import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MeteoData } from "./Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useStations } from "@/hooks/useStations";
import { StationManager } from "./StationManager";
import { Skeleton } from "@/components/ui/skeleton";

interface DataImportProps {
  onDataImport: (stationName: string) => void;
}

export const DataImport = ({ onDataImport }: DataImportProps) => {
  const { isAdmin } = useAuth();
  const { stations, isLoading: isLoadingStations } = useStations();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Only admins can import data
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Only administrators can import meteorological data.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
  };

  const handleImport = async () => {
    if (!uploadedFile || !selectedStation) {
      toast({
        title: "Missing information",
        description: "Please select a station and upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const csvData = await uploadedFile.text();
      const stationInfo = stations.find(s => s.id === selectedStation);
      
      if (!stationInfo) {
        throw new Error('Station not found');
      }
      
      // Call backend API to process and store CSV data
      const { data, error } = await supabase.functions.invoke('import-csv-data', {
        body: {
          stationId: selectedStation,  // Send station ID
          stationName: stationInfo.name,  // Also send name for logging
          csvData: csvData
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to import data');
      }

      onDataImport(selectedStation);
      
      toast({
        title: "Data imported successfully",
        description: `Imported ${data.inserted} records for ${stationInfo?.name}. ${data.skipped > 0 ? `Skipped ${data.skipped} invalid rows.` : ''}`,
      });

      // Reset form
      setSelectedStation("");
      setUploadedFile(null);
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error.message || "There was an error importing the CSV file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingStations) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Station Management Section */}
      <StationManager />

      {/* Data Import Section */}
      <Card className="border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileText className="h-5 w-5" />
          Import Meteorological Data
        </CardTitle>
        <CardDescription>
          Upload CSV files containing meteorological station data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Station Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Select Station
          </label>
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a meteorological station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{station.name}</span>
                    <span className="text-xs text-muted-foreground">{station.location}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Upload CSV File
          </label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-muted border-dashed rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                {uploadedFile ? (
                  <div className="text-center">
                    <p className="mb-2 text-sm text-foreground font-medium">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">File ready for import</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> CSV file
                    </p>
                    <p className="text-xs text-muted-foreground">CSV files only</p>
                  </div>
                )}
              </div>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Import Button */}
        <Button 
          onClick={handleImport}
          disabled={!selectedStation || !uploadedFile || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Expected CSV format:</p>
          <p>Date, Time, Humidity, Precipitation, Wind Speed, Temperature, Solar Radiation, etc.</p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};