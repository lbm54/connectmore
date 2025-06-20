"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  QueryClient,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

interface ReactQueryProviderProps {
  children: ReactNode;
  // the server will pass us this
  dehydratedState?: unknown;
}

export function ReactQueryProvider({
  children,
  dehydratedState,
}: ReactQueryProviderProps) {
  // Create QueryClient with optimized settings for Redis-backed API
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Reduce stale time since Redis handles server-side caching
            staleTime: 2 * 60_000, // 2 minutes
            gcTime: 10 * 60_000, // 10 minutes - keep in memory longer
            refetchOnWindowFocus: false,
            retry: 1,
            // Add retry delay for better UX
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Add cache invalidation on mutations
            onSuccess: () => {
              // Optionally invalidate relevant caches
              queryClient.invalidateQueries({ queryKey: ['events'] });
            },
          },
        },
      })
  );

  // Enable persistence after hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
        key: "connectmore-cache",
        // Reduce local storage duration since Redis handles server-side caching
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      });

      persistQueryClient({
        queryClient,
        persister,
        maxAge: 1000 * 60 * 30, // 30 minutes instead of 24 hours
        buster: '', // Add a cache buster if needed
      });
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

// Helper function to invalidate cache both locally and on server
export async function invalidateServerCache(type: string, id?: string) {
  try {
    const url = new URL('/api/cache/invalidate', window.location.origin);
    url.searchParams.set('type', type);
    if (id) url.searchParams.set('id', id);
    
    await fetch(url.toString(), { method: 'POST' });
  } catch (error) {
    console.error('Failed to invalidate server cache:', error);
  }
}
