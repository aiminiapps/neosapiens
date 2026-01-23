/**
 * React Query Client Configuration
 * Sets up default query and mutation options
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time: Data is fresh for 30 seconds
            staleTime: 30 * 1000,

            // Cache time: Keep unused data in cache for 5 minutes
            gcTime: 5 * 60 * 1000,

            // Retry failed requests 3 times with exponential backoff
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Refetch on window focus
            refetchOnWindowFocus: true,

            // Refetch on reconnect
            refetchOnReconnect: true,

            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
        },
        mutations: {
            // Retry mutations once
            retry: 1,
        },
    },
});
