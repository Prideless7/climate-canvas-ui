-- Add missing columns to stations table for full functionality
ALTER TABLE public.stations 
ADD COLUMN IF NOT EXISTS latitude numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS longitude numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS elevation integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS last_update timestamp with time zone NOT NULL DEFAULT now();

-- Update RLS policies to allow delete operations
DROP POLICY IF EXISTS "Anyone can delete stations" ON public.stations;
CREATE POLICY "Anyone can delete stations"
ON public.stations
FOR DELETE
USING (true);

-- Update RLS policy to allow updates
DROP POLICY IF EXISTS "Anyone can update stations" ON public.stations;
CREATE POLICY "Anyone can update stations"
ON public.stations
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Insert the 5 predefined meteorological stations if they don't exist
INSERT INTO public.stations (name, location, latitude, longitude, elevation, active)
VALUES 
  ('Tympaki Station', 'Tympaki', 35.0697, 24.7661, 15, true),
  ('Potamies Station', 'Potamies', 35.2854, 25.4556, 120, true),
  ('Pyrgos Station', 'Pyrgos', 35.3340, 24.0500, 85, true),
  ('Doxaro Station', 'Doxaro', 35.2200, 25.7800, 210, true),
  ('Ziros Station', 'Ziros', 35.1397, 26.1300, 95, true)
ON CONFLICT (name) DO NOTHING;

-- Create index for faster location queries
CREATE INDEX IF NOT EXISTS idx_stations_location ON public.stations(latitude, longitude);