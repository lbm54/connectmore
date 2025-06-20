// src/features/events/api.ts
import type { FlatEventInstance } from "./models/flat_event_instance";
import { invalidateServerCache } from "@/lib/reactQuery";

// Enhanced fetch functions with search and filter support
export async function fetchEvents(params: {
  days?: number;
  search?: string;
  tags?: string;
  date?: string;
  featured?: boolean;
  superFeatured?: boolean;
} = {}): Promise<FlatEventInstance[]> {
  const { 
    days = 90, 
    search = '', 
    tags = '', 
    date = 'all',
    featured = false,
    superFeatured = false 
  } = params;

  const urlParams = new URLSearchParams({
    days: days.toString(),
    ...(search && { search }),
    ...(tags && { tags }),
    ...(date !== 'all' && { date }),
    ...(featured && { featured: 'true' }),
    ...(superFeatured && { superFeatured: 'true' }),
  });

  const res = await fetch(`/api/events?${urlParams}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch events (${res.status})`);
  }
  return res.json();
}

export async function fetchFeaturedEvents(days = 90): Promise<FlatEventInstance[]> {
  return fetchEvents({ days, featured: true });
}

export async function fetchSuperFeaturedEvents(days = 90): Promise<FlatEventInstance[]> {
  return fetchEvents({ days, superFeatured: true });
}

// Enhanced RSVP function with cache invalidation
export async function updateRsvp(eventId: number, status: string, comment?: string) {
  const res = await fetch(`/api/events/${eventId}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, comment }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update RSVP');
  }

  // Invalidate relevant caches
  await invalidateServerCache('event', eventId.toString());
  
  return res.json();
}

export async function fetchRsvp(eventId: number) {
  const res = await fetch(`/api/events/${eventId}/rsvp`);
  if (!res.ok) {
    throw new Error('Failed to fetch RSVP');
  }
  return res.json();
}

export async function fetchAttendees(eventId: number) {
  const res = await fetch(`/api/events/${eventId}/attendees`);
  if (!res.ok) {
    throw new Error('Failed to fetch attendees');
  }
  return res.json();
}

export async function fetchComments(eventId: number) {
  const res = await fetch(`/api/events/${eventId}/comments`);
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  return res.json();
}

export async function createComment(eventId: number, commentText: string, parentId?: number) {
  const res = await fetch(`/api/events/${eventId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment_text: commentText, parent_id: parentId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create comment');
  }

  // Invalidate comments cache for this event
  await invalidateServerCache('event', eventId.toString());
  
  return res.json();
}

// Enhanced query keys with filter support
export const eventQueryKeys = {
  all: ['events'] as const,
  lists: () => [...eventQueryKeys.all, 'list'] as const,
  list: (params: {
    days?: number;
    search?: string;
    tags?: string;
    date?: string;
    featured?: boolean;
    superFeatured?: boolean;
  }) => [...eventQueryKeys.lists(), params] as const,
  featured: (days: number) => [...eventQueryKeys.all, 'featured', days] as const,
  superFeatured: (days: number) => [...eventQueryKeys.all, 'super-featured', days] as const,
  rsvp: (eventId: number) => [...eventQueryKeys.all, 'rsvp', eventId] as const,
  attendees: (eventId: number) => [...eventQueryKeys.all, 'attendees', eventId] as const,
  comments: (eventId: number) => [...eventQueryKeys.all, 'comments', eventId] as const,
};

// Hook for using events with React Query
export function useEvents(params: Parameters<typeof fetchEvents>[0] = {}) {
  return {
    queryKey: eventQueryKeys.list(params),
    queryFn: () => fetchEvents(params),
  };
}
