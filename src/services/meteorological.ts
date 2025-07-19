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
    console.log('Fetching data for station:', stationName);
    
    // First, let's check what stations exist
    const { data: stationsCheck } = await supabase
      .from('stations')
      .select('name')
      .ilike('name', `%${stationName}%`);
    console.log('Similar station names in DB:', stationsCheck?.map(s => s.name));
    
    // Get the meteorological readings using exact station name match
    const { data, error } = await supabase
      .from('meteorological_readings')
      .select(`
        *,
        stations!inner(name)
      `)
      .eq('stations.name', stationName)
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .limit(100);

    console.log('Query executed with station name:', stationName);

    if (error) {
      console.error('Error fetching meteorological data:', error);
      return [];
    }

    console.log(`Found ${data?.length || 0} readings for station ${stationName}`);
    console.log('Raw data sample:', data?.[0]);
    
    if (!data || data.length === 0) {
      console.warn(`No data found for station: ${stationName}`);
      
      // Let's try a different approach - check all available data
      const { data: allData } = await supabase
        .from('meteorological_readings')
        .select(`
          *,
          stations(name)
        `)
        .limit(5);
      console.log('Sample of all available data:', allData);
      
      return [];
    }

    // Convert database format to MeteoData format
    const transformedData = data.map((reading: any) => ({
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
      rainDuration: reading.rain_duration || 0
    }));

    console.log('Transformed data sample:', transformedData[0]);
    console.log('Returning', transformedData.length, 'records');
    
    return transformedData;
  },

  async getStationDataByTimePeriod(stationId: string, timePeriod: string): Promise<MeteoData[]> {
    console.log('getStationDataByTimePeriod called with:', stationId, timePeriod);
    const allData = await this.getStationData(stationId);
    
    console.log('getStationDataByTimePeriod received data:', allData.length, 'items');
    
    if (!allData.length) {
      console.log('No data from getStationData, returning empty array');
      return allData;
    }
    
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
        console.log('Unknown time period, returning all data');
        return allData;
    }
    
    console.log('Filtering data from cutoff date:', cutoffDate);
    
    const filteredData = allData.filter(item => {
      // Parse date in YYYY-MM-DD format from database
      const itemDate = new Date(item.date);
      const isValid = itemDate >= cutoffDate;
      if (!isValid) {
        console.log('Filtering out old data:', item.date, 'vs cutoff:', cutoffDate);
      }
      return isValid;
    });
    
    console.log('Filtered data result:', filteredData.length, 'items after date filtering');
    return filteredData;
  }
};