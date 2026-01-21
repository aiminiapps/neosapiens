'use client';

import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get WalletConnect Project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

// Wagmi configuration
export const config = createConfig({
    chains: [mainnet],
    connectors: [
        injected({
            target: 'metaMask',
            shimDisconnect: true,
        }),
        walletConnect({
            projectId,
            showQrModal: true,
        }),
    ],
    transports: {
        [mainnet.id]: http(
            process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth.public-rpc.com'
        ),
    },
});

// Chain information
export const supportedChains = [mainnet];

// Default chain
export const defaultChain = mainnet;
