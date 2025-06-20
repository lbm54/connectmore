import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate params
    const { id } = await params; // Await params here
    const eventInstanceId = parseInt(id);
    const attendees = await prisma.event_attendees.findMany({
      where: {
        instance_id: eventInstanceId,
      },
      include: {
        users: {
          select: {
            userid: true,
            first_name: true,
            last_name: true,
            display_name: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    // Group by response status
    const going = attendees.filter(a => a.response_status === 'going');
    const maybe = attendees.filter(a => a.response_status === 'maybe');
    const notGoing = attendees.filter(a => a.response_status === 'not_going');

    return NextResponse.json({
      going,
      maybe,
      not_going: notGoing,
      total: attendees.length,
      counts: {
        going: going.length,
        maybe: maybe.length,
        not_going: notGoing.length,
      },
    });

  } catch (error) {
    console.error('Get Attendees Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    );
  }
} 