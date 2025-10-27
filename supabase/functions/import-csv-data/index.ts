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

// Dynamic pattern-based column mapping
function mapColumnToField(columnHeader: string): string | null {
  const header = columnHeader.toLowerCase();
  
  // Temperature patterns
  if (header.includes('temperature') || header.includes('air temp')) {
    return 'temperature';
  }
  
  // Humidity patterns
  if (header.includes('humidity')) {
    return 'humidity';
  }
  
  // Precipitation/Rain patterns
  if (header.includes('precipitation') || header.includes('rain') && !header.includes('duration')) {
    return 'precipitation';
  }
  
  // Wind speed patterns
  if (header.includes('wind speed') || header.includes('wind_speed')) {
    return 'wind_speed';
  }
  
  // Wind direction patterns
  if (header.includes('wind direction') || header.includes('wind_direction')) {
    return 'wind_direction';
  }
  
  // Pressure/Barometer patterns
  if (header.includes('pressure') || header.includes('barometer')) {
    return 'pressure';
  }
  
  // Solar radiation/Pyranometer patterns
  if (header.includes('solar') || header.includes('pyranometer')) {
    return 'solar_radiation';
  }
  
  // ETo patterns
  if (header.includes('eto')) {
    return 'eto';
  }
  
  // Rain duration patterns
  if (header.includes('rain') && header.includes('duration')) {
    return 'rain_duration';
  }
  
  return null;
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
  
  // Map other columns based on header names using dynamic pattern matching
  for (let i = 2; i < headers.length && i < row.length; i++) {
    const header = headers[i];
    const standardField = mapColumnToField(header);
    
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

    const { stationId, stationName, csvData } = await req.json();

    if (!stationId || !csvData) {
      return new Response(
        JSON.stringify({ error: 'Station ID and CSV data are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing CSV import for station: ${stationName || stationId}`);

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

    // Verify station exists
    const { data: station, error: stationError } = await supabase
      .from('stations')
      .select('id, name')
      .eq('id', stationId)
      .single();

    if (stationError || !station) {
      console.error('Station not found:', stationError);
      return new Response(
        JSON.stringify({ error: 'Station not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        message: `Successfully imported ${totalInserted} readings for station ${station.name}`,
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