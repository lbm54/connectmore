"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, TrendingUp, ArrowRight, Plus, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/lib/auth-client';
import { 
  fetchOrganizerEvents, 
  fetchOrganizerProfile,
  fetchOrganizersList,
  organizerQueryKeys 
} from '@/features/organizers/api';
import OrganizerEventCard from '@/features/organizers/components/OrganizerEventCard';
import PublicOrganizerCard from '@/features/organizers/components/PublicOrganizerCard';
import type { FlatEventInstance } from '@/features/events/models/flat_event_instance';

// Type definitions for better type safety
interface Organizer {
  id: number;
  name: string;
  image_url?: string | null;
  website_url?: string | null;
  contact_phone?: string | null;
  city?: string | null;
  state?: string | null;
  events_url?: string | null;
}

interface DashboardProps {
  user: {
    organizerId?: number;
    role?: string;
  };
  organizer: Organizer;
  events: FlatEventInstance[];
}

type PublicOrganizerType = {
  id: number;
  name: string;
  image_url?: string;
  website_url?: string;
  contact_phone?: string;
  city?: string;
  state?: string;
  events_url?: string;
};

// Component for public organizer list
function PublicOrganizersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const organizersPerPage = 24;

  const { data, isLoading } = useQuery({
    queryKey: organizerQueryKeys.list(currentPage, organizersPerPage, searchTerm),
    queryFn: () => fetchOrganizersList(currentPage, organizersPerPage, searchTerm),
  });

  const organizers = data?.organizers || [];
  const pagination = data?.pagination;

  return (
    <div className="w-full px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-surface-50">Event Organizers</h1>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search organizers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10 bg-surface-800 border-surface-700 text-surface-50 placeholder:text-surface-400"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : organizers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-surface-400">
            {searchTerm ? 'No organizers found matching your search.' : 'No organizers available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {organizers.map((organizer: PublicOrganizerType) => (
              <PublicOrganizerCard key={organizer.id} organizer={organizer} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="bg-surface-800 border-surface-700 text-surface-50 hover:bg-surface-700"
              >
                Previous
              </Button>
              
              <span className="text-sm text-surface-300">
                Page {pagination.page} of {pagination.totalPages} 
                ({pagination.total} total organizers)
              </span>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="bg-surface-800 border-surface-700 text-surface-50 hover:bg-surface-700"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Original dashboard component (extracted for clarity)
function OrganizerDashboard({ user, organizer, events }: DashboardProps) {
  // Loading state
  if (!user || !organizer) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Separate events by status
  const now = new Date();
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start_datetime || event.instance_date || '');
    return eventDate > now;
  }).slice(0, 20); // Increased from 6 to 20

  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.start_datetime || event.instance_date || '');
    return eventDate <= now;
  }).slice(0, 12); // Increased from 6 to 12

  const totalAttendees = events.reduce((total, event) => total + (event.attendee_count || 0), 0);
  const allUpcomingCount = events.filter(event => {
    const eventDate = new Date(event.start_datetime || event.instance_date || '');
    return eventDate > now;
  }).length;

  return (
    <div className="max-w-10xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="pr-12">
          <h1 className="text-3xl font-bold text-surface-50">Organizer Dashboard</h1>
          <p className="text-surface-300">Welcome back, {organizer.name}!</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="bg-surface-800 border-surface-700 text-surface-50 hover:bg-surface-700">
            <Link href="/organizers/events">
              <Calendar className="mr-2 h-4 w-4" />
              All Events
            </Link>
          </Button>
          {/* <Button variant="outline" asChild className="bg-surface-800 border-surface-700 text-surface-50 hover:bg-surface-700">
            <Link href="/organizers/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button> */}
          <Button asChild className="bg-primary-600 text-surface-50 hover:bg-primary-700">
            <Link href="/organizers/create-event">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-surface-800 border-surface-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-300">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-electric-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-surface-50">{events.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-800 border-surface-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-300">Upcoming Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-electric-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-surface-50">{allUpcomingCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-800 border-surface-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-300">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-electric-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-surface-50">{totalAttendees}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-800 border-surface-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-surface-300">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-electric-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-surface-50">
              {events.filter(event => {
                const eventDate = new Date(event.start_datetime || event.instance_date || '');
                const thisMonth = new Date();
                return eventDate.getMonth() === thisMonth.getMonth() && 
                       eventDate.getFullYear() === thisMonth.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-surface-50">Upcoming Events</h2>
          <Button variant="outline" asChild className="bg-surface-800 border-surface-700 text-surface-50 hover:bg-surface-700">
            <Link href="/organizers/events?filter=upcoming">
              View All ({allUpcomingCount})
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {upcomingEvents.length === 0 ? (
          <Card className="bg-surface-800 border-surface-700">
            <CardContent className="p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-surface-400" />
              <h3 className="mt-4 text-lg font-medium text-surface-50">No upcoming events</h3>
              <p className="text-surface-400">Create your first event to get started.</p>
              <Button className="mt-4 bg-primary-600 text-surface-50 hover:bg-primary-700" asChild>
                <Link href="/organizers/create-event">Create Event</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <OrganizerEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        
        {allUpcomingCount > 20 && (
          <div className="text-center pt-4">
            <p className="text-sm text-surface-400 mb-3">
              Showing {upcomingEvents.length} of {allUpcomingCount} upcoming events
            </p>
            <Button variant="outline" asChild className="bg-surface-800 border-surface-700 text-surface-50 hover:bg-surface-700">
              <Link href="/organizers/events?filter=upcoming">
                View All Upcoming Events
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recent Events */}
      {pastEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-surface-50">Recent Events</h2>
            <Button variant="outline" asChild className="bg-surface-800 border-surface-700 text-surface-50 hover:bg-surface-700">
              <Link href="/organizers/events?filter=past">
                View All Past Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pastEvents.map((event) => (
              <OrganizerEventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrganizersPage() {
  const { user, isLoaded } = useCurrentUser();
  
  const isOrganizer = user?.role === 'organizer' && user?.organizerId;

  // Fetch organizer profile and events only if user is an organizer
  const { data: organizer, isLoading: organizerLoading } = useQuery({
    queryKey: organizerQueryKeys.profile(user?.organizerId || 0),
    queryFn: () => fetchOrganizerProfile(user?.organizerId || 0),
    enabled: !!isOrganizer,
  });

  const { data: events = []} = useQuery({
    queryKey: organizerQueryKeys.events(user?.organizerId || 0, 365),
    queryFn: () => fetchOrganizerEvents(user?.organizerId || 0, 365),
    enabled: !!isOrganizer,
  });

  // Loading state for authenticated users
  if (!isLoaded || (isOrganizer && organizerLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Show dashboard if user is an authenticated organizer
  if (isOrganizer && organizer) {
    return <OrganizerDashboard user={user} organizer={organizer} events={events} />;
  }

  // Show public organizers list for everyone else
  return <PublicOrganizersList />;
} 