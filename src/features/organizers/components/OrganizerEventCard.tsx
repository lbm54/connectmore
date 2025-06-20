import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, MapPin, Edit, MoreHorizontal } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { OrganizerEventInstance } from '../models/organizer_event';
import { formatEventDate, formatEventTime, formatEventAddress } from '@/features/events/utils/formatEventDateTime';

interface OrganizerEventCardProps {
  event: OrganizerEventInstance;
  isPast?: boolean;
}

export default function OrganizerEventCard({ event, isPast = false }: OrganizerEventCardProps) {
  const {
    id, 
    event_id,
    instance_thumbnail_address, 
    event_thumbnail_address,
    instance_name, 
    event_name,
    start_datetime, 
    // start_time,
    // end_time,
    instance_date, 
    // event_address,
    // event_city,
    attendee_count,
    max_attendees,
    current_attendees,
  } = event;

  const imageSrc = instance_thumbnail_address || event_thumbnail_address || '/placeholder_event.svg';
  const eventDate = formatEventDate(start_datetime ?? instance_date ?? undefined);
  const eventTime = formatEventTime(start_datetime ?? instance_date ?? undefined);
  const title = instance_name || event_name || 'Untitled Event';
  const venue = formatEventAddress(event);
  
  const attendeeStats = current_attendees || attendee_count || 0;
  const capacity = max_attendees;
  const isFull = capacity && attendeeStats >= capacity;
  const fillRate = capacity ? Math.round((attendeeStats / capacity) * 100) : 0;

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isPast ? 'opacity-75' : ''}`}>
      <div className="relative h-48">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          unoptimized
        />
        {!isPast && (
          <div className="absolute top-3 right-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-black/50 hover:bg-black/70 text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-4">
                  <Button asChild className="w-full justify-start">
                    <Link href={`/organizers/edit-event/${event_id}?instanceId=${id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href={`/events/${id}`}>
                      View Public Page
                    </Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {isFull && !isPast && (
          <Badge className="absolute top-3 left-3 bg-red-500">
            Sold Out
          </Badge>
        )}
        
        {isPast && (
          <Badge className="absolute top-3 left-3 bg-gray-500">
            Completed
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Calendar className="h-4 w-4" />
            <span>{eventDate} at {eventTime}</span>
          </div>
        </div>

        {venue && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{venue}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>
              {attendeeStats} attendee{attendeeStats !== 1 ? 's' : ''}
              {capacity && ` / ${capacity}`}
            </span>
          </div>
          
          {capacity && !isPast && (
            <Badge variant={fillRate > 80 ? 'destructive' : fillRate > 50 ? 'default' : 'secondary'}>
              {fillRate}% full
            </Badge>
          )}
        </div>

        {!isPast && (
          <div className="flex gap-2 pt-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/organizers/edit-event/${event_id}?instanceId=${id}`}>
                Edit Event
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/events/${id}`}>
                View Public
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 