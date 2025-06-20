import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createRRule, generateInstancesFromRRule } from '@/features/organizers/utils/rrule';
import type { CreateEventInput } from '@/features/organizers/models/organizer_event';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const resolvedParams = await params;
    const organizerId = parseInt(resolvedParams.id);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // For now, let's be more permissive and just check if user exists
    // Later you can add proper organizer role checking
    console.log('User:', user);
    console.log('Requested organizer ID:', organizerId);

    const body: CreateEventInput = await request.json();
    console.log('Request body:', body);
    
    // Convert recurrence options to RRULE if recurring
    let rrule: string | null = null;
    if (body.isRecurring && body.recurrencePattern) {
      rrule = createRRule({
        pattern: body.recurrencePattern,
        interval: body.recurrenceInterval || 1,
        endDate: body.recurrenceEndDate,
        daysOfWeek: body.recurrenceDaysOfWeek,
      });
    }

    // Create the main event record (FIXED field mapping)
    const event = await prisma.events.create({
      data: {
        name: body.name,
        summary: body.summary,
        description: body.description,
        category_id: body.categoryId,
        subcategory_id: body.subcategoryId,
        thumbnail_address: body.thumbnailAddress,
        image_address: body.imageAddress,
        video_url: body.videoUrl,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        custom_venue_name: body.customVenueName,
        use_custom_venue: body.useCustomVenue,
        max_attendees: body.maxAttendees,
        snippet: body.snippet,
        organizer_id: organizerId,
        venue_id: body.venueId,
        
        // Recurring event fields
        is_recurring: body.isRecurring || false,
        recurrence: rrule,
        recurrence_end_date: body.recurrenceEndDate ? new Date(body.recurrenceEndDate) : null,
        instance_template_name: body.instanceName,
        instance_template_desc: body.instanceDescription,
        
        // Timestamps
        created: new Date(),
        updated: new Date(),
        start_datetime: new Date(body.startDateTime),
        end_datetime: body.endDateTime ? new Date(body.endDateTime) : null,
      },
    });

    console.log('Created event:', event);

    // Handle tags if provided
    if (body.tagIds && body.tagIds.length > 0) {
      await prisma.events_tags.createMany({
        data: body.tagIds.map(tagId => ({
          event_id: event.id,
          tag_id: tagId,
        })),
      });
    }

    // Generate event instances
    const instances = body.isRecurring && rrule 
      ? generateInstancesFromRRule({
          startDateTime: body.startDateTime,
          endDateTime: body.endDateTime,
          rrule,
        })
      : [{ startDateTime: body.startDateTime, endDateTime: body.endDateTime }];

    console.log('Generated instances:', instances);

    // Create event instances (FIXED field mapping)
    const createdInstances = [];
    for (const instance of instances) {
      const eventInstance = await prisma.event_instances.create({
        data: {
          event_id: event.id,
          start_datetime: new Date(instance.startDateTime),
          end_datetime: instance.endDateTime ? new Date(instance.endDateTime) : null,
          instance_date: new Date(instance.startDateTime), // Full datetime, not just date
          instance_name: body.instanceName,
          instance_description: body.instanceDescription,
          allow_waitlist: body.allowWaitlist ?? true,
          current_attendees: 0,
          max_attendees: body.maxAttendees,
          uses_event_name: !body.instanceName,
          uses_event_description: !body.instanceDescription,
          instance_venue_id: body.venueId || body.instanceVenueId,
        },
      });
      createdInstances.push(eventInstance);
    }

    console.log('Created instances:', createdInstances);

    return NextResponse.json({ 
      success: true, 
      event,
      instances: createdInstances,
      instancesCreated: createdInstances.length 
    });

  } catch (error) {
    console.error('Failed to create event:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to create event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Fix the GET method for fetching organizer events
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const resolvedParams = await params;
    const organizerId = parseInt(resolvedParams.id);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // const { searchParams } = new URL(request.url);
    // const days = parseInt(searchParams.get('days') || '365');
    
    // Get all events instead of just future ones
    const eventInstances = await prisma.event_instances.findMany({
      where: {
        events: {
          organizer_id: organizerId,
        },
      },
      include: {
        events: {
          include: {
            organizers: true,
            event_categories: true,
            event_subcategories: true,
            venues: true,
            events_tags: {
              include: {
                tags: true,
              },
            },
          },
        },
        venues: true,
        event_subcategories: true,
        event_instance_statuses: true,
      },
      orderBy: {
        start_datetime: 'asc',
      },
    });

    // Properly flatten the data to match FlatEventInstance type
    const transformedInstances = eventInstances.map(instance => ({
      // Event instance fields
      id: instance.id,
      event_id: instance.event_id,
      instance_date: instance.instance_date?.toISOString() || null,
      start_time: instance.start_time?.toString() || null,
      end_time: instance.end_time?.toString() || null,
      instance_end_date: instance.instance_end_date?.toISOString() || null,
      instance_html_link: instance.instance_html_link,
      instance_summary: instance.instance_summary,
      instance_description: instance.instance_description,
      instance_start_date: instance.instance_start_date?.toISOString() || null,
      instance_thumbnail_address: instance.instance_thumbnail_address,
      instance_image_address: instance.instance_image_address,
      instance_name: instance.instance_name,
      instance_venue_id: instance.instance_venue_id,
      instance_subcategory_id: instance.instance_subcategory_id,
      instance_start_time: instance.instance_start_time,
      instance_end_time: instance.instance_end_time,
      instance_video_url: instance.instance_video_url,
      start_datetime: instance.start_datetime?.toISOString() || null,
      end_datetime: instance.end_datetime?.toISOString() || null,
      current_attendees: instance.current_attendees,
      max_attendees: instance.max_attendees,
      allow_waitlist: instance.allow_waitlist,
      uses_event_name: instance.uses_event_name,
      uses_event_description: instance.uses_event_description,

      // Event fields (prefixed)
      event_name: instance.events?.name || null,
      event_summary: instance.events?.summary || null,
      event_description: instance.events?.description || null,
      event_html_link: instance.events?.html_link || null,
      event_thumbnail_address: instance.events?.thumbnail_address || null,
      event_image_address: instance.events?.image_address || null,
      event_video_url: instance.events?.video_url || null,
      event_address: instance.events?.address || null,
      event_city: instance.events?.city || null,
      event_state: instance.events?.state || null,
      event_zip: instance.events?.zip || null,
      event_start_datetime: instance.events?.start_datetime?.toISOString() || null,
      event_end_datetime: instance.events?.end_datetime?.toISOString() || null,
      is_featured: instance.events?.is_featured || null,
      is_super_featured: instance.events?.is_super_featured || null,
      is_checked: instance.events?.is_checked || null,
      importance: instance.events?.importance || null,
      custom_venue_name: instance.events?.custom_venue_name || null,
      use_custom_venue: instance.events?.use_custom_venue || null,
      snippet: instance.events?.snippet || null,
      is_recurring: instance.events?.is_recurring || null,
      recurrence: instance.events?.recurrence || null,
      recurrence_end_date: instance.events?.recurrence_end_date?.toISOString() || null,
      instance_template_name: instance.events?.instance_template_name || null,
      instance_template_desc: instance.events?.instance_template_desc || null,

      // Category fields
      category_id: instance.events?.category_id || null,
      category_name: instance.events?.event_categories?.category_name || null,
      subcategory_id: instance.events?.subcategory_id || null,
      subcategory_name: instance.events?.event_subcategories?.subcategory_name || null,

      // Organizer fields
      organizer_id: instance.events?.organizer_id || null,
      organizer_name: instance.events?.organizers?.name || null,
      organizer_image_url: instance.events?.organizers?.image_url || null,
      organizer_website_url: instance.events?.organizers?.website_url || null,

      // Venue fields
      venue_id: instance.events?.venue_id || null,
      venue_name: instance.events?.venues?.name || instance.venues?.name || null,

      // Computed fields
      attendee_count: instance.current_attendees || 0,
      flag_names: [], // TODO: Add if needed
      tag_names: instance.events?.events_tags?.map(et => et.tags.tag_name) || [],
      tag_ids: instance.events?.events_tags?.map(et => et.tags.id) || [],

      // Legacy compatibility fields
      eventName: instance.events?.name || null,
      eventSummary: instance.events?.summary || null,
      eventDescription: instance.events?.description || null,
    }));

    return NextResponse.json(transformedInstances);

  } catch (error) {
    console.error('Failed to fetch organizer events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 