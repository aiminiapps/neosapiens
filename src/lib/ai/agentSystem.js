/**
 * AI Agent Wallet Data Structures
 * Represents NEO Units - AI agents with transparent on-chain wallets
 */

// NEO Unit AI Agents
export const AI_AGENTS = [
    {
        id: 'neo-alpha-01',
        name: 'NEO-Unit-Alpha-01',
        role: 'Whale Transaction Analyst',
        specialty: 'Large capital movement detection and analysis',
        wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Example wallet
        avatar: '🐋',
        color: '#FFC21A',
        status: 'active',
        confidenceLevel: 0.92,
        createdAt: new Date('2024-01-01').getTime(),
    },
    {
        id: 'neo-beta-02',
        name: 'NEO-Unit-Beta-02',
        role: 'Network Activity Monitor',
        specialty: 'Gas price analysis and network congestion detection',
        wallet: '0x8B3192f2F7B8B8B8B8B8B8B8B8B8B8B8B8B8B8B8', // Example wallet
        avatar: '⛽',
        color: '#FFD84D',
        status: 'active',
        confidenceLevel: 0.88,
        createdAt: new Date('2024-01-15').getTime(),
    },
    {
        id: 'neo-gamma-03',
        name: 'NEO-Unit-Gamma-03',
        role: 'Volume & Liquidity Tracker',
        specialty: 'Transaction volume analysis and market liquidity monitoring',
        wallet: '0x9C4192f2F7B8B8B8B8B8B8B8B8B8B8B8B8B8B8B8', // Example wallet
        avatar: '📊',
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
    }

    logActivity(agentId, activityType, data) {
        const activity = {
            id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            agentId,
            type: activityType,
            timestamp: Date.now(),
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
            .slice(0, limit);
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
        agentAvatar: agent.avatar,
        agentColor: agent.color,
    };
}
