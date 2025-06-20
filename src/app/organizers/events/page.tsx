"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRequireRole } from '@/lib/auth-client';
import { 
  fetchOrganizerEvents, 
  organizerQueryKeys,
  fetchCategories
} from '@/features/organizers/api';
import OrganizerEventCard from '@/features/organizers/components/OrganizerEventCard';

type FilterType = 'all' | 'upcoming' | 'past' | 'this-month' | 'this-week';
type SortType = 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc';

export default function AllEventsPage() {
  const { user } = useRequireRole('organizer');
  
  // State for filtering, searching, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('date-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 24;

  // Fetch data
  const { data: events = [], isLoading } = useQuery({
    queryKey: organizerQueryKeys.events(user?.organizerId || 0, 365),
    queryFn: () => fetchOrganizerEvents(user?.organizerId || 0, 365),
    enabled: !!user?.organizerId,
  });

  const { data: categories = [] } = useQuery({
    queryKey: organizerQueryKeys.categories,
    queryFn: fetchCategories,
  });

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = events;
    const now = new Date();

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.instance_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.instance_summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.instance_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(event => event.category_id === categoryFilter);
    }

    // Apply date filter
    switch (filter) {
      case 'upcoming':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_datetime || event.instance_date || '');
          return eventDate > now;
        });
        break;
      case 'past':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_datetime || event.instance_date || '');
          return eventDate <= now;
        });
        break;
      case 'this-month':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_datetime || event.instance_date || '');
          return eventDate.getMonth() === now.getMonth() && 
                 eventDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'this-week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_datetime || event.instance_date || '');
          return eventDate >= weekStart && eventDate <= weekEnd;
        });
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.start_datetime || a.instance_date || '').getTime() - 
                 new Date(b.start_datetime || b.instance_date || '').getTime();
        case 'date-desc':
          return new Date(b.start_datetime || b.instance_date || '').getTime() - 
                 new Date(a.start_datetime || a.instance_date || '').getTime();
        case 'name-asc':
          return (a.instance_name || '').localeCompare(b.instance_name || '');
        case 'name-desc':
          return (b.instance_name || '').localeCompare(a.instance_name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, filter, categoryFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter, categoryFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Events</h1>
          <p className="text-gray-600">
            {filteredEvents.length} of {events.length} events
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/organizers">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/organizers/create-event">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Events</option>
              <option value="this-month">This Month</option>
              <option value="this-week">This Week</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter || ''}
              onChange={(e) => setCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="date-asc">Date (Oldest First)</option>
              <option value="date-desc">Date (Newest First)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {paginatedEvents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No events found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' || categoryFilter
                ? 'Try adjusting your filters or search terms.'
                : 'Create your first event to get started.'
              }
            </p>
            {(!searchTerm && filter === 'all' && !categoryFilter) && (
              <Button className="mt-4" asChild>
                <Link href="/organizers/create-event">Create Event</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedEvents.map((event) => (
              <OrganizerEventCard 
                key={event.id} 
                event={event} 
                isPast={filter === 'past'}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * eventsPerPage + 1} to {Math.min(currentPage * eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 