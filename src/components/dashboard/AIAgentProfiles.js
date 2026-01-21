'use client';

import { useState, useEffect } from 'react';
import Panel from '../ui/Panel';
import { AI_AGENTS, getAgentPerformance, activityTracker } from '@/lib/ai/agentSystem';
import { getBalance } from '@/lib/web3/providers';
import { formatAddress } from '@/lib/utils/formatters';
import {
    FaCheckCircle,
    FaChartLine,
    FaWallet,
    FaBolt,
    FaClock,
    FaEye,
    FaShieldAlt,
    FaRobot,
    FaExternalLinkAlt,
    FaCircle
} from 'react-icons/fa';

export default function AIAgentProfiles() {
    const [agentData, setAgentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState(null);

    useEffect(() => {
        loadAgentData();
        // Refresh every 30 seconds
        const interval = setInterval(loadAgentData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadAgentData = async () => {
        setLoading(true);
        const data = await Promise.all(
            AI_AGENTS.map(async (agent) => {
                let balance = '0';
                try {
                    balance = await getBalance(agent.wallet);
                } catch (e) {
                    console.error(`Failed to get balance for ${agent.name}:`, e);
                }

                const performance = getAgentPerformance(agent.id);
                const activities = activityTracker.getAgentActivities(agent.id, 10);

                return {
                    ...agent,
                    balance,
                    performance: {
                        signalsGenerated: performance.signalsGenerated,
                        accuracyRate: performance.getAccuracyRate(),
                        recentActivity: performance.getRecentPerformance(7).length,
                    },
                    recentActivities: activities,
                };
            })
        );

        setAgentData(data);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-bg-panel border border-border-divider rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-intent-green/20 rounded-lg flex items-center justify-center">
                            <FaRobot className="text-intent-green" size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-text-primary">{AI_AGENTS.length}</div>
                            <div className="text-xs text-text-muted">Active AI Agents</div>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-panel border border-border-divider rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-yellow-neo/20 rounded-lg flex items-center justify-center">
                            <FaBolt className="text-yellow-neo" size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-text-primary">
                                {agentData.reduce((sum, a) => sum + (a.performance?.signalsGenerated || 0), 0)}
                            </div>
                            <div className="text-xs text-text-muted">Total Signals Generated</div>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-panel border border-border-divider rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <FaShieldAlt className="text-blue-500" size={20} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-text-primary">100%</div>
                            <div className="text-xs text-text-muted">Wallet Transparency</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {AI_AGENTS.map((agent) => {
                    const data = agentData.find(d => d.id === agent.id);

                    return (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            data={data}
                            onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
                            isExpanded={selectedAgent === agent.id}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function AgentCard({ agent, data, onClick, isExpanded }) {
    const IconComponent = getAgentIcon(agent.role);

    return (
        <div
            className={`bg-bg-secondary border rounded-lg transition-all cursor-pointer ${isExpanded
                    ? 'border-yellow-neo shadow-lg'
                    : 'border-border-divider hover:border-yellow-neo/50'
                }`}
            onClick={onClick}
        >
            {/* Card Header */}
            <div className="p-4 border-b border-border-divider">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: agent.color + '20', border: `2px solid ${agent.color}` }}
                        >
                            <IconComponent size={24} style={{ color: agent.color }} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-text-primary">{agent.name}</h3>
                            <p className="text-xs text-text-muted">{agent.role}</p>
                        </div>
                    </div>
                    {agent.status === 'active' && (
                        <div className="flex items-center gap-1 text-xs text-intent-green">
                            <FaCircle size={8} className="animate-pulse" />
                            <span>Live</span>
                        </div>
                    )}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-bg-panel rounded">
                        <div className="text-lg font-bold text-yellow-neo">
                            {data?.performance?.signalsGenerated || 0}
                        </div>
                        <div className="text-xs text-text-muted">Signals</div>
                    </div>
                    <div className="text-center p-2 bg-bg-panel rounded">
                        <div className="text-lg font-bold text-intent-green">
                            {data?.performance?.accuracyRate?.toFixed(0) || 0}%
                        </div>
                        <div className="text-xs text-text-muted">Accuracy</div>
                    </div>
                    <div className="text-center p-2 bg-bg-panel rounded">
                        <div className="text-lg font-bold text-text-primary">
                            {agent.confidenceLevel.toFixed(2)}
                        </div>
                        <div className="text-xs text-text-muted">Confidence</div>
                    </div>
                </div>
            </div>

            {/* Wallet Section */}
            <div className="p-4 bg-bg-panel/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaWallet className="text-yellow-neo" size={14} />
                        <span className="text-xs font-mono text-text-muted">{formatAddress(agent.wallet)}</span>
                        <a
                            href={`https://etherscan.io/address/${agent.wallet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted hover:text-yellow-neo transition"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaExternalLinkAlt size={10} />
                        </a>
                    </div>
                    {data && (
                        <span className="text-sm font-semibold text-text-primary">
                            {parseFloat(data.balance).toFixed(4)} ETH
                        </span>
                    )}
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="p-4 border-t border-border-divider space-y-3 animate-in fade-in duration-200">
                    <div>
                        <div className="text-xs font-semibold text-text-muted mb-2">Specialty</div>
                        <p className="text-sm text-text-secondary">{agent.specialty}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <div className="flex items-center gap-1 text-text-muted mb-1">
                                <FaClock size={10} />
                                <span>Active Since</span>
                            </div>
                            <div className="text-text-primary font-semibold">
                                {new Date(agent.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-text-muted mb-1">
                                <FaChartLine size={10} />
                                <span>Week Activity</span>
                            </div>
                            <div className="text-text-primary font-semibold">
                                {data?.performance?.recentActivity || 0} signals
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-border-divider">
                        <div className="flex items-center gap-2 text-xs text-intent-green">
                            <FaEye size={12} />
                            <span>100% Transparent • All actions on-chain</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function getAgentIcon(role) {
    if (role.includes('Whale')) return FaWallet;
    if (role.includes('Network')) return FaBolt;
    if (role.includes('Volume')) return FaChartLine;
    return FaRobot;
}
