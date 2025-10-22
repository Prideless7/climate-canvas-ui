import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Station {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  elevation: number;
  active: boolean;
  last_update: string;
  created_at: string;
  updated_at: string;
}

export const useStations = () => {
  const queryClient = useQueryClient();

  const { data: stations = [], isLoading } = useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Station[];
    },
  });

  const addStation = useMutation({
    mutationFn: async (newStation: Omit<Station, "id" | "created_at" | "updated_at" | "last_update">) => {
      const { data, error } = await supabase
        .from("stations")
        .insert([newStation])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      toast.success("Station added successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add station: ${error.message}`);
    },
  });

  const deleteStation = useMutation({
    mutationFn: async (stationId: string) => {
      const { error } = await supabase
        .from("stations")
        .delete()
        .eq("id", stationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      toast.success("Station deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete station: ${error.message}`);
    },
  });

  const updateStation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Station> & { id: string }) => {
      const { error } = await supabase
        .from("stations")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      toast.success("Station updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update station: ${error.message}`);
    },
  });

  return {
    stations,
    isLoading,
    addStation: addStation.mutate,
    deleteStation: deleteStation.mutate,
    updateStation: updateStation.mutate,
    isAdding: addStation.isPending,
    isDeleting: deleteStation.isPending,
    isUpdating: updateStation.isPending,
  };
};
