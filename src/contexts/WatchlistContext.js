'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getTokenInfo, monitorToken } from '@/lib/data/tokenMonitor';
import { validateEthereumAddress } from '@/lib/utils/validators';
import toast from 'react-hot-toast';

const WatchlistContext = createContext();

// Popular ERC-20 token contracts (NOT wallet addresses!)
export const POPULAR_TOKENS = [
    { symbol: 'USDT', name: 'Tether USD', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6b175474e89094c44da98b954eedeac495271d0f' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
    { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' },
    { symbol: 'LINK', name: 'Chainlink', address: '0x514910771af9ca656af840dff83e8264ecf986ca' },
    { symbol: 'SHIB', name: 'Shiba Inu', address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce' },
    { symbol: 'PEPE', name: 'Pepe', address: '0x6982508145454ce325ddbe47a25d4ec3d2311933' },
];

export function WatchlistProvider({ children }) {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load watchlist from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('neo-sapiens-watchlist');
        if (saved) {
            try {
                setWatchlist(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load watchlist:', e);
            }
        }
    }, []);

    // Save watchlist to localStorage whenever it changes
    useEffect(() => {
        if (watchlist.length > 0) {
            localStorage.setItem('neo-sapiens-watchlist', JSON.stringify(watchlist));
        }
    }, [watchlist]);

    const addToken = async (address) => {
        const validation = validateEthereumAddress(address);
        if (!validation.valid) {
            toast.error(validation.error);
            return false;
        }

        // Check if already in watchlist
        if (watchlist.find(t => t.address.toLowerCase() === address.toLowerCase())) {
            toast.error('Token already in watchlist');
            return false;
        }

        setLoading(true);
        try {
            const tokenInfo = await getTokenInfo(address);

            if (!tokenInfo.success) {
                toast.error(tokenInfo.error || 'Failed to fetch token info');
                return false;
            }

            const newToken = {
                ...tokenInfo,
                addedAt: Date.now(),
            };

            setWatchlist(prev => [...prev, newToken]);
            toast.success(`${tokenInfo.symbol} added to watchlist`);
            return true;
        } catch (error) {
            toast.error('Failed to add token');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const removeToken = (address) => {
        setWatchlist(prev => prev.filter(t => t.address.toLowerCase() !== address.toLowerCase()));
        toast.success('Token removed from watchlist');
    };

    const refreshToken = async (address) => {
        try {
            const tokenData = await monitorToken(address);
            if (tokenData.success) {
                setWatchlist(prev => prev.map(t =>
                    t.address.toLowerCase() === address.toLowerCase()
                        ? { ...t, ...tokenData, lastUpdate: Date.now() }
                        : t
                ));
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    };

    const refreshAllTokens = async () => {
        setLoading(true);
        try {
            const updates = await Promise.all(
                watchlist.map(token => monitorToken(token.address))
            );

            setWatchlist(prev => prev.map((token, index) => ({
                ...token,
                ...updates[index],
                lastUpdate: Date.now(),
            })));

            toast.success('Watchlist refreshed');
        } catch (error) {
            toast.error('Failed to refresh watchlist');
        } finally {
            setLoading(false);
        }
    };

    const value = {
        watchlist,
        loading,
        addToken,
        removeToken,
        refreshToken,
        refreshAllTokens,
    };

    return (
        <WatchlistContext.Provider value={value}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within WatchlistProvider');
    }
    return context;
}
