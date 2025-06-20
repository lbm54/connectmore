import { cacheUtils, buildCacheKey, CACHE_CONFIG } from './redis'
export { buildCacheKey, CACHE_CONFIG }

// API cache wrapper
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = CACHE_CONFIG.DEFAULT_TTL,
  tags: string[] = []
): Promise<T> {
  // Try to get from cache first
  const cached = await cacheUtils.get<T>(key)
  if (cached !== null) {
    console.log(`Cache HIT for key: ${key}`)
    return cached
  }

  console.log(`Cache MISS for key: ${key}`)
  
  // If not in cache, fetch from API
  const data = await fetcher()
  
  // Cache the result
  if (tags.length > 0) {
    await cacheUtils.cacheWithTags(key, data, ttlSeconds, tags)
  } else {
    await cacheUtils.set(key, data, ttlSeconds)
  }
  
  return data
}

// Cache invalidation helpers
export const invalidateCache = {
  // Invalidate event-related caches
  async events() {
    await cacheUtils.delPattern('events:*')
    await cacheUtils.invalidateByTag('events')
  },

  async event(eventId: string) {
    await cacheUtils.del(buildCacheKey.event(eventId))
    await cacheUtils.del(buildCacheKey.eventAttendees(eventId))
    await cacheUtils.del(buildCacheKey.eventComments(eventId))
    await cacheUtils.invalidateByTag(`event:${eventId}`)
  },

  // Invalidate organizer-related caches
  async organizers() {
    await cacheUtils.delPattern('organizer*')
    await cacheUtils.invalidateByTag('organizers')
  },

  async organizer(organizerId: string) {
    await cacheUtils.del(buildCacheKey.organizer(organizerId))
    await cacheUtils.del(buildCacheKey.organizerEvents(organizerId))
    await cacheUtils.invalidateByTag(`organizer:${organizerId}`)
  },

  // Invalidate venue-related caches
  async venues() {
    await cacheUtils.delPattern('venue*')
    await cacheUtils.invalidateByTag('venues')
  },

  // Invalidate all caches (use sparingly)
  async all() {
    await cacheUtils.delPattern('*')
  }
} 