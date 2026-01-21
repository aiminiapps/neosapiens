'use client';

import { aggregateIntentScores, getIntentStatus } from '@/lib/ai/intentScorer';
import IntentDistributionChart from '../charts/IntentDistributionChart';

export default function IntentAnalytics({ signals = [] }) {
    const aggregated = aggregateIntentScores(signals);
    const status = getIntentStatus(aggregated.average);

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-secondary border border-border-divider rounded-lg p-4">
                    <div className="text-xs text-text-muted mb-1">Average Score</div>
                    <div className={`text-2xl font-bold text-${status.color}`}>
                        {aggregated.average}
                    </div>
                    <div className="text-xs text-text-muted mt-1">{status.level} Intent</div>
                </div>

                <div className="bg-bg-secondary border border-border-divider rounded-lg p-4">
                    <div className="text-xs text-text-muted mb-1">Score Range</div>
                    <div className="text-2xl font-bold text-text-primary">
                        {aggregated.lowest} - {aggregated.highest}
                    </div>
                    <div className="text-xs text-text-muted mt-1">Min to Max</div>
                </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-bg-secondary border border-border-divider rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-4 text-text-primary">
                    Signal Priority Distribution
                </h4>
                <IntentDistributionChart distribution={aggregated.distribution} />
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-bg-secondary border border-border-divider rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-3 text-text-primary">
                    Priority Breakdown
                </h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-critical-red" />
                            <span className="text-sm text-text-secondary">Critical</span>
                        </div>
                        <span className="text-sm font-semibold">{aggregated.distribution.critical}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-caution-amber" />
                            <span className="text-sm text-text-secondary">High</span>
                        </div>
                        <span className="text-sm font-semibold">{aggregated.distribution.high}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-neo" />
                            <span className="text-sm text-text-secondary">Moderate</span>
                        </div>
                        <span className="text-sm font-semibold">{aggregated.distribution.moderate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-intent-green" />
                            <span className="text-sm text-text-secondary">Low</span>
                        </div>
                        <span className="text-sm font-semibold">{aggregated.distribution.low}</span>
                    </div>
                </div>
            </div>

            {/* Median Score */}
            <div className="text-center py-4 bg-bg-secondary border border-border-divider rounded-lg">
                <div className="text-xs text-text-muted mb-1">Median Intent Score</div>
                <div className="text-3xl font-bold text-yellow-neo">{aggregated.median}</div>
                <div className="text-xs text-text-muted mt-1">Middle value of all signals</div>
            </div>
        </div>
    );
}
