'use client';

import { useState, useEffect } from 'react';
import Panel from '@/components/ui/Panel';
import Button from '@/components/ui/Button';
import { getCryptoNews, analyzeNewsSentiment, getMarketData, generateMarketSignals } from '@/lib/api/cryptoNews';
import { FaBolt, FaNewspaper, FaSync, FaFire, FaChartLine, FaExclamationTriangle, FaLightbulb, FaEye, FaRobot, FaClock, FaExternalLinkAlt } from 'react-icons/fa';

// Sample fallback data
const SAMPLE_SIGNALS = [
    {
        id: 'sample-1',
        type: 'risk',
        timestamp: Date.now() - 1000 * 60 * 15,
        intentScore: '8.5',
        title: 'BTC Price Volatility Alert',
        explanation: '🔴 Bitcoin experiencing 12.3% price surge in the last 24 hours. Current price $89,234. High trading volume indicates strong buying pressure. Monitor for potential correction.',
        agent: 'Titan',
        category: 'market',
        data: { coin: 'BTC', price: 89234, priceChange: 12.3 },
    },
    {
        id: 'sample-2',
        type: 'opportunity',
        timestamp: Date.now() - 1000 * 60 * 30,
        intentScore: '7.2',
        title: 'ETH Network Upgrade Announcement',
        explanation: '🟢 Positive sentiment signal: Ethereum announces successful testnet upgrade. Community reaction is strongly bullish. Potential accumulation opportunity before mainnet deployment.',
        agent: 'Pulse',
        category: 'news',
        currencies: ['ETH'],
    },
    {
        id: 'sample-3',
        type: 'action',
        timestamp: Date.now() - 1000 * 60 * 45,
        intentScore: '6.8',
        title: 'DEX Volume Surge Detected',
        explanation: 'Elevated transaction volume: $2.3B processed across major DEXs in last 6 hours. Average transaction value suggests institutional-scale activity. Monitoring for directional bias.',
        agent: 'Flow',
        category: 'market',
        currencies: ['UNI', 'SUSHI'],
    },
    {
        id: 'sample-4',
        type: 'risk',
        timestamp: Date.now() - 1000 * 60 * 60,
        intentScore: '8.9',
        title: 'Major Exchange Outflow Detected',
        explanation: '🔴 Critical capital movement: 50,000 ETH transferred from major exchange to unknown wallet. Transaction volume exceeds $125M USD. Historical patterns suggest significant market impact potential.',
        agent: 'Titan',
        category: 'onchain',
        data: { coin: 'ETH' },
    },
    {
        id: 'sample-5',
        type: 'opportunity',
        timestamp: Date.now() - 1000 * 60 * 90,
        intentScore: '7.5',
        title: 'Gas Prices at Record Low',
        explanation: '🟢 Low network congestion: Gas prices at 8.5 Gwei. Optimal conditions for on-chain transactions. Historical data shows low-fee periods often precede accumulation phases.',
        agent: 'Pulse',
        category: 'onchain',
    },
];

export default function SignalsPage() {
    const [signals, setSignals] = useState(SAMPLE_SIGNALS);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [category, setCategory] = useState('all');
    const [usingLiveData, setUsingLiveData] = useState(false);

    useEffect(() => {
        // Try to load live data on mount
        loadSignals();
    }, []);

    const loadSignals = async () => {
        setLoading(true);

        try {
            // Fetch crypto news
            const newsData = await getCryptoNews('BTC,ETH,USDT,BNB,SOL', 15);
            const newsSignals = newsData.success ? analyzeNewsSentiment(newsData.news) : [];

            // Fetch market data
            const marketData = await getMarketData();
            const marketSignals = marketData.success ? generateMarketSignals(marketData.data) : [];

            // Combine signals
            const allSignals = [...newsSignals, ...marketSignals];

            // If we got real data, use it; otherwise keep sample data
            if (allSignals.length > 0) {
                const sortedSignals = allSignals.sort((a, b) => parseFloat(b.intentScore) - parseFloat(a.intentScore));
                setSignals(sortedSignals);
                setUsingLiveData(true);
            } else {
                // Keep sample data if API fails
                console.log('Using sample data - APIs may require keys or have rate limits');
                setUsingLiveData(false);
            }
        } catch (error) {
            console.error('Error loading signals:', error);
            // Keep sample data on error
            setUsingLiveData(false);
        }

        setLoading(false);
    };

    const filteredSignals = signals.filter(signal => {
        if (filter !== 'all' && signal.type !== filter) return false;
        if (category !== 'all' && signal.category !== category) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Signal <span className="text-gradient-yellow">Feed</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                    AI-powered economic signals from crypto news, market data, and on-chain activity
                </p>
            </div>

            {/* Live Data Indicator */}
            {!usingLiveData && (
                <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm">
                    <p className="text-blue-400">
                        📊 Showing sample data. Click <strong>Refresh</strong> to load live crypto signals (requires API keys).
                    </p>
                </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatBox
                    icon={FaBolt}
                    label="Total Signals"
                    value={signals.length}
                    color="text-yellow-neo"
                />
                <StatBox
                    icon={FaExclamationTriangle}
                    label="Risk Alerts"
                    value={signals.filter(s => s.type === 'risk').length}
                    color="text-critical-red"
                />
                <StatBox
                    icon={FaLightbulb}
                    label="Opportunities"
                    value={signals.filter(s => s.type === 'opportunity').length}
                    color="text-intent-green"
                />
                <StatBox
                    icon={FaFire}
                    label="Avg Score"
                    value={(signals.reduce((sum, s) => sum + parseFloat(s.intentScore), 0) / signals.length || 0).toFixed(1)}
                    color="text-blue-500"
                />
            </div>

            {/* Filters */}
            <div className="mb-6 bg-bg-secondary border border-border-divider rounded-lg p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-text-muted mr-2">Filter by Type:</span>
                        <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
                        <FilterButton label="Risk" active={filter === 'risk'} onClick={() => setFilter('risk')} color="red" />
                        <FilterButton label="Opportunity" active={filter === 'opportunity'} onClick={() => setFilter('opportunity')} color="green" />
                        <FilterButton label="Action" active={filter === 'action'} onClick={() => setFilter('action')} color="blue" />
                        <FilterButton label="Observation" active={filter === 'observation'} onClick={() => setFilter('observation')} />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-text-muted mr-2">Source:</span>
                        <FilterButton label="All" active={category === 'all'} onClick={() => setCategory('all')} size="sm" />
                        <FilterButton label="News" active={category === 'news'} onClick={() => setCategory('news')} size="sm" />
                        <FilterButton label="Market" active={category === 'market'} onClick={() => setCategory('market')} size="sm" />
                        <FilterButton label="On-Chain" active={category === 'onchain'} onClick={() => setCategory('onchain')} size="sm" />
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-text-muted">
                    Showing {filteredSignals.length} of {signals.length} signals
                </div>
                <Button
                    onClick={loadSignals}
                    disabled={loading}
                    size="sm"
                >
                    <FaSync className={loading ? 'animate-spin' : ''} />
                    <span className="ml-2">Refresh</span>
                </Button>
            </div>

            {/* Signals Feed */}
            {loading ? (
                <div className="text-center py-12">
                    <FaSync className="animate-spin text-yellow-neo mx-auto mb-4" size={32} />
                    <p className="text-text-muted">Loading AI signals...</p>
                </div>
            ) : filteredSignals.length === 0 ? (
                <div className="text-center py-12">
                    <FaEye className="text-text-muted mx-auto mb-4" size={32} />
                    <p className="text-text-muted">No signals match your filters</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSignals.map((signal) => (
                        <SignalCard key={signal.id} signal={signal} />
                    ))}
                </div>
            )}
        </div>
    );
}

function StatBox({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-bg-secondary border border-border-divider rounded-lg p-4">
            <div className="flex items-center gap-3">
                <Icon className={color} size={20} />
                <div>
                    <div className="text-2xl font-bold text-text-primary">{value}</div>
                    <div className="text-xs text-text-muted">{label}</div>
                </div>
            </div>
        </div>
    );
}

function FilterButton({ label, active, onClick, color = 'yellow', size = 'md' }) {
    const colors = {
        yellow: active ? 'bg-yellow-neo text-bg-primary' : 'bg-bg-panel text-text-secondary hover:bg-yellow-neo/20',
        red: active ? 'bg-critical-red text-white' : 'bg-bg-panel text-text-secondary hover:bg-critical-red/20',
        green: active ? 'bg-intent-green text-white' : 'bg-bg-panel text-text-secondary hover:bg-intent-green/20',
        blue: active ? 'bg-blue-500 text-white' : 'bg-bg-panel text-text-secondary hover:bg-blue-500/20',
    };

    const sizeClass = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm';

    return (
        <button
            onClick={onClick}
            className={`${colors[color]} ${sizeClass} rounded-lg font-medium transition`}
        >
            {label}
        </button>
    );
}

function SignalCard({ signal }) {
    const typeConfig = {
        risk: { icon: FaExclamationTriangle, color: 'text-critical-red', bg: 'bg-critical-red/10', border: 'border-critical-red/30' },
        opportunity: { icon: FaLightbulb, color: 'text-intent-green', bg: 'bg-intent-green/10', border: 'border-intent-green/30' },
        action: { icon: FaBolt, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
        observation: { icon: FaEye, color: 'text-text-muted', bg: 'bg-bg-panel', border: 'border-border-divider' },
    };

    const config = typeConfig[signal.type] || typeConfig.observation;
    const Icon = config.icon;

    return (
        <div className={`bg-bg-secondary border ${config.border} rounded-lg p-4 hover:border-yellow-neo/50 transition`}>
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={config.color} size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                            {signal.title && (
                                <h3 className="text-base font-bold text-text-primary mb-1">{signal.title}</h3>
                            )}
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <FaRobot size={12} />
                                <span>{signal.agent}</span>
                                <span>•</span>
                                <FaClock size={12} />
                                <span>{new Date(signal.timestamp).toLocaleTimeString()}</span>
                                {signal.category && (
                                    <>
                                        <span>•</span>
                                        {signal.category === 'news' ? <FaNewspaper size={12} /> : <FaChartLine size={12} />}
                                        <span className="capitalize">{signal.category}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Intent Score */}
                        <div className="flex-shrink-0 text-right">
                            <div className="text-2xl font-bold text-yellow-neo">{signal.intentScore}</div>
                            <div className="text-xs text-text-muted">Intent Score</div>
                        </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-sm text-text-secondary mb-3">{signal.explanation}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {signal.currencies && signal.currencies.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {signal.currencies.slice(0, 3).map(currency => (
                                        <span key={currency} className="px-2 py-1 bg-yellow-neo/10 text-yellow-neo text-xs font-semibold rounded">
                                            {currency}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {signal.data?.coin && (
                                <span className="px-2 py-1 bg-yellow-neo/10 text-yellow-neo text-xs font-semibold rounded">
                                    {signal.data.coin}
                                </span>
                            )}
                        </div>

                        {signal.url && (
                            <a
                                href={signal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-yellow-neo hover:text-yellow-electric transition"
                            >
                                <span>View Source</span>
                                <FaExternalLinkAlt size={10} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
