import { QueryClient, dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { fetchEvents, eventQueryKeys } from "@/features/events/api";

export default async function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const daysAhead = 365; // Fetch more data for all pages

  // 1️⃣ Single SSR fetch for all event pages
  const queryClient = new QueryClient();

  // 2️⃣ Prefetch events once for all child pages
  await queryClient.prefetchQuery({
    queryKey: eventQueryKeys.list(daysAhead),
    queryFn: () => fetchEvents(daysAhead),
    staleTime: 5 * 60_000, // 5 minutes
  });

  // 3️⃣ Prefetch categories once for all child pages
  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    staleTime: 10 * 60_000,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {children}
    </HydrationBoundary>
  );
} 