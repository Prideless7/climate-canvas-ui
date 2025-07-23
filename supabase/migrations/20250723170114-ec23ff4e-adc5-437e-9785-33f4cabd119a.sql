-- Add DELETE policies for meteorological_readings table
CREATE POLICY "Anyone can delete meteorological readings" 
ON public.meteorological_readings 
FOR DELETE 
USING (true);