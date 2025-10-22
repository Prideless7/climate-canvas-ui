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

  async getStationDataByTimePeriod(stationId: string, timePeriod: string, customYear?: number, customMonth?: number): Promise<MeteoData[]> {
    console.log('getStationDataByTimePeriod called with:', stationId, timePeriod, customYear, customMonth);
    
    // For database-level filtering, build the query with date filters
    let query = supabase
      .from('meteorological_readings')
      .select('*')
      .eq('station_id', stationId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    const now = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    switch (timePeriod) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case "year":
        if (customYear) {
          startDate = `${customYear}-01-01`;
          endDate = `${customYear}-12-31`;
        }
        break;
      case "month":
        if (customYear && customMonth) {
          const monthStr = customMonth.toString().padStart(2, '0');
          startDate = `${customYear}-${monthStr}-01`;
          const lastDay = new Date(customYear, customMonth, 0).getDate();
          endDate = `${customYear}-${monthStr}-${lastDay}`;
        }
        break;
      case "all":
      default:
        console.log('Showing all data, no date filtering');
        break;
    }

    // Apply date filters to the query
    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
      console.log(`Filtering data between ${startDate} and ${endDate}`);
    } else if (startDate) {
      query = query.gte('date', startDate);
      console.log(`Filtering data from ${startDate}`);
    }

    const { data, error } = await query.limit(1000);

    if (error) {
      console.error('Error fetching filtered meteorological data:', error);
      return [];
    }

    console.log(`Found ${data?.length || 0} readings for station ${stationId} with filter ${timePeriod}`);
    
    if (!data || data.length === 0) {
      console.warn(`No data found for station: ${stationId} with filter: ${timePeriod}`);
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

    console.log('Returning', transformedData.length, 'filtered records');
    return transformedData;
  }
};