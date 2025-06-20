import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = {
      is_active: true, // Only show active venues
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    };

    // Get total count for pagination
    const total = await prisma.venues.count({ where });

    // Fetch venues with pagination
    const venues = await prisma.venues.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        address_line1: true,
        address_line2: true,
        city: true,
        state: true,
        zip: true,
        phone: true,
        email: true,
        website_url: true,
        capacity: true,
        parking_available: true,
        wheelchair_accessible: true,
        wifi_available: true,
        catering_available: true,
        av_equipment_available: true,
        image_url: true,
        _count: {
          select: {
            events: true,
            event_instances: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: limit,
    });

    // Filter out null/empty values from each venue
    const cleanedVenues = venues.map(venue => {
      const cleaned: Record<string, string | number | boolean> = { 
        id: venue.id, 
        name: venue.name,
        eventCount: venue._count.events + venue._count.event_instances,
      };
      
      if (venue.description) cleaned.description = venue.description;
      if (venue.address_line1) cleaned.address_line1 = venue.address_line1;
      if (venue.address_line2) cleaned.address_line2 = venue.address_line2;
      if (venue.city) cleaned.city = venue.city;
      if (venue.state) cleaned.state = venue.state;
      if (venue.zip) cleaned.zip = venue.zip;
      if (venue.phone) cleaned.phone = venue.phone;
      if (venue.email) cleaned.email = venue.email;
      if (venue.website_url) cleaned.website_url = venue.website_url;
      if (venue.capacity) cleaned.capacity = venue.capacity;
      if (venue.image_url) cleaned.image_url = venue.image_url;
      
      // Include amenities if they're true
      if (venue.parking_available) cleaned.parking_available = true;
      if (venue.wheelchair_accessible) cleaned.wheelchair_accessible = true;
      if (venue.wifi_available) cleaned.wifi_available = true;
      if (venue.catering_available) cleaned.catering_available = true;
      if (venue.av_equipment_available) cleaned.av_equipment_available = true;
      
      return cleaned;
    });

    return NextResponse.json({
      venues: cleanedVenues,
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
    console.error('Failed to fetch venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
} 