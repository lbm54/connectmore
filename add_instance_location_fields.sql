-- Add missing instance fields
ALTER TABLE event_instances 
ADD COLUMN instance_address VARCHAR(255),
ADD COLUMN instance_city VARCHAR(255), 
ADD COLUMN instance_state VARCHAR(5),
ADD COLUMN instance_zip VARCHAR(10),
ADD COLUMN instance_custom_venue_name VARCHAR(255),
ADD COLUMN instance_use_custom_venue BOOLEAN DEFAULT false,
ADD COLUMN instance_snippet VARCHAR(100);

-- Create index on instance location fields for potential searches
CREATE INDEX idx_event_instances_location ON event_instances(instance_city, instance_state); 