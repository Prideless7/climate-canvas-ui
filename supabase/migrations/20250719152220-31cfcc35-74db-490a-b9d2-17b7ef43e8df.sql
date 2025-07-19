-- Create stations table
CREATE TABLE public.stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meteorological_readings table with standardized columns
CREATE TABLE public.meteorological_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  temperature DECIMAL(5,2), -- Average temperature in Celsius
  humidity DECIMAL(5,2), -- Relative humidity percentage
  precipitation DECIMAL(8,2), -- Precipitation in mm
  wind_speed DECIMAL(6,2), -- Wind speed
  wind_direction DECIMAL(6,2), -- Wind direction in degrees
  pressure DECIMAL(7,2), -- Barometric pressure
  solar_radiation DECIMAL(8,2), -- Solar radiation in W/m²
  eto DECIMAL(8,2), -- Daily ETo
  rain_duration DECIMAL(8,2), -- Rain duration
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(station_id, date, time)
);

-- Enable Row Level Security
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meteorological_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is meteorological data that can be public)
CREATE POLICY "Anyone can view stations" 
ON public.stations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert stations" 
ON public.stations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view meteorological readings" 
ON public.meteorological_readings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert meteorological readings" 
ON public.meteorological_readings 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_stations_updated_at
  BEFORE UPDATE ON public.stations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meteorological_readings_updated_at
  BEFORE UPDATE ON public.meteorological_readings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_meteorological_readings_station_date 
ON public.meteorological_readings(station_id, date);

CREATE INDEX idx_meteorological_readings_date_range 
ON public.meteorological_readings(date DESC);

CREATE INDEX idx_stations_name 
ON public.stations(name);