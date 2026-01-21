/**
 * AI Signal Generator
 * Generates economic signals based on blockchain data
 */

/**
 * Generate a signal from whale transaction data
 */
export function generateWhaleSignal(transaction) {
    const value = parseFloat(transaction.value);

    // Determine signal type based on value
    let signalType = 'observation';
    let intentScore = 0;

    if (value > 1000) {
        signalType = 'risk';
        intentScore = 8.5 + (Math.random() * 1.5); // 8.5-10
    } else if (value > 100) {
        signalType = 'opportunity';
        intentScore = 6.0 + (Math.random() * 2); // 6-8
    } else if (value > 10) {
        signalType = 'observation';
        intentScore = 4.0 + (Math.random() * 2); // 4-6
    } else {
        signalType = 'observation';
        intentScore = 2.0 + (Math.random() * 2); // 2-4
    }

    // Generate explanation based on transaction details
    const explanation = generateTransactionExplanation(transaction, value);

    return {
        id: `signal-${transaction.hash.substring(0, 8)}-${Date.now()}`,
        type: signalType,
        timestamp: transaction.timestamp * 1000,
        intentScore: intentScore.toFixed(1),
        explanation,
        data: {
            transactionHash: transaction.hash,
            from: transaction.from,
            to: transaction.to,
            value: transaction.value,
            blockNumber: transaction.blockNumber,
        },
        agent: 'NEO-Unit-Alpha-01',
    };
}

function generateTransactionExplanation(tx, value) {
    const fromShort = `${tx.from.substring(0, 6)}...${tx.from.substring(38)}`;
    const toShort = tx.to === 'Contract Creation' ? 'Contract Creation' : `${tx.to.substring(0, 6)}...${tx.to.substring(38)}`;

    if (value > 1000) {
        return `Critical capital movement: ${value.toFixed(2)} ETH transferred from ${fromShort} to ${toShort}. Transaction volume exceeds $${(value * 2500).toLocaleString()} USD equivalent. Historical patterns suggest significant market impact potential. Recommend monitoring follow-up activity within 6-hour window.`;
    } else if (value > 100) {
        return `Substantial transfer detected: ${value.toFixed(2)} ETH moved from ${fromShort} to ${toShort}. Value represents significant capital deployment (~$${(value * 2500).toLocaleString()} USD). Pattern indicates potential accumulation or distribution phase. Market reaction probability: moderate.`;
    } else if (value > 10) {
        return `Notable transaction observed: ${value.toFixed(2)} ETH transferred between ${fromShort} and ${toShort}. Transaction size suggests intentional positioning rather than routine activity. Economic impact expected to be localized.`;
    } else {
        return `Standard large transaction: ${value.toFixed(2)} ETH moved on-chain. From ${fromShort} to ${toShort}. Included for completeness in economic activity monitoring. Minimal systemic impact anticipated.`;
    }
}

/**
 * Generate signals from network activity
 */
export function generateNetworkSignals(stats) {
    const gasPrice = parseFloat(stats.gasPrice);

    let signalType = 'observation';
    let intentScore = 5.0;
    let explanation = '';

    if (gasPrice > 100) {
        signalType = 'risk';
        intentScore = 8.0;
        explanation = `Extreme network congestion detected. Gas prices at ${gasPrice.toFixed(2)} Gwei indicate high demand for block space. This level typically correlates with significant on-chain events (major DEX activity, NFT mints, or protocol launches). Sustained congestion may indicate capital flight or accumulation pressure.`;
    } else if (gasPrice > 50) {
        signalType = 'action';
        intentScore = 6.5;
        explanation = `Elevated gas prices observed: ${gasPrice.toFixed(2)} Gwei. Network utilization above baseline suggests increased economic activity. Possible causes include DEX trading surges or smart contract interactions. Transaction costs may impact smaller participants.`;
    } else if (gasPrice < 10) {
        signalType = 'opportunity';
        intentScore = 4.5;
        explanation = `Low network congestion: Gas prices at ${gasPrice.toFixed(2)} Gwei. Optimal conditions for on-chain transactions. Historical data shows low-fee periods often precede accumulation phases. Cost-efficient window for capital deployment.`;
    } else {
        signalType = 'observation';
        intentScore = 5.0;
        explanation = `Normal network conditions. Gas prices stable at ${gasPrice.toFixed(2)} Gwei. Current block: ${stats.blockNumber.toLocaleString()}. Transaction throughput within expected parameters. No unusual economic signals detected.`;
    }

    return {
        id: `signal-network-${stats.blockNumber}-${Date.now()}`,
        type: signalType,
        timestamp: stats.timestamp * 1000,
        intentScore: intentScore.toFixed(1),
        explanation,
        data: {
            gasPrice: stats.gasPrice,
            blockNumber: stats.blockNumber,
            transactions: stats.transactions,
        },
        agent: 'NEO-Unit-Beta-02',
    };
}

/**
 * Generate volume-based signals
 */
export function generateVolumeSignal(volumeData) {
    const volume = parseFloat(volumeData.volume);
    const avgValue = parseFloat(volumeData.averageValue);

    let signalType = 'observation';
    let intentScore = 5.0;
    let explanation = '';

    if (volume > 100000) {
        signalType = 'risk';
        intentScore = 9.0;
        explanation = `Exceptional transaction volume detected: ${volume.toLocaleString()} ETH moved across ${volumeData.transactionCount.toLocaleString()} transactions. Average transaction value: ${avgValue} ETH. Volume spike indicates major capital reallocation. High correlation with market volatility events.`;
    } else if (volume > 50000) {
        signalType = 'action';
        intentScore = 7.0;
        explanation = `Elevated on-chain volume: ${volume.toLocaleString()} ETH transacted. ${volumeData.transactionCount.toLocaleString()} transactions processed. Average value ${avgValue} ETH suggests institutional-scale activity. Monitoring for directional bias.`;
    } else {
        signalType = 'observation';
        intentScore = 5.0;
        explanation = `Baseline transaction volume: ${volume.toLocaleString()} ETH across ${volumeData.transactionCount.toLocaleString()} transactions. Average transaction: ${avgValue} ETH. Economic activity within normal parameters. No anomalous patterns detected.`;
    }

    return {
        id: `signal-volume-${Date.now()}`,
        type: signalType,
        timestamp: Date.now(),
        intentScore: intentScore.toFixed(1),
        explanation,
        data: volumeData,
        agent: 'NEO-Unit-Gamma-03',
    };
}

/**
 * Batch generate signals from multiple data sources
 */
export async function generateSignals(blockchainData) {
    const signals = [];

    // Generate whale transaction signals
    if (blockchainData.whaleTransactions && blockchainData.whaleTransactions.length > 0) {
        const whaleSignals = blockchainData.whaleTransactions
            .slice(0, 5) // Top 5 whale transactions
            .map(tx => generateWhaleSignal(tx));
        signals.push(...whaleSignals);
    }

    // Generate network signal
    if (blockchainData.networkStats) {
        signals.push(generateNetworkSignals(blockchainData.networkStats));
    }

    // Generate volume signal
    if (blockchainData.volumeData) {
        signals.push(generateVolumeSignal(blockchainData.volumeData));
    }

    // Sort by intent score (highest first)
    return signals.sort((a, b) => parseFloat(b.intentScore) - parseFloat(a.intentScore));
}
