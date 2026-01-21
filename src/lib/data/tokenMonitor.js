import { ethers } from 'ethers';
import { getProvider } from '../web3/providers';

const ERC20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
];

/**
 * Fetch comprehensive token information
 */
export async function getTokenInfo(tokenAddress) {
    try {
        const provider = getProvider();
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        // Fetch each field individually with error handling
        // Some tokens don't implement name() or symbol()
        let name = 'Unknown Token';
        let symbol = 'UNKNOWN';
        let decimals = 18;
        let totalSupply = '0';

        try {
            name = await contract.name();
        } catch (e) {
            console.warn('Token does not implement name()');
        }

        try {
            symbol = await contract.symbol();
        } catch (e) {
            console.warn('Token does not implement symbol()');
        }

        try {
            const dec = await contract.decimals();
            decimals = Number(dec);
        } catch (e) {
            console.warn('Token does not implement decimals(), using default 18');
        }

        try {
            const supply = await contract.totalSupply();
            totalSupply = ethers.formatUnits(supply, decimals);
        } catch (e) {
            console.warn('Token does not implement totalSupply()');
        }

        // If we couldn't get basic info, it's probably not an ERC-20 token
        if (symbol === 'UNKNOWN' && name === 'Unknown Token') {
            return {
                address: tokenAddress,
                error: 'Not a valid ERC-20 token. Make sure you entered a token contract address, not a wallet address.',
                success: false,
            };
        }

        return {
            address: tokenAddress,
            name,
            symbol,
            decimals,
            totalSupply,
            success: true,
        };
    } catch (error) {
        console.error('Error fetching token info:', error);
        return {
            address: tokenAddress,
            error: 'Not a valid ERC-20 token contract. Please verify the address is correct.',
            success: false,
        };
    }
}

/**
 * Get token balance for a specific wallet
 */
export async function getTokenBalance(tokenAddress, walletAddress) {
    try {
        const provider = getProvider();
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        const [balance, decimals, symbol] = await Promise.all([
            contract.balanceOf(walletAddress),
            contract.decimals(),
            contract.symbol(),
        ]);

        return {
            balance: ethers.formatUnits(balance, decimals),
            symbol,
            decimals: Number(decimals),
            success: true,
        };
    } catch (error) {
        console.error('Error fetching token balance:', error);
        return {
            balance: '0',
            success: false,
        };
    }
}

/**
 * Monitor token for price changes (simplified - in production use API)
 */
export async function monitorToken(tokenAddress) {
    try {
        const provider = getProvider();
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        let name = 'Unknown';
        let symbol = 'UNKNOWN';
        let decimals = 18;
        let totalSupply = '0';

        try {
            name = await contract.name();
        } catch (e) {
            // Ignore
        }

        try {
            symbol = await contract.symbol();
        } catch (e) {
            // Ignore
        }

        try {
            const dec = await contract.decimals();
            decimals = Number(dec);
        } catch (e) {
            // Ignore
        }

        try {
            const supply = await contract.totalSupply();
            totalSupply = ethers.formatUnits(supply, decimals);
        } catch (e) {
            // Ignore
        }

        // In production, integrate with price APIs (CoinGecko, DeFi Llama, etc.)
        // For now, return basic info
        return {
            address: tokenAddress,
            name,
            symbol,
            totalSupply,
            decimals,
            // Mock price data - in production, fetch from API
            price: null,
            priceChange24h: null,
            volume24h: null,
            marketCap: null,
            lastUpdate: Date.now(),
            success: true,
        };
    } catch (error) {
        console.error('Error monitoring token:', error);
        return {
            address: tokenAddress,
            error: 'Failed to monitor token',
            success: false,
        };
    }
}

/**
 * Get token holders count (requires indexed data - simplified version)
 */
export async function getTokenHolders(tokenAddress) {
    try {
        // In production, use Etherscan API or indexing service
        // This is a placeholder that returns estimated data
        return {
            count: 'N/A',
            note: 'Requires Etherscan API for accurate data',
        };
    } catch (error) {
        return {
            count: 'N/A',
            error: 'Failed to fetch holder count',
        };
    }
}

/**
 * Get recent token transfers
 */
export async function getTokenTransfers(tokenAddress, limit = 10) {
    try {
        const provider = getProvider();
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        // Get Transfer event filter
        const transferEventSignature = 'Transfer(address,address,uint256)';
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 1000; // Last ~1000 blocks

        // Note: This is limited and for production should use event indexing service
        const filter = {
            address: tokenAddress,
            topics: [ethers.id(transferEventSignature)],
            fromBlock,
            toBlock: currentBlock,
        };

        const logs = await provider.getLogs(filter);
        const decimals = await contract.decimals();

        // Parse transfer events (limited to most recent)
        const transfers = logs.slice(-limit).map((log) => {
            const from = '0x' + log.topics[1].slice(26);
            const to = '0x' + log.topics[2].slice(26);
            const value = ethers.formatUnits(log.data, decimals);

            return {
                from,
                to,
                value,
                transactionHash: log.transactionHash,
                blockNumber: log.blockNumber,
            };
        });

        return {
            transfers,
            success: true,
        };
    } catch (error) {
        console.error('Error fetching token transfers:', error);
        return {
            transfers: [],
            success: false,
        };
    }
}
