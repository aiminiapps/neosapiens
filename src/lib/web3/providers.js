/**
 * Web3 Provider Configuration for BNB Chain (BSC)
 */

import { ethers } from 'ethers';

// BNB Chain (BSC) Mainnet RPC endpoints
const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed1.binance.org';

// Fallback RPC endpoints for reliability
const BSC_FALLBACK_RPCS = [
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed4.binance.org',
    'https://bsc.publicnode.com',
];

/**
 * Get BNB Chain provider with fallback support
 */
export function getProvider() {
    try {
        return new ethers.JsonRpcProvider(BSC_RPC_URL);
    } catch (error) {
        console.error('Primary BSC RPC failed, trying fallback:', error);
        // Try fallback providers
        for (const fallbackUrl of BSC_FALLBACK_RPCS) {
            try {
                return new ethers.JsonRpcProvider(fallbackUrl);
            } catch (fallbackError) {
                continue;
            }
        }
        throw new Error('All BSC RPC providers failed');
    }
}

/**
 * Get provider for specific network
 */
export function getNetworkProvider(chainId) {
    const providers = {
        56: BSC_RPC_URL, // BSC Mainnet
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545', // BSC Testnet
    };

    const rpcUrl = providers[chainId] || BSC_RPC_URL;
    return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Get current block number
 */
export async function getCurrentBlockNumber() {
    const provider = getProvider();
    return await provider.getBlockNumber();
}

/**
 * Get balance for an address
 */
export async function getBalance(address) {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}

/**
 * Get transaction by hash
 */
export async function getTransaction(txHash) {
    const provider = getProvider();
    return await provider.getTransaction(txHash);
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(txHash) {
    const provider = getProvider();
    return await provider.getTransactionReceipt(txHash);
}

/**
 * Get transactions for an address (using logs - limited approach)
 * Note: For production, consider using BscScan API or indexing service
 */
export async function getTransactions(address, fromBlock = 'latest', toBlock = 'latest') {
    const provider = getProvider();

    try {
        // This is a simplified approach - for production use BscScan API or indexer
        const currentBlock = await provider.getBlockNumber();
        const startBlock = typeof fromBlock === 'number' ? fromBlock : currentBlock - 1000;
        const endBlock = typeof toBlock === 'number' ? toBlock : currentBlock;

        const logs = await provider.getLogs({
            fromBlock: startBlock,
            toBlock: endBlock,
            topics: [null, ethers.hexZeroPad(address, 32)],
        });

        return logs;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

/**
 * Network configurations
 */
export const NETWORKS = {
    56: {
        name: 'BNB Smart Chain',
        chainId: 56,
        symbol: 'BNB',
        explorer: 'https://bscscan.com',
        rpcUrl: BSC_RPC_URL,
    },
    97: {
        name: 'BSC Testnet',
        chainId: 97,
        symbol: 'tBNB',
        explorer: 'https://testnet.bscscan.com',
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    },
};

/**
 * Get network info by chain ID
 */
export function getNetworkInfo(chainId) {
    return NETWORKS[chainId] || NETWORKS[56];
}
