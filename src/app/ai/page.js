'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import Panel from '@/components/ui/Panel';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { analyzeWalletPortfolio, generatePortfolioRecommendations, getPortfolioStrength } from '@/lib/ai/portfolioAnalysis';
import { getCryptoNews, analyzeNewsSentiment, getMarketData, generateMarketSignals } from '@/lib/api/cryptoNews';
import PortfolioPieChart from '@/components/charts/PortfolioPieChart';
import {
    FaWallet,
    FaChartPie,
    FaShieldAlt,
    FaBolt,
    FaLightbulb,
    FaExclamationTriangle,
    FaInfoCircle,
    FaArrowUp,
    FaArrowDown,
    FaSync,
    FaRobot,
    FaClock,
    FaTrophy,
    FaFire
} from 'react-icons/fa';

export default function AICommandCenter() {
    const { address, isConnected } = useWallet();
    const [portfolio, setPortfolio] = useState(null);
    const [loadingPortfolio, setLoadingPortfolio] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [strength, setStrength] = useState(null);
    const [signals, setSignals] = useState([]);
    const [loadingSignals, setLoadingSignals] = useState(false);

    useEffect(() => {
        if (isConnected && address) {
            loadPortfolioData();
        }
    }, [isConnected, address]);

    useEffect(() => {
        loadSignals();
    }, []);

    const loadPortfolioData = async () => {
        if (!address) return;

        setLoadingPortfolio(true);
        const portfolioData = await analyzeWalletPortfolio(address);

        if (portfolioData) {
            setPortfolio(portfolioData);
            setRecommendations(generatePortfolioRecommendations(portfolioData));
            setStrength(getPortfolioStrength(portfolioData));
        }

        setLoadingPortfolio(false);
    };

    const loadSignals = async () => {
        setLoadingSignals(true);

        try {
            const newsData = await getCryptoNews('BTC,ETH,USDT,BNB,SOL', 10);
            const newsSignals = newsData.success ? analyzeNewsSentiment(newsData.news) : [];

            const marketData = await getMarketData();
            const marketSignals = marketData.success ? generateMarketSignals(marketData.data) : [];

            const allSignals = [...newsSignals, ...marketSignals]
                .sort((a, b) => parseFloat(b.intentScore) - parseFloat(a.intentScore))
                .slice(0, 5);

            setSignals(allSignals.length > 0 ? allSignals : getSampleSignals());
        } catch (error) {
            setSignals(getSampleSignals());
        }

        setLoadingSignals(false);
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    AI Command <span className="text-gradient-yellow">Center</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                    Your personal AI-powered crypto intelligence dashboard
                </p>
            </div>

            {/* Wallet Portfolio Section */}
            {isConnected ? (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                        <FaWallet className="text-yellow-neo" />
                        Your Portfolio
                    </h2>

                    {loadingPortfolio ? (
                        <div className="bg-bg-secondary border border-border-divider rounded-lg p-12 text-center">
                            <LoadingSpinner />
                            <p className="text-text-muted mt-4">Analyzing your portfolio...</p>
                        </div>
                    ) : portfolio ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Portfolio Overview */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Total Value Card */}
                                <Panel title="Portfolio Value">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <div className="text-4xl font-bold text-text-primary">
                                                ${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                            <div className="text-sm text-text-muted mt-1">
                                                {portfolio.metrics.assetCount} assets
                                            </div>
                                        </div>
                                        <Button onClick={loadPortfolioData} size="sm" variant="ghost">
                                            <FaSync className={loadingPortfolio ? 'animate-spin' : ''} />
                                        </Button>
                                    </div>

                                    {/* Asset Breakdown */}
                                    <div className="space-y-3">
                                        {/* ETH */}
                                        <AssetRow
                                            symbol="ETH"
                                            balance={portfolio.eth.balance}
                                            value={portfolio.eth.value}
                                            percentage={portfolio.eth.percentage}
                                            priceChange={portfolio.eth.priceChange24h}
                                        />

                                        {/* Tokens */}
                                        {portfolio.tokens.map(token => (
                                            <AssetRow
                                                key={token.symbol}
                                                symbol={token.symbol}
                                                balance={token.balance}
                                                value={token.value}
                                                percentage={token.percentage}
                                                priceChange={token.priceChange24h}
                                            />
                                        ))}
                                    </div>
                                </Panel>

                                {/* Portfolio Metrics */}
                                <div className="grid grid-cols-3 gap-4">
                                    <MetricCard
                                        icon={FaChartPie}
                                        label="Diversification"
                                        value={`${portfolio.metrics.diversification.toFixed(0)}%`}
                                        color={portfolio.metrics.diversification > 50 ? 'green' : 'yellow'}
                                    />
                                    <MetricCard
                                        icon={FaShieldAlt}
                                        label="Risk Score"
                                        value={`${portfolio.metrics.risk.toFixed(0)}%`}
                                        color={portfolio.metrics.risk > 70 ? 'red' : portfolio.metrics.risk > 40 ? 'yellow' : 'green'}
                                    />
                                    {strength && (
                                        <MetricCard
                                            icon={FaTrophy}
                                            label="Portfolio Grade"
                                            value={strength.grade}
                                            color={strength.grade === 'A' ? 'green' : strength.grade === 'B' ? 'yellow' : 'red'}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Portfolio Chart */}
                            <div>
                                <Panel title="Asset Allocation">
                                    <PortfolioPieChart portfolio={portfolio} />
                                </Panel>
                            </div>
                        </div>
                    ) : (
                        <Panel>
                            <div className="text-center py-8">
                                <FaWallet className="mx-auto text-text-muted mb-4" size={48} />
                                <p className="text-text-muted">Failed to load portfolio data</p>
                                <Button onClick={loadPortfolioData} className="mt-4">
                                    Retry
                                </Button>
                            </div>
                        </Panel>
                    )}

                    {/* AI Recommendations */}
                    {recommendations.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                                <FaRobot className="text-yellow-neo" />
                                AI Recommendations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recommendations.map((rec, index) => (
                                    <RecommendationCard key={index} recommendation={rec} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Portfolio Strength Analysis */}
                    {strength && (
                        <div className="mt-6">
                            <Panel title="Portfolio Strength Analysis">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-intent-green mb-2">Strengths</h4>
                                        <ul className="space-y-2">
                                            {strength.strengths.map((s, i) => (
                                                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                                                    <span className="text-intent-green mt-1">✓</span>
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                            {strength.strengths.length === 0 && (
                                                <li className="text-sm text-text-muted">No major strengths identified</li>
                                            )}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-critical-red mb-2">Areas for Improvement</h4>
                                        <ul className="space-y-2">
                                            {strength.weaknesses.map((w, i) => (
                                                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                                                    <span className="text-critical-red mt-1">⚠</span>
                                                    <span>{w}</span>
                                                </li>
                                            ))}
                                            {strength.weaknesses.length === 0 && (
                                                <li className="text-sm text-text-muted">No major weaknesses identified</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Panel>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mb-6">
                    <Panel>
                        <div className="text-center py-12">
                            <FaWallet className="mx-auto text-text-muted mb-4" size={48} />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Connect Your Wallet
                            </h3>
                            <p className="text-text-secondary mb-4">
                                Connect your wallet to view portfolio analysis and AI recommendations
                            </p>
                        </div>
                    </Panel>
                </div>
            )}

            {/* AI Economic Signal Feed */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <FaBolt className="text-yellow-neo" />
                        AI Economic Signal Feed
                    </h2>
                    <Button onClick={loadSignals} size="sm" variant="ghost">
                        <FaSync className={loadingSignals ? 'animate-spin' : ''} />
                        <span className="ml-2">Refresh</span>
                    </Button>
                </div>

                {loadingSignals ? (
                    <div className="text-center py-8">
                        <LoadingSpinner />
                        <p className="text-text-muted mt-4">Loading signals...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {signals.slice(0, 5).map((signal) => (
                            <SignalCard key={signal.id} signal={signal} />
                        ))}
                    </div>
                )}
            </div>

            {/* Economic Intent Score */}
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <FaFire className="text-yellow-neo" />
                    Economic Intent Score
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <IntentScoreCard
                        type="Market Sentiment"
                        score={calculateAverageIntentScore(signals)}
                        description="Overall market intent based on recent signals"
                    />
                    <IntentScoreCard
                        type="Risk Level"
                        score={calculateRiskLevel(signals)}
                        description="Current market risk assessment"
                    />
                    <IntentScoreCard
                        type="Opportunity Index"
                        score={calculateOpportunityIndex(signals)}
                        description="Potential opportunities in the market"
                    />
                </div>
            </div>
        </div>
    );
}

function AssetRow({ symbol, balance, value, percentage, priceChange }) {
    const isPositive = priceChange >= 0;

    return (
        <div className="flex items-center justify-between p-3 bg-bg-panel rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-neo/10 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-neo font-bold text-sm">{symbol}</span>
                </div>
                <div>
                    <div className="text-sm font-semibold text-text-primary">{balance.toFixed(4)}</div>
                    <div className="text-xs text-text-muted">${value.toFixed(2)}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm font-semibold text-text-primary">{percentage.toFixed(1)}%</div>
                <div className={`text-xs flex items-center gap-1 justify-end ${isPositive ? 'text-intent-green' : 'text-critical-red'}`}>
                    {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                    {Math.abs(priceChange).toFixed(1)}%
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, color }) {
    const colors = {
        green: 'text-intent-green bg-intent-green/10',
        yellow: 'text-yellow-neo bg-yellow-neo/10',
        red: 'text-critical-red bg-critical-red/10',
    };

    return (
        <div className="bg-bg-secondary border border-border-divider rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 ${colors[color]} rounded-lg flex items-center justify-center`}>
                    <Icon size={16} />
                </div>
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
            <div className="text-xs text-text-muted">{label}</div>
        </div>
    );
}

function RecommendationCard({ recommendation }) {
    const iconMap = {
        warning: FaExclamationTriangle,
        risk: FaShieldAlt,
        info: FaInfoCircle,
        opportunity: FaLightbulb,
    };

    const colorMap = {
        warning: { icon: 'text-yellow-neo', bg: 'bg-yellow-neo/10', border: 'border-yellow-neo/30' },
        risk: { icon: 'text-critical-red', bg: 'bg-critical-red/10', border: 'border-critical-red/30' },
        info: { icon: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
        opportunity: { icon: 'text-intent-green', bg: 'bg-intent-green/10', border: 'border-intent-green/30' },
    };

    const Icon = iconMap[recommendation.type];
    const colors = colorMap[recommendation.type];

    return (
        <div className={`bg-bg-secondary border ${colors.border} rounded-lg p-4`}>
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={colors.icon} size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-text-primary mb-1">{recommendation.title}</h4>
                    <p className="text-xs text-text-secondary mb-2">{recommendation.message}</p>
                    <div className="text-xs text-yellow-neo font-semibold">{recommendation.action}</div>
                </div>
            </div>
        </div>
    );
}

function SignalCard({ signal }) {
    const typeConfig = {
        risk: { icon: FaExclamationTriangle, color: 'text-critical-red', bg: 'bg-critical-red/10' },
        opportunity: { icon: FaLightbulb, color: 'text-intent-green', bg: 'bg-intent-green/10' },
        action: { icon: FaBolt, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        observation: { icon: FaInfoCircle, color: 'text-text-muted', bg: 'bg-bg-panel' },
    };

    const config = typeConfig[signal.type] || typeConfig.observation;
    const Icon = config.icon;

    return (
        <div className="bg-bg-secondary border border-border-divider rounded-lg p-4 hover:border-yellow-neo/50 transition">
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={config.color} size={20} />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            {signal.title && <h4 className="text-sm font-bold text-text-primary mb-1">{signal.title}</h4>}
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <FaRobot size={10} />
                                <span>{signal.agent}</span>
                                <span>•</span>
                                <FaClock size={10} />
                                <span>{new Date(signal.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-yellow-neo">{signal.intentScore}</div>
                            <div className="text-xs text-text-muted">Intent</div>
                        </div>
                    </div>
                    <p className="text-xs text-text-secondary">{signal.explanation}</p>
                </div>
            </div>
        </div>
    );
}

function IntentScoreCard({ type, score, description }) {
    return (
        <Panel>
            <div className="text-center">
                <div className="text-4xl font-bold text-yellow-neo mb-2">{score}</div>
                <div className="text-sm font-semibold text-text-primary mb-1">{type}</div>
                <div className="text-xs text-text-muted">{description}</div>
            </div>
        </Panel>
    );
}

function getSampleSignals() {
    return [
        {
            id: 'sample-1',
            type: 'risk',
            timestamp: Date.now() - 1000 * 60 * 15,
            intentScore: '8.5',
            title: 'BTC Price Volatility Alert',
            explanation: 'Bitcoin experiencing significant price movement. High trading volume detected.',
            agent: 'Titan',
        },
        {
            id: 'sample-2',
            type: 'opportunity',
            timestamp: Date.now() - 1000 * 60 * 30,
            intentScore: '7.2',
            title: 'ETH Network Activity Surge',
            explanation: 'Positive sentiment detected across Ethereum ecosystem.',
            agent: 'Pulse',
        },
    ];
}

function calculateAverageIntentScore(signals) {
    if (signals.length === 0) return '0.0';
    const avg = signals.reduce((sum, s) => sum + parseFloat(s.intentScore), 0) / signals.length;
    return avg.toFixed(1);
}

function calculateRiskLevel(signals) {
    const riskSignals = signals.filter(s => s.type === 'risk');
    const riskScore = (riskSignals.length / Math.max(signals.length, 1)) * 10;
    return riskScore.toFixed(1);
}

function calculateOpportunityIndex(signals) {
    const oppSignals = signals.filter(s => s.type === 'opportunity');
    const oppScore = (oppSignals.length / Math.max(signals.length, 1)) * 10;
    return oppScore.toFixed(1);
}
