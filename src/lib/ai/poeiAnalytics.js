/**
 * Proof of Economic Intent (PoEI) Analytics Engine
 * Tracks signal accuracy and market reaction to AI predictions
 */

/**
 * PoEI Metrics for a signal
 */
export class PoEIMetric {
    constructor(signalId, signal) {
        this.signalId = signalId;
        this.signal = signal;
        this.timestamp = signal.timestamp;
        this.intentScore = parseFloat(signal.intentScore);
        this.type = signal.type;
        this.agent = signal.agent;

        // Market reaction data
        this.priceImpact = null;
        this.volumeChange = null;
        this.timeToReaction = null;
        this.accuracy = null;
        this.verified = false;
    }

    /**
     * Calculate price impact after signal
     */
    setPriceImpact(beforePrice, afterPrice, timeframe) {
        this.priceImpact = {
            before: beforePrice,
            after: afterPrice,
            change: ((afterPrice - beforePrice) / beforePrice) * 100,
            timeframe,
        };
    }

    /**
     * Calculate volume change after signal
     */
    setVolumeChange(beforeVolume, afterVolume) {
        this.volumeChange = {
            before: beforeVolume,
            after: afterVolume,
            change: ((afterVolume - beforeVolume) / beforeVolume) * 100,
        };
    }

    /**
     * Set time taken for market to react
     */
    setReactionTime(milliseconds) {
        this.timeToReaction = milliseconds;
    }

    /**
     * Verify if signal prediction was accurate
     */
    verify(wasAccurate, confidence = 1.0) {
        this.accuracy = wasAccurate;
        this.confidence = confidence;
        this.verified = true;
    }

    /**
     * Get PoEI score (0-100)
     */
    getPoEIScore() {
        if (!this.verified) return null;

        let score = 0;

        // Base score from intent score (0-50 points)
        score += (this.intentScore / 10) * 50;

        // Accuracy bonus (0-30 points)
        if (this.accuracy) {
            score += 30 * this.confidence;
        }

        // Price impact bonus (0-10 points)
        if (this.priceImpact) {
            const impact = Math.abs(this.priceImpact.change);
            score += Math.min(impact, 10);
        }

        // Reaction speed bonus (0-10 points)
        if (this.timeToReaction) {
            const hours = this.timeToReaction / (1000 * 60 * 60);
            if (hours < 1) score += 10;
            else if (hours < 6) score += 7;
            else if (hours < 24) score += 5;
            else score += 2;
        }

        return Math.min(score, 100);
    }
}

/**
 * PoEI Analytics Tracker
 */
export class PoEITracker {
    constructor() {
        this.metrics = new Map(); // signalId -> PoEIMetric
        this.aggregateStats = {
            totalSignals: 0,
            verifiedSignals: 0,
            accurateSignals: 0,
            totalPoEIScore: 0,
            avgReactionTime: 0,
        };
    }

    /**
     * Track a new signal
     */
    trackSignal(signal) {
        const metric = new PoEIMetric(signal.id, signal);
        this.metrics.set(signal.id, metric);
        this.aggregateStats.totalSignals++;
        return metric;
    }

    /**
     * Update market reaction for a signal
     */
    updateMarketReaction(signalId, reactionData) {
        const metric = this.metrics.get(signalId);
        if (!metric) return;

        if (reactionData.priceImpact) {
            metric.setPriceImpact(
                reactionData.priceImpact.before,
                reactionData.priceImpact.after,
                reactionData.priceImpact.timeframe
            );
        }

        if (reactionData.volumeChange) {
            metric.setVolumeChange(
                reactionData.volumeChange.before,
                reactionData.volumeChange.after
            );
        }

        if (reactionData.reactionTime) {
            metric.setReactionTime(reactionData.reactionTime);
        }
    }

    /**
     * Verify signal accuracy
     */
    verifySignal(signalId, wasAccurate, confidence = 1.0) {
        const metric = this.metrics.get(signalId);
        if (!metric) return;

        metric.verify(wasAccurate, confidence);
        this.aggregateStats.verifiedSignals++;

        if (wasAccurate) {
            this.aggregateStats.accurateSignals++;
        }

        const poeiScore = metric.getPoEIScore();
        if (poeiScore) {
            this.aggregateStats.totalPoEIScore += poeiScore;
        }
    }

    /**
     * Get aggregate PoEI statistics
     */
    getAggregateStats() {
        const avgPoEI = this.aggregateStats.verifiedSignals > 0
            ? this.aggregateStats.totalPoEIScore / this.aggregateStats.verifiedSignals
            : 0;

        const accuracy = this.aggregateStats.verifiedSignals > 0
            ? (this.aggregateStats.accurateSignals / this.aggregateStats.verifiedSignals) * 100
            : 0;

        return {
            ...this.aggregateStats,
            avgPoEIScore: avgPoEI,
            accuracyRate: accuracy,
        };
    }

    /**
     * Get PoEI metrics for time period
     */
    getMetricsForPeriod(startTime, endTime) {
        const metrics = [];

        for (const [id, metric] of this.metrics.entries()) {
            if (metric.timestamp >= startTime && metric.timestamp <= endTime) {
                metrics.push(metric);
            }
        }

        return metrics;
    }

    /**
     * Get PoEI trend data for charts
     */
    getTrendData(days = 30) {
        const now = Date.now();
        const startTime = now - (days * 24 * 60 * 60 * 1000);

        const dailyData = [];

        for (let i = 0; i < days; i++) {
            const dayStart = startTime + (i * 24 * 60 * 60 * 1000);
            const dayEnd = dayStart + (24 * 60 * 60 * 1000);

            const dayMetrics = this.getMetricsForPeriod(dayStart, dayEnd);
            const verifiedMetrics = dayMetrics.filter(m => m.verified);

            const avgScore = verifiedMetrics.length > 0
                ? verifiedMetrics.reduce((sum, m) => sum + m.getPoEIScore(), 0) / verifiedMetrics.length
                : 0;

            dailyData.push({
                date: new Date(dayStart).toLocaleDateString(),
                timestamp: dayStart,
                signalCount: dayMetrics.length,
                verifiedCount: verifiedMetrics.length,
                avgPoEIScore: avgScore,
            });
        }

        return dailyData;
    }

    /**
     * Get agent performance comparison
     */
    getAgentPerformance() {
        const agentStats = new Map();

        for (const [id, metric] of this.metrics.entries()) {
            if (!metric.verified) continue;

            if (!agentStats.has(metric.agent)) {
                agentStats.set(metric.agent, {
                    agent: metric.agent,
                    signals: 0,
                    accurate: 0,
                    totalPoEI: 0,
                });
            }

            const stats = agentStats.get(metric.agent);
            stats.signals++;
            stats.totalPoEI += metric.getPoEIScore() || 0;

            if (metric.accuracy) {
                stats.accurate++;
            }
        }

        return Array.from(agentStats.values()).map(stats => ({
            ...stats,
            accuracyRate: (stats.accurate / stats.signals) * 100,
            avgPoEI: stats.totalPoEI / stats.signals,
        }));
    }
}

// Singleton instance
export const poeiTracker = new PoEITracker();

/**
 * Initialize PoEI tracking with sample data
 */
export function initializePoEI() {
    // Auto-generate some sample PoEI data for demonstration
    const agents = ['Titan', 'Pulse', 'Flow'];
    const types = ['risk', 'opportunity', 'action', 'observation'];

    for (let i = 0; i < 50; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const timestamp = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

        const signal = {
            id: `demo-signal-${i}`,
            timestamp,
            intentScore: (Math.random() * 4 + 6).toFixed(1), // 6-10
            type: types[Math.floor(Math.random() * types.length)],
            agent: agents[Math.floor(Math.random() * agents.length)],
        };

        const metric = poeiTracker.trackSignal(signal);

        // Simulate market reaction
        const hadReaction = Math.random() > 0.3; // 70% had market reaction
        if (hadReaction) {
            poeiTracker.updateMarketReaction(signal.id, {
                priceImpact: {
                    before: 2500,
                    after: 2500 + (Math.random() * 200 - 100),
                    timeframe: '6h',
                },
                reactionTime: Math.random() * 24 * 60 * 60 * 1000, // 0-24 hours
            });
        }

        // Verify signal (80% accurate)
        const wasAccurate = Math.random() > 0.2;
        poeiTracker.verifySignal(signal.id, wasAccurate, 0.8 + Math.random() * 0.2);
    }
}

// Initialize on load
initializePoEI();
