'use client';

import WalletConnect from '@/components/wallet/WalletConnect';
import NetworkIndicator from '@/components/wallet/NetworkIndicator';
import Link from 'next/link';

export default function DashboardHeader() {
    return (
        <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-sm border-b border-border-divider">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo/Title */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-neo/10 rounded-lg flex items-center justify-center border border-yellow-neo/30">
                                <span className="text-xl font-bold text-yellow-neo">N</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gradient-yellow">NEO-SAPIENS</h1>
                                <p className="text-xs text-text-muted">AI Command Center</p>
                            </div>
                        </Link>
                    </div>

                    {/* Right side - Network & Wallet */}
                    <div className="flex items-center gap-3">
                        <NetworkIndicator />
                        <WalletConnect />
                    </div>
                </div>
            </div>
        </header>
    );
}
