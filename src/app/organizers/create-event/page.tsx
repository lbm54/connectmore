"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireRole } from '@/lib/auth-client';
import { createEvent, organizerQueryKeys } from '@/features/organizers/api';
import EventForm from '@/features/organizers/components/EventForm';
import type { CreateEventInput } from '@/features/organizers/models/organizer_event';

export default function CreateEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoaded, hasPermission } = useRequireRole('organizer');

  const createEventMutation = useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(user?.organizerId || 0, input),
    onSuccess: () => {
      // Invalidate and refetch organizer events
      queryClient.invalidateQueries({
        queryKey: organizerQueryKeys.events(user?.organizerId || 0, 365)
      });
      
      // Navigate to the created event or back to dashboard
      router.push(`/organizers`);
    },
    onError: (error) => {
      console.error('Failed to create event:', error);
    },
  });

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Not authorized
  if (!hasPermission) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You need organizer privileges to create events.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-gray-600">Fill out the details for your new event</p>
      </div> */}

      <EventForm
        onSubmit={(data) => createEventMutation.mutate(data as CreateEventInput)}
        isLoading={createEventMutation.isPending}
        submitButtonText="Create Event"
        onCancel={() => router.push('/organizers')}
      />
    </div>
  );
} 