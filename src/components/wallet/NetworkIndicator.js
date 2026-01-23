'use client';

import { useWallet } from '@/contexts/WalletContext';
import { getNetworkInfo } from '@/lib/web3/providers';

export default function NetworkIndicator() {
    const { chainId, isConnected } = useWallet();

    if (!isConnected || !chainId) return null;

    const network = getNetworkInfo(chainId);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-panel border border-border-divider rounded-lg">
            <div className="w-2 h-2 sm:block hidden rounded-full bg-intent-green animate-pulse-glow" />
            <span className="text-[6px] sm:text-sm font-medium text-text-primary">{network.name}</span>
        </div>
    );
}
