// API functions for venues

// Fetch public venues list
export async function fetchVenuesList(page = 1, limit = 24, search = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });
  
  const res = await fetch(`/api/venues?${params}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch venues list (${res.status})`);
  }
  return res.json();
}

// React Query cache keys
export const venueQueryKeys = {
  all: ['venues'] as const,
  list: (page: number, limit: number, search: string) => [...venueQueryKeys.all, 'list', page, limit, search] as const,
}; 