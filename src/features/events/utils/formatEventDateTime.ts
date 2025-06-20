// src/features/events/utils/formatEventDateTime.ts

import { FlatEventInstance } from "../models/flat_event_instance";

/** Format a JS date‑string or Date to "Weekday, Month Day" */
export function formatEventDate(start?: string | Date): string {
  if (!start) return "Date TBD";
  return new Date(start).toLocaleDateString(undefined, {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  });
}

/** Format a JS date‑string or Date to "h:mm AM/PM" */
export function formatEventTime(start?: string | Date): string {
  if (!start) return "";
  return new Date(start).toLocaleTimeString(undefined, {
    hour:   "numeric",
    minute: "2-digit",
  });
}

/** Build a single address string or use a custom venue name */
export function formatEventAddress(ev: FlatEventInstance): string {
  // ✅ INSTANCE FIRST - Check if instance has custom venue
  if (ev.instance_use_custom_venue && ev.instance_custom_venue_name) {
    return ev.instance_custom_venue_name;
  }
  
  // ✅ INSTANCE FIRST - Check if instance has location data
  const instanceLocation = [
    ev.instance_address,
    ev.instance_city, 
    ev.instance_state,
    ev.instance_zip,
  ].filter(Boolean);
  
  if (instanceLocation.length > 0) {
    return instanceLocation.join(", ");
  }
  
  // ✅ FALLBACK - Use event-level data
  if (ev.use_custom_venue && ev.custom_venue_name) {
    return ev.custom_venue_name;
  }
  
  return [
    ev.event_address,
    ev.event_city,
    ev.event_state,
    ev.event_zip,
  ].filter(Boolean).join(", ");
}


export function formatEventDateTime(
  startDateStr: string | null,
  startTimeStr: string | null,
  endTimeStr: string | null
) {
  // ---- helper to make a Date or return null
  const asDate = (input: string | null, base?: string) => {
    if (!input) return null;
    // if it already includes a T, trust it's ISO
    const iso = input.includes("T")
      ? input
      : base // treat as time only, add dummy date
      ? `${base}T${input}`
      : input; // maybe plain date
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  };

  // baseDay used to stitch times onto a date if needed
  const baseDay = startDateStr?.split("T")[0] ?? undefined;

  const startDate = asDate(startDateStr);
  const startTime = asDate(startTimeStr, baseDay);
  const endTime = asDate(endTimeStr, baseDay);

  if (!startDate) return "TBD";

  const dateFmt = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  });

  const timeFmt = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const datePart = dateFmt.format(startDate);

  if (!startTime) return datePart;
  const startPart = timeFmt.format(startTime);

  if (!endTime) return `${datePart} • ${startPart}`;

  const endPart = timeFmt.format(endTime);
  return `${datePart} • ${startPart} – ${endPart}`;
}

export function formatEventDateTimeEnhanced(event: FlatEventInstance): string {
  const {
    start_datetime,
    end_datetime,
    instance_date,
    start_time,
    end_time,
    instance_end_date,
    instance_start_time,
    instance_end_time
  } = event

  // Helper to create Date objects
  const createDate = (dateStr: string | null, timeStr: string | null = null): Date | null => {
    if (!dateStr) return null
    
    let isoString = dateStr
    if (timeStr && !dateStr.includes('T')) {
      // Combine date and time
      isoString = `${dateStr}T${timeStr}`
    }
    
    const date = new Date(isoString)
    return isNaN(date.getTime()) ? null : date
  }

  // Try to get start and end dates/times
  const startDate = createDate(start_datetime) || 
                   createDate(instance_date, instance_start_time || start_time)
  
  const endDate = createDate(end_datetime) || 
                 createDate(instance_end_date, instance_end_time || end_time)

  if (!startDate) return "Date TBD"

  // Format time helper - shows 6PM instead of 6:00PM, but 6:30PM for non-zero minutes
  const formatTime = (date: Date): string => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    
    if (minutes === 0) {
      return `${displayHours}${ampm}`
    }
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`
  }

  // Format the date part with day of week
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  }
  
  const startDateStr = startDate.toLocaleDateString(undefined, dateOptions)
  
  // If we only have start date, return just that
  if (!endDate) {
    return startDateStr
  }
  
  const endDateStr = endDate.toLocaleDateString(undefined, dateOptions)
  const startTimeStr = formatTime(startDate)
  const endTimeStr = formatTime(endDate)
  
  // Check if it's the same day
  const isSameDay = startDate.toDateString() === endDate.toDateString()
  
  if (isSameDay) {
    return `${startDateStr} • ${startTimeStr}–${endTimeStr}`
  } else {
    return `${startDateStr} ${startTimeStr} – ${endDateStr} ${endTimeStr}`
  }
}