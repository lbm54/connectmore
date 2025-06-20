// Flattened event instance type matching your exact database schema
export type FlatEventInstance = {
    // Event Instance fields (from event_instances table)
    id: number;
    event_id: number | null;
    instance_date: string | null; // DATE
    start_time: string | null; // TIME(6)
    end_time: string | null; // TIME(6)
    instance_end_date: string | null; // DATE
    instance_html_link: string | null;
    instance_summary: string | null;
    instance_description: string | null;
    instance_start_date: string | null; // DATE
    instance_thumbnail_address: string | null;
    instance_image_address: string | null;
    instance_name: string | null;
    instance_venue_id: number | null;
    instance_subcategory_id: number | null;
    instance_start_time: string | null;
    instance_end_time: string | null;
    instance_video_url: string | null;
    
    // ✅ NEW INSTANCE LOCATION FIELDS
    instance_address: string | null;
    instance_city: string | null;
    instance_state: string | null;
    instance_zip: string | null;
    instance_custom_venue_name: string | null;
    instance_use_custom_venue: boolean | null;
    instance_snippet: string | null;
    
    start_datetime: string | null; // TIMESTAMP(6)
    end_datetime: string | null; // TIMESTAMP(6)
    current_attendees: number | null;
    max_attendees: number | null;
    allow_waitlist: boolean | null;
    uses_event_name: boolean | null;
    uses_event_description: boolean | null;
    
    // Event fields (from events table) - prefixed to avoid conflicts
    event_name: string | null; // events.name
    event_summary: string | null; // events.summary
    event_description: string | null; // events.description
    event_html_link: string | null; // events.html_link
    event_thumbnail_address: string | null; // events.thumbnail_address
    event_image_address: string | null; // events.image_address
    event_video_url: string | null; // events.video_url
    event_address: string | null; // events.address
    event_city: string | null; // events.city
    event_state: string | null; // events.state
    event_zip: string | null; // events.zip
    event_start_datetime: string | null; // events.start_datetime
    event_end_datetime: string | null; // events.end_datetime
    is_featured: boolean | null; // events.is_featured
    is_super_featured: boolean | null; // events.is_super_featured
    is_checked: boolean | null; // events.is_checked
    importance: number | null; // events.importance
    custom_venue_name: string | null; // events.custom_venue_name
    use_custom_venue: boolean | null; // events.use_custom_venue
    snippet: string | null; // events.snippet
    is_recurring: boolean | null; // events.is_recurring
    recurrence: string | null; // events.recurrence (RRULE)
    recurrence_end_date: string | null; // events.recurrence_end_date
    instance_template_name: string | null; // events.instance_template_name
    instance_template_desc: string | null; // events.instance_template_desc
    
    // Category fields (flattened from relations)
    category_id: number | null;
    category_name: string | null;
    subcategory_id: number | null;
    subcategory_name: string | null;
    
    // Status fields (flattened from relations)
    event_status_id: number | null; // events.status_id
    event_status_name: string | null;
    instance_status_id: number | null; // event_instances.status_id
    instance_status_name: string | null;
    
    // Organizer fields (flattened from relation)
    organizer_id: number | null;
    organizer_name: string | null;
    organizer_image_url: string | null;
    organizer_website_url: string | null;
    
    // Venue fields (flattened from relation) - EXTENDED FOR MAP
    venue_id: number | null; // events.venue_id
    venue_name: string | null;
    venue_latitude: string | null; // venues.latitude (Decimal converted to string)
    venue_longitude: string | null; // venues.longitude (Decimal converted to string)
    venue_address: string | null; // venues.address_line1
    venue_city: string | null; // venues.city
    venue_state: string | null; // venues.state
    
    // Instance venue fields (for event_instances.instance_venue_id)
    instance_venue_name: string | null;
    instance_venue_latitude: string | null;
    instance_venue_longitude: string | null;
    instance_venue_address: string | null;
    instance_venue_city: string | null;
    instance_venue_state: string | null;
    
    // Computed fields for convenience
    attendee_count: number;
    flag_names: string[];
    tag_names: string[];
    
    // Legacy/compatibility fields (computed)
    eventName: string | null; // Alias for event_name
    eventSummary: string | null; // Alias for event_summary
    eventDescription: string | null; // Alias for event_description
};