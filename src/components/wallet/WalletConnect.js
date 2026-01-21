'use client';

import { useConnect, useAccount } from 'wagmi';
import { FaWallet } from 'react-icons/fa';
import { SiMetamask } from 'react-icons/si';
import Button from '../ui/Button';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WalletConnect() {
    const { connect, connectors, isPending } = useConnect();
    const { isConnected, address, balance, balanceSymbol, disconnect } = useWallet();
    const [showModal, setShowModal] = useState(false);

    const handleConnect = async (connector) => {
        try {
            await connect({ connector });
            setShowModal(false);
            toast.success('Wallet connected successfully!');
        } catch (error) {
            console.error('Connection error:', error);
            toast.error('Failed to connect wallet');
        }
    };

    const handleDisconnect = () => {
        disconnect();
        toast.success('Wallet disconnected');
    };

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-text-primary">
                        {balance ? `${parseFloat(balance).toFixed(4)} ${balanceSymbol}` : '0 ETH'}
                    </span>
                    <span className="text-xs text-text-muted font-mono">{formatAddress(address)}</span>
                </div>
                <Button variant="secondary" size="sm" onClick={handleDisconnect}>
                    <span className="hidden sm:inline">Disconnect</span>
                    <span className="sm:hidden">
                        <FaWallet />
                    </span>
                </Button>
            </div>
        );
    }

    return (
        <>
            <Button variant="primary" size="md" onClick={() => setShowModal(true)}>
                <FaWallet className="mr-2" />
                Connect Wallet
            </Button>

            {/* Connection Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-bg-panel border border-border-divider rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Connect Wallet</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-text-muted hover:text-text-primary transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3">
                            {connectors.map((connector) => (
                                <button
                                    key={connector.id}
                                    onClick={() => handleConnect(connector)}
                                    disabled={isPending}
                                    className="w-full flex items-center gap-4 p-4 bg-bg-secondary border border-border-divider rounded-lg hover:border-yellow-neo transition-all disabled:opacity-50"
                                >
                                    {connector.name === 'MetaMask' && (
                                        <SiMetamask className="w-8 h-8 text-yellow-neo" />
                                    )}
                                    {connector.name === 'WalletConnect' && (
                                        <FaWallet className="w-8 h-8 text-yellow-neo" />
                                    )}
                                    <div className="flex-1 text-left">
                                        <div className="font-semibold">{connector.name}</div>
                                        <div className="text-sm text-text-muted">
                                            {connector.name === 'MetaMask' && 'Connect via MetaMask browser extension'}
                                            {connector.name === 'WalletConnect' && 'Connect via WalletConnect protocol'}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <p className="text-xs text-text-muted mt-6 text-center">
                            Read-only connection. No private key access or signing required.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
