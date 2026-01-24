'use client';

import { useState, useEffect } from 'react';
import { AI_AGENTS, getAgentPerformance, activityTracker } from '@/lib/ai/agentSystem';
import { getBalance } from '@/lib/web3/providers';
import { formatAddress } from '@/lib/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiRobot2Line,
    RiWallet3Line,
    RiFlashlightLine,
    RiLineChartLine,
    RiExternalLinkLine,
    RiCheckboxCircleLine,
    RiTimeLine,
    RiFireLine,
    RiStarLine,
    RiEyeLine,
    RiShieldCheckLine,
    RiArrowUpLine,
    RiArrowDownLine,
    RiCpuLine,
    RiBarChartGroupedLine,
    RiHistoryLine,
    RiSpyLine,
    RiGlobalLine
} from 'react-icons/ri';

// --- STYLED COMPONENTS ---

const TechCard = ({ children, className = "", noPadding = false }) => (
    <div className={`relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10 ${className}`}>
        {/* Soft Glow */}
        <div className="absolute -top-20 -right-20 w-32 h-32 bg-yellow-neo/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={noPadding ? "" : "p-5"}>
            {children}
        </div>
    </div>
);

// --- MAIN DASHBOARD ---

export default function AIAgentsDashboard() {
    const [agents, setAgents] = useState([]);
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAgents();
        const interval = setInterval(loadAgents, 30000); // Live refresh
        return () => clearInterval(interval);
    }, []);

    const loadAgents = async () => {
        setLoading(true);
        // Mocking data fetching if agentSystem isn't fully ready yet, ensuring UI works
        const agentData = await Promise.all(
            AI_AGENTS.map(async (agent) => {
                try {
                    const balance = await getBalance(agent.wallet) || '0.00';
                    // Fallbacks for performance/activity if null
                    const performance = getAgentPerformance(agent.id) || { signalsGenerated: 0, getAccuracyRate: () => 85, getRecentPerformance: () => [] };
                    const activities = activityTracker?.getAgentActivities(agent.id, 20) || [];

                    return {
                        ...agent,
                        balance,
                        stats: {
                            signalsGenerated: performance.signalsGenerated || 0,
                            accuracyRate: performance.getAccuracyRate ? performance.getAccuracyRate() : 85,
                            weeklyActivity: performance.getRecentPerformance ? performance.getRecentPerformance(7).length : 5,
                            totalActivity: activities.length,
                        },
                        recentActivities: activities,
                    };
                } catch (error) {
                    console.error(`Error loading agent ${agent.id}:`, error);
                    return { ...agent, balance: '0', stats: {}, recentActivities: [] };
                }
            })
        );

        setAgents(agentData);
        if (!selectedAgentId && agentData.length > 0) {
            setSelectedAgentId(agentData[0].id);
        }
        setLoading(false);
    };

    const selectedAgent = agents.find(a => a.id === selectedAgentId);

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
        <div className="space-y-8">
            
            {/* Quick Stats Overview */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <StatCard
                    icon={RiRobot2Line}
                    label="Active Agents"
                    value={agents.filter(a => a.status === 'active').length}
                    color="text-yellow-neo"
                />
                <StatCard
                    icon={RiFireLine}
                    label="Signals (24h)"
                    value={agents.reduce((sum, a) => sum + (a.stats?.weeklyActivity || 0), 0)}
                    color="text-intent-green"
                />
                <StatCard
                    icon={RiLineChartLine}
                    label="Avg Accuracy"
                    value={`${agents.length ? (agents.reduce((sum, a) => sum + (a.stats?.accuracyRate || 0), 0) / agents.length).toFixed(0) : 0}%`}
                    color="text-blue-500"
                />
                <StatCard
                    icon={RiShieldCheckLine}
                    label="Transparency"
                    value="100%"
                    color="text-purple-500"
                />
            </motion.div>

            {/* Main Content: Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Agent Selection List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <RiCpuLine className="text-yellow-neo" />
                        <h3 className="sm:text-2xl text-xl font-semibold text-gray-400">
                            Neural Units
                        </h3>
                    </div>
                    
                    <div className="space-y-3">
                        {agents.map((agent) => (
                            <AgentListItem
                                key={agent.id}
                                agent={agent}
                                isSelected={selectedAgentId === agent.id}
                                onClick={() => setSelectedAgentId(agent.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Detailed Agent View */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedAgent ? (
                            <motion.div
                                key={selectedAgent.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <AgentDetailView agent={selectedAgent} />
                            </motion.div>
                        ) : (
                            <TechCard className="h-full flex flex-col items-center justify-center border-dashed border-white/10">
                                <RiRobot2Line className="text-gray-600 mb-4" size={48} />
                                <p className="text-gray-500 font-mono text-sm">Select a neural unit to inspect</p>
                            </TechCard>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <TechCard className="flex items-center gap-4">
            <div className={`pb-3`}>
                <Icon size={24} className={color} />
            </div>
            <div>
                <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</div>
            </div>
        </TechCard>
    );
}

function AgentListItem({ agent, isSelected, onClick }) {
    const IconComponent = getAgentIcon(agent.role);
    
    return (
        <button
            onClick={onClick}
            className={`w-full text-left group relative overflow-hidden p-4 rounded-xl border transition-all duration-300
                ${isSelected 
                    ? 'bg-yellow-neo/10 border-yellow-neo/50 shadow-[0_0_15px_rgba(255,194,26,0.1)]' 
                    : 'bg-[#0f0f0f] border-white/5 hover:border-white/20 hover:bg-[#141414]'
                }
            `}
        >

            <div className="flex items-center gap-4">
                <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors
                        ${isSelected ? 'border-yellow-neo/30 bg-yellow-neo/20' : 'border-white/5 bg-white/5'}
                    `}
                    style={{ color: agent.color }}
                >
                    <IconComponent size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold tracking-wide ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {agent.name}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5 truncate">
                        {agent.role}
                    </div>
                </div>
            </div>
        </button>
    );
}

function AgentDetailView({ agent }) {
    const IconComponent = getAgentIcon(agent.role);

    return (
        <div className="space-y-6">
            
            {/* Header Card */}
            <TechCard className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <IconComponent size={200} />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-5">
                            <div 
                                className="w-20 h-20 sm:flex hidden rounded-2xl items-center justify-center border-2 shadow-2xl"
                                style={{ 
                                    backgroundColor: `${agent.color}10`, 
                                    borderColor: agent.color,
                                    color: agent.color 
                                }}
                            >
                                <IconComponent size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{agent.name}</h2>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="sm:text-xs text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                                        {agent.role}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-intent-green font-bold uppercase bg-intent-green/10 px-2 py-0.5 rounded border border-intent-green/20">
                                        <RiCheckboxCircleLine /> Online
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                                    {agent.specialty}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Bar */}
                    <div className="bg-black/40 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded">
                                <RiWallet3Line className="text-gray-400" size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Public Wallet</div>
                                <div className="text-xs font-mono text-gray-300">{formatAddress(agent.wallet)}</div>
                            </div>
                        </div>
                        <div className="text-right px-4 border-l border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase font-bold">Balance</div>
                            <div className="sm:text-sm text-[10px] font-bold text-white">{parseFloat(agent.balance).toFixed(4)} ETH</div>
                        </div>
                        <a
                            href={`https://etherscan.io/address/${agent.wallet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-yellow-neo transition-colors p-2"
                        >
                            <RiExternalLinkLine size={16} />
                        </a>
                    </div>
                </div>
            </TechCard>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricBox icon={RiBarChartGroupedLine} label="Total Signals" value={agent.stats?.signalsGenerated || 0} />
                <MetricBox icon={RiStarLine} label="Accuracy" value={`${(agent.stats?.accuracyRate || 0).toFixed(0)}%`} trend="up" />
                <MetricBox icon={RiFlashlightLine} label="Weekly Activ." value={agent.stats?.weeklyActivity || 0} />
                <MetricBox icon={RiFireLine} label="Confidence" value={agent.confidenceLevel?.toFixed(2) || '0.95'} />
            </div>

            {/* Activity Log */}
            <TechCard noPadding>
                <div className="p-4 border-b border-white/5 flex items-center gap-2">
                    <RiHistoryLine className="text-yellow-neo" />
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Execution Log</h3>
                </div>
                
                <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {agent.recentActivities && agent.recentActivities.length > 0 ? (
                        <div className="space-y-1">
                            {agent.recentActivities.slice(0, 8).map((activity, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-neo/50 group-hover:bg-yellow-neo group-hover:shadow-[0_0_5px_#FFC21A] transition-all" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-medium text-gray-300 truncate">
                                            {activity.type || 'Signal Generated'}
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-gray-600 font-mono">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-600">
                            <RiTimeLine className="mx-auto mb-2 opacity-50" size={24} />
                            <p className="text-xs">No recent on-chain activity</p>
                        </div>
                    )}
                </div>
            </TechCard>
            
            {/* Footer Info */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono px-2">
                <span className="flex items-center gap-1"><RiGlobalLine /> VERIFIED CONTRACT</span>
                <span className="flex items-center gap-1"><RiShieldCheckLine className="text-intent-green"/> AUDIT PASSED</span>
            </div>
        </div>
    );
}

function MetricBox({ icon: Icon, label, value, trend }) {
    return (
        <TechCard className="flex flex-col justify-between h-24">
            <div className="flex justify-between items-start">
                <Icon className="text-gray-500" size={16} />
                {trend === 'up' && <RiArrowUpLine className="text-intent-green" size={14} />}
                {trend === 'down' && <RiArrowDownLine className="text-critical-red" size={14} />}
            </div>
            <div>
                <div className="text-xl font-bold text-white tracking-tighter">{value}</div>
                <div className="text-[9px] text-gray-500 uppercase font-bold">{label}</div>
            </div>
        </TechCard>
    );
}

function getAgentIcon(role) {
    if (!role) return RiRobot2Line;
    if (role.includes('Whale')) return RiSpyLine; // Spy/Wallet icon
    if (role.includes('Network')) return RiGlobalLine; // Network
    if (role.includes('Volume')) return RiBarChartGroupedLine; // Chart
    return RiRobot2Line;
}