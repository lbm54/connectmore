// src/features/events/components/HomePageClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchEvents, eventQueryKeys } from "@/features/events/api";
import SuperFeaturedCarousel from "./SuperFeaturedCarousel";
import HorizontalEventList from "./HorizontalEventList";
import EventThumbnailCard from "./EventThumbnailCard";
import type { FlatEventInstance } from "../models/flat_event_instance";

export default function HomePageClient({ daysAhead }: { daysAhead: number }) {
  const router = useRouter();
  const { data: events = [], isLoading } = useQuery<FlatEventInstance[], Error>({
    queryKey: eventQueryKeys.list(daysAhead),
    queryFn: () => fetchEvents(daysAhead),
    staleTime: 5 * 60_000, // 5 minutes - matches your server prefetch
  });

  // categorize…
  const now = new Date();
  const weekOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcoming = events.filter((e) => {
    const d = new Date(e.start_datetime ?? e.instance_date ?? "");
    return d >= now && d <= weekOut;
  });
  const featured = events.filter(
    (e) => e.is_featured || (e.attendee_count ?? 0) > 50
  );
  const free = events.filter((e) =>
    e.tag_names?.some((t) => t.toLowerCase() === "free")
  );
  const rest = events.filter(
    (e) => !upcoming.includes(e) && !featured.includes(e) && !free.includes(e)
  );

  // Group featured events by category
  const eventsByCategory = featured.reduce((acc, event) => {
    const categoryName = event.category_name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(event);
    return acc;
  }, {} as Record<string, FlatEventInstance[]>);

  const handleViewAll = () => {
    router.push("/events");
  };

  return (
    <main className="min-h-screen bg-surface-900 text-white">
      <SuperFeaturedCarousel events={events} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          {/* <span className="ml-4">Loading amazing events…</span> */}
        </div>
      ) : (
        <section className="container mx-auto px-4 space-y-8 py-8 bg-surface-900">
          {Object.entries(eventsByCategory).map(([categoryName, categoryEvents]) => (
            <HorizontalEventList 
              key={categoryName}
              title={categoryName} 
              showViewAll 
              onViewAll={handleViewAll}
            >
              {categoryEvents.map((ev) => (
                <EventThumbnailCard key={ev.id} event={ev} />
              ))}
            </HorizontalEventList>
          ))}
          {/* {free.length > 0 && (
            <HorizontalEventList title="Free" showViewAll>
              {free.map((ev) => (
                <EventThumbnailCard key={ev.id} event={ev} />
              ))}
            </HorizontalEventList>
          )}
          {rest.length > 0 && (
            <HorizontalEventList title="More Events" showViewAll>
              {rest.map((ev) => (
                <EventThumbnailCard key={ev.id} event={ev} />
              ))}
            </HorizontalEventList>
          )} */}
        </section>
      )}
    </main>
  );
}
