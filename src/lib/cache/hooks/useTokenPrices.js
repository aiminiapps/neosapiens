/**
 * Custom Hook: useTokenPrices
 * Fetches and caches token prices with automatic updates
 */

import { useQuery } from '@tanstack/react-query';

export function useTokenPrices(symbols = ['BNB'], options = {}) {
    const symbolsKey = Array.isArray(symbols) ? symbols.join(',') : symbols;

    return useQuery({
        queryKey: ['prices', symbolsKey],
        queryFn: async () => {
            const response = await fetch(`/api/blockchain/prices?symbols=${symbolsKey}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch prices: ${response.status}`);
            }

            return response.json();
        },
        staleTime: 30 * 1000, // Fresh for 30 seconds
        refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
        ...options,
    });
}
