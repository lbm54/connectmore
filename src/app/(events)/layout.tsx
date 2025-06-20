import { QueryClient, dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { PrismaClient } from '@/app/generated/prisma';
import { eventQueryKeys } from "@/features/events/api";

// Create a build-time data fetcher that calls the database directly
async function fetchEventsBuildTime(days: number = 365) {
  // Only create Prisma client if we have a database URL
  if (!process.env.DATABASE_URL) {
    console.warn('No DATABASE_URL found, skipping event prefetch');
    return [];
  }

  const prisma = new PrismaClient();
  try {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    const eventInstances = await prisma.event_instances.findMany({
      where: {
        OR: [
          { start_datetime: { gte: now, lte: futureDate } },
          { instance_date: { gte: now, lte: futureDate } }
        ]
      },
      include: {
        events: {
          include: {
            event_categories: true,
            event_subcategories: true,
            organizers: true,
            event_statuses: true,
            venues: true,
            events_flags: {
              include: { flags: true }
            },
            events_tags: {
              include: { tags: true }
            }
          }
        },
        venues: true,
        event_attendees: {
          include: { users: true }
        },
        event_instance_statuses: true
      },
      orderBy: [
        { start_datetime: 'asc' },
        { instance_date: 'asc' }
      ],
      take: 100 // Limit results during build to avoid timeouts
    });

    // Transform the data the same way your API does
    // (You'll need to copy the transformation logic from your API route)
    return eventInstances; // Simplified for now
  } catch (error) {
    console.error('Build-time database fetch failed:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

async function fetchCategoriesBuildTime() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const prisma = new PrismaClient();
  try {
    return await prisma.event_categories.findMany({
      include: {
        event_subcategories: {
          orderBy: { subcategory_name: 'asc' }
        }
      },
      orderBy: { category_name: 'asc' }
    });
  } catch (error) {
    console.error('Build-time categories fetch failed:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export default async function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  try {
    // During build: call database directly
    // During runtime: these will be overridden by client-side fetches
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
      // This is build time
      const [events, categories] = await Promise.all([
        fetchEventsBuildTime(90), // Reduced from 365
        fetchCategoriesBuildTime()
      ]);

      queryClient.setQueryData(eventQueryKeys.list({days: 90}), events);
      queryClient.setQueryData(['categories'], categories);
    }
  } catch (error) {
    console.warn('Build-time prefetch failed, continuing with empty cache:', error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {children}
    </HydrationBoundary>
  );
} 