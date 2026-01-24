'use client';

import { useConnect } from 'wagmi';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
    RiWallet3Line, 
    RiShutDownLine, 
    RiArrowRightLine,
    RiCloseLine,
    RiErrorWarningLine
} from 'react-icons/ri';
import Image from 'next/image';

// --- LOGO ASSETS (Use these or replace with local paths) ---
const METAMASK_LOGO = "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg";
const WALLETCONNECT_LOGO = "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg";

// --- STYLED COMPONENTS ---

const PremiumButton = ({ onClick, children, className = "", variant = "primary" }) => {
    const baseStyle = "relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 overflow-hidden group";
    
    const variants = {
        primary: "bg-white text-black hover:bg-gray-200 shadow-lg hover:shadow-xl",
        secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
        outline: "bg-transparent border border-white/20 text-white hover:border-white/50"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

// --- BACKGROUND SVG COMPONENT ---
const PremiumBackground = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{ 
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
            }} 
        />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-neo/5 blur-[80px] rounded-full" />
    </div>
);

// --- MAIN COMPONENT ---

export default function WalletConnect() {
    const { connect, connectors, isPending } = useConnect();
    const { isConnected, address, balance, balanceSymbol, disconnect } = useWallet();
    const [showModal, setShowModal] = useState(false);
    const pathname = usePathname();

    // Pages that require wallet connection
    const isProtectedRoute = ['/ai', '/dashboard', '/signals', '/watchlist', '/agents'].some(route => pathname?.startsWith(route));

    const handleConnect = async (connector) => {
        try {
            await connect({ connector });
            setShowModal(false);
            toast.success('Wallet connected successfully');
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

    // --- CONNECTED STATE (Header Widget) ---
    if (isConnected && address) {
        return (
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-[#111] border border-white/10 rounded-full">
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Balance</span>
                        <span className="text-sm font-mono font-bold text-white">
                            {balance ? parseFloat(balance).toFixed(4) : '0.00'} <span className="text-yellow-neo">{balanceSymbol}</span>
                        </span>
                    </div>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-intent-green shadow-[0_0_5px_#00ff00]" />
                        <span className="text-xs font-mono text-gray-300">{formatAddress(address)}</span>
                    </div>
                </div>

                <button 
                    onClick={handleDisconnect}
                    className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 text-gray-400 transition-all"
                    title="Disconnect"
                >
                    <RiShutDownLine size={18} />
                </button>
            </div>
        );
    }

    // --- DISCONNECTED STATE ---
    return (
        <>
            {/* 1. Header Connect Button */}
            <PremiumButton onClick={() => setShowModal(true)} variant="secondary" className="!px-4 !py-2 !text-sm">
                <RiWallet3Line />
                <span>Connect Wallet</span>
            </PremiumButton>

            {/* 2. Full Screen Gate (If on Protected Page) */}
            {isProtectedRoute && !isConnected && (
                <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center p-4">
                    {/* Page Background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        <svg className="absolute top-0 left-0 w-full h-[50%] opacity-20" preserveAspectRatio="none">
                            <path d="M 60 0 L 60 150 L 100 180 L 100 1000" fill="none" stroke="#FFC21A" strokeWidth="1" />
                        </svg>
                        <svg className="absolute top-0 right-0 w-full h-[50%] opacity-20 -scale-x-100" preserveAspectRatio="none">
                            <path d="M 60 0 L 60 150 L 100 180 L 100 1000" fill="none" stroke="#FFC21A" strokeWidth="1" />
                        </svg>
                        <svg className="absolute bottom-0 left-0 w-full h-[50%] opacity-20 -scale-y-100" preserveAspectRatio="none">
                            <path d="M 60 0 L 60 150 L 100 180 L 100 1000" fill="none" stroke="#FFC21A" strokeWidth="1" />
                        </svg>
                        <svg className="absolute bottom-0 right-0 w-full h-[50%] opacity-20 -scale-x-100 -scale-y-100" preserveAspectRatio="none">
                            <path d="M 60 0 L 60 150 L 100 180 L 100 1000" fill="none" stroke="#FFC21A" strokeWidth="1" />
                        </svg>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-md w-full bg-[#0F0F0F] border border-white/10 rounded-2xl p-8 shadow-2xl"
                    >
                        <PremiumBackground />
                        
                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                <Image src='/token.png' alt="Token" width={60} height={60} />
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
                                <p className="text-gray-400 text-sm">
                                    Please connect your wallet to view this dashboard.
                                </p>
                            </div>

                            <div className="space-y-3 pt-2">
                                {connectors.map((connector) => (
                                    <button
                                        key={connector.id}
                                        onClick={() => handleConnect(connector)}
                                        disabled={isPending}
                                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 relative">
                                                {connector.name.toLowerCase().includes('metamask') ? (
                                                    <img src={METAMASK_LOGO} alt="MetaMask" className="w-full h-full object-contain" />
                                                ) : (
                                                    <img src={WALLETCONNECT_LOGO} alt="WalletConnect" className="w-full h-full object-contain" />
                                                )}
                                            </div>
                                            <span className="font-bold text-white text-sm">{connector.name}</span>
                                        </div>
                                        <RiArrowRightLine className="text-gray-600 group-hover:text-white transition-colors" />
                                    </button>
                                ))}
                            </div>
                            
                            <p className="text-[10px] text-gray-500 pt-4">
                                By connecting, you agree to our Terms of Service.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* 3. Modal Popup (If clicked from Header) */}
            <AnimatePresence>
                {showModal && !isProtectedRoute && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="relative bg-[#0F0F0F] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl"
                        >
                            <PremiumBackground />

                            {/* Modal Header */}
                            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/5">
                                <h3 className="text-lg font-bold text-white">Connect Wallet</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <RiCloseLine size={24} />
                                </button>
                            </div>

                            {/* Connector List */}
                            <div className="relative z-10 p-6 space-y-3">
                                {connectors.map((connector) => (
                                    <button
                                        key={connector.id}
                                        onClick={() => handleConnect(connector)}
                                        disabled={isPending}
                                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-yellow-neo/30 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 relative flex-shrink-0">
                                                {connector.name.toLowerCase().includes('metamask') ? (
                                                    <img src={METAMASK_LOGO} alt="MetaMask" className="w-full h-full object-contain" />
                                                ) : (
                                                    <img src={WALLETCONNECT_LOGO} alt="WalletConnect" className="w-full h-full object-contain" />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white text-sm">{connector.name}</div>
                                                <div className="text-[10px] text-gray-500">
                                                    {connector.name === 'MetaMask' ? 'Browser Extension' : 'Mobile & Desktop'}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}