'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getTokenInfo, monitorToken } from '@/lib/data/tokenMonitor';
import { validateEthereumAddress } from '@/lib/utils/validators';
import toast from 'react-hot-toast';

const WatchlistContext = createContext();

// Popular BEP-20 token contracts on BSC (NOT wallet addresses!)
export const POPULAR_TOKENS = [
    { symbol: 'USDT', name: 'Tether USD (BSC)', address: '0x55d398326f99059fF775485246999027B3197955' },
    { symbol: 'USDC', name: 'USD Coin (BSC)', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' },
    { symbol: 'BUSD', name: 'Binance USD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' },
    { symbol: 'WBNB', name: 'Wrapped BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' },
    { symbol: 'CAKE', name: 'PancakeSwap', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82' },
    { symbol: 'ETH', name: 'Binance-Pegged ETH', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8' },
    { symbol: 'BTCB', name: 'Binance-Pegged BTC', address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c' },
    { symbol: 'DAI', name: 'Dai Token (BSC)', address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3' },
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
