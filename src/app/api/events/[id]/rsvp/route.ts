import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { getCurrentUser, ensureUserExists } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Ensure user exists in database before creating RSVP
    await ensureUserExists(user);

    const { id } = await params;
    const eventInstanceId = parseInt(id);
    const { status, comment } = await request.json();

    // Validate status
    const validStatuses = ["going", "maybe", "not_going"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid RSVP status" },
        { status: 400 }
      );
    }

    // Get event instance with attendee limits
    const eventInstance = await prisma.event_instances.findUnique({
      where: { id: eventInstanceId },
      select: {
        max_attendees: true,
        current_attendees: true,
        allow_waitlist: true,
      },
    });

    if (!eventInstance) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Find existing RSVP using string user ID
    const existingRsvp = await prisma.event_attendees.findFirst({
      where: {
        instance_id: eventInstanceId,
        user_id: user.id, // Now using Clerk's string ID directly
      },
    });

    let result;
    let wasAddedToWaitlist = false;

    if (existingRsvp) {
      // Update existing RSVP
      const oldStatus = existingRsvp.response_status;

      result = await prisma.event_attendees.update({
        where: { id: existingRsvp.id },
        data: {
          response_status: status,
          comment: comment || existingRsvp.comment,
        },
      });

      // Update attendee count
      if (oldStatus === "going" && status !== "going") {
        // User was going, now isn't - decrease count
        await prisma.event_instances.update({
          where: { id: eventInstanceId },
          data: { current_attendees: { decrement: 1 } },
        });
      } else if (oldStatus !== "going" && status === "going") {
        // User wasn't going, now is - check capacity
        const maxAttendees = eventInstance.max_attendees;
        const currentAttendees = eventInstance.current_attendees || 0;

        if (maxAttendees && currentAttendees >= maxAttendees) {
          // Add to waitlist
          if (eventInstance.allow_waitlist) {
            const waitlistPosition = await prisma.event_waitlist.count({
              where: { event_instance_id: eventInstanceId },
            });

            await prisma.event_waitlist.upsert({
              where: {
                event_instance_id_user_id: {
                  event_instance_id: eventInstanceId,
                  user_id: user.id, // Using string ID
                },
              },
              create: {
                event_instance_id: eventInstanceId,
                user_id: user.id, // Using string ID
                waitlist_position: waitlistPosition + 1,
              },
              update: {
                waitlist_position: waitlistPosition + 1,
              },
            });
            wasAddedToWaitlist = true;
          } else {
            return NextResponse.json(
              {
                error: "Event is full and waitlist is not allowed",
              },
              { status: 400 }
            );
          }
        } else {
          // Increase count
          await prisma.event_instances.update({
            where: { id: eventInstanceId },
            data: { current_attendees: { increment: 1 } },
          });
        }
      }
    } else {
      // Create new RSVP
      const maxAttendees = eventInstance.max_attendees;
      const currentAttendees = eventInstance.current_attendees || 0;

      if (
        status === "going" &&
        maxAttendees &&
        currentAttendees >= maxAttendees
      ) {
        // Add to waitlist
        if (eventInstance.allow_waitlist) {
          const waitlistPosition = await prisma.event_waitlist.count({
            where: { event_instance_id: eventInstanceId },
          });

          await prisma.event_waitlist.create({
            data: {
              event_instance_id: eventInstanceId,
              user_id: user.id, // Using string ID
              waitlist_position: waitlistPosition + 1,
            },
          });
          wasAddedToWaitlist = true;
        } else {
          return NextResponse.json(
            {
              error: "Event is full and waitlist is not allowed",
            },
            { status: 400 }
          );
        }
      }

      result = await prisma.event_attendees.create({
        data: {
          instance_id: eventInstanceId,
          user_id: user.id, // Using string ID
          response_status: status,
          comment: comment || null,
        },
      });

      // Update attendee count if going and not on waitlist
      if (status === "going" && !wasAddedToWaitlist) {
        await prisma.event_instances.update({
          where: { id: eventInstanceId },
          data: { current_attendees: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({
      success: true,
      rsvp: result,
      waitlisted: wasAddedToWaitlist,
    });
  } catch (error) {
    console.error("RSVP Error:", error);
    return NextResponse.json(
      { error: "Failed to update RSVP" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const eventInstanceId = parseInt(id);

    const rsvp = await prisma.event_attendees.findFirst({
      where: {
        instance_id: eventInstanceId,
        user_id: user.id, // Using string ID
      },
    });

    return NextResponse.json({
      rsvp: rsvp || null,
    });
  } catch (error) {
    console.error("Get RSVP Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVP" },
      { status: 500 }
    );
  }
}
