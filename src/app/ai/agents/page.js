'use client';

import AIAgentProfiles from '@/components/dashboard/AIAgentProfiles';

export default function AgentsPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    NEO <span className="text-gradient-yellow">Unit Agents</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                    Transparent AI agents with visible wallets and performance tracking
                </p>
            </div>

            <div className="mb-6 bg-bg-panel border border-yellow-neo/30 rounded-lg p-4 md:p-6">
                <h2 className="text-lg font-semibold text-yellow-neo mb-2">
                    🔍 Complete Transparency
                </h2>
                <p className="text-sm text-text-secondary mb-3">
                    Every NEO Unit operates with a public wallet address. You can verify all transactions,
                    balances, and on-chain activity in real-time. No hidden operations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="flex items-start gap-2">
                        <span className="text-intent-green">✓</span>
                        <span className="text-text-muted">Public wallet addresses</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-intent-green">✓</span>
                        <span className="text-text-muted">Real-time balance tracking</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-intent-green">✓</span>
                        <span className="text-text-muted">Performance metrics visible</span>
                    </div>
                </div>
            </div>

            <AIAgentProfiles />
        </div>
    );
}
