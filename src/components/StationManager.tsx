import { useState } from "react";
import { Plus, Trash2, MapPin, Save, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useStations } from "@/hooks/useStations";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name: string;
}

export const StationManager = () => {
  const { stations, addStation, deleteStation, isAdding, isDeleting } = useStations();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    elevation: "",
    active: true,
  });

  const searchLocation = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a location name to search");
      return;
    }

    setIsSearching(true);
    try {
      // OpenStreetMap Nominatim API - free, no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=gr`,
        {
          headers: {
            'User-Agent': 'MeteorologicalStationManager/1.0'
          }
        }
      );

      if (!response.ok) throw new Error('Search failed');

      const results = await response.json();
      setSearchResults(results);

      if (results.length === 0) {
        toast.info("No locations found. Try a different search term.");
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Failed to search location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: SearchResult) => {
    setFormData({
      ...formData,
      name: formData.name || `${result.name} Station`,
      location: result.name,
      latitude: result.lat,
      longitude: result.lon,
    });
    setSearchResults([]);
    setSearchQuery("");
    toast.success("Location coordinates filled in!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.latitude || !formData.longitude) {
      return;
    }

    addStation({
      name: formData.name,
      location: formData.location,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      elevation: parseInt(formData.elevation) || 0,
      active: formData.active,
    });

    setFormData({
      name: "",
      location: "",
      latitude: "",
      longitude: "",
      elevation: "",
      active: true,
    });
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Station Management
            </CardTitle>
            <CardDescription>
              Add or remove meteorological stations
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Station
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Station</DialogTitle>
                <DialogDescription>
                  Enter the details for the new meteorological station
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  {/* Location Search */}
                  <div className="grid gap-2">
                    <Label htmlFor="search">Search Location on Map</Label>
                    <div className="flex gap-2">
                      <Input
                        id="search"
                        placeholder="e.g., Heraklion, Crete"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            searchLocation();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={searchLocation}
                        disabled={isSearching}
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="border rounded-lg max-h-48 overflow-y-auto">
                        {searchResults.map((result) => (
                          <button
                            key={result.place_id}
                            type="button"
                            onClick={() => selectSearchResult(result)}
                            className="w-full text-left px-3 py-2 hover:bg-accent text-sm border-b last:border-b-0"
                          >
                            <p className="font-medium">{result.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {result.display_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or enter manually
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Station Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Heraklion Station"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Heraklion"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.0001"
                        placeholder="e.g., 35.3387"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.0001"
                        placeholder="e.g., 25.1442"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="elevation">Elevation (meters)</Label>
                    <Input
                      id="elevation"
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.elevation}
                      onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="active">Active Status</Label>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isAdding}>
                    <Save className="w-4 h-4 mr-2" />
                    {isAdding ? "Adding..." : "Add Station"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stations.map((station) => (
            <div
              key={station.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${station.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="font-medium text-sm">{station.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {station.location} • {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {station.elevation}m
                </Badge>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Station</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{station.name}"? This action cannot be undone.
                        All meteorological readings associated with this station will remain in the database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteStation(station.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
