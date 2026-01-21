'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

export default function SignalFeed({ signals = [], onRefresh }) {
    const [filter, setFilter] = useState('all');

    const filteredSignals = signals.filter(signal => {
        if (filter === 'all') return true;
        return signal.type === filter;
    });

    if (!signals || signals.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-text-muted mb-4">No signals generated yet</p>
                <p className="text-sm text-text-muted">
                    Monitoring blockchain for economic activity...
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'risk', 'opportunity', 'action', 'observation'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === type
                                ? 'bg-yellow-neo text-bg-primary'
                                : 'bg-bg-secondary text-text-secondary hover:bg-bg-hover'
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Signals List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <AnimatePresence>
                    {filteredSignals.map((signal, index) => (
                        <motion.div
                            key={signal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <SignalCard signal={signal} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredSignals.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-text-muted">No {filter} signals found</p>
                </div>
            )}
        </div>
    );
}

function SignalCard({ signal }) {
    const getTypeColor = (type) => {
        const colors = {
            risk: 'border-critical-red/30 bg-critical-red/5',
            opportunity: 'border-intent-green/30 bg-intent-green/5',
            action: 'border-caution-amber/30 bg-caution-amber/5',
            observation: 'border-yellow-neo/30 bg-yellow-neo/5',
        };
        return colors[type] || 'border-border-divider bg-bg-secondary';
    };

    return (
        <div className={`border rounded-lg p-4 ${getTypeColor(signal.type)}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Badge variant={signal.type}>{signal.type.toUpperCase()}</Badge>
                    <span className="text-xs text-text-muted">{signal.agent}</span>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-yellow-neo">{signal.intentScore}</div>
                    <div className="text-xs text-text-muted">Intent Score</div>
                </div>
            </div>

            <p className="text-sm leading-relaxed text-text-primary mb-3">
                {signal.explanation}
            </p>

            <div className="flex items-center justify-between text-xs text-text-muted">
                <span>
                    {formatDistanceToNow(new Date(signal.timestamp), { addSuffix: true })}
                </span>
                {signal.data?.transactionHash && (
                    <span className="font-mono">
                        Tx: {signal.data.transactionHash.substring(0, 10)}...
                    </span>
                )}
            </div>
        </div>
    );
}
