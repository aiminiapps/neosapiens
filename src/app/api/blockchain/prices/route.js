/**
 * Blockchain Prices API Route
 * GET /api/blockchain/prices?symbols=BNB,USDT,BUSD
 */

import { NextResponse } from 'next/server';

// CoinGecko coin ID mapping for BSC tokens
const COIN_ID_MAP = {
    BNB: 'binancecoin',
    WBNB: 'binancecoin',
    USDT: 'tether',
    USDC: 'usd-coin',
    DAI: 'dai',
    BUSD: 'binance-usd',
    ETH: 'ethereum',
    BTCB: 'bitcoin',
};

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbolsParam = searchParams.get('symbols') || 'BNB';
        const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());

        // Map symbols to CoinGecko IDs
        const coinIds = symbols
            .map(symbol => COIN_ID_MAP[symbol])
            .filter(Boolean)
            .join(',');

        if (!coinIds) {
            return NextResponse.json(
                { error: 'No valid symbols provided' },
                { status: 400 }
            );
        }

        // Fetch prices from CoinGecko
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
            { next: { revalidate: 60 } } // Cache for 60 seconds
        );

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform data to match our format
        const prices = {};
        symbols.forEach(symbol => {
            const coinId = COIN_ID_MAP[symbol];
            if (coinId && data[coinId]) {
                prices[symbol] = {
                    symbol,
                    price: data[coinId].usd,
                    priceChange24h: data[coinId].usd_24h_change || 0,
                    marketCap: data[coinId].usd_market_cap || 0,
                    volume24h: data[coinId].usd_24h_vol || 0,
                    timestamp: Date.now(),
                };
            }
        });

        return NextResponse.json(prices, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        });
    } catch (error) {
        console.error('Prices API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prices', details: error.message },
            { status: 500 }
        );
    }
}
