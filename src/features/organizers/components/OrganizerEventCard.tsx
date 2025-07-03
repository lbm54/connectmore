import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, MapPin, Edit, MoreHorizontal, Trash2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { OrganizerEventInstance } from '../models/organizer_event';
import { formatEventDate, formatEventTime, formatEventAddress } from '@/features/events/utils/formatEventDateTime';
import { deleteEvent } from '../api';

interface OrganizerEventCardProps {
  event: OrganizerEventInstance;
  isPast?: boolean;
  onEventDeleted?: () => void;
}

export default function OrganizerEventCard({ event, isPast = false, onEventDeleted }: OrganizerEventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    id, 
    event_id,
    instance_thumbnail_address, 
    event_thumbnail_address,
    instance_name, 
    event_name,
    start_datetime, 
    instance_date, 
    attendee_count,
    max_attendees,
    current_attendees,
    organizer_id,
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

  const handleDelete = async () => {
    if (!organizer_id || !event_id) return;
    
    setIsDeleting(true);
    try {
      await deleteEvent(organizer_id, event_id, 'instance', id);
      setShowDeleteDialog(false);
      onEventDeleted?.();
    } catch (error) {
      console.error('Failed to delete event:', error);
      // Could add toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`group overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/10 border-border/50 bg-card/95 backdrop-blur-sm ${isPast ? 'opacity-90 grayscale-[0.3]' : 'hover:border-border hover:-translate-y-0.5'}`}>
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          unoptimized
        />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Action buttons */}
        {!isPast && (
          <div className="absolute top-3 right-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-sm border border-white/50 backdrop-blur-sm"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-purple-950 backdrop-blur-md border-border shadow-2xl">
                <DialogTitle>Event Actions</DialogTitle>
                <div className="space-y-4">
                  <div className="space-y-2">
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
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Event
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-3 left-3">
          {isFull && !isPast && (
            <Badge className="bg-red-500/90 hover:bg-red-500 text-white shadow-sm">
              Sold Out
            </Badge>
          )}
          
          {isPast && (
            <Badge className="bg-gray-500/90 hover:bg-gray-500 text-white shadow-sm">
              Completed
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 text-foreground">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span>{eventDate} at {eventTime}</span>
          </div>
        </div>

        {venue && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{venue}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-background/98 backdrop-blur-md border-border shadow-2xl">
          <DialogTitle className="text-destructive">Delete Event Instance</DialogTitle>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this event instance? This action cannot be undone.
              All attendees and comments will be removed.
            </p>
            <div className="bg-muted/30 p-3 rounded-md border border-border/50">
              <p className="font-medium text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground">{eventDate} at {eventTime}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Event'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 