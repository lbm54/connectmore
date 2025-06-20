"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { fetchEvents, eventQueryKeys } from '@/features/events/api';
import HorizontalEventList from './HorizontalEventList';
import EventThumbnailCard from './EventThumbnailCard';
import type { FlatEventInstance } from '../models/flat_event_instance';
import type { Category } from '@/features/organizers/models/categories_tags';

export default function EventsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Get filter values from URL
  const searchTerm = searchParams.get('search') || '';
  const dateFilter = searchParams.get('date') || 'all';
  const tagsFilter = searchParams.get('tags') || '';

  // Fetch events and categories
  const { data: events = [], isLoading: isLoadingEvents } = useQuery<FlatEventInstance[], Error>({
    queryKey: eventQueryKeys.list({ days: 365 }),
    queryFn: () => fetchEvents({ days: 365 }),
    staleTime: 5 * 60_000,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    staleTime: 10 * 60_000,
  });

  // Helper function to remove a filter parameter
  const removeFilter = (filterType: 'search' | 'date' | 'tags') => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterType);
    router.push(`/events?${params.toString()}`);
  };

  // Filter events based on URL parameters
  const filteredEvents = useMemo(() => {
    let filtered = events;
    const now = new Date();

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.event_name?.toLowerCase().includes(searchLower) ||
        event.event_summary?.toLowerCase().includes(searchLower) ||
        event.event_description?.toLowerCase().includes(searchLower) ||
        event.category_name?.toLowerCase().includes(searchLower) ||
        event.subcategory_name?.toLowerCase().includes(searchLower) ||
        event.tag_names?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply date filter
    switch (dateFilter) {
      case 'today':
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_datetime || event.instance_date || '');
          return eventDate >= todayStart && eventDate < todayEnd;
        });
        break;
      case 'this-week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_datetime || event.instance_date || '');
          return eventDate >= weekStart && eventDate < weekEnd;
        });
        break;
      case 'this-month':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_datetime || event.instance_date || '');
          return eventDate.getMonth() === now.getMonth() && 
                 eventDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_datetime || event.instance_date || '');
          return eventDate > now;
        });
        break;
    }

    // Apply tag filter
    if (tagsFilter) {
      const selectedTags = tagsFilter.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
      if (selectedTags.length > 0) {
        filtered = filtered.filter(event =>
          selectedTags.some(tag =>
            event.tag_names?.some(eventTag => eventTag.toLowerCase().includes(tag))
          )
        );
      }
    }

    // Apply category filter
    if (activeCategory !== 'all') {
      const selectedCategory = categories.find(cat => cat.id.toString() === activeCategory);
      if (selectedCategory) {
        filtered = filtered.filter(event => event.category_id === selectedCategory.id);
      }
    }

    return filtered;
  }, [events, searchTerm, dateFilter, tagsFilter, activeCategory, categories]);



  // Get active filters for pill display
  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm) {
      filters.push({ type: 'search', label: `Search: "${searchTerm}"`, value: searchTerm });
    }
    if (dateFilter && dateFilter !== 'all') {
      const dateLabels = {
        'today': 'Today',
        'this-week': 'This Week',
        'this-month': 'This Month',
        'upcoming': 'Upcoming'
      };
      filters.push({ 
        type: 'date', 
        label: `Date: ${dateLabels[dateFilter as keyof typeof dateLabels]}`, 
        value: dateFilter 
      });
    }
    if (tagsFilter) {
      const tags = tagsFilter.split(',').map(tag => tag.trim()).filter(Boolean);
      if (tags.length > 0) {
        filters.push({ 
          type: 'tags', 
          label: `Tags: ${tags.join(', ')}`, 
          value: tagsFilter 
        });
      }
    }
    return filters;
  };

  if (isLoadingEvents || isLoadingCategories) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <span className="ml-4">Loading events...</span>
      </div>
    );
  }

  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-6 mx-12 mt-4">
      {/* Active Filters Pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-surface-400 self-center mr-2">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-primary-500/20 border border-primary-500/30 text-primary-300 rounded-full text-sm"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => removeFilter(filter.type as 'search' | 'date' | 'tags')}
                className="text-primary-300 hover:text-primary-200 ml-1"
                aria-label={`Remove ${filter.type} filter`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mt-6">
        <div className="overflow-x-auto">
          <TabsList className="h-14 p-1 bg-surface-800 border border-surface-700 rounded-lg shadow-lg">
            <TabsTrigger 
              value="all" 
              className="relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-surface-700 text-surface-300 data-[state=active]:border-0"
            >
              All Events
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id.toString()} 
                className="relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:gradient-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-surface-700 text-surface-300 data-[state=active]:border-0"
              >
                {category.category_name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* All Events Tab */}
        <TabsContent value="all" className="mt-6">
          {activeCategory === 'all' ? (
            <div className="space-y-8">
              {categories.map(category => {
                const categoryEvents = filteredEvents.filter(event => event.category_id === category.id);
                
                if (categoryEvents.length === 0) {
                  return null; // Skip empty categories in "All Events" view
                }
                
                // Group by subcategory
                const subcategoryGroups = new Map<string, FlatEventInstance[]>();
                categoryEvents.forEach(event => {
                  const subcategoryKey = event.subcategory_name || 'Other';
                  if (!subcategoryGroups.has(subcategoryKey)) {
                    subcategoryGroups.set(subcategoryKey, []);
                  }
                  subcategoryGroups.get(subcategoryKey)!.push(event);
                });

                return (
                  <div key={category.id} className="space-y-6">
                    {Array.from(subcategoryGroups.entries()).map(([subcategory, subcategoryEvents]) => (
                      <HorizontalEventList
                        key={subcategory}
                        title={subcategory}
                        showViewAll={false}
                        titleSize="small"
                      >
                        {subcategoryEvents.slice(0, 10).map((event) => (
                          <EventThumbnailCard key={event.id} event={event} />
                        ))}
                      </HorizontalEventList>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : null}
        </TabsContent>

        {/* Individual Category Tabs */}
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id.toString()} className="">
            {activeCategory === category.id.toString() ? (
              <div className="space-y-6">
                {(() => {
                  const categoryEvents = filteredEvents.filter(event => event.category_id === category.id);
                  
                  if (categoryEvents.length === 0) {
                    return (
                      <div className="text-center py-20">
                        <div className="text-4xl mb-4">📅</div>
                        <h2 className="text-xl font-semibold text-surface-50 mb-2">
                          No events found in {category.category_name}
                        </h2>
                        <p className="text-surface-400">
                          There are currently no events in this category that match your filters.
                        </p>
                      </div>
                    );
                  }

                  // Group by subcategory
                  const subcategoryGroups = new Map<string, FlatEventInstance[]>();
                  categoryEvents.forEach(event => {
                    const subcategoryKey = event.subcategory_name || 'Other';
                    if (!subcategoryGroups.has(subcategoryKey)) {
                      subcategoryGroups.set(subcategoryKey, []);
                    }
                    subcategoryGroups.get(subcategoryKey)!.push(event);
                  });

                  return Array.from(subcategoryGroups.entries()).map(([subcategory, subcategoryEvents]) => (
                    <HorizontalEventList
                      key={subcategory}
                      title={subcategory}
                      showViewAll={false}
                      titleSize="small"
                    >
                      {subcategoryEvents.map((event) => (
                        <EventThumbnailCard key={event.id} event={event} />
                      ))}
                    </HorizontalEventList>
                  ));
                })()}
              </div>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>

      {/* No Results for All Events */}
      {activeCategory === 'all' && filteredEvents.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-2">
            No events found
          </h2>
          <p className="text-surface-600 dark:text-surface-400">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
} 