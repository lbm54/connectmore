import type { FlatEventInstance } from '@/features/events/models/flat_event_instance';

// Extended event instance type specifically for organizer dashboard
export type OrganizerEventInstance = FlatEventInstance & {
  // Additional organizer-specific fields
  totalRegistrations?: number;
  waitlistCount?: number;
  revenue?: number;
  lastUpdated?: string;
  
  // Additional computed fields for organizer dashboard
  registrationPercentage?: number;
  daysUntilEvent?: number;
  isUpcoming?: boolean;
  isPast?: boolean;
};

// Simplified form input (we'll convert to RRULE internally)
export type CreateEventInput = {
  // Event fields
  name: string;
  summary?: string;
  description?: string;
  categoryId?: number;
  subcategoryId?: number;
  thumbnailAddress?: string;
  imageAddress?: string;
  videoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  customVenueName?: string;
  useCustomVenue?: boolean;
  maxAttendees?: number;
  snippet?: string;
  html_link?: string;
  allowWaitlist?: boolean;
  
  // Instance fields
  startDateTime: string;
  endDateTime?: string;
  instanceDescription?: string;
  instanceName?: string;
  
  // Recurring event fields (will be converted to RRULE)
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceInterval?: number;
  recurrenceEndDate?: string;
  recurrenceDaysOfWeek?: number[];
  
  // Venue fields
  venueId?: number;
  instanceVenueId?: number;
  
  // Tag fields
  tagIds?: number[];
};

export type UpdateEventInput = Partial<CreateEventInput> & {
  eventId: number;
  instanceId?: number;
  updateScope?: 'instance' | 'all_instances' | 'future_instances';
  
  // Tag fields
  tagIds?: number[];
}; 