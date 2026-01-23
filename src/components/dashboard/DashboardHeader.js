'use client';

import WalletConnect from '@/components/wallet/WalletConnect';
import NetworkIndicator from '@/components/wallet/NetworkIndicator';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardHeader() {
    return (
        <header className="sticky top-0 z-40 bg-gradient-to-r from-bg-primary via-bg-primary to-bg-secondary/50 backdrop-blur-xl border-b-2 border-yellow-neo/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-transparent via-yellow-neo to-transparent opacity-50" />

            <div className="mx-auto px-2 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo Only - Gaming Style */}
                    <Link href="/" className="group relative">
                        <div className="relative">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={200}
                                    height={70}
                                    priority
                                />
                        </div>
                    </Link>

                    {/* Right side - Network & Wallet */}
                    <div className="flex items-center gap-3">
                        {/* Live status indicator */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-intent-green/10 to-transparent border border-intent-green/30 rounded-lg backdrop-blur-sm">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-intent-green shadow-[0_0_8px_rgba(110,220,95,0.6)]" />
                                <div className="absolute inset-0 w-2 h-2 rounded-full bg-intent-green animate-ping" />
                            </div>
                            <span className="text-xs font-bold text-intent-green uppercase tracking-wide">
                                Live
                            </span>
                        </div>

                        <NetworkIndicator />
                        <WalletConnect />
                    </div>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-neo/50 to-transparent" />
        </header>
    );
}
