'use client';

import WalletConnect from '@/components/wallet/WalletConnect';
import NetworkIndicator from '@/components/wallet/NetworkIndicator';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DashboardHeader() {
    return (
        <header className="sticky top-0 z-30 w-full pointer-events-none">
            {/* The actual clickable content wrapper */}
            <div className="pointer-events-auto relative z-20">
                
                {/* 1. Glass Background Layer with Curve */}
                <div className="absolute inset-0 h-[85px] overflow-hidden">
                     {/* Base Dark Glass */}
                    <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl" />
                    
                    {/* The HUD Curve SVG Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[20px] text-yellow-neo/20">
                        <svg className="w-full h-full" viewBox="0 0 1440 20" preserveAspectRatio="none">
                            <path 
                                d="M0,0 L0,20 L100,20 L120,5 L300,5 L320,20 L1120,20 L1140,5 L1320,5 L1340,20 L1440,20 L1440,0 Z" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1"
                                vectorEffect="non-scaling-stroke"
                                className="opacity-50"
                            />
                            {/* Fill for the glass effect below the line */}
                            <path 
                                d="M0,0 L0,20 L1440,20 L1440,0 Z" 
                                fill="url(#header-gradient)"
                                className="opacity-10"
                            />
                            <defs>
                                <linearGradient id="header-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FFC21A" stopOpacity="0" />
                                    <stop offset="100%" stopColor="#FFC21A" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Top Accent Line */}
                    <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-neo/30 to-transparent" />
                </div>

                {/* 2. Content Container */}
                <div className="relative mx-auto px-6 h-[85px] flex items-center justify-between">
                    
                    {/* Left: Logo Section */}
                    <div className="flex items-center pl-2">
                        <Link href="/" className="group relative block">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                className="relative z-10"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={160}
                                    height={50}
                                    className="object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
                                    priority
                                />
                            </motion.div>
                            {/* Logo Back Glow */}
                            <div className="absolute inset-0 bg-yellow-neo/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                        </Link>
                    </div>

                    {/* Center: Decorative HUD Elements (Hidden on mobile) */}
                    <div className="hidden lg:flex items-center gap-4 opacity-20">
                         {/* Tech decoration lines */}
                         <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-white" />
                         <div className="flex gap-1">
                             <div className="w-1 h-1 bg-white rounded-full" />
                             <div className="w-1 h-1 bg-white rounded-full" />
                             <div className="w-1 h-1 bg-white rounded-full" />
                         </div>
                         <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-white" />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-5 pr-2">
                        {/* Live Status Pill */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-white/10 rounded text-[10px] font-mono tracking-widest text-intent-green shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-intent-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-intent-green"></span>
                            </div>
                            ONLINE
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                        {/* Wallet Area */}
                        <div className="flex items-center gap-3">
                            <NetworkIndicator />
                            <WalletConnect />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 3. Bottom Shadow / Glow for depth */}
            <div className="absolute bottom-[-20px] left-0 w-full h-[20px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
        </header>
    );
}