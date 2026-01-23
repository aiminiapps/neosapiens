/**
 * Blockchain Balance API Route
 * GET /api/blockchain/balance?address=0x...
 */

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// BSC RPC endpoint
const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed1.binance.org';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json(
                { error: 'Address parameter is required' },
                { status: 400 }
            );
        }

        // Validate address
        if (!ethers.isAddress(address)) {
            return NextResponse.json(
                { error: 'Invalid Ethereum address' },
                { status: 400 }
            );
        }

        // Get provider
        const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);

        // Get BNB balance
        const balance = await provider.getBalance(address);
        const balanceFormatted = ethers.formatEther(balance);

        // Get BNB price from CoinGecko
        const priceResponse = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
            { next: { revalidate: 60 } } // Cache for 60 seconds
        );
        const priceData = await priceResponse.json();
        const bnbPrice = priceData.binancecoin?.usd || 0;

        const result = {
            address,
            balance: balanceFormatted,
            balanceUSD: (parseFloat(balanceFormatted) * bnbPrice).toFixed(2),
            price: bnbPrice,
            symbol: 'BNB',
            timestamp: Date.now(),
        };

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            },
        });
    } catch (error) {
        console.error('Balance API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch balance', details: error.message },
            { status: 500 }
        );
    }
}
