/**
 * Get price history (sparkline) for last 7 days
 */
export async function getTokenPriceHistory(tokenAddress, days = 7) {
    try {
        const coinId = getCoinGeckoId(tokenAddress);

        if (!coinId) {
            return { success: false };
        }

        const response = await fetch(
            `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch price history');
        }

        const data = await response.json();

        // Extract prices and format for chart
        const prices = data.prices.map(([timestamp, price]) => ({
            time: timestamp,
            price,
        }));

        return {
            prices,
            success: true,
        };
    } catch (error) {
        console.error('Error fetching price history:', error);
        return {
            success: false,
        };
    }
}

// Re-export functions for external use
export { getTokenPriceData, getBatchTokenPrices, getTokenPriceHistory };
