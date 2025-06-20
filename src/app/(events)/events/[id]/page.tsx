// src/features/events/components/EventDetailPage.tsx
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, MessageCircle, Users, Clock, Calendar, MapPin } from "lucide-react";
import { 
  fetchEvents, 
  eventQueryKeys, 
  updateRsvp, 
  fetchRsvp, 
  fetchAttendees, 
  fetchComments, 
  createComment 
} from "@/features/events/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import type { FlatEventInstance } from "@/features/events/models/flat_event_instance";

// Pure formatting utils
import {
  formatEventDate,
  formatEventTime,
  formatEventAddress,
} from "@/features/events/utils/formatEventDateTime";

type Comment = {
  id: number;
  comment_text: string;
  created_at: string;
  users: {
    id: number;
    first_name?: string;
    last_name?: string;
    display_name?: string;
  };
  replies?: Comment[];
};

type AttendeesData = {
  going: Array<{
    id: number;
    response_status: string;
    users: {
      id: number;
      first_name?: string;
      last_name?: string;
      display_name?: string;
    };
  }>;
  maybe: Array<{
    id: number;
    response_status: string;
    users: {
      id: number;
      first_name?: string;
      last_name?: string;
      display_name?: string;
    };
  }>;
  not_going: Array<{
    id: number;
    response_status: string;
    users: {
      id: number;
      first_name?: string;
      last_name?: string;
      display_name?: string;
    };
  }>;
  counts: {
    going: number;
    maybe: number;
    not_going: number;
  };
};

function getUserDisplayName(user: { first_name?: string; last_name?: string; display_name?: string }) {
  if (!user) return "Anonymous";
  if (user.display_name) return user.display_name;
  if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
  if (user.first_name) return user.first_name;
  if (user.last_name) return user.last_name;
  return "Anonymous";
}

function getUserInitials(user: { first_name?: string; last_name?: string; display_name?: string }) {
  if (!user) return "AN";
  const name = getUserDisplayName(user);
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch all events using React Query
  const { data: events = [], isLoading, error } = useQuery<FlatEventInstance[], Error>({
    queryKey: eventQueryKeys.list(365),
    queryFn: () => fetchEvents(365),
    staleTime: 5 * 60_000, // 5 minutes
  });

  // Fetch user's RSVP status
  const { data: rsvpData } = useQuery({
    queryKey: eventQueryKeys.rsvp(eventId),
    queryFn: () => fetchRsvp(eventId),
    enabled: !!eventId,
  });

  // Fetch attendees
  const { data: attendeesData } = useQuery<AttendeesData>({
    queryKey: eventQueryKeys.attendees(eventId),
    queryFn: () => fetchAttendees(eventId),
    enabled: !!eventId,
  });

  // Fetch comments
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: eventQueryKeys.comments(eventId),
    queryFn: () => fetchComments(eventId),
    enabled: !!eventId,
  });

  // RSVP mutation
  const rsvpMutation = useMutation({
    mutationFn: ({ status, comment }: { status: string; comment?: string }) =>
      updateRsvp(eventId, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.rsvp(eventId) });
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.attendees(eventId) });
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.list(365) });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ commentText }: { commentText: string }) =>
      createComment(eventId, commentText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.comments(eventId) });
      setNewComment("");
      setIsSubmittingComment(false);
    },
    onError: () => {
      setIsSubmittingComment(false);
    },
  });

  // Find the specific event by ID
  const event = events.find(e => e.id === eventId);
  const userRsvp = rsvpData?.rsvp;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-muted-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>Failed to load event</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-muted-foreground">
        Event not found.
      </div>
    );
  }

  const start = event.start_datetime ?? event.instance_date ?? undefined;
  const eventDate = formatEventDate(start);
  const eventTime = formatEventTime(start);
  const address = formatEventAddress(event);

  const copyLink = () => navigator.clipboard.writeText(window.location.href);

  const handleRsvp = (status: string) => {
    rsvpMutation.mutate({ status });
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmittingComment(true);
    commentMutation.mutate({ commentText: newComment.trim() });
  };

  const hasAttendees = attendeesData && (
    attendeesData.counts.going > 0 || 
    attendeesData.counts.maybe > 0 || 
    attendeesData.counts.not_going > 0
  );

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold lg:text-5xl text-gradient-primary">
              {event.instance_name || event.event_name}
            </h1>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-electric-blue/20 text-electric-blue rounded-lg border border-electric-blue/30">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{eventDate}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-electric-green/20 text-electric-green rounded-lg border border-electric-green/30">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{eventTime}</span>
              </div>
            </div>
          </div>

          {event.organizer_name && (
            <div className="flex items-center gap-3 p-4 bg-primary-900/20 rounded-lg border border-primary-500/30">
              <p className="text-sm font-medium text-primary-300">
                Hosted by
              </p>
              <Avatar className="border-2 border-primary-400">
                {event.organizer_image_url ? (
                  <AvatarImage src={event.organizer_image_url} />
                ) : (
                  <AvatarFallback className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200">
                    {event.organizer_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-semibold text-primary-200">
                {event.organizer_name}
              </span>
            </div>
          )}

          {address && (
            <div className="flex items-center gap-3 p-3 bg-electric-orange/20 text-electric-orange rounded-lg border border-electric-orange/30">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{address}</span>
            </div>
          )}

          {/* RSVP Buttons with unified colors */}
          <div className="flex gap-3">
            <Button 
              onClick={() => handleRsvp("going")}
              disabled={rsvpMutation.isPending}
              variant={userRsvp?.response_status === "going" ? "default" : "outline"}
              className={userRsvp?.response_status === "going" 
                ? "bg-electric-green hover:bg-electric-green/80 text-black" 
                : "border-electric-green text-electric-green hover:bg-electric-green/20"
              }
            >
              {userRsvp?.response_status === "going" ? "Going ✓" : "I'm Going"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRsvp("maybe")}
              disabled={rsvpMutation.isPending}
              className={userRsvp?.response_status === "maybe" 
                ? "bg-electric-yellow text-black border-electric-yellow hover:bg-electric-yellow/80" 
                : "border-electric-yellow text-electric-yellow hover:bg-electric-yellow/20"
              }
            >
              {userRsvp?.response_status === "maybe" ? "Maybe ✓" : "Maybe"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRsvp("not_going")}
              disabled={rsvpMutation.isPending}
              className={userRsvp?.response_status === "not_going" 
                ? "bg-electric-red text-white border-electric-red hover:bg-electric-red/80" 
                : "border-electric-red text-electric-red hover:bg-electric-red/20"
              }
            >
              {userRsvp?.response_status === "not_going" ? "Can't Go ✓" : "Can't Go"}
            </Button>
          </div>

          {rsvpMutation.isError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {rsvpMutation.error?.message || "Failed to update RSVP"}
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            className="gap-2 p-0 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            onClick={copyLink}
          >
            <Copy className="h-4 w-4" /> Copy link
          </Button>
        </div>

        {(event.instance_image_address || event.event_image_address) && (
          <div className="relative h-64 w-full md:h-auto md:w-1/2 lg:w-2/5 overflow-hidden rounded-xl border-4 border-purple-300 dark:border-purple-600 shadow-lg">
            <Image
              src={event.instance_image_address || event.event_image_address || ''}
              alt={event.instance_name || event.event_name || "Event image"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Video Section - Prominently placed after hero */}
      {(event.instance_video_url || event.event_video_url) && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-300">Event Video</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border-4 border-purple-200 dark:border-purple-700 shadow-md">
            <iframe
              src={event.instance_video_url || event.event_video_url || ''}
              title="Event Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      )}

      {/* Event Description */}
      {(event.instance_description || event.event_description) && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold text-primary-300">About This Event</h2>
          <div className="p-6 border border-primary-500/30 rounded-lg bg-primary-900/10">
            <p className="prose max-w-none text-base leading-relaxed text-surface-300">
              {event.instance_description || event.event_description}
            </p>
          </div>
        </div>
      )}

      {/* Guest List - Only show if there are attendees */}
      {hasAttendees && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-300">Attendees</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  View all
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Event Attendees</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {attendeesData && attendeesData.counts.going > 0 && (
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">
                        Going ({attendeesData.counts.going})
                      </h4>
                      <div className="grid grid-cols-4 gap-4">
                        {attendeesData.going.map((attendee) => (
                          <div key={attendee.id} className="text-center">
                            <Avatar className="mx-auto mb-1 border-2 border-green-200 dark:border-green-600">
                              <AvatarFallback className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                                {getUserInitials(attendee.users)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-xs truncate">
                              {getUserDisplayName(attendee.users)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {attendeesData && attendeesData.counts.maybe > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                        Maybe ({attendeesData.counts.maybe})
                      </h4>
                      <div className="grid grid-cols-4 gap-4">
                        {attendeesData.maybe.map((attendee) => (
                          <div key={attendee.id} className="text-center">
                            <Avatar className="mx-auto mb-1 border-2 border-yellow-200 dark:border-yellow-600">
                              <AvatarFallback className="bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200">
                                {getUserInitials(attendee.users)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-xs truncate">
                              {getUserDisplayName(attendee.users)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* RSVP Summary */}
          <div className="flex flex-wrap gap-4 text-sm">
            {attendeesData && attendeesData.counts.going > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
                <Users className="h-4 w-4" />
                <span className="font-medium">{attendeesData.counts.going} going</span>
              </div>
            )}
            {attendeesData && attendeesData.counts.maybe > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{attendeesData.counts.maybe} maybe</span>
              </div>
            )}
          </div>

          {/* Attendee Avatars Preview */}
          <div className="flex -space-x-2">
            {attendeesData?.going.slice(0, 8).map((attendee) => (
              <Avatar key={attendee.id} className="border-2 border-white dark:border-gray-900 shadow-md">
                <AvatarFallback className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                  {getUserInitials(attendee.users)}
                </AvatarFallback>
              </Avatar>
            ))}
            {attendeesData && attendeesData.counts.going > 8 && (
              <Badge variant="secondary" className="ml-3 px-3 py-1 text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-600">
                +{attendeesData.counts.going - 8} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-10 space-y-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-secondary-400" />
          <h2 className="text-2xl font-semibold text-secondary-300">Discussion</h2>
          <Badge variant="secondary" className="bg-secondary-900/30 text-secondary-300 border border-secondary-500/30">
            {comments.length}
          </Badge>
        </div>

        {/* Add Comment */}
        <Card className="border-2 border-secondary-500/30 bg-gradient-to-br from-secondary-900/10 to-secondary-800/10">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Textarea 
                placeholder="Join the conversation..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmittingComment}
                className="border-secondary-500/30 focus:border-secondary-400 focus:ring-secondary-400 bg-surface-900/50"
              />
              <Button 
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isSubmittingComment}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-purple-600">
                    <AvatarFallback className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200">
                      {getUserInitials(comment.users)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {getUserDisplayName(comment.users)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.comment_text}</p>
              </CardContent>
            </Card>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-lg font-medium">No comments yet</p>
                <p className="text-sm">Start the discussion!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
