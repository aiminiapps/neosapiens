'use client';

import { useState, useEffect } from 'react';
import Panel from '../ui/Panel';
import { AI_AGENTS, getAgentPerformance, activityTracker } from '@/lib/ai/agentSystem';
import { getBalance } from '@/lib/web3/providers';
import { formatAddress } from '@/lib/utils/formatters';
import { FaCheckCircle, FaChartLine, FaWallet } from 'react-icons/fa';

export default function AIAgentProfiles() {
    const [agentData, setAgentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAgentData();
    }, []);

    const loadAgentData = async () => {
        setLoading(true);
        const data = await Promise.all(
            AI_AGENTS.map(async (agent) => {
                // Get wallet balance
                let balance = '0';
                try {
                    balance = await getBalance(agent.wallet);
                } catch (e) {
                    console.error(`Failed to get balance for ${agent.name}:`, e);
                }

                // Get performance metrics
                const performance = getAgentPerformance(agent.id);

                // Get recent activities
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
            {AI_AGENTS.map((agent, index) => {
                const data = agentData.find(d => d.id === agent.id);

                return (
                    <Panel key={agent.id} title={agent.name}>
                        <div className="space-y-4">
                            {/* Agent Header */}
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                                    style={{ backgroundColor: agent.color + '20', border: `2px solid ${agent.color}` }}
                                >
                                    {agent.avatar}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-text-primary">{agent.name}</h3>
                                        {agent.status === 'active' && (
                                            <span className="flex items-center gap-1 text-xs text-intent-green">
                                                <FaCheckCircle size={12} />
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-secondary mb-1">{agent.role}</p>
                                    <p className="text-xs text-text-muted">{agent.specialty}</p>
                                </div>
                            </div>

                            {/* Wallet Info */}
                            <div className="bg-bg-panel border border-border-divider rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaWallet className="text-yellow-neo" />
                                    <span className="text-sm font-semibold text-text-secondary">Agent Wallet</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-mono text-text-muted">{formatAddress(agent.wallet)}</p>
                                    {data && (
                                        <p className="text-sm font-semibold text-text-primary">
                                            {parseFloat(data.balance).toFixed(4)} ETH
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-text-muted mt-2">
                                    100% Transparent • Read-Only • No Private Keys
                                </p>
                            </div>

                            {/* Performance Metrics */}
                            {data && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-bg-secondary rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-neo">
                                            {data.performance.signalsGenerated}
                                        </div>
                                        <div className="text-xs text-text-muted mt-1">Signals Generated</div>
                                    </div>
                                    <div className="text-center p-3 bg-bg-secondary rounded-lg">
                                        <div className="text-2xl font-bold text-intent-green">
                                            {data.performance.accuracyRate.toFixed(0)}%
                                        </div>
                                        <div className="text-xs text-text-muted mt-1">Accuracy Rate</div>
                                    </div>
                                    <div className="text-center p-3 bg-bg-secondary rounded-lg">
                                        <div className="text-2xl font-bold text-text-primary">
                                            {agent.confidenceLevel.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-text-muted mt-1">Confidence Level</div>
                                    </div>
                                </div>
                            )}

                            {/* Agent Stats */}
                            <div className="pt-4 border-t border-border-divider">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaChartLine className="text-yellow-neo" size={14} />
                                    <span className="text-sm font-semibold text-text-muted">Recent Performance</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-text-secondary">Active Since</span>
                                        <span className="text-text-primary">{new Date(agent.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {data && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-text-secondary">Last 7 Days Activity</span>
                                            <span className="text-text-primary">{data.performance.recentActivity} signals</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Panel>
                );
            })}
        </div>
    );
}
