/**
 * AI Agent Wallet Data Structures
 * Represents NEO Units - AI agents with transparent on-chain wallets
 */

// NEO Unit AI Agents - Autonomous economic intelligence units
// Using real Ethereum addresses with actual balances
export const AI_AGENTS = [
    {
        id: 'titan',
        name: 'Titan',
        role: 'Whale Transaction Analyst',
        specialty: 'Detects and analyzes large capital movements (>10 ETH). Monitors whale wallets and provides early signals for significant market-moving transactions.',
        wallet: '0x28C6c06298d514Db089934071355E5743bf21d60', // Binance 14 - Has ~$2B in ETH
        color: '#FFC21A',
        status: 'active',
        confidenceLevel: 0.92,
        createdAt: new Date('2024-01-01').getTime(),
    },
    {
        id: 'pulse',
        name: 'Pulse',
        role: 'Network Activity Monitor',
        specialty: 'Tracks gas prices, network congestion, and transaction throughput. Identifies optimal transaction timing and network stress indicators.',
        wallet: '0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf', // Kraken 4 - Active exchange wallet
        color: '#FFD84D',
        status: 'active',
        confidenceLevel: 0.88,
        createdAt: new Date('2024-01-15').getTime(),
    },
    {
        id: 'flow',
        name: 'Flow',
        role: 'Volume & Liquidity Tracker',
        specialty: 'Analyzes transaction volume patterns and market liquidity across DEXs and CEXs. Detects liquidity shifts and volume anomalies.',
        wallet: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', // Binance 15 - High volume wallet
        color: '#E6B800',
        status: 'active',
        confidenceLevel: 0.85,
        createdAt: new Date('2024-02-01').getTime(),
    },
];

/**
 * Get AI agent by ID
 */
export function getAgentById(agentId) {
    return AI_AGENTS.find(agent => agent.id === agentId);
}

/**
 * Get AI agent by name
 */
export function getAgentByName(name) {
    return AI_AGENTS.find(agent => agent.name === name);
}

/**
 * AI Agent Performance Metrics
 */
export class AgentPerformance {
    constructor(agentId) {
        this.agentId = agentId;
        this.signalsGenerated = 0;
        this.accurateSignals = 0;
        this.totalValue = 0;
        this.successfulPredictions = 0;
        this.history = [];

        // Initialize with some base performance data
        this.initializePerformance();
    }

    initializePerformance() {
        // Generate initial realistic performance data
        const baseSignals = Math.floor(Math.random() * 50) + 20; // 20-70 signals
        this.signalsGenerated = baseSignals;
        this.accurateSignals = Math.floor(baseSignals * (0.7 + Math.random() * 0.25)); // 70-95% accuracy

        // Generate historical data
        for (let i = 0; i < baseSignals; i++) {
            const daysAgo = Math.floor(Math.random() * 30);
            this.history.push({
                timestamp: Date.now() - (daysAgo * 24 * 60 * 60 * 1000),
                signalId: `init-${i}`,
                type: ['risk', 'opportunity', 'action'][Math.floor(Math.random() * 3)],
                intentScore: (Math.random() * 4 + 6).toFixed(1), // 6.0-10.0
                wasAccurate: Math.random() > 0.2, // 80% accurate
            });
        }
    }

    addSignal(signal, wasAccurate = null) {
        this.signalsGenerated++;
        if (wasAccurate !== null && wasAccurate) {
            this.accurateSignals++;
            this.successfulPredictions++;
        }

        this.history.push({
            timestamp: Date.now(),
            signalId: signal.id,
            type: signal.type,
            intentScore: signal.intentScore,
            wasAccurate,
        });
    }

    getAccuracyRate() {
        if (this.signalsGenerated === 0) return 0;
        return (this.accurateSignals / this.signalsGenerated) * 100;
    }

    getRecentPerformance(days = 7) {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        return this.history.filter(h => h.timestamp >= cutoff);
    }
}

/**
 * Track AI agent activity
 */
export class AgentActivityTracker {
    constructor() {
        this.activities = [];
        this.maxHistory = 1000;

        // Initialize with some sample activities
        this.initializeActivities();
    }

    initializeActivities() {
        const activityTypes = [
            'Whale transaction detected',
            'Gas price spike identified',
            'Volume surge detected',
            'Network congestion alert',
            'Liquidity shift observed',
            'Signal generated',
            'Market analysis completed'
        ];

        AI_AGENTS.forEach(agent => {
            const count = Math.floor(Math.random() * 15) + 5;
            for (let i = 0; i < count; i++) {
                const daysAgo = Math.floor(Math.random() * 7);
                this.logActivity(
                    agent.id,
                    activityTypes[Math.floor(Math.random() * activityTypes.length)],
                    { auto: true, timestamp: Date.now() - (daysAgo * 24 * 60 * 60 * 1000) }
                );
            }
        });
    }

    logActivity(agentId, activityType, data) {
        const activity = {
            id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            agentId,
            type: activityType,
            timestamp: data.timestamp || Date.now(),
            data,
        };

        this.activities.unshift(activity);

        // Keep only last maxHistory items
        if (this.activities.length > this.maxHistory) {
            this.activities = this.activities.slice(0, this.maxHistory);
        }

        return activity;
    }

    getAgentActivities(agentId, limit = 50) {
        return this.activities
            .filter(a => a.agentId === agentId)
            .slice(0, limit)
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    getAllActivities(limit = 100) {
        return this.activities.slice(0, limit);
    }

    getActivitiesByType(type, limit = 50) {
        return this.activities
            .filter(a => a.type === type)
            .slice(0, limit);
    }
}

// Singleton instances
export const activityTracker = new AgentActivityTracker();
const performanceTrackers = new Map();

/**
 * Get or create performance tracker for agent
 */
export function getAgentPerformance(agentId) {
    if (!performanceTrackers.has(agentId)) {
        performanceTrackers.set(agentId, new AgentPerformance(agentId));
    }
    return performanceTrackers.get(agentId);
}

/**
 * Signal Attribution - link signals to AI agents
 */
export function attributeSignalToAgent(signal, agentName) {
    const agent = getAgentByName(agentName);
    if (!agent) return signal;

    return {
        ...signal,
        agent: agentName,
        agentId: agent.id,
        agentRole: agent.role,
        agentColor: agent.color,
    };
}
