import { supabase } from "@/integrations/supabase/client";
import { MeteoData } from "@/components/Dashboard";

export interface Station {
  id: string;
  name: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MeteoReading {
  id: string;
  station_id: string;
  date: string;
  time: string;
  temperature?: number;
  humidity?: number;
  precipitation?: number;
  wind_speed?: number;
  wind_direction?: number;
  pressure?: number;
  solar_radiation?: number;
  eto?: number;
  rain_duration?: number;
  created_at: string;
  updated_at: string;
}

export const meteorologicalService = {
  async getStations(): Promise<Station[]> {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching stations:', error);
      throw new Error('Failed to fetch stations');
    }

    return data || [];
  },

  async getStationData(stationName: string): Promise<MeteoData[]> {
    // Get the meteorological readings directly by station name
    const { data, error } = await supabase
      .from('meteorological_readings')
      .select(`
        *,
        stations!inner(name)
      `)
      .eq('stations.name', stationName)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching meteorological data:', error);
      return [];
    }

    // Convert database format to MeteoData format
    return data.map((reading: MeteoReading) => ({
      date: reading.date,
      time: reading.time,
      temperature: reading.temperature || 0,
      humidity: reading.humidity || 0,
      precipitation: reading.precipitation || 0,
      windSpeed: reading.wind_speed || 0,
      windDirection: reading.wind_direction || 0,
      pressure: reading.pressure || 0,
      solarRadiation: reading.solar_radiation || 0,
      eto: reading.eto || 0,
    }));
  },

  async getStationDataByTimePeriod(stationId: string, timePeriod: string): Promise<MeteoData[]> {
    const allData = await this.getStationData(stationId);
    
    if (!allData.length) return allData;
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timePeriod) {
      case "7d":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return allData;
    }
    
    return allData.filter(item => {
      // Parse date in YYYY-MM-DD format from database
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  }
};