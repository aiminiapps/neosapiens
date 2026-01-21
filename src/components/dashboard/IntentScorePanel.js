'use client';

import { motion } from 'framer-motion';
import { aggregateIntentScores, getIntentStatus, intentTracker } from '@/lib/ai/intentScorer';
import { useEffect } from 'react';
import IntentTrendChart from '../charts/IntentTrendChart';

export default function IntentScorePanel({ signals = [] }) {
    // Track intent scores over time
    useEffect(() => {
        if (signals.length > 0) {
            intentTracker.addDataPoint(Date.now(), signals);
        }
    }, [signals]);

    const aggregated = aggregateIntentScores(signals);
    const status = getIntentStatus(aggregated.average);
    const history = intentTracker.getHistory();
    const trend = intentTracker.getTrend();
    const comparison = intentTracker.getCurrentVsPrevious();

    const score = parseFloat(aggregated.average);

    return (
        <div className="space-y-6">
            {/* Main Score Display */}
            <div className="text-center py-6">
                <div className="relative inline-flex items-center justify-center mb-4">
                    {/* Animated rings */}
                    <motion.div
                        className={`absolute w-32 h-32 rounded-full border-2 text-${status.color} opacity-20`}
                        style={{ borderColor: `var(--${status.color})` }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                        className={`absolute w-24 h-24 rounded-full border-2 text-${status.color} opacity-40`}
                        style={{ borderColor: `var(--${status.color})` }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Score display */}
                    <div className="relative z-10 w-20 h-20 rounded-full bg-bg-secondary border-2 border-yellow-neo/50 flex items-center justify-center">
                        <div className="text-4xl font-bold text-yellow-neo">{aggregated.average}</div>
                    </div>
                </div>

                <div className={`text-lg font-semibold mb-1 text-${status.color}`}>
                    {status.level} Intent
                </div>
                <p className="text-sm text-text-muted">
                    Aggregate Economic Signal Strength
                </p>

                {/* Trend Indicator */}
                {trend !== 'stable' && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-hover">
                        <span className="text-xs">
                            {trend === 'increasing' ? '↗' : '↘'}
                        </span>
                        <span className="text-xs text-text-muted capitalize">{trend}</span>
                    </div>
                )}

                {/* Change from previous */}
                {comparison.change !== 0 && history.length > 1 && (
                    <div className="mt-2 text-xs text-text-muted">
                        {parseFloat(comparison.change) > 0 ? '+' : ''}{comparison.change} from previous
                        ({comparison.percentChange}%)
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="text-text-muted mb-1">Active Signals</div>
                    <div className="text-xl font-semibold text-text-primary">{signals.length}</div>
                </div>
                <div>
                    <div className="text-text-muted mb-1">High Priority</div>
                    <div className="text-xl font-semibold text-text-primary">
                        {signals.filter(s => parseFloat(s.intentScore) >= 7).length}
                    </div>
                </div>
            </div>

            {/* Historical Trend Chart */}
            {history.length > 1 && (
                <div className="pt-4 border-t border-border-divider">
                    <h4 className="text-xs font-semibold text-text-muted mb-3">
                        Intent Score History
                    </h4>
                    <IntentTrendChart history={history} />
                </div>
            )}

            {/* Score Range */}
            <div className="pt-4 border-t border-border-divider">
                <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-text-muted">Score Range</span>
                    <span className="text-text-primary font-semibold">
                        {aggregated.lowest} - {aggregated.highest}
                    </span>
                </div>
                <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-intent-green via-yellow-neo to-critical-red"
                        style={{ width: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
}
