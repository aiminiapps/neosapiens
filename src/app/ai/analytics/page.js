'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { poeiTracker } from '@/lib/ai/poeiAnalytics';
import PoEITrendChart from '@/components/charts/PoEITrendChart';
import CapitalFlowChart from '@/components/charts/CapitalFlowChart';
import WalletClusterChart from '@/components/charts/WalletClusterChart';
import SignalTypeDistribution from '@/components/charts/SignalTypeDistribution';
import AgentPerformanceBar from '@/components/charts/AgentPerformanceBar';
import {
    RiBarChartGroupedLine,
    RiTrophyLine,
    RiFocus2Line,
    RiTimeLine,
    RiInformationLine,
    RiArrowUpLine,
    RiArrowDownLine,
    RiPieChart2Line,
    RiGroupLine,
    RiExchangeDollarLine,
    RiBubbleChartLine
} from 'react-icons/ri';

// --- STYLED COMPONENTS ---

const TechCard = ({ children, className = "", title, icon: Icon, subtitle }) => (
    <div className={`relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10 ${className}`}>
        {/* Soft Glow */}
        <div className="absolute -top-20 -right-20 w-32 h-32 bg-yellow-neo/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Card Header (Optional) */}
        {(title || Icon) && (
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="text-yellow-neo" size={18} />}
                    <div>
                        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">{title}</h3>
                        {subtitle && <p className="text-[10px] text-gray-500 font-mono mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                {/* Decorative dots */}
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                </div>
            </div>
        )}

        <div className="p-4 ">
            {children}
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="relative mb-10 pl-6">
        <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="sm:text-xl text-3xl font-semibold tracking-tight text-white"
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

// --- MAIN PAGE ---

export default function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [trendData, setTrendData] = useState(null);

    useEffect(() => {
        // Load PoEI statistics (Mock or Real)
        const poeiStats = poeiTracker?.getAggregateStats() || { 
            avgPoEIScore: 82.5, 
            accuracyRate: 94, 
            accurateSignals: 450, 
            verifiedSignals: 478, 
            totalSignals: 512 
        };
        setStats(poeiStats);

        const trend = poeiTracker?.getTrendData(14) || [];
        setTrendData(trend);
    }, []);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative min-h-screen py-10 w-full overflow-hidden bg-[#050505]">
            
            {/* --- BACKGROUND LAYER --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 1. Mesh Texture */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ 
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                        backgroundSize: '32px 32px' 
                    }} 
                />
                
                {/* 2. The Tech Line Animation */}
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

                {/* 3. Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-neo/5 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-10 container mx-auto md:px-12 py-10 max-w-7xl">
                
                <SectionHeader 
                    title={<span>Analytics <span className="text-yellow-neo">Dashboard</span></span>}
                    subtitle="Market Impact Metrics"
                />

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="pl-4 md:pl-8 border-l border-white/5 space-y-8"
                >

                    {/* Info Banner - Terminal Style */}
                    <motion.div variants={itemVariants} className="relative bg-yellow-neo/5 border-l-2 border-yellow-neo p-4 rounded-r-lg">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-yellow-neo/10 rounded-lg">
                                <RiInformationLine className="text-yellow-neo" size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                                    System Definition: Proof of Economic Intent (PoEI)
                                </h3>
                                <p className="text-xs text-gray-400 font-mono leading-relaxed max-w-3xl">
                                    PoEI scores (0-100) quantify the predictive accuracy of AI signals against realized market movements. 
                                    High-latency validation ensures scoring reflects true economic impact rather than noise.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Key Metrics Grid */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <MetricCard
                                icon={RiBarChartGroupedLine}
                                label="Avg PoEI Score"
                                value={stats.avgPoEIScore.toFixed(1)}
                                subtitle="Global System Average"
                                trend="up"
                                trendValue="+5.2%"
                                color="text-yellow-neo"
                            />
                            <MetricCard
                                icon={RiTrophyLine}
                                label="Accuracy Rate"
                                value={`${stats.accuracyRate.toFixed(0)}%`}
                                subtitle={`${stats.accurateSignals} Verified Hits`}
                                trend="up"
                                trendValue="+3.1%"
                                color="text-intent-green"
                            />
                            <MetricCard
                                icon={RiFocus2Line}
                                label="Total Signals"
                                value={stats.totalSignals}
                                subtitle="Lifetime Generation"
                                color="text-blue-500"
                            />
                            <MetricCard
                                icon={RiTimeLine}
                                label="7-Day Volume"
                                value={stats.verifiedSignals}
                                subtitle="Processing Load"
                                trend="up"
                                trendValue="+12"
                                color="text-purple-500"
                            />
                        </div>
                    )}

                    {/* Main Chart - PoEI Trend (Full Width) */}
                    <motion.div variants={itemVariants}>
                        <TechCard 
                            title="Predictive Accuracy Trend" 
                            icon={RiBarChartGroupedLine}
                            subtitle="14-Day Performance Rolling Average"
                        >
                            <div className="h-fit w-full">
                                <PoEITrendChart trendData={trendData} />
                            </div>
                        </TechCard>
                    </motion.div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Signal Type Distribution */}
                        <motion.div variants={itemVariants}>
                            <TechCard 
                                title="Signal Categorization" 
                                icon={RiPieChart2Line}
                                subtitle="Distribution by Intent Type"
                            >
                                <div className="h-fit flex items-center justify-center">
                                    <SignalTypeDistribution />
                                </div>
                            </TechCard>
                        </motion.div>

                        {/* Agent Performance Comparison */}
                        <motion.div variants={itemVariants}>
                            <TechCard 
                                title="Unit Comparison" 
                                icon={RiGroupLine}
                                subtitle="Titan vs Pulse vs Flow"
                            >
                                <div className="h-fit">
                                    <AgentPerformanceBar />
                                </div>
                            </TechCard>
                        </motion.div>
                    </div>

                    {/* Capital Flow & Wallet Clusters */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                            <TechCard 
                                title="Net Capital Flow" 
                                icon={RiExchangeDollarLine}
                                subtitle="30-Day Inflow/Outflow Analysis"
                            >
                                <div className="h-fit">
                                    <CapitalFlowChart />
                                </div>
                            </TechCard>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <TechCard 
                                title="Wallet Clusters" 
                                icon={RiBubbleChartLine}
                                subtitle="Behavioral Pattern Recognition"
                            >
                                <div className="h-fit">
                                    <WalletClusterChart />
                                </div>
                            </TechCard>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function MetricCard({ icon: Icon, label, value, subtitle, trend, trendValue, color }) {
    return (
        <TechCard className="flex flex-col justify-between h-full hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-white/5 border border-white/5 ${color} bg-opacity-10`}>
                    <Icon size={22} className={color} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-white/5 ${trend === 'up' ? 'text-intent-green' : 'text-critical-red'}`}>
                        {trend === 'up' ? <RiArrowUpLine size={12} /> : <RiArrowDownLine size={12} />}
                        {trendValue}
                    </div>
                )}
            </div>
            
            <div>
                <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
                {subtitle && (
                    <div className="text-[10px] text-gray-600 font-mono mt-1 border-t border-white/5 pt-2">
                        {subtitle}
                    </div>
                )}
            </div>
        </TechCard>
    );
}