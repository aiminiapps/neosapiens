'use client';

import { useState, useEffect } from 'react';
import Panel from '@/components/ui/Panel';
import { poeiTracker } from '@/lib/ai/poeiAnalytics';
import PoEITrendChart from '@/components/charts/PoEITrendChart';
import CapitalFlowChart from '@/components/charts/CapitalFlowChart';
import WalletClusterChart from '@/components/charts/WalletClusterChart';
import SignalTypeDistribution from '@/components/charts/SignalTypeDistribution';
import AgentPerformanceBar from '@/components/charts/AgentPerformanceBar';
import {
    FaChartLine,
    FaTrophy,
    FaBullseye,
    FaClock,
    FaInfoCircle,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';

export default function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [trendData, setTrendData] = useState(null);

    useEffect(() => {
        // Load PoEI statistics
        const poeiStats = poeiTracker.getAggregateStats();
        setStats(poeiStats);

        const trend = poeiTracker.getTrendData(14);
        setTrendData(trend);
    }, []);

    return (
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Analytics <span className="text-gradient-yellow">Dashboard</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                    Track signal performance, market impact, and AI agent effectiveness
                </p>
            </div>

            {/* Info Banner */}
            <div className="mb-6 bg-gradient-to-r from-yellow-neo/10 to-transparent border border-yellow-neo/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-yellow-neo mt-1 flex-shrink-0" size={18} />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-text-primary mb-1">
                            What is Proof of Economic Intent (PoEI)?
                        </h3>
                        <p className="text-xs text-text-secondary">
                            PoEI scores (0-100) measure how accurately AI signals predict market movements.
                            Higher scores indicate better predictive accuracy and faster market reactions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <MetricCard
                        icon={FaChartLine}
                        label="Average PoEI Score"
                        value={stats.avgPoEIScore.toFixed(1)}
                        subtitle="Out of 100"
                        trend={stats.avgPoEIScore > 70 ? 'up' : 'down'}
                        trendValue="+5.2%"
                        color="text-yellow-neo"
                        bgColor="bg-yellow-neo/10"
                    />
                    <MetricCard
                        icon={FaTrophy}
                        label="Accuracy Rate"
                        value={`${stats.accuracyRate.toFixed(0)}%`}
                        subtitle={`${stats.accurateSignals}/${stats.verifiedSignals} accurate`}
                        trend="up"
                        trendValue="+3.1%"
                        color="text-intent-green"
                        bgColor="bg-intent-green/10"
                    />
                    <MetricCard
                        icon={FaBullseye}
                        label="Total Signals"
                        value={stats.totalSignals}
                        subtitle={`${stats.verifiedSignals} verified`}
                        trend={null}
                        color="text-blue-500"
                        bgColor="bg-blue-500/10"
                    />
                    <MetricCard
                        icon={FaClock}
                        label="Last 7 Days"
                        value={stats.verifiedSignals}
                        subtitle="New signals analyzed"
                        trend="up"
                        trendValue="+12"
                        color="text-purple-500"
                        bgColor="bg-purple-500/10"
                    />
                </div>
            )}

            {/* Main Chart - PoEI Trend (Full Width) */}
            <div className="mb-6">
                <Panel title="Proof of Economic Intent Trend">
                    <div className="mb-4 text-sm text-text-secondary">
                        Track how each AI agent's prediction accuracy evolves over time.
                        Lines show PoEI scores for the last 14 days.
                    </div>
                    <PoEITrendChart trendData={trendData} />
                </Panel>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Signal Type Distribution */}
                <Panel title="Signal Types">
                    <div className="mb-3 text-sm text-text-secondary">
                        Breakdown of signal categories generated by all agents.
                    </div>
                    <SignalTypeDistribution />
                </Panel>

                {/* Agent Performance Comparison */}
                <Panel title="Agent Comparison">
                    <div className="mb-3 text-sm text-text-secondary">
                        Compare performance metrics across Titan, Pulse, and Flow.
                    </div>
                    <AgentPerformanceBar />
                </Panel>
            </div>

            {/* Capital Flow & Wallet Clusters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title="Capital Flow Analysis">
                    <div className="mb-3 text-sm text-text-secondary">
                        Track ETH moving in and out of monitored wallets over 30 days.
                    </div>
                    <CapitalFlowChart />
                </Panel>

                <Panel title="Wallet Activity Clusters">
                    <div className="mb-3 text-sm text-text-secondary">
                        Visualize wallet behavior patterns. Bubble size = activity level.
                    </div>
                    <WalletClusterChart />
                </Panel>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, subtitle, trend, trendValue, color, bgColor }) {
    return (
        <div className="bg-bg-secondary border border-border-divider rounded-lg p-4 hover:border-yellow-neo/30 transition">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={color} size={20} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-intent-green' : 'text-critical-red'
                        }`}>
                        {trend === 'up' ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
            <div className="text-xs text-text-muted mb-1">{label}</div>
            {subtitle && (
                <div className="text-xs text-text-secondary">{subtitle}</div>
            )}
        </div>
    );
}
