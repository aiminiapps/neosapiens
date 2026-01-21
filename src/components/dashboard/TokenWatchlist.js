'use client';

import { useState } from 'react';
import { useWatchlist, POPULAR_TOKENS } from '@/contexts/WatchlistContext';
import Panel from '../ui/Panel';
import Button from '../ui/Button';
import { FaPlus, FaTrash, FaSync, FaStar } from 'react-icons/fa';
import { formatAddress, formatLargeNumber } from '@/lib/utils/formatters';
import LoadingSpinner from '../ui/LoadingSpinner';

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

    return (
        <div className="space-y-6">
            {/* Add Token Form */}
            <Panel title="Add Token to Watchlist">
                <form onSubmit={handleAddToken} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Token Contract Address
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTokenAddress}
                                onChange={(e) => setNewTokenAddress(e.target.value)}
                                placeholder="0x..."
                                className="flex-1 px-4 py-2 bg-bg-secondary border border-border-divider rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-yellow-neo transition"
                                disabled={adding}
                            />
                            <Button type="submit" disabled={adding || !newTokenAddress.trim()}>
                                {adding ? <LoadingSpinner size="sm" /> : <FaPlus />}
                                <span className="ml-2">Add</span>
                            </Button>
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                            ⚠️ Enter a <strong>token contract address</strong>, not a wallet address.
                            Token contracts implement ERC-20 (have name(), symbol(), decimals()).
                        </p>
                    </div>

                    {/* Popular Tokens Quick Add */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FaStar className="text-yellow-neo" size={14} />
                            <span className="text-xs font-semibold text-text-muted uppercase">
                                Popular Tokens
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {POPULAR_TOKENS.map((token) => (
                                <button
                                    key={token.address}
                                    type="button"
                                    onClick={() => handleQuickAdd(token.address)}
                                    disabled={adding || watchlist.some(t => t.address.toLowerCase() === token.address.toLowerCase())}
                                    className="px-3 py-1.5 bg-bg-secondary border border-border-divider rounded-lg text-xs font-medium text-text-secondary hover:border-yellow-neo hover:text-text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {token.symbol}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </Panel>

            {/* Watchlist */}
            <Panel
                title={`Watchlist (${watchlist.length})`}
                actions={
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshAllTokens}
                        disabled={loading || watchlist.length === 0}
                    >
                        <FaSync className={loading ? 'animate-spin' : ''} />
                    </Button>
                }
            >
                {watchlist.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-muted mb-2">No tokens in watchlist</p>
                        <p className="text-sm text-text-muted">
                            Add a token by contract address or select from popular tokens above
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {watchlist.map((token) => (
                            <TokenCard
                                key={token.address}
                                token={token}
                                onRemove={() => removeToken(token.address)}
                            />
                        ))}
                    </div>
                )}
            </Panel>
        </div>
    );
}

function TokenCard({ token, onRemove }) {
    return (
        <div className="bg-bg-secondary border border-border-divider rounded-lg p-4 hover:border-yellow-neo/50 transition">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-text-primary">{token.symbol}</h3>
                        <span className="text-xs text-text-muted">({token.name})</span>
                    </div>
                    <p className="text-xs font-mono text-text-muted">
                        {formatAddress(token.address)}
                    </p>
                </div>
                <button
                    onClick={onRemove}
                    className="p-2 text-text-muted hover:text-critical-red transition"
                >
                    <FaTrash size={14} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="text-text-muted text-xs mb-1">Total Supply</div>
                    <div className="font-semibold text-text-primary">
                        {formatLargeNumber(token.totalSupply)}
                    </div>
                </div>
                <div>
                    <div className="text-text-muted text-xs mb-1">Decimals</div>
                    <div className="font-semibold text-text-primary">{token.decimals}</div>
                </div>
            </div>

            {token.lastUpdate && (
                <div className="mt-3 pt-3 border-t border-border-divider">
                    <div className="text-xs text-text-muted">
                        Last updated: {new Date(token.lastUpdate).toLocaleTimeString()}
                    </div>
                </div>
            )}
        </div>
    );
}
