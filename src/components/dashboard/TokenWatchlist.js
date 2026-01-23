'use client';

import { useState } from 'react';
import { useWatchlist, POPULAR_TOKENS } from '@/contexts/WatchlistContext';
import { 
    RiAddLine, 
    RiDeleteBinLine, 
    RiRefreshLine, 
    RiStarFill, 
    RiArrowUpLine, 
    RiArrowDownLine, 
    RiSearch2Line,
    RiTimeLine,
    RiCoinLine,
    RiBarChartGroupedLine,
    RiDatabase2Line
} from 'react-icons/ri';
import { formatAddress, formatCurrency, formatLargeNumber, formatPercentage, getPercentageColor } from '@/lib/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

// --- STYLED SUBCOMPONENTS ---

const TechCard = ({ children, className = "" }) => (
    <div className={`relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10 ${className}`}>
        {/* Soft Glow on Hover */}
        <div className="absolute -top-20 -right-20 w-32 h-32 bg-yellow-neo/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {children}
    </div>
);

const TokenBadge = ({ label, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="px-3 py-1.5 bg-white/5 hover:bg-yellow-neo/10 border border-white/5 hover:border-yellow-neo/30 rounded text-xs font-medium text-gray-400 hover:text-yellow-neo uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {label}
    </button>
);

// --- MAIN COMPONENT ---

export default function TokenWatchlist() {
    const { watchlist, loading, addToken, removeToken, refreshAllTokens } = useWatchlist();
    const [newTokenAddress, setNewTokenAddress] = useState('');
    const [adding, setAdding] = useState(false);

    const handleAddToken = async (e) => {
        e.preventDefault();
        if (!newTokenAddress.trim()) return;

        setAdding(true);
        const success = await addToken(newTokenAddress.trim());
        if (success) {
            setNewTokenAddress('');
        }
        setAdding(false);
    };

    const handleQuickAdd = async (address) => {
        setAdding(true);
        await addToken(address);
        setAdding(false);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            
            {/* --- ADD TOKEN SECTION --- */}
            <TechCard className="p-6">
                <form onSubmit={handleAddToken} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                            <RiSearch2Line className="text-yellow-neo" /> 
                            Token Contract Input
                        </h3>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={newTokenAddress}
                                onChange={(e) => setNewTokenAddress(e.target.value)}
                                placeholder="Paste 0x contract address..."
                                className="w-full px-5 py-3 bg-[#050505] border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-yellow-neo/50 focus:ring-1 focus:ring-yellow-neo/20 transition-all font-mono text-sm"
                                disabled={adding}
                            />
                            {/* Input Scanline Effect */}
                            <div className="absolute bottom-0 left-0 h-[1px] bg-yellow-neo w-0 group-focus-within:w-full transition-all duration-500" />
                        </div>
                        <button 
                            type="submit" 
                            disabled={adding || !newTokenAddress.trim()}
                            className="px-6 py-2 bg-yellow-neo hover:bg-yellow-neo/90 text-black font-bold rounded-lg uppercase tracking-wider text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {adding ? <RiRefreshLine className="animate-spin" size={16} /> : <RiAddLine size={16} />}
                            {adding ? 'Scanning' : 'Add'}
                        </button>
                    </div>
                    
                    {/* Quick Add Section */}
                    <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <RiStarFill className="text-yellow-neo" size={12} />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                Quick Add Popular Tokens
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {POPULAR_TOKENS.map((token) => (
                                <TokenBadge
                                    key={token.address}
                                    label={token.symbol}
                                    onClick={() => handleQuickAdd(token.address)}
                                    disabled={adding || watchlist.some(t => t.address.toLowerCase() === token.address.toLowerCase())}
                                />
                            ))}
                        </div>
                    </div>
                </form>
            </TechCard>

            {/* --- WATCHLIST GRID --- */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-intent-green rounded-full shadow-[0_0_5px_#00ff00]"></span>
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                            Monitored Assets ({watchlist.length})
                        </h3>
                    </div>
                    <button
                        onClick={refreshAllTokens}
                        disabled={loading || watchlist.length === 0}
                        className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-yellow-neo transition-colors disabled:opacity-50"
                    >
                        <RiRefreshLine className={loading ? 'animate-spin' : ''} />
                        SYNC DATA
                    </button>
                </div>

                {watchlist.length === 0 ? (
                    <TechCard className="border-dashed border-white/10">
                        <div className="text-center py-16">
                            <RiDatabase2Line className="mx-auto text-gray-600 mb-4" size={32} />
                            <p className="text-gray-400 text-sm">Watchlist is empty.</p>
                            <p className="text-xs text-gray-600 mt-1">Add a token contract to begin monitoring.</p>
                        </div>
                    </TechCard>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        <AnimatePresence>
                            {watchlist.map((token) => (
                                <motion.div key={token.address} variants={itemVariants} layout>
                                    <TokenCard
                                        token={token}
                                        onRemove={() => removeToken(token.address)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// --- TOKEN CARD COMPONENT ---

function TokenCard({ token, onRemove }) {
    const hasPrice = token.price !== null && token.price !== undefined;
    
    // Determine color class based on price change logic
    const isPositive = parseFloat(token.priceChange24h) >= 0;
    const priceColorClass = isPositive ? 'text-intent-green' : 'text-critical-red';
    const bgGlowClass = isPositive ? 'bg-intent-green/5' : 'bg-critical-red/5';

    return (
        <TechCard className="group h-full flex flex-col justify-between p-0 hover:border-white/20">
            {/* Header / Top Section */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 ${bgGlowClass} text-gray-200 font-bold text-sm`}>
                            {token.symbol[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-white tracking-wide">{token.symbol}</h3>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">ERC20</span>
                            </div>
                            <p className="text-[10px] font-mono text-gray-500 mt-0.5 truncate max-w-[120px]">
                                {formatAddress(token.address)}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={onRemove}
                        className="p-2 text-gray-600 hover:text-critical-red hover:bg-critical-red/10 rounded transition-all opacity-0 group-hover:opacity-100"
                        title="Remove Token"
                    >
                        <RiDeleteBinLine size={16} />
                    </button>
                </div>

                {/* Price Display */}
                {hasPrice ? (
                    <div className="mb-6">
                        <div className="text-3xl font-bold text-white tracking-tight mb-1">
                            {formatCurrency(token.price)}
                        </div>
                        {token.priceChange24h !== null && (
                            <div className={`flex items-center gap-1 text-xs font-bold font-mono ${priceColorClass}`}>
                                {isPositive ? <RiArrowUpLine size={12} /> : <RiArrowDownLine size={12} />}
                                {formatPercentage(token.priceChange24h)} (24h)
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mb-6 py-2">
                        <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">Price Unavailable</span>
                    </div>
                )}

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-4 border-t border-white/5">
                    <StatRow label="Mkt Cap" value={token.marketCap ? formatCurrency(token.marketCap) : '-'} icon={RiBarChartGroupedLine} />
                    <StatRow label="Volume" value={token.volume24h ? formatCurrency(token.volume24h) : '-'} icon={RiCoinLine} />
                    <StatRow label="Supply" value={formatLargeNumber(token.totalSupply)} />
                    <StatRow label="Range (24h)" value={token.high24h && token.low24h ? `${formatLargeNumber(token.low24h)} - ${formatLargeNumber(token.high24h)}` : '-'} />
                </div>
            </div>

            {/* Footer / Last Update */}
            <div className="px-5 py-3 bg-black/20 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
                    <RiTimeLine size={10} />
                    {token.lastUpdate ? new Date(token.lastUpdate).toLocaleTimeString() : 'Just now'}
                </div>
                <div className="text-[10px] text-gray-600 font-mono">
                    DEC: {token.decimals}
                </div>
            </div>
        </TechCard>
    );
}

// Small helper for grid rows
function StatRow({ label, value, icon: Icon }) {
    return (
        <div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase font-bold mb-0.5">
                {Icon && <Icon size={10} />} {label}
            </div>
            <div className="text-xs font-medium text-gray-200 font-mono truncate">
                {value}
            </div>
        </div>
    );
}