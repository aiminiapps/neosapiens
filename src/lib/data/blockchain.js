import { ethers } from 'ethers';
import { getProvider } from '../web3/providers';

/**
 * Fetch recent blocks from the blockchain
 */
export async function getRecentBlocks(count = 10) {
    try {
        const provider = getProvider();
        const currentBlock = await provider.getBlockNumber();

        const blocks = [];
        for (let i = 0; i < count; i++) {
            const block = await provider.getBlock(currentBlock - i, true);
            if (block) {
                blocks.push({
                    number: block.number,
                    timestamp: block.timestamp,
                    transactions: block.transactions.length,
                    gasUsed: block.gasUsed.toString(),
                    gasLimit: block.gasLimit.toString(),
                    hash: block.hash,
                });
            }
        }

        return blocks;
    } catch (error) {
        console.error('Error fetching recent blocks:', error);
        return [];
    }
}

/**
 * Fetch large transactions from recent blocks (whale detection)
 */
export async function getWhaleTransactions(threshold = '10') {
    try {
        const provider = getProvider();
        const currentBlock = await provider.getBlockNumber();
        const thresholdWei = ethers.parseEther(threshold);

        const whaleTransactions = [];

        // Check last 5 blocks for whale transactions
        for (let i = 0; i < 5; i++) {
            const block = await provider.getBlock(currentBlock - i, true);
            if (!block || !block.prefetchedTransactions) continue;

            for (const tx of block.prefetchedTransactions) {
                if (tx.value >= thresholdWei) {
                    whaleTransactions.push({
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to || 'Contract Creation',
                        value: ethers.formatEther(tx.value),
                        blockNumber: block.number,
                        timestamp: block.timestamp,
                        gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : '0',
                    });
                }
            }
        }

        return whaleTransactions.slice(0, 20); // Return top 20
    } catch (error) {
        console.error('Error fetching whale transactions:', error);
        return [];
    }
}

/**
 * Get current gas price
 */
export async function getCurrentGasPrice() {
    try {
        const provider = getProvider();
        const feeData = await provider.getFeeData();

        return {
            gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : null,
            maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : null,
        };
    } catch (error) {
        console.error('Error fetching gas price:', error);
        return null;
    }
}

/**
 * Get network stats
 */
export async function getNetworkStats() {
    try {
        const provider = getProvider();
        const [blockNumber, feeData] = await Promise.all([
            provider.getBlockNumber(),
            provider.getFeeData(),
        ]);

        const block = await provider.getBlock(blockNumber);

        return {
            blockNumber,
            gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0',
            timestamp: block ? block.timestamp : Date.now() / 1000,
            transactions: block ? block.transactions.length : 0,
        };
    } catch (error) {
        console.error('Error fetching network stats:', error);
        return null;
    }
}

/**
 * Calculate transaction volume from recent blocks
 */
export async function getTransactionVolume(blockCount = 100) {
    try {
        const provider = getProvider();
        const currentBlock = await provider.getBlockNumber();

        let totalVolume = BigInt(0);
        let txCount = 0;

        // Sample every 10th block for performance
        for (let i = 0; i < blockCount; i += 10) {
            const block = await provider.getBlock(currentBlock - i, true);
            if (!block || !block.prefetchedTransactions) continue;

            for (const tx of block.prefetchedTransactions) {
                totalVolume += tx.value;
                txCount++;
            }
        }

        return {
            volume: ethers.formatEther(totalVolume),
            transactionCount: txCount,
            averageValue: txCount > 0 ? ethers.formatEther(totalVolume / BigInt(txCount)) : '0',
        };
    } catch (error) {
        console.error('Error calculating transaction volume:', error);
        return { volume: '0', transactionCount: 0, averageValue: '0' };
    }
}

/**
 * Get token balance for ERC-20 tokens
 */
export async function getTokenBalance(tokenAddress, walletAddress) {
    try {
        const provider = getProvider();

        // ERC-20 ABI for balanceOf
        const erc20ABI = [
            'function balanceOf(address owner) view returns (uint256)',
            'function decimals() view returns (uint8)',
            'function symbol() view returns (string)',
        ];

        const contract = new ethers.Contract(tokenAddress, erc20ABI, provider);

        const [balance, decimals, symbol] = await Promise.all([
            contract.balanceOf(walletAddress),
            contract.decimals(),
            contract.symbol(),
        ]);

        return {
            balance: ethers.formatUnits(balance, decimals),
            symbol,
            decimals,
        };
    } catch (error) {
        console.error('Error fetching token balance:', error);
        return null;
    }
}
