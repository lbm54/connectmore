import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getCurrentUser } from '@/lib/auth';
import type { UpdateEventInput } from '@/features/organizers/models/organizer_event';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const resolvedParams = await params;
    // const organizerId = parseInt(resolvedParams.id);
    const eventId = parseInt(resolvedParams.eventId);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body: UpdateEventInput = await request.json();
    console.log('Update request body:', body);

    // ✅ Handle different update scopes properly
    if (body.updateScope === 'instance' && body.instanceId) {
      // Update ONLY the specific instance - DO NOT touch the events table
      const instance = await prisma.event_instances.update({
        where: { id: body.instanceId },
        data: {
          // Existing fields
          instance_name: body.name || null,
          instance_summary: body.summary || null,
          instance_description: body.description || null,
          instance_thumbnail_address: body.thumbnailAddress || null,
          instance_image_address: body.imageAddress || null,
          instance_video_url: body.videoUrl || null,
          instance_html_link: body.html_link || null,
          start_datetime: body.startDateTime ? new Date(body.startDateTime) : null,
          end_datetime: body.endDateTime ? new Date(body.endDateTime) : null,
          allow_waitlist: body.allowWaitlist ?? null,
          max_attendees: body.maxAttendees || null,
          
          // ✅ NEW INSTANCE LOCATION FIELDS
          instance_address: body.address || null,
          instance_city: body.city || null,
          instance_state: body.state || null,
          instance_zip: body.zip || null,
          instance_custom_venue_name: body.customVenueName || null,
          instance_use_custom_venue: body.useCustomVenue ?? null,
          instance_snippet: body.snippet || null,
          
          // Venue handling
          instance_venue_id: body.useCustomVenue ? null : (body.venueId || null),
        },
      });

      console.log('Updated instance only:', instance);
      return NextResponse.json({ success: true, instance });
    } 
    else {
      // Update the main event record (for 'all_instances' or 'future_instances' or regular events)
      const event = await prisma.events.update({
        where: { id: eventId },
        data: {
          name: body.name,
          summary: body.summary,
          description: body.description,
          category_id: body.categoryId,
          subcategory_id: body.subcategoryId,
          thumbnail_address: body.thumbnailAddress,
          image_address: body.imageAddress,
          video_url: body.videoUrl,
          html_link: body.html_link,
          address: body.address,
          city: body.city,
          state: body.state,
          zip: body.zip,
          custom_venue_name: body.customVenueName,
          use_custom_venue: body.useCustomVenue,
          max_attendees: body.maxAttendees,
          snippet: body.snippet,
          venue_id: body.venueId,
          start_datetime: body.startDateTime ? new Date(body.startDateTime) : undefined,
          end_datetime: body.endDateTime ? new Date(body.endDateTime) : undefined,
          updated: new Date(),
        },
      });

      // Handle tags update for the event
      if (body.tagIds !== undefined) {
        await prisma.events_tags.deleteMany({
          where: { event_id: eventId },
        });

        if (body.tagIds && body.tagIds.length > 0) {
          await prisma.events_tags.createMany({
            data: body.tagIds.map(tagId => ({
              event_id: eventId,
              tag_id: tagId,
            })),
          });
        }
      }

      console.log('Updated event:', event);
      return NextResponse.json({ success: true, event });
    }

  } catch (error) {
    console.error('Failed to update event:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const resolvedParams = await params;
    const organizerId = parseInt(resolvedParams.id);
    const eventId = parseInt(resolvedParams.eventId);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deleteScope = searchParams.get('deleteScope') || 'instance';
    const instanceId = searchParams.get('instanceId');

    // Verify user owns this organizer
    const organizer = await prisma.organizers.findFirst({
      where: { 
        id: organizerId,
        // Add user verification here if needed
      },
    });

    if (!organizer) {
      return NextResponse.json({ error: 'Organizer not found' }, { status: 404 });
    }

    if (deleteScope === 'instance' && instanceId) {
      // Delete only the specific instance
      const instanceIdNum = parseInt(instanceId);
      
      // First, delete related records
      await prisma.event_attendees.deleteMany({
        where: { instance_id: instanceIdNum },
      });
      
      await prisma.event_comments.deleteMany({
        where: { instance_id: instanceIdNum },
      });
      
      await prisma.event_waitlist.deleteMany({
        where: { event_instance_id: instanceIdNum },
      });

      // Delete the instance
      await prisma.event_instances.delete({
        where: { id: instanceIdNum },
      });

      console.log(`Deleted event instance: ${instanceIdNum}`);
    } else {
      // Delete all instances and the main event
      const event = await prisma.events.findUnique({
        where: { id: eventId },
        include: { event_instances: true },
      });

      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }

      // Delete related records for all instances
      for (const instance of event.event_instances) {
        await prisma.event_attendees.deleteMany({
          where: { instance_id: instance.id },
        });
        
        await prisma.event_comments.deleteMany({
          where: { instance_id: instance.id },
        });
        
        await prisma.event_waitlist.deleteMany({
          where: { event_instance_id: instance.id },
        });
      }

      // Delete all instances
      await prisma.event_instances.deleteMany({
        where: { event_id: eventId },
      });

      // Delete event tags
      await prisma.events_tags.deleteMany({
        where: { event_id: eventId },
      });

      // Delete the main event
      await prisma.events.delete({
        where: { id: eventId },
      });

      console.log(`Deleted entire event: ${eventId}`);
    }

    // Invalidate cache
    try {
      await fetch('/api/cache/invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'organizer-events', id: organizerId.toString() }),
      });
    } catch (cacheError) {
      console.warn('Failed to invalidate cache:', cacheError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}