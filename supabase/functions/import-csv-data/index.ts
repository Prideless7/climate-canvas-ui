import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MeteoReading {
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
}

// Column mapping for different station formats
const columnMappings: Record<string, string> = {
  // Temperature mappings
  'M05 Temperature (AVG)': 'temperature',
  'M07 Temperature (AVG)': 'temperature',
  'ΠΥΡΓΟΣ AIR TEMP (AVG)': 'temperature',
  'M02 Temperature (AVG)': 'temperature',
  'M04 Temperature (AVG)': 'temperature',
  
  // Humidity mappings
  'M05 Relative Humidity (AVG)': 'humidity',
  'M07 Relative Humidity (AVG)': 'humidity',
  'ΠΥΡΓΟΣ Humidity (AVG)': 'humidity',
  'ΔΟΞΑΡΟ Relative Humidity': 'humidity',
  'M04 Relative Humidity (AVG)': 'humidity',
  
  // Precipitation mappings
  'M05 Precipitation (SUM)': 'precipitation',
  'M07 Precipitation (SUM)': 'precipitation',
  'ΠΥΡΓΟΣ Rain (SUM)': 'precipitation',
  'M02 Precipitation (SUM)': 'precipitation',
  'M04 Precipitation (SUM)': 'precipitation',
  
  // Wind speed mappings
  'M05 WIND SPEED (AVG)': 'wind_speed',
  'M07 WIND SPEED (AVG)': 'wind_speed',
  'ΠΥΡΓΟΣ WIND SPEED (AVG)': 'wind_speed',
  'M02 WIND SPEED (AVG)': 'wind_speed',
  'M04 WIND SPEED (AVG)': 'wind_speed',
  
  // Wind direction mappings
  'ΤΥΜΠΑΚΙ WIND DIRECTION (AVG)': 'wind_direction',
  'ΠΟΤΑΜΙΕΣ WIND DIRECTION (AVG)': 'wind_direction',
  'ΠΥΡΓΟΣ WIND DΙRECTION (AVG)': 'wind_direction',
  'ΔΟΞΑΡΟ WIND DIRECTION (AVG)': 'wind_direction',
  'ΖΗΡΟΣ WIND DIRECTION (AVG)': 'wind_direction',
  
  // Pressure mappings
  'M05 Barometric Pressure (AVG)': 'pressure',
  'M07 Barometric Pressure (AVG)': 'pressure',
  'ΠΥΡΓΟΣ BAROMETER (AVG)': 'pressure',
  'M02 Barometric Pressure (AVG)': 'pressure',
  'M04 Barometric Pressure (AVG)': 'pressure',
  
  // Solar radiation mappings
  'M05 Pyranometer 0 - 2000 W/m² (AVG)': 'solar_radiation',
  'M07 Pyranometer 0 - 2000 W/m² (AVG)': 'solar_radiation',
  'ΠΥΡΓΟΣ SOLAR (AVG)': 'solar_radiation',
  'M02 Pyranometer 0 - 2000 W/m² (AVG)': 'solar_radiation',
  'M04 Pyranometer 0 - 2000 W/m² (AVG)': 'solar_radiation',
  
  // ETo mappings
  'ΤΥΜΠΑΚΙ Daily ETo': 'eto',
  'ΠΟΤΑΜΙΕΣ Daily ETo': 'eto',
  'ΠΥΡΓΟΣ Daily ETo': 'eto',
  'ΔΟΞΑΡΟ Daily ETo': 'eto',
  'ΖΗΡΟΣ Daily ETo': 'eto',
  
  // Rain duration mappings
  'ΠΥΡΓΟΣ Rain Duration (SUM)': 'rain_duration',
  'ΔΟΞΑΡΟ Rain Duration (SUM)': 'rain_duration',
  'ΖΗΡΟΣ Rain Duration (SUM)': 'rain_duration',
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseDate(dateStr: string): string {
  // Handle DD/MM/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

function parseTime(timeStr: string): string {
  // Ensure time is in HH:MM:SS format
  if (timeStr.includes(':')) {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return `${parts[0]}:${parts[1]}:00`;
    }
    return timeStr;
  }
  return '00:00:00';
}

function parseNumericValue(value: string): number | null {
  if (!value || value === '*' || value === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

function mapRowToReading(headers: string[], row: string[]): MeteoReading | null {
  if (row.length < 2) return null;
  
  const reading: MeteoReading = {
    date: parseDate(row[0]),
    time: parseTime(row[1])
  };
  
  // Map other columns based on header names
  for (let i = 2; i < headers.length && i < row.length; i++) {
    const header = headers[i];
    const standardField = columnMappings[header];
    
    if (standardField && row[i]) {
      const value = parseNumericValue(row[i]);
      if (value !== null) {
        (reading as any)[standardField] = value;
      }
    }
  }
  
  return reading;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { stationName, csvData } = await req.json();

    if (!stationName || !csvData) {
      return new Response(
        JSON.stringify({ error: 'Station name and CSV data are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing CSV import for station: ${stationName}`);

    // Parse CSV data
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ error: 'CSV must contain at least header and one data row' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const headers = parseCSVLine(lines[0]);
    console.log('CSV Headers:', headers);

    // Create or get station
    let { data: station, error: stationError } = await supabase
      .from('stations')
      .select('id')
      .eq('name', stationName)
      .maybeSingle();

    if (!station) {
      // Station doesn't exist, create it
      const { data: newStation, error: createError } = await supabase
        .from('stations')
        .insert([{ name: stationName }])
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating station:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create station' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      station = newStation;
    } else if (stationError) {
      console.error('Error fetching station:', stationError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch station' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and prepare readings
    const readings: any[] = [];
    let skippedRows = 0;

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      const reading = mapRowToReading(headers, row);
      
      if (reading && reading.date && reading.time) {
        readings.push({
          station_id: station.id,
          ...reading
        });
      } else {
        skippedRows++;
      }
    }

    console.log(`Parsed ${readings.length} readings, skipped ${skippedRows} rows`);

    if (readings.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid readings found in CSV' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert readings in batches
    const batchSize = 100;
    let totalInserted = 0;
    let totalErrors = 0;

    for (let i = 0; i < readings.length; i += batchSize) {
      const batch = readings.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('meteorological_readings')
        .upsert(batch, { 
          onConflict: 'station_id,date,time',
          ignoreDuplicates: false 
        });

      if (insertError) {
        console.error('Batch insert error:', insertError);
        totalErrors += batch.length;
      } else {
        totalInserted += batch.length;
      }
    }

    console.log(`Import completed: ${totalInserted} inserted, ${totalErrors} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${totalInserted} readings for station ${stationName}`,
        totalRows: readings.length,
        inserted: totalInserted,
        errors: totalErrors,
        skipped: skippedRows
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing CSV import:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})