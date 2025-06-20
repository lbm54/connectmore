// src/features/events/components/SuperFeaturedCarousel.tsx
"use client";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { FlatEventInstance } from "@/features/events/models/flat_event_instance";

export default function SuperFeaturedCarousel({
  events,
}: {
  events: FlatEventInstance[];
}) {
  const items = events.filter((e) => e.is_super_featured);
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center w-full bg-surface-900">
        <span>Loading amazing events…</span>
      </div>
    );
  }

  return (
    <div className="superfeatured relative w-screen h-[70vh] md:h-[85vh] overflow-hidden">
      <Carousel
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
        opts={{ loop: true }}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {items.map((ev) => {
            const bg =
              ev.instance_image_address ||
              ev.event_image_address ||
              ev.instance_thumbnail_address ||
              ev.event_thumbnail_address;
            return (
              <CarouselItem key={ev.id} className="relative h-full">
                <Link href={`/events/${ev.id}`} className="block w-full h-full">
                  <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url(${bg})` }}
                  />
                  <div className="relative z-10 flex h-full flex-col justify-end p-6">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 max-w-2xl">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        {ev.instance_name || ev.eventName}
                      </h2>
                      {ev.snippet && (
                        <p className="text-lg md:text-xl text-white/95 line-clamp-3 leading-relaxed">
                          {ev.snippet}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
