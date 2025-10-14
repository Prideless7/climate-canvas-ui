import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ClearDataButtonsProps {
  selectedStation: string;
  onDataCleared: () => void;
}

const stationNames: Record<string, string> = {
  Tympaki: "Tympaki Station",
  Potamies: "Potamies Station", 
  Doxaro: "Doxaro Station",
  Pyrgos: "Pyrgos Station",
  Ziros: "Ziros Station"
};

export const ClearDataButtons = ({ selectedStation, onDataCleared }: ClearDataButtonsProps) => {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  // Only admins can clear data
  if (!isAdmin) {
    return null;
  }

  const clearStationData = async () => {
    setIsClearing(true);
    try {
      // Get station ID first
      const { data: stations, error: stationError } = await supabase
        .from('stations')
        .select('id')
        .eq('name', selectedStation)
        .single();

      if (stationError) throw stationError;

      // Delete meteorological readings for this station
      const { error: deleteError } = await supabase
        .from('meteorological_readings')
        .delete()
        .eq('station_id', stations.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: `All data cleared for ${stationNames[selectedStation] || selectedStation}`,
      });
      
      onDataCleared();
    } catch (error) {
      console.error('Error clearing station data:', error);
      toast({
        title: "Error",
        description: "Failed to clear station data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const clearAllData = async () => {
    setIsClearing(true);
    try {
      // Delete all meteorological readings (keeps stations intact)
      const { error } = await supabase
        .from('meteorological_readings')
        .delete()
        .gte('id', '00000000-0000-0000-0000-000000000000'); // This will match all UUIDs

      if (error) throw error;

      toast({
        title: "Success",
        description: "All meteorological data cleared from all stations",
      });
      
      onDataCleared();
    } catch (error) {
      console.error('Error clearing all data:', error);
      toast({
        title: "Error", 
        description: "Failed to clear all data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isClearing}>
          <Trash2 className="w-4 h-4" />
          Clear Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Clear {stationNames[selectedStation] || selectedStation} Data
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Station Data</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all meteorological data for{" "}
                <strong>{stationNames[selectedStation] || selectedStation}</strong>.
                The station itself will remain intact. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearStationData}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isClearing}
              >
                {isClearing ? "Clearing..." : "Clear Station Data"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Clear All Stations Data
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Data</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all meteorological data from all stations.
                All stations will remain intact, but all their meteorological readings
                will be deleted. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearAllData}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isClearing}
              >
                {isClearing ? "Clearing..." : "Clear All Data"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
