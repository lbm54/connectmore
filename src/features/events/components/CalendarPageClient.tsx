"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvents, eventQueryKeys } from "@/features/events/api";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { FlatEventInstance } from "../models/flat_event_instance";
import { formatEventDateTimeEnhanced } from "../utils/formatEventDateTime";
import type { EventClickArg } from '@fullcalendar/core';

// interface CalendarEvent {
//   id: string;
//   title: string;
//   start: string;
//   end?: string;
//   allDay?: boolean;
//   extendedProps: {
//     eventData: FlatEventInstance;
//   };
// }

export default function CalendarPageClient({ daysAhead }: { daysAhead: number }) {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<FlatEventInstance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the same query pattern as HomePage
  const { data: events = [], isLoading, error } = useQuery<FlatEventInstance[], Error>({
    queryKey: eventQueryKeys.list(daysAhead),
    queryFn: () => fetchEvents(daysAhead),
    staleTime: 5 * 60_000,
  });

  // Transform events for FullCalendar
  const calendarEvents = events
    .map(event => {
      const startDateStr = event.start_datetime ?? event.instance_date;
      if (!startDateStr) return null;

      const endDateStr = event.end_datetime ?? event.instance_end_date;
      const isAllDay = !startDateStr.includes('T');

      return {
        id: event.id.toString(),
        title: event.instance_name || event.event_name || "Untitled Event",
        start: startDateStr,
        end: endDateStr || undefined,
        allDay: isAllDay,
        extendedProps: {
          eventData: event,
        },
      };
    })
    .filter(event => event !== null);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventData = (clickInfo.event.extendedProps as { eventData: FlatEventInstance }).eventData;
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <span className="ml-4 text-surface-50">Loading calendar...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <span className="text-red-500">Error loading events: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-surface-900 dark:text-surface-50">
          Calendar View
        </h1>
        {/* <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">
          Showing {calendarEvents.length} events from {events.length} total
        </p> */}
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={1.8}
        />
      </div>

      {/* Event Details Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-surface-100 dark:bg-surface-800 rounded-lg p-6 shadow-xl">
            {selectedEvent && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <Dialog.Title className="text-xl font-semibold text-surface-900 dark:text-surface-50">
                    {selectedEvent.instance_name || selectedEvent.eventName || "Event Details"}
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Date & Time */}
                  <div>
                    <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1">
                      When
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400">
                      {formatEventDateTimeEnhanced(selectedEvent)}
                    </p>
                  </div>

                  {/* Description */}
                  {(selectedEvent.instance_description || selectedEvent.event_description) && (
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1">
                        Description
                      </h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                        {selectedEvent.instance_description || selectedEvent.event_description}
                      </p>
                    </div>
                  )}

                  {/* Location */}
                  {(selectedEvent.event_address || selectedEvent.event_city) && (
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1">
                        Location
                      </h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm">
                        📍 {[selectedEvent.event_address, selectedEvent.event_city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Organizer */}
                  {selectedEvent.organizer_name && (
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1">
                        Organizer
                      </h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm">
                        {selectedEvent.organizer_name}
                      </p>
                    </div>
                  )}

                  {/* Attendees */}
                  {selectedEvent.attendee_count && selectedEvent.attendee_count > 0 && (
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1">
                        Attendance
                      </h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm">
                        {selectedEvent.attendee_count} interested
                      </p>
                    </div>
                  )}

                  {/* Category */}
                  {selectedEvent.category_name && (
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1">
                        Category
                      </h3>
                      <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                        {selectedEvent.subcategory_name || selectedEvent.category_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      router.push(`/events/${selectedEvent.id}`);
                      closeModal();
                    }}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    View Full Details
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 