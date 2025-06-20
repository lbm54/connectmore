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
      <div className="flex items-center justify-between mb-6">
        <h2 className={getTitleClass()}>{title}</h2>

        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-primary hover:text-primary/80 text-sm md:text-base font-medium"
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
        {/* negative margin + padding keep the same horizontal gutters as before */}
        <CarouselContent className="-ml-4 md:-ml-6">
          {Array.isArray(children)
            ? children.map((child, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-4 mr-12 md:pl-6 basis-[16rem]" /* 16 rem cards overflow */
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
