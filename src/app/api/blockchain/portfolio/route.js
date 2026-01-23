/**
 * Blockchain Portfolio API Route
 * GET /api/blockchain/portfolio?address=0x...
 */

import { NextResponse } from 'next/server';
import { analyzeWalletPortfolio, generatePortfolioRecommendations, getPortfolioStrength } from '@/lib/ai/portfolioAnalysis';

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

        console.log('[Portfolio API] Analyzing:', address);

        // Analyze portfolio server-side
        const portfolio = await analyzeWalletPortfolio(address);

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Failed to analyze portfolio' },
                { status: 500 }
            );
        }

        // Generate recommendations
        const recommendations = generatePortfolioRecommendations(portfolio);
        const strength = getPortfolioStrength(portfolio);

        const result = {
            portfolio,
            recommendations,
            strength,
            timestamp: Date.now(),
        };

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            },
        });
    } catch (error) {
        console.error('[Portfolio API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch portfolio', details: error.message },
            { status: 500 }
        );
    }
}
