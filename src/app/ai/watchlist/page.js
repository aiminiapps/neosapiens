'use client';

import TokenWatchlist from '@/components/dashboard/TokenWatchlist';

export default function WatchlistPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Token <span className="text-gradient-yellow">Watchlist</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                    Monitor ERC-20 tokens and track on-chain activity
                </p>
            </div>

            <TokenWatchlist />
        </div>
    );
}
