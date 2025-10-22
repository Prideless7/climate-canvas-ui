-- Fix: Update all readings from the incorrectly created station to the correct station
-- The bad station has name as UUID, the correct station is "Λίμνη Κουρνά Station"
UPDATE meteorological_readings
SET station_id = 'b251d75b-8f8d-4401-8cf0-4ad2fbdc93c5'
WHERE station_id = '487b5dcd-69aa-43cb-8a0f-37f4920bc86a';

-- Delete the incorrectly created station (with UUID as name)
DELETE FROM stations 
WHERE id = '487b5dcd-69aa-43cb-8a0f-37f4920bc86a';