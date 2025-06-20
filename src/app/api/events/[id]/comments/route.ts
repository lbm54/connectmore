import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getCurrentUser, ensureUserExists } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const eventInstanceId = parseInt(id);

    const comments = await prisma.event_comments.findMany({
      where: {
        instance_id: eventInstanceId,
        parent_id: null, // Only top-level comments
        is_deleted: false,
      },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            display_name: true,
          },
        },
        replies: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                display_name: true,
              },
            },
          },
          where: {
            is_deleted: false,
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(comments);

  } catch (error) {
    console.error('Get Comments Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Ensure user exists in database before creating comment
    await ensureUserExists(user);

    const { id } = await params;
    const eventInstanceId = parseInt(id);
    const { comment_text, parent_id } = await request.json();

    if (!comment_text?.trim()) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }

    // Verify event instance exists
    const eventInstance = await prisma.event_instances.findUnique({
      where: { id: eventInstanceId },
      select: { id: true },
    });

    if (!eventInstance) {
      return NextResponse.json({ error: 'Event instance not found' }, { status: 404 });
    }

    const comment = await prisma.event_comments.create({
      data: {
        instance_id: eventInstanceId,
        user_id: user.id, // Now using Clerk's string ID directly
        comment_text: comment_text.trim(),
        parent_id: parent_id || null,
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
    });

    return NextResponse.json(comment);

  } catch (error) {
    console.error('Create Comment Error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 