-- Copy event location data to instances where instance fields are null
UPDATE event_instances ei
SET 
  instance_address = e.address,
  instance_city = e.city,
  instance_state = e.state,
  instance_zip = e.zip,
  instance_custom_venue_name = e.custom_venue_name,
  instance_use_custom_venue = e.use_custom_venue,
  instance_snippet = e.snippet
FROM events e
WHERE ei.event_id = e.id
  AND (ei.instance_address IS NULL OR ei.instance_address = '')
  AND e.address IS NOT NULL; 