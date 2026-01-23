/**
 * Custom Hook: usePortfolio
 * Fetches and caches wallet portfolio data
 */

import { useQuery } from '@tanstack/react-query';

export function usePortfolio(address, options = {}) {
    return useQuery({
        queryKey: ['portfolio', address],
        queryFn: async () => {
            if (!address) {
                throw new Error('Address is required');
            }

            const response = await fetch(`/api/blockchain/portfolio?address=${address}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch portfolio: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!address, // Only run query if address exists
        staleTime: 30 * 1000, // Consider data fresh for 30 seconds
        refetchInterval: 60 * 1000, // Background refetch every 60 seconds
        ...options,
    });
}
