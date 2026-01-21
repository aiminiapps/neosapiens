/**
 * Economic Intent Scorer
 * Calculates and tracks economic intent scores based on blockchain signals
 */

/**
 * Calculate detailed intent score for a transaction or signal
 * @param {Object} data - Signal or transaction data
 * @returns {Object} Detailed intent score breakdown
 */
export function calculateIntentScore(data) {
    let score = 0;
    const factors = {};

    // Factor 1: Transaction Size (30% weight)
    if (data.value) {
        const value = parseFloat(data.value);
        if (value > 1000) {
            factors.transactionSize = 10;
        } else if (value > 100) {
            factors.transactionSize = 7;
        } else if (value > 10) {
            factors.transactionSize = 5;
        } else {
            factors.transactionSize = 3;
        }
        score += factors.transactionSize * 0.3;
    }

    // Factor 2: Gas Price Urgency (20% weight)
    if (data.gasPrice) {
        const gasPrice = parseFloat(data.gasPrice);
        if (gasPrice > 100) {
            factors.urgency = 10;
        } else if (gasPrice > 50) {
            factors.urgency = 7;
        } else if (gasPrice > 20) {
            factors.urgency = 5;
        } else {
            factors.urgency = 3;
        }
        score += factors.urgency * 0.2;
    }

    // Factor 3: Network Activity (25% weight)
    if (data.transactions) {
        const txCount = data.transactions;
        if (txCount > 200) {
            factors.networkActivity = 10;
        } else if (txCount > 150) {
            factors.networkActivity = 7;
        } else if (txCount > 100) {
            factors.networkActivity = 5;
        } else {
            factors.networkActivity = 3;
        }
        score += factors.networkActivity * 0.25;
    }

    // Factor 4: Volume Momentum (25% weight)
    if (data.volume) {
        const volume = parseFloat(data.volume);
        if (volume > 100000) {
            factors.volumeMomentum = 10;
        } else if (volume > 50000) {
            factors.volumeMomentum = 7;
        } else if (volume > 10000) {
            factors.volumeMomentum = 5;
        } else {
            factors.volumeMomentum = 3;
        }
        score += factors.volumeMomentum * 0.25;
    }

    // Default score if no factors available
    if (Object.keys(factors).length === 0) {
        score = 5.0;
        factors.default = 5.0;
    }

    return {
        score: Math.min(10, Math.max(0, score.toFixed(1))),
        factors,
        breakdown: {
            transactionSize: (factors.transactionSize || 0) * 0.3,
            urgency: (factors.urgency || 0) * 0.2,
            networkActivity: (factors.networkActivity || 0) * 0.25,
            volumeMomentum: (factors.volumeMomentum || 0) * 0.25,
        },
    };
}

/**
 * Aggregate intent scores from multiple signals
 */
export function aggregateIntentScores(signals) {
    if (!signals || signals.length === 0) {
        return {
            average: 0,
            median: 0,
            highest: 0,
            lowest: 0,
            distribution: { low: 0, moderate: 0, high: 0, critical: 0 },
        };
    }

    const scores = signals.map(s => parseFloat(s.intentScore)).sort((a, b) => a - b);

    const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const median = scores[Math.floor(scores.length / 2)];
    const highest = scores[scores.length - 1];
    const lowest = scores[0];

    // Distribution
    const distribution = {
        low: scores.filter(s => s < 4).length,
        moderate: scores.filter(s => s >= 4 && s < 6).length,
        high: scores.filter(s => s >= 6 && s < 8).length,
        critical: scores.filter(s => s >= 8).length,
    };

    return {
        average: average.toFixed(1),
        median: median.toFixed(1),
        highest: highest.toFixed(1),
        lowest: lowest.toFixed(1),
        distribution,
        total: signals.length,
    };
}

/**
 * Track historical intent scores
 */
class IntentScoreTracker {
    constructor() {
        this.history = [];
        this.maxHistory = 100; // Keep last 100 data points
    }

    addDataPoint(timestamp, signals) {
        const aggregated = aggregateIntentScores(signals);

        this.history.push({
            timestamp,
            average: parseFloat(aggregated.average),
            median: parseFloat(aggregated.median),
            highest: parseFloat(aggregated.highest),
            lowest: parseFloat(aggregated.lowest),
            signalCount: signals.length,
            distribution: aggregated.distribution,
        });

        // Keep only last maxHistory items
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(-this.maxHistory);
        }
    }

    getHistory() {
        return this.history;
    }

    getTrend() {
        if (this.history.length < 2) return 'stable';

        const recent = this.history.slice(-5);
        const older = this.history.slice(-10, -5);

        if (recent.length === 0 || older.length === 0) return 'stable';

        const recentAvg = recent.reduce((sum, d) => sum + d.average, 0) / recent.length;
        const olderAvg = older.reduce((sum, d) => sum + d.average, 0) / older.length;

        const change = ((recentAvg - olderAvg) / olderAvg) * 100;

        if (change > 10) return 'increasing';
        if (change < -10) return 'decreasing';
        return 'stable';
    }

    getCurrentVsPrevious() {
        if (this.history.length < 2) return { current: 0, previous: 0, change: 0 };

        const current = this.history[this.history.length - 1];
        const previous = this.history[this.history.length - 2];

        const change = current.average - previous.average;

        return {
            current: current.average,
            previous: previous.average,
            change: change.toFixed(1),
            percentChange: ((change / previous.average) * 100).toFixed(1),
        };
    }
}

// Export singleton instance
export const intentTracker = new IntentScoreTracker();

/**
 * Get intent status level
 */
export function getIntentStatus(score) {
    const scoreNum = parseFloat(score);

    if (scoreNum >= 8) {
        return { level: 'Critical', color: 'critical-red', priority: 4 };
    } else if (scoreNum >= 6) {
        return { level: 'High', color: 'caution-amber', priority: 3 };
    } else if (scoreNum >= 4) {
        return { level: 'Moderate', color: 'yellow-neo', priority: 2 };
    } else {
        return { level: 'Low', color: 'intent-green', priority: 1 };
    }
}

/**
 * Compare intent scores across time periods
 */
export function compareIntentPeriods(currentSignals, previousSignals) {
    const current = aggregateIntentScores(currentSignals);
    const previous = aggregateIntentScores(previousSignals);

    return {
        current,
        previous,
        changes: {
            average: (parseFloat(current.average) - parseFloat(previous.average)).toFixed(1),
            signalCount: current.total - previous.total,
            highPriorityChange: current.distribution.critical - previous.distribution.critical,
        },
    };
}
