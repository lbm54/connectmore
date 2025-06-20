// API functions for organizers
import type { Organizer, OrganizerWithStats, CreateOrganizerInput, UpdateOrganizerInput } from './models/organizer';
import type { OrganizerEventInstance, CreateEventInput, UpdateEventInput } from './models/organizer_event';
import type { Category, Tag } from './models/categories_tags';

// Organizer CRUD operations
export async function fetchOrganizerProfile(organizerId: number): Promise<OrganizerWithStats> {
  const res = await fetch(`/api/organizers/${organizerId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch organizer profile (${res.status})`);
  }
  return res.json();
}

export async function fetchOrganizerByAuthId(authUserId: string): Promise<Organizer | null> {
  const res = await fetch(`/api/organizers/by-auth/${authUserId}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch organizer by auth ID (${res.status})`);
  }
  return res.json();
}

export async function createOrganizer(input: CreateOrganizerInput): Promise<Organizer> {
  const res = await fetch('/api/organizers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to create organizer (${res.status})`);
  }
  return res.json();
}

export async function updateOrganizer(input: UpdateOrganizerInput): Promise<Organizer> {
  const res = await fetch(`/api/organizers/${input.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to update organizer (${res.status})`);
  }
  return res.json();
}

// Organizer Events
export async function fetchOrganizerEvents(organizerId: number, days = 365): Promise<OrganizerEventInstance[]> {
  const res = await fetch(`/api/organizers/${organizerId}/events?days=${days}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch organizer events (${res.status})`);
  }
  return res.json();
}

export async function createEvent(organizerId: number, input: CreateEventInput): Promise<OrganizerEventInstance> {
  const res = await fetch(`/api/organizers/${organizerId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to create event (${res.status})`);
  }
  return res.json();
}

export async function updateEvent(organizerId: number, input: UpdateEventInput): Promise<OrganizerEventInstance> {
  const res = await fetch(`/api/organizers/${organizerId}/events/${input.eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to update event (${res.status})`);
  }
  return res.json();
}

export async function deleteEvent(organizerId: number, eventId: number, deleteScope: 'instance' | 'all_instances' = 'instance', instanceId?: number): Promise<void> {
  const params = new URLSearchParams({
    deleteScope,
    ...(instanceId && { instanceId: instanceId.toString() })
  });
  
  const res = await fetch(`/api/organizers/${organizerId}/events/${eventId}?${params}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete event (${res.status})`);
  }
}

// Fetch categories with subcategories
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) {
    throw new Error(`Failed to fetch categories (${res.status})`);
  }
  return res.json();
}

// Fetch all tags
export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch('/api/tags');
  if (!res.ok) {
    throw new Error(`Failed to fetch tags (${res.status})`);
  }
  return res.json();
}

// Fetch public organizers list
export async function fetchOrganizersList(page = 1, limit = 24, search = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });
  
  const res = await fetch(`/api/organizers?${params}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch organizers list (${res.status})`);
  }
  return res.json();
}

// React Query cache keys
export const organizerQueryKeys = {
  all: ['organizers'] as const,
  list: (page: number, limit: number, search: string) => [...organizerQueryKeys.all, 'list', page, limit, search] as const,
  profile: (id: number) => [...organizerQueryKeys.all, 'profile', id] as const,
  byAuthId: (authId: string) => [...organizerQueryKeys.all, 'by-auth', authId] as const,
  events: (id: number, days: number) => [...organizerQueryKeys.all, id, 'events', days] as const,
  categories: ['categories'] as const,
  tags: ['tags'] as const,
}; 