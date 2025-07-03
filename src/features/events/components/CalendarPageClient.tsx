"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvents, eventQueryKeys } from "@/features/events/api";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use the same query pattern as HomePage
  const { data: events = [], isLoading, error } = useQuery<FlatEventInstance[], Error>({
    queryKey: eventQueryKeys.list({ days: daysAhead }),
    queryFn: () => fetchEvents({ days: daysAhead }),
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
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-surface-900 dark:text-surface-50">
          Calendar View
        </h1>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 lg:p-6 overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={isMobile ? {
            left: 'prev,next',
            center: 'title',
            right: 'today'
          } : {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={isMobile ? 1.0 : 1.8}
          // Mobile-specific options
          dayMaxEventRows={isMobile ? 2 : 4}
          moreLinkClick="popover"
          eventDisplay="block"
          // Responsive font sizes
          titleFormat={isMobile ? { month: 'short', year: 'numeric' } : { month: 'long', year: 'numeric' }}
        />
      </div>

      {/* Event Details Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 bg-surface-100 dark:bg-surface-800 rounded-lg p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {selectedEvent && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <Dialog.Title className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-50 pr-2 flex-1">
                    {selectedEvent.instance_name || selectedEvent.eventName || "Event Details"}
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 flex-shrink-0 p-1"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Date & Time */}
                  <div>
                    <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1 text-sm sm:text-base">
                      When
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400 text-sm">
                      {formatEventDateTimeEnhanced(selectedEvent)}
                    </p>
                  </div>

                  {/* Description */}
                  {(selectedEvent.instance_description || selectedEvent.event_description) && (
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1 text-sm sm:text-base">
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
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1 text-sm sm:text-base">
                        Location
                      </h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm break-words">
                        📍 {[selectedEvent.event_address, selectedEvent.event_city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Organizer */}
                  {selectedEvent.organizer_name && (
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1 text-sm sm:text-base">
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
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1 text-sm sm:text-base">
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
                      <h3 className="font-medium text-surface-900 dark:text-surface-50 mb-1 text-sm sm:text-base">
                        Category
                      </h3>
                      <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                        {selectedEvent.subcategory_name || selectedEvent.category_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => {
                      router.push(`/events/${selectedEvent.id}`);
                      closeModal();
                    }}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
                  >
                    View Full Details
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 transition-colors text-sm sm:text-base"
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