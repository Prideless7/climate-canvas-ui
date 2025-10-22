-- Delete all stations with invalid coordinates (0, 0)
-- These are old entries without proper geographic data
DELETE FROM public.stations 
WHERE latitude = 0 AND longitude = 0;

-- Verify we only have valid stations with proper coordinates
-- The remaining stations should be:
-- Tympaki Station, Potamies Station, Pyrgos Station, Doxaro Station, Ziros Station