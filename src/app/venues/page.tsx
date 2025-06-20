"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchVenuesList, venueQueryKeys } from '@/features/venues/api';
import PublicVenueCard from '@/features/venues/components/PublicVenueCard';

export default function VenuesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 24;

  const { data, isLoading } = useQuery({
    queryKey: venueQueryKeys.list(currentPage, venuesPerPage, searchTerm),
    queryFn: () => fetchVenuesList(currentPage, venuesPerPage, searchTerm),
  });

  const venues = data?.venues || [];
  const pagination = data?.pagination;

  return (
    <div className="w-full px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-surface-50">Event Venues</h1>
        {/* <p className="text-gray-600 text-lg">
          Discover amazing venues for your next event
        </p> */}
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search venues..."
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
      ) : venues.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-surface-400">
            {searchTerm ? 'No venues found matching your search.' : 'No venues available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {venues.map((venue: any) => (
              <PublicVenueCard key={venue.id} venue={venue} />
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
                ({pagination.total} total venues)
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