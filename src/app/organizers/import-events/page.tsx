"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireRole } from '@/lib/auth-client';
import { organizerQueryKeys } from '@/features/organizers/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Sparkles, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ParsedEvent {
  title: string;
  description?: string;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  city?: string;
  state?: string;
  category?: string;
  price?: number;
  capacity?: number;
  confidence: number; // AI confidence in parsing
  issues?: string[]; // Missing or unclear information
}

export default function ImportEventsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoaded, hasPermission } = useRequireRole('organizer');
  
  const [inputText, setInputText] = useState('');
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([]);
  const [isParsingLoading, setIsParsingLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'review' | 'complete'>('input');

  // Parse events using AI
  const parseEventsMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/events/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, organizerId: user?.organizerId }),
      });
      
      if (!response.ok) throw new Error('Failed to parse events');
      return response.json();
    },
    onSuccess: (data) => {
      setParsedEvents(data.events || []);
      setCurrentStep('review');
    },
  });

  // Create events in batch
  const createEventsMutation = useMutation({
    mutationFn: async (events: ParsedEvent[]) => {
      const response = await fetch('/api/events/batch-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events, organizerId: user?.organizerId }),
      });
      
      if (!response.ok) throw new Error('Failed to create events');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizerQueryKeys.events(user?.organizerId || 0, 365)
      });
      setCurrentStep('complete');
    },
  });

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!hasPermission) {
    return <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-6">You need organizer privileges to import events.</p>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.push('/organizers')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Import Events</h1>
          <p className="text-gray-600">Paste event information and let AI create your events</p>
        </div>
      </div>

      {currentStep === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Paste Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Details (copy from websites, emails, documents, etc.)
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your event information here. Examples:

Concert: Jazz Night at Blue Note
Date: March 15, 2024 at 8:00 PM
Location: Blue Note Jazz Club, 131 W 3rd St, New York, NY
Tickets: $25-45

Workshop: Digital Marketing Basics
When: March 20, 2024, 2:00 PM - 5:00 PM  
Where: Tech Hub, 123 Innovation Ave, San Francisco, CA
Cost: $150, Limited to 30 people

Multiple events can be pasted at once..."
                className="min-h-[300px]"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => parseEventsMutation.mutate(inputText)}
                disabled={!inputText.trim() || parseEventsMutation.isPending}
                className="bg-primary-600 text-white"
              >
                {parseEventsMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Parsing Events...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Parse Events with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'review' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Review Parsed Events</h2>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('input')}>
                Edit Text
              </Button>
              <Button
                onClick={() => createEventsMutation.mutate(parsedEvents)}
                disabled={createEventsMutation.isPending}
                className="bg-primary-600 text-white"
              >
                {createEventsMutation.isPending ? 'Creating...' : `Create ${parsedEvents.length} Events`}
              </Button>
            </div>
          </div>

          {parsedEvents.map((event, index) => (
            <EventReviewCard 
              key={index} 
              event={event} 
              onUpdate={(updatedEvent) => {
                const updated = [...parsedEvents];
                updated[index] = updatedEvent;
                setParsedEvents(updated);
              }}
            />
          ))}
        </div>
      )}

      {currentStep === 'complete' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Events Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              {parsedEvents.length} events have been added to your dashboard.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => {
                setCurrentStep('input');
                setInputText('');
                setParsedEvents([]);
              }}>
                Import More Events
              </Button>
              <Button onClick={() => router.push('/organizers')}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Enhanced component for reviewing individual parsed events
function EventReviewCard({ event, onUpdate }: { 
  event: ParsedEvent; 
  onUpdate: (event: ParsedEvent) => void 
}) {
  const updateField = (field: keyof ParsedEvent, value: any) => {
    onUpdate({ ...event, [field]: value });
  };

  return (
    <Card className={`${event.confidence < 0.7 ? 'border-yellow-300' : 'border-green-300'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex-1">
            <Input
              value={event.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="text-lg font-semibold"
              placeholder="Event Title"
            />
          </CardTitle>
          <div className={`px-2 py-1 rounded text-sm ml-4 ${
            event.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
            event.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {Math.round(event.confidence * 100)}% confident
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Issues/Missing Information */}
        {event.issues && event.issues.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <h4 className="font-medium text-yellow-800 mb-2">Needs Attention:</h4>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              {event.issues.map((issue, i) => <li key={i}>{issue}</li>)}
            </ul>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={event.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Event description..."
            className="min-h-[80px]"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input
              type="date"
              value={event.start_date}
              onChange={(e) => updateField('start_date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <Input
              type="time"
              value={event.start_time || ''}
              onChange={(e) => updateField('start_time', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">End Date (if different)</label>
            <Input
              type="date"
              value={event.end_date || ''}
              onChange={(e) => updateField('end_date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <Input
              type="time"
              value={event.end_time || ''}
              onChange={(e) => updateField('end_time', e.target.value)}
            />
          </div>
        </div>

        {/* Venue Information */}
        <div className="space-y-3">
          <h4 className="font-medium">Venue Information</h4>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Venue Name</label>
              <Input
                value={event.venue_name || ''}
                onChange={(e) => updateField('venue_name', e.target.value)}
                placeholder="Venue name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                value={event.venue_address || ''}
                onChange={(e) => updateField('venue_address', e.target.value)}
                placeholder="Street address..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input
                  value={event.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="City..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <Input
                  value={event.state || ''}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="State..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              value={event.category || ''}
              onChange={(e) => updateField('category', e.target.value)}
              placeholder="e.g., Concert, Workshop..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <Input
              type="number"
              value={event.price || ''}
              onChange={(e) => updateField('price', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="0 for free"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <Input
              type="number"
              value={event.capacity || ''}
              onChange={(e) => updateField('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Max attendees"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}