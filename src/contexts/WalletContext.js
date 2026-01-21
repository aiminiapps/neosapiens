'use client';

import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/web3/walletConfig';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect, useBalance, useChainId } from 'wagmi';

const WalletContext = createContext();

export function WalletProvider({ children }) {
    return (
        <WagmiProvider config={config}>
            <WalletContextProvider>
                {children}
            </WalletContextProvider>
        </WagmiProvider>
    );
}

function WalletContextProvider({ children }) {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();
    const { data: balance } = useBalance({
        address: address,
    });

    const [walletState, setWalletState] = useState({
        isConnected: false,
        address: null,
        balance: null,
        chainId: null,
    });

    useEffect(() => {
        setWalletState({
            isConnected,
            address: address || null,
            balance: balance ? balance.formatted : null,
            balanceSymbol: balance ? balance.symbol : null,
            chainId,
        });
    }, [isConnected, address, balance, chainId]);

    const handleDisconnect = () => {
        disconnect();
    };

    const value = {
        ...walletState,
        disconnect: handleDisconnect,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within WalletProvider');
    }
    return context;
}
