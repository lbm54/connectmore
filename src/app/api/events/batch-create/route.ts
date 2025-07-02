import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createRRule, generateInstancesFromRRule } from '@/features/organizers/utils/rrule';
import type { CreateEventInput } from '@/features/organizers/models/organizer_event';

const prisma = new PrismaClient();

interface ParsedEvent {
  title: string;
  description?: string;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  city?: string;
  state?: string;
  category?: string;
  price?: number;
  capacity?: number;
  confidence: number;
  issues?: string[];
}

interface BatchCreateRequest {
  events: ParsedEvent[];
  organizerId: number;
}

// Helper function to convert ParsedEvent to CreateEventInput
function convertParsedEventToCreateInput(parsedEvent: ParsedEvent): CreateEventInput {
  // Combine date and time into datetime string
  const startDateTime = parsedEvent.start_time 
    ? `${parsedEvent.start_date}T${parsedEvent.start_time}:00`
    : `${parsedEvent.start_date}T09:00:00`; // Default to 9 AM if no time

  const endDateTime = parsedEvent.end_date && parsedEvent.end_time
    ? `${parsedEvent.end_date}T${parsedEvent.end_time}:00`
    : parsedEvent.start_time
    ? `${parsedEvent.start_date}T${addHours(parsedEvent.start_time, 2)}:00` // Default 2 hours duration
    : `${parsedEvent.start_date}T11:00:00`; // Default end time

  return {
    name: parsedEvent.title,
    description: parsedEvent.description,
    startDateTime,
    endDateTime,
    maxAttendees: parsedEvent.capacity,
    city: parsedEvent.city,
    state: parsedEvent.state,
    customVenueName: parsedEvent.venue_name,
    useCustomVenue: !!parsedEvent.venue_name,
    address: parsedEvent.venue_address,
    allowWaitlist: true,
    isRecurring: false, // Parsed events are typically one-time events
  };
}

// Helper function to add hours to a time string
function addHours(timeString: string, hours: number): string {
  const [h, m] = timeString.split(':').map(Number);
  const newHour = (h + hours) % 24;
  return `${newHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { events, organizerId }: BatchCreateRequest = await request.json();
    
    console.log('Batch creating events for organizer:', organizerId);
    console.log('Number of events to create:', events.length);

    const results = [];
    const errors = [];

    // Process each event
    for (let i = 0; i < events.length; i++) {
      const parsedEvent = events[i];
      
      try {
        console.log(`Creating event ${i + 1}/${events.length}:`, parsedEvent.title);

        // Convert parsed event to CreateEventInput format
        const eventInput = convertParsedEventToCreateInput(parsedEvent);
        
        // Create the main event record
        const event = await prisma.events.create({
          data: {
            name: eventInput.name,
            summary: eventInput.name, // Use title as summary if no separate summary
            description: eventInput.description,
            address: eventInput.address,
            city: eventInput.city,
            state: eventInput.state,
            custom_venue_name: eventInput.customVenueName,
            use_custom_venue: eventInput.useCustomVenue || false,
            max_attendees: eventInput.maxAttendees,
            organizer_id: organizerId,
            
            // Default values for required fields
            is_recurring: false,
            created: new Date(),
            updated: new Date(),
            start_datetime: new Date(eventInput.startDateTime),
            end_datetime: eventInput.endDateTime ? new Date(eventInput.endDateTime) : null,
          },
        });

        // Create the event instance
        const eventInstance = await prisma.event_instances.create({
          data: {
            event_id: event.id,
            start_datetime: new Date(eventInput.startDateTime),
            end_datetime: eventInput.endDateTime ? new Date(eventInput.endDateTime) : null,
            instance_date: new Date(eventInput.startDateTime),
            instance_name: eventInput.name,
            instance_description: eventInput.description,
            allow_waitlist: eventInput.allowWaitlist ?? true,
            current_attendees: 0,
            max_attendees: eventInput.maxAttendees,
            uses_event_name: true,
            uses_event_description: true,
          },
        });

        results.push({
          success: true,
          event,
          instance: eventInstance,
          originalIndex: i,
          originalEvent: parsedEvent,
        });

        console.log(`Successfully created event: ${event.name}`);

      } catch (eventError) {
        console.error(`Failed to create event ${i + 1}:`, eventError);
        errors.push({
          index: i,
          event: parsedEvent,
          error: eventError instanceof Error ? eventError.message : 'Unknown error',
        });
      }
    }

    // Invalidate cache for this organizer's events
    try {
      await fetch('/api/cache/invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'organizer-events', id: organizerId.toString() }),
      });
    } catch (cacheError) {
      console.warn('Failed to invalidate cache:', cacheError);
    }

    return NextResponse.json({
      success: true,
      created: results.length,
      failed: errors.length,
      total: events.length,
      results,
      errors,
    });

  } catch (error) {
    console.error('Batch create failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create events in batch', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 