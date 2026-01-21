'use client';

import Panel from '@/components/ui/Panel';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
    return (
        <main className="container mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    AI <span className="text-gradient-yellow">Command Center</span>
                </h1>
                <p className="text-text-secondary">
                    Real-time on-chain intelligence and economic signal monitoring
                </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Signal Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <Panel title="AI Economic Signal Feed">
                        <div className="flex flex-col items-center justify-center py-12">
                            <LoadingSpinner size="lg" className="mb-4" />
                            <p className="text-text-muted">Loading live signals...</p>
                            <p className="text-sm text-text-muted mt-2">
                                Connecting to blockchain data sources
                            </p>
                        </div>
                    </Panel>

                    <Panel title="Proof of Economic Intent (PoEI) Analytics">
                        <div className="flex flex-col items-center justify-center py-12">
                            <LoadingSpinner className="mb-4" />
                            <p className="text-text-muted">Analyzing signal impact...</p>
                        </div>
                    </Panel>
                </div>

                {/* Right Column - Widgets */}
                <div className="space-y-6">
                    <Panel title="Economic Intent Score">
                        <div className="text-center py-8">
                            <div className="text-6xl font-bold text-yellow-neo mb-2">--</div>
                            <p className="text-text-muted text-sm">Calculating aggregate intent</p>
                        </div>
                    </Panel>

                    <Panel title="Token Watchlist">
                        <div className="text-center py-8">
                            <p className="text-text-muted">Add tokens to monitor</p>
                        </div>
                    </Panel>

                    <Panel title="NEO Unit Status">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-secondary">Active Agents</span>
                                <span className="text-sm font-semibold">3</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-secondary">Signals Today</span>
                                <span className="text-sm font-semibold">--</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-secondary">Avg Intent Score</span>
                                <span className="text-sm font-semibold">--</span>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            {/* Bottom Section - Charts */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title="Capital Flow Visualization">
                    <div className="flex flex-col items-center justify-center py-12">
                        <LoadingSpinner className="mb-4" />
                        <p className="text-text-muted">Loading flow data...</p>
                    </div>
                </Panel>

                <Panel title="Intent Trend Analysis">
                    <div className="flex flex-col items-center justify-center py-12">
                        <LoadingSpinner className="mb-4" />
                        <p className="text-text-muted">Loading trend data...</p>
                    </div>
                </Panel>
            </div>
        </main>
    );
}
