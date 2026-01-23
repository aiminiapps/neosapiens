'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiDashboardLine,
    RiPulseLine,
    RiEye2Line,
    RiRobot2Line,
    RiPieChart2Line,
    RiMenu4Line,
    RiCloseLine,
    RiShieldCheckLine,
    RiCpuLine
} from 'react-icons/ri';

const sidebarItems = [
    { id: 'overview', label: 'Command Center', icon: RiDashboardLine, href: '/ai' },
    { id: 'signals', label: 'Signal Feed', icon: RiPulseLine, href: '/ai/signals' },
    { id: 'watchlist', label: 'Watchlist', icon: RiEye2Line, href: '/ai/watchlist' },
    { id: 'agents', label: 'AI Agents', icon: RiRobot2Line, href: '/ai/agents' },
    { id: 'analytics', label: 'Analytics', icon: RiPieChart2Line, href: '/ai/analytics' },
];

export default function DashboardSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-black/90 backdrop-blur-xl border border-yellow-neo/50 text-yellow-neo rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,194,26,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
                {isOpen ? <RiCloseLine size={24} /> : <RiMenu4Line size={24} />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-md z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside
                className={`fixed sm:sticky top-0 left-0 h-screen z-40 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                style={{ width: '290px' }}
            >
                {/* SVG Tech Background Layer */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                    {/* Dark Glass Base */}
                    <div className="absolute inset-0 bg-[#080808]/95 backdrop-blur-xl border-r border-white/5" />

                    {/* Vertical Tech Line SVG */}
                    <svg className="absolute top-0 right-0 h-full w-[20px]" preserveAspectRatio="none">
                        <path
                            d="M0,0 L0,100 L20,120 L20,300 L0,320 L0,1000"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.05)"
                            strokeWidth="1"
                        />
                        {/* Glowing node moving down the line */}
                        <circle cx="0" cy="0" r="2" fill="#FFC21A">
                            <animateMotion
                                path="M0,0 L0,100 L20,120 L20,300 L0,320 L0,1000"
                                dur="10s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>

                    {/* Background Grid Texture */}
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}
                    />
                </div>

                <div className="relative flex flex-col h-full z-10 px-5">

                    {/* Header Alignment Spacer */}
                    <div className="h-[100px] flex items-end pb-4 justify-center">
                        <div className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase opacity-50">
                            :: System Navigation ::
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-4 py-4">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)} className="block relative group perspective-500">
                                    <div className="relative h-[56px] w-full transition-all duration-300 transform-style-3d group-hover:translate-z-2">

                                        {/* THE BACKGROUND PLATE (Matches "ACCEPT" Image) */}
                                        <div className={`
                                            absolute inset-0 overflow-hidden transition-all duration-300
                                            ${isActive
                                                ? 'bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]'
                                                : 'bg-[#0f0f0f] hover:bg-[#151515]'
                                            }
                                        `}>
                                            {/* Top Notch (The white tab at the top) */}
                                            <div className={`
                                                absolute top-0 left-1/2 -translate-x-1/2 h-[2px] transition-all duration-300
                                                ${isActive ? 'w-20 bg-yellow-neo shadow-[0_0_10px_#FFC21A]' : 'w-12 bg-white/20 group-hover:bg-white/40'}
                                            `} />
                                            <div className={`
                                                absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[4px] opacity-80
                                                ${isActive ? 'bg-yellow-neo' : 'bg-white/10'}
                                            `} style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }} />

                                            {/* Diagonal Rays (The "X" background effect) */}
                                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                                <div className="absolute top-0 left-[-20%] w-[140%] h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                                            </div>
                                            {/* Static darker diagonals */}
                                            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_45%,rgba(0,0,0,0.4)_50%,transparent_55%)] pointer-events-none" />

                                            {/* Bottom Bar (The Red/Orange strip) */}
                                            <div className={`
                                                absolute bottom-0 left-0 w-full h-[3px] transition-all duration-300
                                                ${isActive
                                                    ? 'bg-yellow-neo shadow-[0_0_15px_rgba(255,194,26,0.6)]'
                                                    : 'bg-white/5 group-hover:bg-yellow-neo/50'
                                                }
                                            `} />
                                        </div>

                                        {/* Border Frame */}
                                        <div className={`
                                            absolute inset-0 border transition-colors duration-300 pointer-events-none
                                            ${isActive ? 'border-yellow-neo/20' : 'border-white/5 group-hover:border-white/10'}
                                        `} />

                                        {/* Content Layer */}
                                        <div className="relative h-full flex items-center justify-between px-6 z-10">
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    transition-colors duration-300
                                                    ${isActive ? 'text-yellow-neo drop-shadow-[0_0_5px_rgba(255,194,26,0.8)]' : 'text-gray-500 group-hover:text-gray-300'}
                                                `}>
                                                    <item.icon size={20} />
                                                </div>
                                                <span className={`
                                                    text-sm font-bold tracking-wider uppercase transition-colors duration-300
                                                    ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-200'}
                                                `}>
                                                    {item.label}
                                                </span>
                                            </div>

                                            {/* Active Status Light (Right Side) */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-dot"
                                                    className="w-1.5 h-1.5 bg-yellow-neo rounded-full shadow-[0_0_8px_#FFC21A]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Status Panel */}
                    <div className="mt-4 mb-8">
                        <div className="relative p-5 bg-[#0a0a0a] border border-white/5 overflow-hidden group">
                            {/* Animated Background Mesh */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,194,26,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Decorative Tech Lines */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10" />

                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono uppercase">
                                    <span className="flex items-center gap-2">
                                        <RiShieldCheckLine className="text-intent-green" />
                                        System Optimal
                                    </span>
                                    <span>V.1.0.4</span>
                                </div>
                                
                                {/* Resource Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] text-gray-600 font-bold tracking-widest">
                                        <span>GPU LOAD</span>
                                        <span>34%</span>
                                    </div>
                                    <div className="h-1 w-full bg-gray-900 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-yellow-neo/50 to-yellow-neo w-[34%] animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </aside>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
                .perspective-500 { perspective: 500px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .translate-z-2 { transform: translateZ(10px); }
            `}</style>
        </>
    );
}