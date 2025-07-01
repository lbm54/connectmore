// src/features/events/components/HorizontalEventList.tsx
"use client";

import { ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "../../../components/ui/carousel";

interface HorizontalEventListProps {
  title: string;
  children: ReactNode; // expect a list of <EventThumbnailCard /> wrappers
  showViewAll?: boolean;
  onViewAll?: () => void;
  titleSize?: "small" | "medium" | "large";
}

export default function HorizontalEventList({
  title,
  children,
  showViewAll = true,
  onViewAll,
  titleSize = "large",
}: HorizontalEventListProps) {
  // Determine title class based on size
  const getTitleClass = () => {
    switch (titleSize) {
      case "small":
        return "text-lg md:text-xl font-bold";
      case "medium":
        return "text-xl md:text-2xl font-bold";
      case "large":
      default:
        return "text-2xl md:text-3xl font-bold";
    }
  };

  return (
    <section className="w-full py-6 bg-surface-900 text-white">
      {/* header */}
      <div className="flex items-center justify-between mb-6 px-4 md:px-0">
        <h2 className={getTitleClass()}>{title}</h2>

        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-primary hover:text-primary/80 text-sm md:text-base font-medium flex-shrink-0"
          >
            View all
          </button>
        )}
      </div>

      {/* carousel */}
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }} /* dragFree = smooth like ListView */
        className="w-full"
      >
        {/* Proper padding for mobile */}
        <CarouselContent className="-ml-2 md:-ml-4">
          {Array.isArray(children)
            ? children.map((child, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-2 md:pl-4 basis-[280px] md:basis-[320px] flex-shrink-0"
                >
                  {child}
                </CarouselItem>
              ))
            : children}
        </CarouselContent>

        {/* arrow buttons – comment out if you don't want them */}
        {/* <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" /> */}
      </Carousel>
    </section>
  );
}
