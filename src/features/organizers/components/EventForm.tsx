"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
//   Video, 
  Users, 
//   Tag,
  Repeat,
  X,
  FolderOpen,
  Search
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
// import { Combobox, ComboboxOption } from '@/components/catalyst/combobox';
import type { CreateEventInput, UpdateEventInput } from '../models/organizer_event';
import { fetchCategories, fetchTags, organizerQueryKeys } from '../api';
// import type { Category, Tag } from '../models/categories_tags';

// Updated form validation schema
const eventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  summary: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.number({required_error: 'Category is required'}).min(1, 'Category is required'),
  subcategoryId: z.number({required_error: 'Subcategory is required'}).min(1, 'Subcategory is required'),
  thumbnailAddress: z.string().url().optional().or(z.literal('')),
  imageAddress: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  html_link: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  customVenueName: z.string().optional(),
  useCustomVenue: z.boolean(),
  maxAttendees: z.number().min(1).optional(),
  snippet: z.string().max(100).optional(),
  
  // Instance fields
  startDateTime: z.string().min(1, 'Start date and time is required'),
  endDateTime: z.string().optional(),
  instanceDescription: z.string().optional(),
  instanceName: z.string().optional(),
  allowWaitlist: z.boolean(),
  
  // Recurring event fields
  isRecurring: z.boolean(),
  recurrencePattern: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  recurrenceInterval: z.number().min(1).max(30).optional(),
  recurrenceEndDate: z.string().optional(),
  recurrenceDaysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  
  // Venue and tags
  venueId: z.number().optional(),
  tagIds: z.array(z.number()).optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  initialData?: Partial<CreateEventInput>;
  onSubmit: (data: CreateEventInput | UpdateEventInput) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  eventId?: number;
  instanceId?: number;
  isRecurringEvent?: boolean;
  isEditingInstance?: boolean;
}

export default function EventForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Event',
  onCancel,
  mode = 'create',
  eventId,
  instanceId,
  isRecurringEvent = false,
  isEditingInstance = false,
}: EventFormProps) {
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>(initialData?.tagIds || []);
  const [tagQuery, setTagQuery] = useState('');
  const [showEditScopeDialog, setShowEditScopeDialog] = useState(false);

  React.useEffect(() => {
    if (initialData?.tagIds) {
      setSelectedTags(initialData.tagIds);
    }
  }, [initialData?.tagIds]);

  // Fetch categories and tags
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: organizerQueryKeys.categories,
    queryFn: fetchCategories,
  });

  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: organizerQueryKeys.tags,
    queryFn: fetchTags,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      summary: initialData?.summary || '',
      description: initialData?.description || '',
      snippet: initialData?.snippet || '',
      startDateTime: initialData?.startDateTime || '',
      endDateTime: initialData?.endDateTime || '',
      maxAttendees: initialData?.maxAttendees || undefined,
      allowWaitlist: initialData?.allowWaitlist ?? true,
      useCustomVenue: initialData?.useCustomVenue ?? false,
      isRecurring: initialData?.isRecurring ?? false,
      recurrenceInterval: initialData?.recurrenceInterval || 1,
      recurrencePattern: initialData?.recurrencePattern,
      recurrenceEndDate: initialData?.recurrenceEndDate,
      recurrenceDaysOfWeek: initialData?.recurrenceDaysOfWeek || [],
      thumbnailAddress: initialData?.thumbnailAddress || '',
      imageAddress: initialData?.imageAddress || '',
      videoUrl: initialData?.videoUrl || '',
      html_link: initialData?.html_link || '',
      categoryId: initialData?.categoryId,
      subcategoryId: initialData?.subcategoryId,
      venueId: initialData?.venueId,
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zip: initialData?.zip || '',
      customVenueName: initialData?.customVenueName || '',
      tagIds: selectedTags,
    },
  });

  const watchIsRecurring = watch('isRecurring');
  const watchUseCustomVenue = watch('useCustomVenue');
  const watchRecurrencePattern = watch('recurrencePattern');
  const watchCategoryId = watch('categoryId');

  // Get subcategories for selected category
  const selectedCategory = categories.find(cat => cat.id === watchCategoryId);
  const subcategories = selectedCategory?.event_subcategories || [];

  // Filter available tags based on query and exclude already selected
  const availableTags = tags.filter(tag => 
    !selectedTags.includes(tag.id) && 
    tag.tag_name.toLowerCase().includes(tagQuery.toLowerCase())
  );

  const handleTagSelect = (tagId: number) => {
    setSelectedTags(prev => [...prev, tagId]);
    setTagQuery('');
  };

  const handleTagRemove = (tagId: number) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const onFormSubmit = (data: EventFormData, updateScope?: 'instance' | 'all_instances' | 'future_instances') => {
    const submitData: CreateEventInput | UpdateEventInput = {
      ...data,
      tagIds: selectedTags,
    };

    if (mode === 'edit' && eventId) {
      (submitData as UpdateEventInput).eventId = eventId;
      if (instanceId) {
        (submitData as UpdateEventInput).instanceId = instanceId;
      }
      if (updateScope) {
        (submitData as UpdateEventInput).updateScope = updateScope;
      }
    }

    onSubmit(submitData);
  };

  const handleRecurringEventSubmit = (updateScope: 'instance' | 'all_instances' | 'future_instances') => {
    const formData = watch(); // Get current form data
    onFormSubmit(formData as EventFormData, updateScope);
    setShowEditScopeDialog(false);
  };

  // Calculate end date/time based on start date if not provided
  const calculateEndDateTime = (startDateTime: string) => {
    if (!startDateTime) return '';
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
    return end.toISOString().slice(0, 16); // Format for datetime-local input
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {mode === 'create' ? 'Create New Event' : 'Edit Event'}
        </h1>
        <p className="text-gray-400 dark:text-gray-300">
          Fill out the details for your {mode === 'create' ? 'new' : ''} event
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Two column layout on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Basic Event Information - Purple Theme */}
            <Card className="bg-gradient-to-r from-primary-900/30 to-primary-800/30 border-primary-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-300">
                  <Calendar className="h-5 w-5 text-primary-400" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Name *</label>
                    <Input
                      {...register('name')}
                      placeholder="Enter event name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Snippet (max 100 chars)
                    </label>
                    <Input
                      {...register('snippet')}
                      placeholder="Brief, catchy description for the event card"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      {...register('description')}
                      placeholder="Detailed event description"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories & Tags - Cyan Theme */}
            <Card className="bg-gradient-to-r from-secondary-900/30 to-secondary-800/30 border-secondary-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-secondary-300">
                  <FolderOpen className="h-5 w-5 text-secondary-400" />
                  Category & Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                          disabled={categoriesLoading}
                        >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Subcategory *</label>
                    <Controller
                      name="subcategoryId"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 ${errors.subcategoryId ? 'border-red-500' : 'border-gray-300'}`}
                          disabled={!watchCategoryId || subcategories.length === 0}
                        >
                          <option value="">Select subcategory</option>
                          {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.subcategory_name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.subcategoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.subcategoryId.message}</p>
                    )}
                  </div>
                </div>

                {/* Tags Multiselect */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  {tagsLoading ? (
                    <p className="text-sm text-gray-500">Loading tags...</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={tagQuery}
                          onChange={(e) => setTagQuery(e.target.value)}
                          placeholder="Search and select tags..."
                          className="pl-10"
                        />
                        {tagQuery && availableTags.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {availableTags.slice(0, 10).map((tag) => (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleTagSelect(tag.id)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                              >
                                {tag.tag_name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Selected Tags Display */}
                      {selectedTags.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Selected Tags:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tagId) => {
                              const tag = tags.find(t => t.id === tagId);
                              return tag ? (
                                <Badge key={tagId} variant="secondary" className="flex items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                  {tag.tag_name}
                                  <button
                                    type="button"
                                    onClick={() => handleTagRemove(tagId)}
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Media - Pink Theme */}
            <Card className="bg-gradient-to-r from-pink-900/30 to-pink-800/30 border-electric-pink/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electric-pink">
                  <ImageIcon className="h-5 w-5 text-electric-pink" />
                  Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail Image URL</label>
                  <Input
                    {...register('thumbnailAddress')}
                    placeholder="https://example.com/thumbnail.jpg"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Event Image URL</label>
                  <Input
                    {...register('imageAddress')}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Video URL</label>
                  <Input
                    {...register('videoUrl')}
                    placeholder="https://youtube.com/watch?v=..."
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Date and Time - Yellow/Green Theme */}
            <Card className="bg-gradient-to-r from-yellow-900/30 to-green-900/30 border-electric-yellow/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electric-yellow">
                  <Clock className="h-5 w-5 text-electric-yellow" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-white bg-amber-600 rounded p-1" />
                      Start Date & Time *
                    </label>
                    <Input
                      type="datetime-local"
                      {...register('startDateTime')}
                      className={errors.startDateTime ? 'border-red-500' : ''}
                    />
                    {errors.startDateTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.startDateTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-white bg-amber-600 rounded p-1" />
                      End Date & Time
                    </label>
                    <Input
                      type="datetime-local"
                      {...register('endDateTime')}
                      placeholder={calculateEndDateTime(watch('startDateTime'))}
                    />
                  </div>
                </div>

                {/* Recurring Events */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('isRecurring')}
                    id="isRecurring"
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium">
                    Recurring Event
                  </label>
                </div>

                {watchIsRecurring && (
                  <Dialog open={showRecurrenceDialog} onOpenChange={setShowRecurrenceDialog}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="flex items-center gap-2">
                        <Repeat className="h-4 w-4" />
                        Configure Recurrence
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Recurrence Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Repeat</label>
                          <Controller
                            name="recurrencePattern"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="">Select pattern</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                              </select>
                            )}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Every</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              {...register('recurrenceInterval', { valueAsNumber: true })}
                              min={1}
                              max={30}
                              defaultValue={1}
                              className="w-20"
                            />
                            <span className="text-sm text-gray-600">
                              {watchRecurrencePattern === 'daily' && 'days'}
                              {watchRecurrencePattern === 'weekly' && 'weeks'}
                              {watchRecurrencePattern === 'monthly' && 'months'}
                              {watchRecurrencePattern === 'yearly' && 'years'}
                            </span>
                          </div>
                        </div>

                        {watchRecurrencePattern === 'weekly' && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Days of Week</label>
                            <div className="flex flex-wrap gap-2">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <label key={day} className="flex items-center gap-1">
                                  <Controller
                                    name="recurrenceDaysOfWeek"
                                    control={control}
                                    render={({ field }) => (
                                      <input
                                        type="checkbox"
                                        checked={field.value?.includes(index) || false}
                                        onChange={(e) => {
                                          const current = field.value || [];
                                          if (e.target.checked) {
                                            field.onChange([...current, index]);
                                          } else {
                                            field.onChange(current.filter(d => d !== index));
                                          }
                                        }}
                                      />
                                    )}
                                  />
                                  <span className="text-sm">{day}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium mb-1">End Date</label>
                          <Input
                            type="date"
                            {...register('recurrenceEndDate')}
                          />
                        </div>

                        <Button 
                          type="button" 
                          onClick={() => setShowRecurrenceDialog(false)}
                          className="w-full"
                        >
                          Done
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>

            {/* Location - Red Theme */}
            <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-electric-red/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electric-red">
                  <MapPin className="h-5 w-5 text-electric-red" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Venue</label>
                  <Controller
                    name="venueId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="">Select a venue</option>
                        <option value="1">Innovation Depot</option>
                      </select>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('useCustomVenue')}
                    id="useCustomVenue"
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="useCustomVenue" className="text-sm font-medium">
                    Use Custom Venue
                  </label>
                </div>

                {watchUseCustomVenue && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Venue Name</label>
                      <Input
                        {...register('customVenueName')}
                        placeholder="Enter venue name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <Input
                        {...register('address')}
                        placeholder="Street address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <Input
                          {...register('city')}
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <Input
                          {...register('state')}
                          placeholder="State"
                          maxLength={5}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <Input
                        {...register('zip')}
                        placeholder="ZIP"
                        maxLength={10}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Capacity & Settings - Blue Theme */}
            <Card className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-electric-blue/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-electric-blue">
                  <Users className="h-5 w-5 text-electric-blue" />
                  Capacity & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Max Attendees (optional)</label>
                  <Input
                    type="number"
                    {...register('maxAttendees', { valueAsNumber: true })}
                    placeholder="No limit"
                    min={1}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited capacity</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('allowWaitlist')}
                    id="allowWaitlist"
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="allowWaitlist" className="text-sm font-medium">
                    Allow Waitlist
                  </label>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                      HTML Link
                    </label>
                    <Input
                      {...register('html_link')}
                      placeholder="A link to your event"
                      maxLength={100}
                    />
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-surface-700">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          
          {/* For recurring events being edited as instances, show scope dialog */}
          {mode === 'edit' && isRecurringEvent && isEditingInstance ? (
            <>
              <Button 
                type="button"
                disabled={!isValid || isLoading}
                onClick={() => setShowEditScopeDialog(true)}
                className="min-w-32 bg-primary-500 hover:bg-primary-600 text-white font-medium"
              >
                Update Event
              </Button>

              <Dialog open={showEditScopeDialog} onOpenChange={setShowEditScopeDialog}>
                <DialogContent className="bg-gradient-to-br from-primary-900/95 to-secondary-900/95 border-primary-500/30 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="text-primary-300">Edit Recurring Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-primary-200">
                      This event is part of a series. What would you like to edit?
                    </p>
                    <div className="space-y-3 ">
                      <Button 
                        variant="outline" 
                        className="w-full p-8 justify-start bg-gradient-to-r from-electric-green/20 to-electric-green/10 border-electric-green/30 hover:bg-electric-green/20 hover:border-electric-green/50 text-white"
                        onClick={() => handleRecurringEventSubmit('instance')}
                        disabled={isLoading}
                      >
                        <div className="text-left">
                          <div className="font-medium text-electric-green">This Event Only</div>
                          <div className="text-sm text-gray-300">Changes will only apply to this specific occurrence</div>
                        </div>
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full p-8 justify-start bg-gradient-to-r from-electric-blue/20 to-electric-blue/10 border-electric-blue/30 hover:bg-electric-blue/20 hover:border-electric-blue/50 text-white"
                        onClick={() => handleRecurringEventSubmit('future_instances')}
                        disabled={isLoading}
                      >
                        <div className="text-left">
                          <div className="font-medium text-electric-blue">This and Future Events</div>
                          <div className="text-sm text-gray-300">Changes will apply to this and all future occurrences</div>
                        </div>
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full p-8 justify-start bg-gradient-to-r from-electric-red/20 to-electric-red/10 border-electric-red/30 hover:bg-electric-red/20 hover:border-electric-red/50 text-white"
                        onClick={() => handleRecurringEventSubmit('all_instances')}
                        disabled={isLoading}
                      >
                        <div className="text-left">
                          <div className="font-medium text-electric-red">All Events in Series</div>
                          <div className="text-sm text-gray-300">Changes will apply to all occurrences in the series</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Button 
              type="submit" 
              disabled={!isValid || isLoading}
              className="min-w-32 bg-primary-500 hover:bg-primary-600 text-white font-medium"
            >
              {isLoading ? 'Saving...' : submitButtonText}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
} 