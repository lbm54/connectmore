"use client";

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireRole } from '@/lib/auth-client';
import { 
  fetchOrganizerEvents, 
  updateEvent, 
  organizerQueryKeys 
} from '@/features/organizers/api';
import EventForm from '@/features/organizers/components/EventForm';
import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UpdateEventInput } from '@/features/organizers/models/organizer_event';

export default function EditEventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const eventId = parseInt(params.id as string);
  const instanceId = searchParams.get('instanceId') ? parseInt(searchParams.get('instanceId')!) : undefined;
  
  const { user, isLoaded, hasPermission } = useRequireRole('organizer');

  // Fetch organizer events to find the specific event
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: organizerQueryKeys.events(user?.organizerId || 0, 365),
    queryFn: () => fetchOrganizerEvents(user?.organizerId || 0, 365),
    enabled: !!user?.organizerId,
  });

  const event = events.find(e => e.event_id === eventId);
  const instance = instanceId ? events.find(e => e.id === instanceId) : event;

  // ✅ ADD THIS - Extract tag IDs from the event data
  const initialTagIds = React.useMemo(() => {
    // Return empty array since tag_names are strings but tagIds expects numbers
    return [];
  }, [event]);

  const updateEventMutation = useMutation({
    mutationFn: (input: UpdateEventInput) => updateEvent(user?.organizerId || 0, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizerQueryKeys.events(user?.organizerId || 0, 365)
      });
      router.push('/organizers');
    },
  });

  // Loading state
  if (!isLoaded || eventsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Not authorized
  if (!hasPermission) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <Button onClick={() => router.push('/organizers')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // If this is a recurring event and we're editing a specific instance, show the edit scope dialog
  const isRecurringEvent = event.is_recurring || false;
  const isEditingInstance = !!instanceId;

  const prepareInitialData = () => {
    const formatDateTimeLocal = (dateTimeString: string | null) => {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toISOString().slice(0, 16);
    };

    const baseData = {
      // Basic event info - prioritize instance fields
      name: (isEditingInstance ? instance?.instance_name : null) || event.event_name || '',
      summary: (isEditingInstance ? instance?.instance_summary : null) || event.event_summary || '',
      description: (isEditingInstance ? instance?.instance_description : null) || event.event_description || '',
      snippet: (isEditingInstance ? instance?.instance_snippet : null) || event.snippet || '', // ✅ NOW INSTANCE-AWARE
      
      // Media fields - prioritize instance fields
      thumbnailAddress: (isEditingInstance ? instance?.instance_thumbnail_address : null) || event.event_thumbnail_address || '',
      imageAddress: (isEditingInstance ? instance?.instance_image_address : null) || event.event_image_address || '',
      videoUrl: (isEditingInstance ? instance?.instance_video_url : null) || event.event_video_url || '',
      html_link: (isEditingInstance ? instance?.instance_html_link : null) || event.event_html_link || '',
      
      // Category fields - categories are at event level only
      categoryId: event.category_id || undefined,
      subcategoryId: event.subcategory_id || undefined,
      
      // ✅ UPDATED LOCATION FIELDS - now instance-aware
      address: (isEditingInstance ? instance?.instance_address : null) || event.event_address || '',
      city: (isEditingInstance ? instance?.instance_city : null) || event.event_city || '',
      state: (isEditingInstance ? instance?.instance_state : null) || event.event_state || '',
      zip: (isEditingInstance ? instance?.instance_zip : null) || event.event_zip || '',
      venueId: (isEditingInstance ? instance?.instance_venue_id : null) || event.venue_id || undefined,
      useCustomVenue: (isEditingInstance ? instance?.instance_use_custom_venue : null) || event.use_custom_venue || false,
      customVenueName: (isEditingInstance ? instance?.instance_custom_venue_name : null) || event.custom_venue_name || '',
      
      // Date/time fields - prioritize instance datetime
      startDateTime: formatDateTimeLocal(instance?.start_datetime || event.event_start_datetime),
      endDateTime: formatDateTimeLocal(instance?.end_datetime || event.event_end_datetime),
      
      // Event settings - prioritize instance fields
      maxAttendees: (isEditingInstance ? instance?.max_attendees : null) || event.max_attendees || undefined,
      allowWaitlist: instance?.allow_waitlist ?? true,
      
      // Recurring event fields
      isRecurring: event.is_recurring || false,
      
      // Tags - at event level only (for now)
      tagIds: initialTagIds,
    };

    return baseData;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <EventForm
        mode="edit"
        eventId={eventId}
        instanceId={instanceId}
        isRecurringEvent={isRecurringEvent}
        isEditingInstance={isEditingInstance}
        initialData={prepareInitialData()}
        onSubmit={(data) => updateEventMutation.mutate(data as UpdateEventInput)}
        isLoading={updateEventMutation.isPending}
        submitButtonText="Update Event"
        onCancel={() => router.push('/organizers')}
      />
    </div>
  );
} 