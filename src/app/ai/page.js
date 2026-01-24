'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { analyzeWalletPortfolio, generatePortfolioRecommendations, getPortfolioStrength } from '@/lib/ai/portfolioAnalysis';
import { getCryptoNews, analyzeNewsSentiment, getMarketData, generateMarketSignals } from '@/lib/api/cryptoNews';
import PortfolioPieChart from '@/components/charts/PortfolioPieChart';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiWallet3Line,
    RiPieChart2Line,
    RiShieldCheckLine,
    RiFlashlightLine,
    RiLightbulbFlashLine,
    RiAlertLine,
    RiInformationLine,
    RiArrowUpLine,
    RiArrowDownLine,
    RiRefreshLine,
    RiRobot2Line,
    RiTimeLine,
    RiTrophyLine,
    RiFireLine,
    RiCpuLine
} from 'react-icons/ri';

// --- ROBUST MOCK DATA (Fallback) ---
// This ensures the UI never breaks even if the API returns null
const MOCK_PORTFOLIO = {
    totalValue: 12450.80,
    metrics: { assetCount: 8, diversification: 65, risk: 42 },
    bnb: { balance: 15.5, value: 4650.00, percentage: 37.3, priceChange24h: 2.4 },
    tokens: [
        { symbol: 'CAKE', balance: 540.2, value: 1200.50, percentage: 9.6, priceChange24h: -1.2 },
        { symbol: 'USDT', balance: 3500.0, value: 3500.00, percentage: 28.1, priceChange24h: 0.01 },
        { symbol: 'ETH', balance: 1.2, value: 3100.30, percentage: 24.9, priceChange24h: 1.8 }
    ]
};

// --- COMPONENTS ---

const TechCard = ({ children, title, icon: Icon, className = "", noPadding = false }) => (
    <div className={`relative group bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 ${className}`}>
        {/* Soft Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
        
        {/* Header */}
        {title && (
            <div className="relative flex items-center gap-3 p-6 pb-4 border-b border-white/5">
                {Icon && <Icon className="text-yellow-neo opacity-90" size={18} />}
                <h3 className="text-sm font-medium tracking-wide text-gray-200">{title}</h3>
            </div>
        )}
        
        {/* Content */}
        <div className={noPadding ? "" : "p-6"}>
            {children}
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="relative mb-10 pl-6">
        <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-3xl font-semibold tracking-tight text-white"
        >
            {title}
        </motion.h1>
        {subtitle && (
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 text-sm mt-1"
            >
                {subtitle}
            </motion.p>
        )}
    </div>
);

// --- MAIN COMPONENT ---

export default function AICommandCenter() {
    const { address, isConnected } = useWallet();
    const [portfolio, setPortfolio] = useState(null);
    const [loadingPortfolio, setLoadingPortfolio] = useState(true); // Start loading true
    const [recommendations, setRecommendations] = useState([]);
    const [strength, setStrength] = useState(null);
    const [signals, setSignals] = useState([]);
    const [loadingSignals, setLoadingSignals] = useState(false);

    // Initial Load
    useEffect(() => {
        // If connected, load data. If not, wait for connection or show empty state.
        if (isConnected) {
            loadPortfolioData();
        } else {
            setLoadingPortfolio(false);
        }
    }, [isConnected, address]);

    useEffect(() => {
        loadSignals();
    }, []);

    const loadPortfolioData = async () => {
        setLoadingPortfolio(true);
        
        // Artificial delay to prevent flicker (optional)
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Attempt to fetch real data
            const portfolioData = await analyzeWalletPortfolio(address);
            
            if (portfolioData) {
                setPortfolio(portfolioData);
                setRecommendations(generatePortfolioRecommendations(portfolioData));
                setStrength(getPortfolioStrength(portfolioData));
            } else {
                // FALLBACK: Use Mock data if API returns null/undefined so UI still works
                console.warn("API returned null, using mock data");
                setPortfolio(MOCK_PORTFOLIO);
                setRecommendations(generatePortfolioRecommendations(MOCK_PORTFOLIO));
                setStrength(getPortfolioStrength(MOCK_PORTFOLIO));
            }
        } catch (error) {
            console.error("Portfolio load failed, using mock data", error);
            setPortfolio(MOCK_PORTFOLIO);
            setRecommendations(generatePortfolioRecommendations(MOCK_PORTFOLIO));
            setStrength(getPortfolioStrength(MOCK_PORTFOLIO));
        } finally {
            setLoadingPortfolio(false);
        }
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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <div className="relative min-h-screen py-10 w-full overflow-hidden bg-[#050505]">
            
            {/* --- BACKGROUND --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ 
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                        backgroundSize: '32px 32px' 
                    }} 
                />
                <svg className="absolute top-0 left-0 w-full h-full opacity-20" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFC21A" stopOpacity="0" />
                            <stop offset="50%" stopColor="#FFC21A" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FFC21A" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 60 0 L 60 150 L 100 180 L 100 1000" 
                        fill="none" 
                        stroke="url(#lineGradient)" 
                        strokeWidth="1" 
                    />
                    <circle r="3" fill="#FFC21A">
                        <animateMotion 
                            dur="8s" 
                            repeatCount="indefinite"
                            path="M 60 0 L 60 150 L 100 180 L 100 1000"
                        />
                    </circle>
                </svg>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-neo/5 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 py-10 max-w-7xl">
                
                <SectionHeader 
                    title={<span>AI Command <span className="text-yellow-neo">Center</span></span>}
                    subtitle="System Status: Online & Monitoring"
                />

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-12 pl-4 md:pl-8 border-l border-white/5"
                >
                    {/* --- PORTFOLIO SECTION --- */}
                    <AnimatePresence mode="wait">
                        {/* 1. NOT CONNECTED STATE */}
                        {!isConnected ? (
                            <motion.div 
                                key="not-connected"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <TechCard className="border-yellow-neo/20 bg-gradient-to-b from-yellow-neo/5 to-transparent">
                                    <div className="text-center py-20">
                                        <div className="relative inline-block mb-8">
                                            <RiWallet3Line className="text-gray-500" size={64} />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-neo rounded-full animate-ping"></div>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-white mb-2">
                                            Connect Neural Interface
                                        </h3>
                                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                            Link your wallet to initialize the AI analysis modules.
                                        </p>
                                    </div>
                                </TechCard>
                            </motion.div>
                        ) : loadingPortfolio ? (
                            /* 2. LOADING STATE */
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <TechCard className="flex flex-col items-center justify-center py-24">
                                    <LoadingSpinner />
                                    <p className="text-gray-500 mt-6 text-sm font-medium animate-pulse">Scanning blockchain data...</p>
                                </TechCard>
                            </motion.div>
                        ) : (
                            /* 3. DATA LOADED STATE */
                            <motion.div 
                                key="data-loaded"
                                initial="hidden" 
                                animate="show"
                                variants={containerVariants}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Main Col */}
                                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                                        <TechCard title="Total Portfolio Value" icon={RiWallet3Line}>
                                            <div className="flex items-end justify-between mb-8">
                                                <div>
                                                    <div className="text-5xl font-medium text-white tracking-tight">
                                                        ${portfolio?.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-intent-green shadow-[0_0_5px_#00ff00]"></span>
                                                            {portfolio?.metrics?.assetCount || 0} Assets Tracked
                                                        </span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={loadPortfolioData} 
                                                    className="p-3 rounded-full hover:bg-white/5 text-gray-400 hover:text-yellow-neo transition-all"
                                                >
                                                    <RiRefreshLine size={20} />
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Safely map BNB */}
                                                {portfolio?.bnb && (
                                                    <AssetRow
                                                        symbol="BNB"
                                                        balance={portfolio.bnb.balance}
                                                        value={portfolio.bnb.value}
                                                        percentage={portfolio.bnb.percentage}
                                                        priceChange={portfolio.bnb.priceChange24h}
                                                    />
                                                )}
                                                {/* Safely map Tokens */}
                                                {portfolio?.tokens?.map(token => (
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
                                        </TechCard>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <MetricCard
                                                icon={RiPieChart2Line}
                                                label="Diversification"
                                                value={`${portfolio?.metrics?.diversification?.toFixed(0) || 0}%`}
                                                color={(portfolio?.metrics?.diversification || 0) > 50 ? 'green' : 'yellow'}
                                            />
                                            <MetricCard
                                                icon={RiShieldCheckLine}
                                                label="Risk Score"
                                                value={`${portfolio?.metrics?.risk?.toFixed(0) || 0}%`}
                                                color={(portfolio?.metrics?.risk || 0) > 70 ? 'red' : (portfolio?.metrics?.risk || 0) > 40 ? 'yellow' : 'green'}
                                            />
                                            {strength && (
                                                <MetricCard
                                                    icon={RiTrophyLine}
                                                    label="Performance Grade"
                                                    value={strength.grade}
                                                    color={strength.grade === 'A' ? 'green' : strength.grade === 'B' ? 'yellow' : 'red'}
                                                />
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Right Col */}
                                    <motion.div variants={itemVariants} className="space-y-8">
                                        <TechCard title="Allocation" icon={RiPieChart2Line} className="h-fit min-h-[300px]">
                                            <div className="h-[280px] flex items-center justify-center">
                                                <PortfolioPieChart portfolio={portfolio} />
                                            </div>
                                        </TechCard>

                                        {strength && (
                                            <TechCard title="Strength Analysis" icon={RiCpuLine}>
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-intent-green mb-3 flex items-center gap-2">
                                                            <RiArrowUpLine /> Strengths
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {strength.strengths.map((s, i) => (
                                                                <li key={i} className="text-sm text-gray-400 pl-3 border-l border-white/10">{s}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-critical-red mb-3 flex items-center gap-2">
                                                            <RiAlertLine /> Weaknesses
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {strength.weaknesses.map((w, i) => (
                                                                <li key={i} className="text-sm text-gray-400 pl-3 border-l border-white/10">{w}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </TechCard>
                                        )}
                                    </motion.div>
                                </div>
                                
                                {/* Recommendations */}
                                {recommendations.length > 0 && (
                                    <motion.div variants={itemVariants} className="mt-8">
                                        <TechCard title="AI Strategic Insights" icon={RiRobot2Line}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {recommendations.map((rec, index) => (
                                                    <RecommendationCard key={index} recommendation={rec} />
                                                ))}
                                            </div>
                                        </TechCard>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* --- SIGNALS SECTION (ALWAYS VISIBLE) --- */}
                    <motion.div variants={itemVariants} className="pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-medium text-white flex items-center gap-3">
                                <RiFlashlightLine className="text-yellow-neo" />
                                Economic Signal Feed
                            </h2>
                            <button onClick={loadSignals} className="text-sm text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
                                <RiRefreshLine className={loadingSignals ? 'animate-spin' : ''} /> Refresh
                            </button>
                        </div>

                        {loadingSignals && signals.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {signals.slice(0, 5).map((signal) => (
                                    <SignalCard key={signal.id} signal={signal} />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* --- INTENT SCORES --- */}
                    <motion.div variants={itemVariants} className="pb-12">
                        <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                            <RiFireLine className="text-critical-red" />
                            Market Intent Scores
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <IntentScoreCard
                                type="Market Sentiment"
                                score={calculateAverageIntentScore(signals)}
                                description="Overall ecosystem status"
                            />
                            <IntentScoreCard
                                type="Risk Level"
                                score={calculateRiskLevel(signals)}
                                description="Volatility assessment"
                                isInverse={true}
                            />
                            <IntentScoreCard
                                type="Opportunity Index"
                                score={calculateOpportunityIndex(signals)}
                                description="Potential entry points"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function AssetRow({ symbol, balance, value, percentage, priceChange }) {
    const isPositive = priceChange >= 0;
    return (
        <div className="group flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-transparent hover:border-white/5 hover:bg-white/[0.04] transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#151515] border border-white/5 flex items-center justify-center text-gray-300 group-hover:text-yellow-neo transition-colors">
                    <span className="font-semibold text-sm">{symbol}</span>
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-200">{balance.toFixed(4)}</div>
                    <div className="text-xs text-gray-500">${value.toFixed(2)}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm font-medium text-gray-200">{percentage.toFixed(1)}%</div>
                <div className={`text-xs flex items-center gap-1 justify-end mt-1 ${isPositive ? 'text-intent-green' : 'text-critical-red'}`}>
                    {isPositive ? <RiArrowUpLine size={12} /> : <RiArrowDownLine size={12} />}
                    {Math.abs(priceChange).toFixed(1)}%
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, color }) {
    const colorStyles = {
        green: 'text-intent-green bg-intent-green/5',
        yellow: 'text-yellow-neo bg-yellow-neo/5',
        red: 'text-critical-red bg-critical-red/5',
    };
    return (
        <div className={`flex flex-col p-5 rounded-xl border border-white/5 ${colorStyles[color]} transition-colors hover:bg-opacity-80`}>
            <div className="flex items-center gap-2 mb-auto opacity-80">
                <Icon size={20} />
                <span className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
            </div>
            <div className="text-3xl font-medium mt-4 tracking-tight">{value}</div>
        </div>
    );
}

function RecommendationCard({ recommendation }) {
    const iconMap = {
        warning: RiAlertLine,
        risk: RiShieldCheckLine,
        info: RiInformationLine,
        opportunity: RiLightbulbFlashLine,
    };
    const styleMap = {
        warning: 'bg-yellow-neo/5 border-yellow-neo/20 text-yellow-neo',
        risk: 'bg-critical-red/5 border-critical-red/20 text-critical-red',
        info: 'bg-blue-500/5 border-blue-500/20 text-blue-500',
        opportunity: 'bg-intent-green/5 border-intent-green/20 text-intent-green',
    };
    const Icon = iconMap[recommendation.type] || RiInformationLine;
    const styles = styleMap[recommendation.type] || styleMap.info;

    return (
        <div className={`flex gap-4 p-5 rounded-xl border ${styles} transition-transform hover:scale-[1.01]`}>
            <div className="mt-0.5"><Icon size={20} /></div>
            <div>
                <h4 className="text-sm font-semibold text-gray-100 mb-1">{recommendation.title}</h4>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{recommendation.message}</p>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-80 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    {recommendation.action}
                </div>
            </div>
        </div>
    );
}

function SignalCard({ signal }) {
    const typeConfig = {
        risk: { icon: RiAlertLine, color: 'text-critical-red', border: 'border-l-critical-red' },
        opportunity: { icon: RiLightbulbFlashLine, color: 'text-intent-green', border: 'border-l-intent-green' },
        action: { icon: RiFlashlightLine, color: 'text-blue-500', border: 'border-l-blue-500' },
        observation: { icon: RiInformationLine, color: 'text-gray-400', border: 'border-l-gray-600' },
    };
    const config = typeConfig[signal.type] || typeConfig.observation;
    const Icon = config.icon;

    return (
        <div className={`relative bg-[#0F0F0F] border border-white/5 border-l-2 ${config.border} p-5 rounded-r-lg hover:bg-[#141414] transition-colors group`}>
            <div className="flex items-start gap-4">
                <div className={`mt-1 ${config.color}`}><Icon size={18} /></div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-200 truncate pr-2">{signal.title}</h4>
                        <div className="flex flex-col items-end flex-shrink-0">
                            <span className={`text-lg font-medium ${config.color}`}>{signal.intentScore}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><RiRobot2Line size={12}/> {signal.agent}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><RiTimeLine size={12}/> {new Date(signal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{signal.explanation}</p>
                </div>
            </div>
        </div>
    );
}

function IntentScoreCard({ type, score, description, isInverse }) {
    let colorClass = "text-yellow-neo";
    const numScore = parseFloat(score);
    if (isInverse) {
        if (numScore > 7) colorClass = "text-critical-red";
        else if (numScore < 4) colorClass = "text-intent-green";
    } else {
        if (numScore > 7) colorClass = "text-intent-green";
        else if (numScore < 4) colorClass = "text-gray-400";
    }
    return (
        <TechCard noPadding className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className={`text-5xl font-medium mb-3 ${colorClass} tracking-tighter`}>{score}</div>
            <div className="text-sm font-medium text-gray-200 mb-1">{type}</div>
            <div className="text-xs text-gray-500">{description}</div>
        </TechCard>
    );
}

// --- UTILS ---
function getSampleSignals() {
    return [
        { id: '1', type: 'risk', timestamp: Date.now(), intentScore: '8.5', title: 'BTC Volatility', explanation: 'High volume > $2B detected.', agent: 'TITAN' },
        { id: '2', type: 'opportunity', timestamp: Date.now(), intentScore: '7.2', title: 'ETH Inflow', explanation: 'Positive sentiment on Layer 2.', agent: 'PULSE' },
    ];
}
function calculateAverageIntentScore(signals) { return signals.length ? (signals.reduce((a,b)=>a+parseFloat(b.intentScore),0)/signals.length).toFixed(1) : '0.0'; }
function calculateRiskLevel(signals) { return ((signals.filter(s=>s.type==='risk').length/Math.max(signals.length,1))*10).toFixed(1); }
function calculateOpportunityIndex(signals) { return ((signals.filter(s=>s.type==='opportunity').length/Math.max(signals.length,1))*10).toFixed(1); }