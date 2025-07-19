import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MeteoData } from "./Dashboard";

interface DataImportProps {
  onDataImport: (stationName: string, data: MeteoData[]) => void;
}

export const DataImport = ({ onDataImport }: DataImportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parseCSV = (csvText: string): MeteoData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      
      return {
        date: values[0] || '',
        time: values[1] || '',
        humidity: parseFloat(values[2]) || 0,
        precipitation: parseFloat(values[3]) || 0,
        windSpeed: parseFloat(values[4]) || 0,
        temperature: parseFloat(values[6]) || 0,
        solarRadiation: parseFloat(values[7]) || 0,
        windDirection: parseFloat(values[8]) || 0,
        pressure: parseFloat(values[9]) || 0,
        eto: parseFloat(values[10]) || 0,
      };
    });
  };

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

    setIsLoading(true);
    
    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      // Extract station name from filename (assuming format like "chania_airport.csv")
      const stationName = file.name.replace('.csv', '').replace(/_/g, ' ').toLowerCase();
      
      onDataImport(stationName, data);
      
      toast({
        title: "Data imported successfully",
        description: `Imported ${data.length} records for ${stationName}`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error parsing the CSV file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
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
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-muted border-dashed rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> CSV file
              </p>
              <p className="text-xs text-muted-foreground">CSV files only</p>
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
        
        {isLoading && (
          <div className="text-center text-sm text-muted-foreground">
            Processing file...
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Expected CSV format:</p>
          <p>Date, Time, Humidity, Precipitation, Wind Speed, Temperature, Solar Radiation, etc.</p>
        </div>
      </CardContent>
    </Card>
  );
};