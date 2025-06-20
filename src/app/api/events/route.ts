// src/app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { withCache, buildCacheKey, CACHE_CONFIG } from '@/lib/apiCache';
// import prisma from '../../../../lib/prisma'; 

const prisma = new PrismaClient();

/**
 * GET /api/events
 * 
 * This file is called "route.ts" because it follows Next.js App Router conventions.
 * In Next.js 13+, any file named "route.ts" in the app directory becomes an API endpoint.
 * The folder structure determines the URL path:
 * - src/app/api/events/route.ts → accessible at /api/events
 * 
 * Query Parameters:
 * - days: number of days to look ahead (default: 90)
 * - featured: filter for featured events only (true/false)
 * - superFeatured: filter for super featured events only (true/false)
 * - search: search term for filtering events
 * - tags: comma-separated list of tags for filtering
 * - date: date filter (today, this-week, this-month, upcoming)
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '90');
    const featured = searchParams.get('featured') === 'true';
    const superFeatured = searchParams.get('superFeatured') === 'true';
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags') || '';
    const dateFilter = searchParams.get('date') || 'all';
    
    // Create filters object for cache key
    const filters = {
      days: days.toString(),
      featured: featured.toString(),
      superFeatured: superFeatured.toString(),
      search,
      tags,
      date: dateFilter
    };

    // Generate cache key based on filters
    const cacheKey = buildCacheKey.events(filters);

    // Wrap the database query with Redis cache
    const events = await withCache(
      cacheKey,
      async () => {
        // Calculate date range for filtering events
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);
        
        /**
         * Build the WHERE clause for the database query
         * 
         * This is a Prisma query filter object that tells the database which records to return.
         * Instead of using 'any', we'll use a more specific type that matches Prisma's expectations.
         */
        interface WhereClause {
          OR: Array<{
            start_datetime?: { gte: Date; lte: Date };
            instance_date?: { gte: Date; lte: Date };
          }>;
          events?: {
            OR?: Array<{
              is_featured?: boolean;
              is_super_featured?: boolean;
            }>;
            name?: { contains: string; mode: 'insensitive' };
            events_tags?: {
              some: {
                tags: {
                  tag_name: { in: string[] };
                };
              };
            };
          };
        }
        
        const whereClause: WhereClause = {
          /**
           * OR clause explanation:
           * In database queries, OR means "match records that satisfy ANY of these conditions"
           * (as opposed to AND which requires ALL conditions to be true)
           * 
           * Here we're saying: "Find event instances where EITHER:
           * 1. The start_datetime is between now and futureDate, OR
           * 2. The instance_date is between now and futureDate"
           * 
           * This handles events that might use different date fields for scheduling
           */
          OR: [
            { start_datetime: { gte: now, lte: futureDate } }, // gte = greater than or equal, lte = less than or equal
            { instance_date: { gte: now, lte: futureDate } }
          ]
        };
        
        /**
         * Add featured event filters if requested
         * This creates a nested OR condition within the related 'events' table
         */
        if (featured || superFeatured) {
          whereClause.events = {
            OR: []
          };
          
          // Add filter for regular featured events
          if (featured) {
            whereClause.events.OR!.push({ is_featured: true });
          }
          
          // Add filter for super featured events
          if (superFeatured) {
            whereClause.events.OR!.push({ is_super_featured: true });
          }
        }
        
        /**
         * Add search filter if provided
         */
        if (search.trim()) {
          if (!whereClause.events) {
            whereClause.events = {};
          }
          whereClause.events.name = {
            contains: search.trim(),
            mode: 'insensitive'
          };
        }
        
        /**
         * Add tag filters if provided
         */
        if (tags.trim()) {
          const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
          if (tagArray.length > 0) {
            if (!whereClause.events) {
              whereClause.events = {};
            }
            whereClause.events.events_tags = {
              some: {
                tags: {
                  tag_name: { in: tagArray }
                }
              }
            };
          }
        }
        
        /**
         * Execute the main database query
         * 
         * This queries the 'event_instances' table (which seems to represent specific occurrences of events)
         * and includes related data from multiple other tables using Prisma's 'include' feature.
         * 
         * The 'include' tells Prisma to also fetch related records from other tables:
         * - events: the main event details
         * - event_categories, event_subcategories: categorization
         * - organizers: who's organizing the event
         * - event_attendees: who's attending
         * - venues: venue location data
         * - flags and tags: additional metadata
         */
        const eventInstances = await prisma.event_instances.findMany({
          where: whereClause,
          include: {
            // Include the main event record and its related data
            events: {
              include: {
                event_categories: true,      // Category info (e.g., "Music", "Sports")
                event_subcategories: true,   // Subcategory info (e.g., "Rock Concert", "Basketball")
                organizers: true,            // Organizer details
                event_statuses: true,        // Event status (e.g., "Active", "Cancelled")
                venues: true,                // Include event venues (for events.venue_id)
                events_flags: {              // Special flags/labels for events
                  include: { flags: true }
                },
                events_tags: {               // Tags for categorization/search
                  include: { tags: true }
                }
              }
            },
            venues: true,                    // Include instance venues (for event_instances.instance_venue_id)
            event_attendees: {               // List of people attending this instance
              include: { users: true }
            },
            event_instance_statuses: true    // Status of this specific instance
          },
          // Sort results by date (earliest first)
          orderBy: [
            { start_datetime: 'asc' },
            { instance_date: 'asc' }
          ]
        });
        
        /**
         * Flatten the nested database structure into a simpler format for the frontend
         * 
         * The database returns a complex nested structure with related records.
         * This transforms it into a flat object that's easier for the frontend to consume.
         * Instead of having to access instance.events.name, the frontend can just use eventName.
         */
        const flattenedEvents = eventInstances.map(instance => ({
          // Event Instance fields
          id: instance.id,
          event_id: instance.event_id,
          start_datetime: instance.start_datetime,
          end_datetime: instance.end_datetime,
          instance_date: instance.instance_date,
          start_time: instance.start_time,
          end_time: instance.end_time,
          instance_summary: instance.instance_summary,
          instance_description: instance.instance_description,
          instance_name: instance.instance_name,
          instance_venue_id: instance.instance_venue_id,
          instance_html_link: instance.instance_html_link,
          instance_thumbnail_address: instance.instance_thumbnail_address,
          instance_image_address: instance.instance_image_address,
          instance_video_url: instance.instance_video_url,
          current_attendees: instance.current_attendees,
          max_attendees: instance.max_attendees,
          allow_waitlist: instance.allow_waitlist,
          uses_event_name: instance.uses_event_name,
          uses_event_description: instance.uses_event_description,
          
          // Event fields (use underscore naming to match type)
          event_name: instance.events?.name,
          event_summary: instance.events?.summary,
          event_description: instance.events?.description,
          event_html_link: instance.events?.html_link,
          event_thumbnail_address: instance.events?.thumbnail_address,
          event_image_address: instance.events?.image_address,
          event_video_url: instance.events?.video_url,
          event_address: instance.events?.address,
          event_city: instance.events?.city,
          event_state: instance.events?.state,
          event_zip: instance.events?.zip,
          event_start_datetime: instance.events?.start_datetime,
          event_end_datetime: instance.events?.end_datetime,
          is_featured: instance.events?.is_featured,
          is_super_featured: instance.events?.is_super_featured,
          is_checked: instance.events?.is_checked,
          importance: instance.events?.importance,
          custom_venue_name: instance.events?.custom_venue_name,
          use_custom_venue: instance.events?.use_custom_venue,
          snippet: instance.events?.snippet,
          is_recurring: instance.events?.is_recurring,
          recurrence: instance.events?.recurrence,
          recurrence_end_date: instance.events?.recurrence_end_date,
          instance_template_name: instance.events?.instance_template_name,
          instance_template_desc: instance.events?.instance_template_desc,
          
          // Category fields
          category_id: instance.events?.category_id,
          category_name: instance.events?.event_categories?.category_name,
          subcategory_id: instance.events?.subcategory_id,
          subcategory_name: instance.events?.event_subcategories?.subcategory_name,
          
          // Status fields
          event_status_id: instance.events?.status_id,
          event_status_name: instance.events?.event_statuses?.status_name,
          instance_status_id: instance.status_id,
          instance_status_name: instance.event_instance_statuses?.status_name,
          
          // Organizer fields
          organizer_id: instance.events?.organizer_id,
          organizer_name: instance.events?.organizers?.name,
          organizer_image_url: instance.events?.organizers?.image_url,
          organizer_website_url: instance.events?.organizers?.website_url,
          
          // Venue fields (from event's venue_id) - EXTENDED FOR MAP
          venue_id: instance.events?.venue_id,
          venue_name: instance.events?.venues?.name,
          venue_latitude: instance.events?.venues?.latitude?.toString(),
          venue_longitude: instance.events?.venues?.longitude?.toString(),
          venue_address: instance.events?.venues?.address_line1,
          venue_city: instance.events?.venues?.city,
          venue_state: instance.events?.venues?.state,
          
          // Instance venue fields (from instance's instance_venue_id)
          instance_venue_name: instance.venues?.name,
          instance_venue_latitude: instance.venues?.latitude?.toString(),
          instance_venue_longitude: instance.venues?.longitude?.toString(),
          instance_venue_address: instance.venues?.address_line1,
          instance_venue_city: instance.venues?.city,
          instance_venue_state: instance.venues?.state,
          
          // Computed fields
          attendee_count: instance.event_attendees?.length || 0,
          flag_names: instance.events?.events_flags?.map(ef => ef.flags.flag) || [],
          tag_names: instance.events?.events_tags?.map(et => et.tags.tag_name) || [],
          
          // Legacy compatibility fields (if needed)
          eventName: instance.events?.name,
          eventSummary: instance.events?.summary,
          eventDescription: instance.events?.description,
        }));

        return flattenedEvents;
      },
      CACHE_CONFIG.EVENTS_TTL, // 10 minutes cache
      ['events', 'event-instances'] // Cache tags for invalidation
    );
    
    // Return the cached or fresh events as JSON
    return NextResponse.json(events);
    
  } catch (error) {
    // Log the error for debugging and return a user-friendly error response
    console.error('Events API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}