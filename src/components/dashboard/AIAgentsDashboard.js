'use client';

import { useState, useEffect } from 'react';
import { AI_AGENTS, getAgentPerformance, activityTracker } from '@/lib/ai/agentSystem';
import { getBalance } from '@/lib/web3/providers';
import { formatAddress } from '@/lib/utils/formatters';
import {
    FaRobot,
    FaWallet,
    FaBolt,
    FaChartLine,
    FaExternalLinkAlt,
    FaCheckCircle,
    FaClock,
    FaFire,
    FaStar,
    FaEye,
    FaShieldAlt,
    FaArrowUp,
    FaArrowDown,
    FaCircle,
    FaChartBar,
    FaHistory
} from 'react-icons/fa';

export default function AIAgentsDashboard() {
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAgents();
        const interval = setInterval(loadAgents, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadAgents = async () => {
        setLoading(true);
        const agentData = await Promise.all(
            AI_AGENTS.map(async (agent) => {
                try {
                    const balance = await getBalance(agent.wallet);
                    const performance = getAgentPerformance(agent.id);
                    const activities = activityTracker.getAgentActivities(agent.id, 20);

                    return {
                        ...agent,
                        balance,
                        stats: {
                            signalsGenerated: performance.signalsGenerated,
                            accuracyRate: performance.getAccuracyRate(),
                            weeklyActivity: performance.getRecentPerformance(7).length,
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
        if (!selectedAgent && agentData.length > 0) {
            setSelectedAgent(agentData[0].id);
        }
        setLoading(false);
    };

    const selected = agents.find(a => a.id === selectedAgent);

    return (
        <div className="space-y-6">
            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    icon={FaRobot}
                    label="Active Agents"
                    value={agents.filter(a => a.status === 'active').length}
                    color="text-yellow-neo"
                    bgColor="bg-yellow-neo/10"
                />
                <StatCard
                    icon={FaFire}
                    label="Signals Today"
                    value={agents.reduce((sum, a) => sum + (a.stats?.weeklyActivity || 0), 0)}
                    color="text-intent-green"
                    bgColor="bg-intent-green/10"
                />
                <StatCard
                    icon={FaChartLine}
                    label="Avg Accuracy"
                    value={`${(agents.reduce((sum, a) => sum + (a.stats?.accuracyRate || 0), 0) / agents.length).toFixed(0)}%`}
                    color="text-blue-500"
                    bgColor="bg-blue-500/10"
                />
                <StatCard
                    icon={FaShieldAlt}
                    label="Transparency"
                    value="100%"
                    color="text-purple-500"
                    bgColor="bg-purple-500/10"
                />
            </div>

            {/* Main Content: Agent List + Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Agent List */}
                <div className="lg:col-span-1 space-y-3">
                    <h2 className="text-lg font-bold text-text-primary mb-4">NEO Units</h2>
                    {agents.map((agent) => (
                        <AgentListItem
                            key={agent.id}
                            agent={agent}
                            isSelected={selectedAgent === agent.id}
                            onClick={() => setSelectedAgent(agent.id)}
                        />
                    ))}
                </div>

                {/* Right: Agent Details */}
                <div className="lg:col-span-2">
                    {selected ? (
                        <AgentDetails agent={selected} />
                    ) : (
                        <div className="bg-bg-secondary border border-border-divider rounded-lg p-12 text-center">
                            <FaRobot className="mx-auto text-text-muted mb-4" size={48} />
                            <p className="text-text-muted">Select an agent to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color, bgColor }) {
    return (
        <div className="bg-bg-secondary border border-border-divider rounded-lg p-4 hover:border-yellow-neo/50 transition">
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={color} size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold text-text-primary">{value}</div>
                    <div className="text-xs text-text-muted">{label}</div>
                </div>
            </div>
        </div>
    );
}

function AgentListItem({ agent, isSelected, onClick }) {
    const IconComponent = getAgentIcon(agent.role);

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected
                    ? 'bg-yellow-neo/10 border-yellow-neo'
                    : 'bg-bg-secondary border-border-divider hover:border-yellow-neo/30'
                }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: agent.color + '20', border: `2px solid ${agent.color}` }}
                >
                    <IconComponent size={20} style={{ color: agent.color }} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-primary text-sm truncate">
                        {agent.name}
                    </div>
                    <div className="text-xs text-text-muted truncate">{agent.role}</div>
                </div>
                {agent.status === 'active' && (
                    <FaCircle size={8} className="text-intent-green animate-pulse flex-shrink-0" />
                )}
            </div>
        </div>
    );
}

function AgentDetails({ agent }) {
    const IconComponent = getAgentIcon(agent.role);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-bg-secondary border border-border-divider rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: agent.color + '20', border: `2px solid ${agent.color}` }}
                        >
                            <IconComponent size={32} style={{ color: agent.color }} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary">{agent.name}</h2>
                            <p className="text-text-secondary">{agent.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-intent-green/10 text-intent-green rounded-full text-sm font-semibold">
                        <FaCheckCircle size={12} />
                        Active
                    </div>
                </div>

                <p className="text-sm text-text-secondary mb-4">{agent.specialty}</p>

                {/* Wallet */}
                <div className="bg-bg-panel rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                            <FaWallet size={14} />
                            <span>Agent Wallet</span>
                        </div>
                        <a
                            href={`https://etherscan.io/address/${agent.wallet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-yellow-neo hover:text-yellow-electric transition"
                        >
                            <span>View on Etherscan</span>
                            <FaExternalLinkAlt size={10} />
                        </a>
                    </div>
                    <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-text-primary">{formatAddress(agent.wallet)}</code>
                        <div className="text-lg font-bold text-text-primary">{parseFloat(agent.balance).toFixed(4)} ETH</div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard
                    icon={FaChartBar}
                    label="Signals Generated"
                    value={agent.stats?.signalsGenerated || 0}
                    trend={null}
                />
                <MetricCard
                    icon={FaStar}
                    label="Accuracy Rate"
                    value={`${(agent.stats?.accuracyRate || 0).toFixed(0)}%`}
                    trend="up"
                />
                <MetricCard
                    icon={FaBolt}
                    label="This Week"
                    value={agent.stats?.weeklyActivity || 0}
                    trend={null}
                />
                <MetricCard
                    icon={FaFire}
                    label="Confidence"
                    value={agent.confidenceLevel.toFixed(2)}
                    trend={null}
                />
            </div>

            {/* Activity Timeline */}
            <div className="bg-bg-secondary border border-border-divider rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FaHistory className="text-yellow-neo" />
                    <h3 className="text-lg font-bold text-text-primary">Recent Activity</h3>
                </div>

                {agent.recentActivities && agent.recentActivities.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {agent.recentActivities.slice(0, 10).map((activity, index) => (
                            <ActivityItem key={activity.id || index} activity={activity} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-text-muted">
                        <FaClock className="mx-auto mb-2" size={32} />
                        <p className="text-sm">No recent activity</p>
                    </div>
                )}
            </div>

            {/* Agent Info */}
            <div className="bg-bg-secondary border border-border-divider rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FaEye className="text-yellow-neo" />
                    <h3 className="text-lg font-bold text-text-primary">Transparency Info</h3>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-border-divider">
                        <span className="text-text-muted">Active Since</span>
                        <span className="text-text-primary font-semibold">
                            {new Date(agent.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-divider">
                        <span className="text-text-muted">Wallet Access</span>
                        <span className="text-intent-green font-semibold">Read-Only</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-text-muted">On-Chain Verification</span>
                        <span className="text-intent-green font-semibold">100% Public</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, trend }) {
    return (
        <div className="bg-bg-panel border border-border-divider rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
                <Icon className="text-yellow-neo" size={16} />
                <span className="text-xs text-text-muted">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-xl font-bold text-text-primary">{value}</div>
                {trend === 'up' && <FaArrowUp className="text-intent-green" size={12} />}
                {trend === 'down' && <FaArrowDown className="text-critical-red" size={12} />}
            </div>
        </div>
    );
}

function ActivityItem({ activity }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-bg-panel rounded-lg">
            <div className="w-8 h-8 bg-yellow-neo/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaBolt className="text-yellow-neo" size={14} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary mb-1">
                    {activity.type || 'Signal Generated'}
                </div>
                <div className="text-xs text-text-muted">
                    {new Date(activity.timestamp).toLocaleString()}
                </div>
            </div>
        </div>
    );
}

function getAgentIcon(role) {
    if (role.includes('Whale')) return FaWallet;
    if (role.includes('Network')) return FaBolt;
    if (role.includes('Volume')) return FaChartLine;
    return FaRobot;
}
