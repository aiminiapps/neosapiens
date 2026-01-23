'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    RiFlashlightLine, 
    RiNewspaperLine, 
    RiRefreshLine, 
    RiFireLine, 
    RiBarChartGroupedLine, 
    RiAlertLine, 
    RiLightbulbFlashLine, 
    RiEyeLine, 
    RiRobot2Line, 
    RiTimeLine, 
    RiExternalLinkLine,
    RiArrowUpLine,
    RiArrowDownLine,
    RiGlobalLine,
    RiFilter3Line
} from 'react-icons/ri';

// --- UTILS: NO-KEY API FETCHERS (Kept the same) ---

async function fetchPublicCryptoNews() {
    try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss');
        const data = await res.json();
        
        if (data.status === 'ok') {
            return data.items.map(item => ({
                id: item.guid,
                title: item.title,
                url: item.link,
                timestamp: new Date(item.pubDate).getTime(),
                category: 'news',
                source: 'CoinTelegraph',
                type: (item.title.toLowerCase().includes('surge') || item.title.toLowerCase().includes('bull') || item.title.toLowerCase().includes('high')) ? 'opportunity' :
                      (item.title.toLowerCase().includes('crash') || item.title.toLowerCase().includes('ban') || item.title.toLowerCase().includes('risk')) ? 'risk' : 'observation',
                intentScore: (Math.random() * (9.5 - 6.0) + 6.0).toFixed(1),
                explanation: item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
                agent: 'NewsBot-V1'
            }));
        }
        return [];
    } catch (e) {
        console.error("News fetch error", e);
        return [];
    }
}

async function fetchPublicMarketData() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h');
        const data = await res.json();
        
        return data.map(coin => ({
            id: `market-${coin.id}`,
            title: `${coin.symbol.toUpperCase()} Price Movement`,
            timestamp: Date.now(),
            category: 'market',
            source: 'CoinGecko',
            type: Math.abs(coin.price_change_percentage_24h) > 5 ? 'action' : 'observation',
            intentScore: (Math.abs(coin.price_change_percentage_24h) / 2 + 5).toFixed(1),
            explanation: `${coin.name} is currently trading at $${coin.current_price.toLocaleString()} with a 24h change of ${coin.price_change_percentage_24h.toFixed(2)}%. Volume: $${(coin.total_volume/1000000).toFixed(0)}M.`,
            agent: 'MarketWatch',
            data: { 
                coin: coin.symbol.toUpperCase(), 
                change: coin.price_change_percentage_24h 
            }
        }));
    } catch (e) {
        console.error("Market fetch error", e);
        return [];
    }
}

// --- SHARED UI COMPONENTS (Exact match with AICommandCenter) ---

const TechCard = ({ children, className = "" }) => (
    <div className={`relative group bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 ${className}`}>
        {/* Soft Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
        {children}
    </div>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="relative mb-2 pl-6">
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

const FilterBadge = ({ label, active, onClick, count }) => (
    <button
        onClick={onClick}
        className={`
            relative px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-between w-full
            ${active 
                ? 'bg-yellow-neo/10 text-yellow-neo border border-yellow-neo/30 shadow-[0_0_10px_rgba(255,194,26,0.2)]' 
                : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-gray-200'
            }
        `}
    >
        <span>{label}</span>
        {count !== undefined && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${active ? 'bg-yellow-neo/20' : 'bg-black/20'}`}>
                {count}
            </span>
        )}
    </button>
);

const SignalCard = ({ signal }) => {
    const typeConfig = {
        risk: { icon: RiAlertLine, color: 'text-critical-red', border: 'border-l-critical-red', bg: 'bg-critical-red/5' },
        opportunity: { icon: RiLightbulbFlashLine, color: 'text-intent-green', border: 'border-l-intent-green', bg: 'bg-intent-green/5' },
        action: { icon: RiFlashlightLine, color: 'text-blue-500', border: 'border-l-blue-500', bg: 'bg-blue-500/5' },
        observation: { icon: RiEyeLine, color: 'text-gray-400', border: 'border-l-gray-600', bg: 'bg-white/5' },
    };

    const config = typeConfig[signal.type] || typeConfig.observation;
    const Icon = config.icon;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative bg-[#0F0F0F] border border-white/5 border-l-2 ${config.border} p-5 rounded-r-lg hover:bg-[#141414] transition-colors`}
        >
            <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 border border-white/5 mt-1`}>
                    <Icon className={config.color} size={18} />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-100 group-hover:text-yellow-neo transition-colors">
                                {signal.title}
                            </h3>
                            
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono mt-1">
                                <span className="flex items-center gap-1">
                                    <RiRobot2Line size={10} /> {signal.agent}
                                </span>
                                <span className="opacity-30">|</span>
                                <span className="flex items-center gap-1">
                                    <RiTimeLine size={10} /> {new Date(signal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>

                        {/* Intent Score */}
                        <div className="flex flex-col items-end flex-shrink-0">
                            <span className={`text-lg font-medium font-mono ${config.color}`}>
                                {signal.intentScore}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                        {signal.explanation}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            {signal.data?.coin && (
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${signal.data.change >= 0 ? 'bg-intent-green/10 text-intent-green' : 'bg-critical-red/10 text-critical-red'}`}>
                                    {signal.data.coin} 
                                    {signal.data.change && (signal.data.change >= 0 ? <RiArrowUpLine size={10}/> : <RiArrowDownLine size={10}/>)}
                                    {signal.data.change ? Math.abs(signal.data.change).toFixed(2) + '%' : ''}
                                </span>
                            )}
                            <span className={`flex items-center gap-1 text-[10px] uppercase font-bold ${signal.category === 'news' ? 'text-blue-500' : 'text-purple-500'}`}>
                                {signal.category}
                            </span>
                        </div>

                        {signal.url && (
                            <a 
                                href={signal.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-yellow-neo uppercase tracking-wide transition-colors"
                            >
                                Source <RiExternalLinkLine size={10} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE ---

export default function SignalsPage() {
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const loadData = async () => {
        setLoading(true);
        const [news, market] = await Promise.all([
            fetchPublicCryptoNews(),
            fetchPublicMarketData()
        ]);
        const combined = [...news, ...market].sort((a, b) => b.timestamp - a.timestamp);
        setSignals(combined);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredSignals = signals.filter(s => filter === 'all' || s.type === filter);

    // Animation Containers
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="relative min-h-screen w-full py-10 overflow-hidden bg-[#050505]">
            
            {/* --- BACKGROUND (EXACT MATCH TO /AI) --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 1. Subtle Mesh Texture */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ 
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                        backgroundSize: '32px 32px' 
                    }} 
                />
                
                {/* 2. The Tech Line (Dynamic flow connecting sections) */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-20" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFC21A" stopOpacity="0" />
                            <stop offset="50%" stopColor="#FFC21A" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FFC21A" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    
                    {/* The line path */}
                    <path 
                        d="M 60 0 L 60 150 L 100 180 L 100 1000" 
                        fill="none" 
                        stroke="url(#lineGradient)" 
                        strokeWidth="1" 
                    />
                    
                    {/* Animated Data Packet */}
                    <circle r="3" fill="#FFC21A">
                        <animateMotion 
                            dur="8s" 
                            repeatCount="indefinite"
                            path="M 60 0 L 60 150 L 100 180 L 100 1000"
                        />
                    </circle>
                </svg>

                {/* 3. Ambient Light Spot */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-neo/5 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 py-10 max-w-7xl">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <SectionHeader 
                        title={<span>Signal <span className="text-yellow-neo">Feed</span></span>}
                        subtitle="Real-time AI Analysis"
                    />
                    
                    <button 
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white rounded-full transition-all text-xs font-bold uppercase tracking-wide disabled:opacity-50"
                    >
                        <RiRefreshLine className={loading ? 'animate-spin' : ''} size={14} />
                        {loading ? 'Scanning...' : 'Refresh'}
                    </button>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-8 pl-4 md:pl-8 border-l border-white/5" // This connects visually to the SVG line
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon={RiFlashlightLine} label="Total Signals" value={signals.length} />
                        <StatCard icon={RiAlertLine} label="Risk Alerts" value={signals.filter(s => s.type === 'risk').length} color="text-critical-red" />
                        <StatCard icon={RiLightbulbFlashLine} label="Opportunities" value={signals.filter(s => s.type === 'opportunity').length} color="text-intent-green" />
                        <StatCard icon={RiFireLine} label="High Intent" value={signals.filter(s => s.intentScore > 8).length} color="text-blue-500" />
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
                        
                        {/* Left: Filters Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <TechCard className="p-5 sticky top-24">
                                <div className="flex items-center gap-2 mb-6 text-gray-200">
                                    <RiFilter3Line className="text-yellow-neo" size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Signal Filters</span>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <FilterBadge label="All Signals" active={filter === 'all'} count={signals.length} onClick={() => setFilter('all')} />
                                    <FilterBadge label="Risks" active={filter === 'risk'} count={signals.filter(s => s.type === 'risk').length} onClick={() => setFilter('risk')} />
                                    <FilterBadge label="Opportunities" active={filter === 'opportunity'} count={signals.filter(s => s.type === 'opportunity').length} onClick={() => setFilter('opportunity')} />
                                    <FilterBadge label="Market Action" active={filter === 'action'} count={signals.filter(s => s.type === 'action').length} onClick={() => setFilter('action')} />
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <div className="text-[10px] text-gray-500 font-mono uppercase mb-3">Live Sources</div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span className="flex items-center gap-2"><RiGlobalLine size={12}/> CoinTelegraph</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-intent-green animate-pulse"></span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span className="flex items-center gap-2"><RiBarChartGroupedLine size={12}/> CoinGecko</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-intent-green animate-pulse"></span>
                                        </div>
                                    </div>
                                </div>
                            </TechCard>
                        </div>

                        {/* Right: Feed */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                {loading && signals.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/5 rounded-xl">
                                        <RiRefreshLine className="animate-spin text-gray-600 mb-4" size={32} />
                                        <p className="text-gray-500 font-medium text-sm">Intercepting global crypto signals...</p>
                                    </div>
                                ) : filteredSignals.length === 0 ? (
                                    <div className="text-center py-24 border border-dashed border-white/5 rounded-xl">
                                        <RiEyeLine className="mx-auto text-gray-600 mb-4" size={32} />
                                        <p className="text-gray-500 text-sm">No signals detected for this frequency.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredSignals.map((signal) => (
                                            <SignalCard key={signal.id} signal={signal} />
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Simple Stat Component
function StatCard({ icon: Icon, label, value, color = "text-yellow-neo" }) {
    return (
        <TechCard className="p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg bg-white/5 ${color} bg-opacity-10`}>
                <Icon size={20} className={color} />
            </div>
            <div>
                <div className="text-xl font-bold text-white tracking-tight">{value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{label}</div>
            </div>
        </TechCard>
    );
}