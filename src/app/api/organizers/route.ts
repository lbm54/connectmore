// /api/organizers - Create organizer and list organizers
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getCurrentUser } from '@/lib/auth';
import { clerkClient } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    // Get total count for pagination
    const total = await prisma.organizers.count({ where });

    // Fetch organizers with pagination
    const organizers = await prisma.organizers.findMany({
      where,
      select: {
        id: true,
        name: true,
        image_url: true,
        website_url: true,
        contact_phone: true,
        city: true,
        state: true,
        events_url: true,
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: limit,
    });

    // Filter out null/empty values from each organizer
    const cleanedOrganizers = organizers.map(organizer => {
      const cleaned: any = { id: organizer.id, name: organizer.name };
      
      if (organizer.image_url) cleaned.image_url = organizer.image_url;
      if (organizer.website_url) cleaned.website_url = organizer.website_url;
      if (organizer.contact_phone) cleaned.contact_phone = organizer.contact_phone;
      if (organizer.city) cleaned.city = organizer.city;
      if (organizer.state) cleaned.state = organizer.state;
      if (organizer.events_url) cleaned.events_url = organizer.events_url;
      
      return cleaned;
    });

    return NextResponse.json({
      organizers: cleanedOrganizers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Failed to fetch organizers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Create organizer profile
    const organizer = await prisma.organizers.create({
      data: {
        ...body,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Update Clerk metadata to link organizer - AWAIT the clerkClient instantiation
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...user,
        organizerId: organizer.id,
        role: 'organizer', // Promote to organizer role
      },
    });

    return NextResponse.json(organizer);
  } catch (error) {
    console.error('Failed to create organizer:', error);
    return NextResponse.json(
      { error: 'Failed to create organizer' },
      { status: 500 }
    );
  }
} 