'use client';

import { useState, useEffect } from 'react';
import Panel from '@/components/ui/Panel';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SignalFeed from '@/components/dashboard/SignalFeed';
import IntentScorePanel from '@/components/dashboard/IntentScorePanel';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
    getWhaleTransactions,
    getNetworkStats,
    getTransactionVolume
} from '@/lib/data/blockchain';
import { generateSignals } from '@/lib/ai/signalGenerator';

export default function DashboardPage() {
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Fetch blockchain data and generate signals
    const fetchDataAndGenerateSignals = async () => {
        try {
            setLoading(true);

            // Fetch blockchain data in parallel
            const [whaleTransactions, networkStats, volumeData] = await Promise.all([
                getWhaleTransactions('10'), // Threshold: 10 ETH
                getNetworkStats(),
                getTransactionVolume(50), // Last 50 blocks (sampled)
            ]);

            setStats(networkStats);

            // Generate AI signals from the data
            const newSignals = await generateSignals({
                whaleTransactions,
                networkStats,
                volumeData,
            });

            setSignals(newSignals);
            setLastUpdate(new Date());
            toast.success(`Generated ${newSignals.length} signals from blockchain data`);
        } catch (error) {
            console.error('Error fetching blockchain data:', error);
            toast.error('Failed to fetch blockchain data');
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchDataAndGenerateSignals();

        // Auto-refresh every 60 seconds
        const interval = setInterval(() => {
            fetchDataAndGenerateSignals();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        AI <span className="text-gradient-yellow">Command Center</span>
                    </h1>
                    <p className="text-text-secondary text-sm md:text-base">
                        Real-time on-chain intelligence and economic signal monitoring
                    </p>
                    {lastUpdate && (
                        <p className="text-xs text-text-muted mt-1">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </p>
                    )}
                </div>
                <Button onClick={fetchDataAndGenerateSignals} disabled={loading} variant="secondary" size="md">
                    {loading ? 'Updating...' : 'Refresh Data'}
                </Button>
            </div>

            {/* Network Stats Banner */}
            {stats && (
                <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-bg-panel border border-border-divider rounded-lg p-3 md:p-4">
                        <div className="text-xs text-text-muted mb-1">Block Number</div>
                        <div className="text-base md:text-lg font-semibold truncate">{stats.blockNumber.toLocaleString()}</div>
                    </div>
                    <div className="bg-bg-panel border border-border-divider rounded-lg p-3 md:p-4">
                        <div className="text-xs text-text-muted mb-1">Gas Price</div>
                        <div className="text-base md:text-lg font-semibold">{parseFloat(stats.gasPrice).toFixed(2)} Gwei</div>
                    </div>
                    <div className="bg-bg-panel border border-border-divider rounded-lg p-3 md:p-4">
                        <div className="text-xs text-text-muted mb-1">Active Signals</div>
                        <div className="text-base md:text-lg font-semibold text-yellow-neo">{signals.length}</div>
                    </div>
                    <div className="bg-bg-panel border border-border-divider rounded-lg p-3 md:p-4">
                        <div className="text-xs text-text-muted mb-1">NEO Units</div>
                        <div className="text-base md:text-lg font-semibold text-intent-green">3 Active</div>
                    </div>
                </div>
            )}

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column - Signal Feed */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <Panel
                        title="AI Economic Signal Feed"
                        actions={
                            <span className="text-xs text-text-muted">
                                {signals.length} signals
                            </span>
                        }
                    >
                        {loading && signals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <LoadingSpinner size="lg" className="mb-4" />
                                <p className="text-text-muted">Analyzing blockchain data...</p>
                                <p className="text-sm text-text-muted mt-2 text-center px-4">
                                    Fetching whale transactions and network stats
                                </p>
                            </div>
                        ) : (
                            <SignalFeed signals={signals} onRefresh={fetchDataAndGenerateSignals} />
                        )}
                    </Panel>
                </div>

                {/* Right Column - Widgets */}
                <div className="space-y-4 md:space-y-6">
                    <Panel title="Economic Intent Score">
                        <IntentScorePanel signals={signals} />
                    </Panel>

                    <Panel title="NEO Unit Status">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">Active Agents</span>
                                <span className="font-semibold">3</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">Signals Generated</span>
                                <span className="font-semibold text-yellow-neo">{signals.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">High Priority</span>
                                <span className="font-semibold text-critical-red">
                                    {signals.filter(s => parseFloat(s.intentScore) >= 7).length}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border-divider">
                                <div className="text-xs text-text-muted mb-2">Agent Performance</div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>NEO-Unit-Alpha-01</span>
                                        <span className="text-intent-green">● Active</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span>NEO-Unit-Beta-02</span>
                                        <span className="text-intent-green">● Active</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span>NEO-Unit-Gamma-03</span>
                                        <span className="text-intent-green">● Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        </main>
    );
}
