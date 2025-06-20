import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined')
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Cache configuration
export const CACHE_CONFIG = {
  // TTL in seconds
  DEFAULT_TTL: 300, // 5 minutes
  EVENTS_TTL: 600,  // 10 minutes
  ORGANIZERS_TTL: 1800, // 30 minutes
  VENUES_TTL: 3600, // 1 hour
  CATEGORIES_TTL: 7200, // 2 hours
  TAGS_TTL: 7200, // 2 hours
} as const

// Cache key builders
export const buildCacheKey = {
  events: (filters?: Record<string, string | number | boolean | undefined>) => {
    const filterString = filters ? new URLSearchParams(filters as Record<string, string>).toString() : 'all'
    return `events:${filterString}`
  },
  event: (id: string) => `event:${id}`,
  eventAttendees: (id: string) => `event:${id}:attendees`,
  eventComments: (id: string) => `event:${id}:comments`,
  organizers: () => 'organizers:all',
  organizer: (id: string) => `organizer:${id}`,
  organizerEvents: (id: string) => `organizer:${id}:events`,
  venues: () => 'venues:all',
  venue: (id: string) => `venue:${id}`,
  categories: () => 'categories:all',
  tags: () => 'tags:all',
}

// Redis cache utilities
export const cacheUtils = {
  // Get from cache with JSON parsing
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key)
      return cached as T | null
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  },

  // Set cache with JSON stringification and TTL
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    try {
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, JSON.stringify(value))
      } else {
        await redis.set(key, JSON.stringify(value))
      }
      return true
    } catch (error) {
      console.error('Redis set error:', error)
      return false
    }
  },

  // Delete cache key
  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Redis del error:', error)
      return false
    }
  },

  // Delete multiple keys by pattern
  async delPattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      return true
    } catch (error) {
      console.error('Redis delPattern error:', error)
      return false
    }
  },

  // Cache with automatic invalidation
  async cacheWithTags<T>(
    key: string, 
    value: T, 
    ttlSeconds: number, 
    tags: string[]
  ): Promise<boolean> {
    try {
      // Set the main cache
      await this.set(key, value, ttlSeconds)
      
      // Associate with tags for batch invalidation
      for (const tag of tags) {
        await redis.sadd(`tag:${tag}`, key)
        await redis.expire(`tag:${tag}`, ttlSeconds)
      }
      
      return true
    } catch (error) {
      console.error('Redis cacheWithTags error:', error)
      return false
    }
  },

  // Invalidate by tag
  async invalidateByTag(tag: string): Promise<boolean> {
    try {
      const keys = await redis.smembers(`tag:${tag}`)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      await redis.del(`tag:${tag}`)
      return true
    } catch (error) {
      console.error('Redis invalidateByTag error:', error)
      return false
    }
  }
} 