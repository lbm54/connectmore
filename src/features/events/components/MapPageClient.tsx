"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvents, eventQueryKeys } from "@/features/events/api";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import type { FlatEventInstance } from "../models/flat_event_instance";
import { formatEventDateTimeEnhanced } from "../utils/formatEventDateTime";

// Import required CSS
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

// Fix Leaflet default icons in Next.js
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Birmingham, AL coordinates
const BIRMINGHAM_CENTER: [number, number] = [33.5186, -86.8104];

type DateFilter = 'today' | 'week' | 'month' | 'all';

interface DateFilterOption {
  value: DateFilter;
  label: string;
  days: number;
}

const DATE_FILTERS: DateFilterOption[] = [
  { value: 'today', label: 'Today', days: 1 },
  { value: 'week', label: 'This Week', days: 7 },
  { value: 'month', label: 'This Month', days: 30 },
  { value: 'all', label: 'All Events', days: 365 },
];

// Custom cluster icon function
const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span class="cluster-count">${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom',
    iconSize: L.point(40, 40, true),
  });
};

export default function MapPageClient({ daysAhead }: { daysAhead: number }) {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');

  // Get current filter's day count
  const currentDays = DATE_FILTERS.find(f => f.value === dateFilter)?.days || daysAhead;

  // Use the same query pattern as other pages
  const { data: events = [], isLoading, error } = useQuery<FlatEventInstance[], Error>({
    queryKey: eventQueryKeys.list(currentDays),
    queryFn: () => fetchEvents(currentDays),
    staleTime: 5 * 60_000,
  });

  // Filter events that have coordinates and apply date filter
  const mappableEvents = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    // Set filter date based on selection
    switch (dateFilter) {
      case 'today':
        filterDate.setDate(now.getDate() + 1);
        break;
      case 'week':
        filterDate.setDate(now.getDate() + 7);
        break;
      case 'month':
        filterDate.setDate(now.getDate() + 30);
        break;
      case 'all':
        filterDate.setDate(now.getDate() + 365);
        break;
    }

    return events.filter(event => {
      // Check if event has coordinates (either from venue or instance venue)
      const hasCoords = (
        (event.venue_latitude && event.venue_longitude) ||
        (event.instance_venue_latitude && event.instance_venue_longitude)
      );
      
      if (!hasCoords) return false;

      // Apply date filter
      const eventDate = new Date(event.start_datetime || event.instance_date || '');
      return eventDate >= now && eventDate <= filterDate;
    });
  }, [events, dateFilter]);

  // Group events by location for markers
  const eventGroups = useMemo(() => {
    const groups = new Map<string, FlatEventInstance[]>();
    
    mappableEvents.forEach(event => {
      const lat = event.venue_latitude || event.instance_venue_latitude;
      const lng = event.venue_longitude || event.instance_venue_longitude;
      const key = `${lat},${lng}`;
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(event);
    });
    
    return Array.from(groups.entries()).map(([coords, events]) => {
      const [lat, lng] = coords.split(',');
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        events: events.sort((a, b) => {
          const dateA = new Date(a.start_datetime || a.instance_date || '');
          const dateB = new Date(b.start_datetime || b.instance_date || '');
          return dateA.getTime() - dateB.getTime();
        })
      };
    });
  }, [mappableEvents]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <span className="ml-4 text-surface-50">Loading map...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <span className="text-red-500">Error loading events: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-12 mt-8">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900 dark:text-surface-50">
            Events Map
          </h1>
         
        </div>
        
        {/* Date Filter */}
        <div className="flex gap-2">
          {DATE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setDateFilter(filter.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                dateFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="markercluster-map" style={{ height: '600px' }}>
          <MapContainer
            center={BIRMINGHAM_CENTER}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MarkerClusterGroup
              iconCreateFunction={createClusterCustomIcon}
              showCoverageOnHover={false}
              maxClusterRadius={50}
            >
              {eventGroups.map(({ lat, lng, events }, index) => (
                <Marker
                  key={`${lat}-${lng}-${index}`}
                  position={[lat, lng]}
                >
                  <Popup maxWidth={400} className="event-popup">
                    <div className="p-2 max-h-96 overflow-y-auto">
                      {events.length === 1 ? (
                        // Single event
                        <EventPopupContent 
                          event={events[0]} 
                          onViewDetails={(eventId) => router.push(`/events/${eventId}`)}
                        />
                      ) : (
                        // Multiple events at same location
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-surface-900">
                            {events.length} Events at This Location
                          </h3>
                          <div className="space-y-3">
                            {events.slice(0, 5).map((event) => (
                              <div key={event.id} className="border-b pb-2 last:border-b-0">
                                <EventPopupContent 
                                  event={event} 
                                  onViewDetails={(eventId) => router.push(`/events/${eventId}`)}
                                  compact
                                />
                              </div>
                            ))}
                            {events.length > 5 && (
                              <p className="text-sm text-surface-600 text-center pt-2">
                                ... and {events.length - 5} more events
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>

      {/* Events without location notice */}
      {events.length > mappableEvents.length && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>Note:</strong> {events.length - mappableEvents.length} events are not shown on the map because they do not have location coordinates.
          </p>
        </div>
      )}
    </div>
  );
}

// Component for rendering event details in popup
interface EventPopupContentProps {
  event: FlatEventInstance;
  onViewDetails: (eventId: number) => void;
  compact?: boolean;
}

function EventPopupContent({ event, onViewDetails, compact = false }: EventPopupContentProps) {
  const eventName = event.instance_name || event.event_name || "Untitled Event";
  const venueName = event.instance_venue_name || event.venue_name || event.custom_venue_name;
  const venueAddress = event.instance_venue_address || event.venue_address || event.event_address;
  const venueCity = event.instance_venue_city || event.venue_city || event.event_city;

  return (
    <div className={compact ? "text-sm" : ""}>
      <h4 className={`font-semibold text-surface-900 mb-2 ${compact ? "text-sm" : "text-base"}`}>
        {eventName}
      </h4>
      
      <div className="space-y-1 text-surface-600">
        <p className="text-xs">
          📅 {formatEventDateTimeEnhanced(event)}
        </p>
        
        {venueName && (
          <p className="text-xs">
            📍 {venueName}
            {venueAddress && venueCity && ` - ${venueAddress}, ${venueCity}`}
          </p>
        )}
        
        {event.attendee_count > 0 && (
          <p className="text-xs">
            👥 {event.attendee_count} interested
          </p>
        )}
        
        {!compact && event.event_description && (
          <p className="text-xs line-clamp-2 mt-2">
            {event.event_description}
          </p>
        )}
      </div>
      
      <button
        onClick={() => onViewDetails(event.id)}
        className={`mt-3 w-full bg-primary text-white py-1 px-3 rounded text-xs hover:bg-primary/90 transition-colors ${
          compact ? "py-1" : "py-2"
        }`}
      >
        View Details
      </button>
    </div>
  );
}