// /api/organizers/[id] - Get and update specific organizer
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizerId = parseInt(params.id);
    
    // Only allow access to their own organizer profile
    if (user.organizerId !== organizerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch organizer with stats
    const organizer = await prisma.organizers.findUnique({
      where: { id: organizerId },
      include: {
        events: {
          include: {
            event_instances: {
              include: {
                event_attendees: true,
              },
            },
          },
        },
      },
    });

    if (!organizer) {
      return NextResponse.json({ error: 'Organizer not found' }, { status: 404 });
    }

    // Calculate stats
    const now = new Date();
    const upcomingEvents = organizer.events.filter(event => 
      event.event_instances.some(instance => 
        (instance.start_datetime && instance.start_datetime > now) ||
        (instance.instance_date && instance.instance_date > now)
      )
    );

    const totalAttendees = organizer.events.reduce((total, event) => 
      total + event.event_instances.reduce((eventTotal, instance) => 
        eventTotal + (instance.event_attendees?.length || 0), 0
      ), 0
    );

    const organizerWithStats = {
      ...organizer,
      totalEvents: organizer.events.length,
      totalUpcomingEvents: upcomingEvents.length,
      totalAttendees,
      recentActivity: organizer.updated_at?.toISOString() || '',
    };

    return NextResponse.json(organizerWithStats);
  } catch (error) {
    console.error('Failed to fetch organizer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizer' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizerId = parseInt(params.id);
    const body = await request.json();
    
    // Only allow updating their own organizer profile
    if (user.organizerId !== organizerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Update organizer
    const organizer = await prisma.organizers.update({
      where: { id: organizerId },
      data: {
        ...body,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(organizer);
  } catch (error) {
    console.error('Failed to update organizer:', error);
    return NextResponse.json(
      { error: 'Failed to update organizer' },
      { status: 500 }
    );
  }
} 