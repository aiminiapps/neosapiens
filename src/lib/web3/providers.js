import { ethers } from 'ethers';

// RPC provider configuration
const RPC_PROVIDERS = {
    ethereum: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth.public-rpc.com',
    fallback: [
        'https://ethereum.publicnode.com',
        'https://rpc.ankr.com/eth',
        'https://eth.llamarpc.com',
    ],
};

/**
 * Get Ethereum provider with fallback support
 */
export function getProvider() {
    try {
        return new ethers.JsonRpcProvider(RPC_PROVIDERS.ethereum);
    } catch (error) {
        console.error('Primary RPC failed, using fallback:', error);
        // Try fallback providers
        for (const fallbackUrl of RPC_PROVIDERS.fallback) {
            try {
                return new ethers.JsonRpcProvider(fallbackUrl);
            } catch (fallbackError) {
                continue;
            }
        }
        throw new Error('All RPC providers failed');
    }
}

/**
 * Get provider for specific network
 */
export function getNetworkProvider(chainId) {
    const providers = {
        1: RPC_PROVIDERS.ethereum, // Ethereum Mainnet
        // Add more networks as needed
    };

    const rpcUrl = providers[chainId] || RPC_PROVIDERS.ethereum;
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
 * Note: For production, consider using Etherscan API or indexing service
 */
export async function getTransactions(address, fromBlock = 'latest', toBlock = 'latest') {
    const provider = getProvider();

    try {
        // This is a simplified approach - for production use Etherscan API or indexer
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
    1: {
        name: 'Ethereum',
        chainId: 1,
        symbol: 'ETH',
        explorer: 'https://etherscan.io',
    },
    // Add more networks as needed
};

/**
 * Get network info by chain ID
 */
export function getNetworkInfo(chainId) {
    return NETWORKS[chainId] || NETWORKS[1];
}
