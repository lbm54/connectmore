import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import css from "./EventThumbnailCard.module.css";
import { FlatEventInstance } from "../models/flat_event_instance";
import { formatEventDateTimeEnhanced, formatEventAddress } from "../utils/formatEventDateTime";

// Enhanced date formatting function

export default function EventThumbnailCard({
  event,
}: {
  event: FlatEventInstance;
}) {
  const {
    id,
    instance_thumbnail_address,
    event_thumbnail_address,
    instance_name,
    eventName,
    instance_summary,
    attendee_count,
    instance_description,
    event_description,
    organizer_name,
    category_name,
    subcategory_name,
    // venue_name,
    // custom_venue_name,
    // use_custom_venue,
    // instance_use_custom_venue,
    // instance_custom_venue_name,
    // instance_venue_name,
  } = event;

  const [thumbSrc, setThumbSrc] = useState(
    instance_thumbnail_address?.trim() ||
      event_thumbnail_address?.trim() ||
      "/placeholder_event.svg"
  );

  const date = formatEventDateTimeEnhanced(event);
  const title = (instance_name || eventName || "Untitled Event").toUpperCase();
  const venue = formatEventAddress(event);

  // Get the best available description
  const description =
    instance_description || event_description || "No description available";

  // Get venue name
  const venueName = event.instance_use_custom_venue 
    ? event.instance_custom_venue_name 
    : event.instance_venue_name || (event.use_custom_venue ? event.custom_venue_name : event.venue_name);

  return (
    <Link
      href={`/events/${id}`}
      className={`${css.card} flex flex-col bg-surface-200
                  transition hover:-translate-y-1 hover:shadow-xl group`}
    >
      {/* ---- Thumbnail ---- */}
      <div className={css.thumb}>
        <Image
          src={thumbSrc}
          fill
          alt={title}
          sizes="(min-width:768px) 224px, 90vw"
          className="object-cover"
          unoptimized
          onError={() => setThumbSrc("/placeholder-event.svg")}
        />

        {/* Enhanced date badge */}
        <span
          className="
          absolute left-3 top-3 rounded-full bg-accent text-white text-xs
          px-3 py-1 font-semibold shadow-lg max-w-[calc(100%-1.5rem)]
          leading-tight text-center
        "
        >
          {date}
        </span>

        {/* Description overlay on hover */}
        <div className={`${css.descriptionOverlay} text-white`}>
          <div className="text-center">
            <p className="text-sm leading-relaxed font-medium text-white">
              {description}
            </p>
          </div>
        </div>

        {instance_summary && (
          <div
            className={`${css.overlay} bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white`}
          >
            <p className="text-sm leading-relaxed font-medium">
              {instance_summary}
            </p>
          </div>
        )}
      </div>

      {/* ---- Meta ---- */}
      <div className="flex flex-col gap-3 p-4">
        <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary line-clamp-2 text-surface-900">
          {title}
        </h3>

        {/* Improved snippet styling - no quotes */}
        {event.snippet && (
          <p className="text-sm text-surface-600 leading-relaxed line-clamp-2 bg-surface-100 px-3 py-2 rounded-md">
            {event.snippet}
          </p>
        )}

        {/* Category info */}
        {(category_name || subcategory_name) && (
          <span className="text-xs text-primary font-medium">
            {subcategory_name || category_name}
          </span>
        )}

        {venue && (
          <p className="text-sm text-surface-700 line-clamp-1">📍 {venue}</p>
        )}

        {/* Organizer and venue name on same line */}
        {(organizer_name || venueName) && (
          <div className="flex items-center justify-between text-xs text-surface-600">
            {organizer_name && <span>by {organizer_name}</span>}
            {venueName && <span className="text-right">{venueName}</span>}
          </div>
        )}

        {!!attendee_count && (
          <div className="flex items-center gap-1 text-sm text-surface-700">
            <Star size={14} className="fill-current text-highlight" />
            {attendee_count} interested
          </div>
        )}
      </div>
    </Link>
  );
}
