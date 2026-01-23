/**
 * Gaming-Style Dashboard Sidebar
 * Responsive, animated sidebar with game-themed buttons and logo only
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    FaChartLine,
    FaExchangeAlt,
    FaBrain,
    FaListUl,
    FaBars,
    FaTimes,
    FaRobot,
    FaBolt,
    FaShieldAlt
} from 'react-icons/fa';
import GameButton from '@/components/ui/GameButton';

const sidebarItems = [
    { id: 'overview', label: 'Command Center', icon: FaChartLine, href: '/ai' },
    { id: 'signals', label: 'Signal Feed', icon: FaBrain, href: '/ai/signals' },
    { id: 'watchlist', label: 'Watchlist', icon: FaListUl, href: '/ai/watchlist' },
    { id: 'agents', label: 'AI Agents', icon: FaRobot, href: '/ai/agents' },
    { id: 'analytics', label: 'Analytics', icon: FaExchangeAlt, href: '/ai/analytics' },
];

export default function DashboardSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Toggle Button - Gaming Style */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-yellow-neo to-yellow-electric text-bg-primary rounded-xl flex items-center justify-center shadow-[0_8px_0_0_#B8860B,0_12px_20px_0_rgba(255,194,26,0.6)] hover:shadow-[0_8px_0_0_#B8860B,0_16px_24px_0_rgba(255,194,26,0.8)] active:shadow-[0_4px_0_0_#B8860B,0_8px_16px_0_rgba(255,194,26,0.4)] active:translate-y-[4px] transition-all duration-150"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                {/* Pixel corners */}
                <div className="absolute top-0 left-0 w-3 h-3 bg-white/30" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
                <div className="absolute top-0 right-0 w-3 h-3 bg-white/30" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-30 animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-bg-secondary via-bg-secondary to-bg-primary border-r-2 border-yellow-neo/20 transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                style={{ width: '280px' }}
            >
                <div className="flex flex-col h-full">

                    {/* Navigation - Gaming Buttons */}
                    <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        <ul className="space-y-2">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;

                                return (
                                    <li key={item.id}>
                                        <Link href={item.href} onClick={() => setIsOpen(false)}>
                                            <GameButton
                                                variant="nav"
                                                active={isActive}
                                                icon={item.icon}
                                                className="w-full justify-start"
                                            >
                                                {item.label}
                                            </GameButton>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Quick Stats - Gaming Card */}
                        <div className="mt-6 p-4 bg-gradient-to-br from-yellow-neo/10 to-transparent border-2 border-yellow-neo/20 rounded-xl relative overflow-hidden group hover:border-yellow-neo/40 transition-colors">
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,194,26,0.5)_50%,transparent_75%)] bg-[length:20px_20px] animate-slide" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaBolt className="text-yellow-neo w-4 h-4" />
                                    <span className="text-xs font-bold text-yellow-neo uppercase tracking-wider">
                                        System Status
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="w-2 h-2 rounded-full bg-intent-green" />
                                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-intent-green animate-ping" />
                                    </div>
                                    <span className="text-sm font-bold text-intent-green">
                                        All Systems Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Footer - Version Info */}
                    <div className="p-4 border-t-2 border-yellow-neo/20 bg-gradient-to-r from-transparent to-yellow-neo/5">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <FaShieldAlt className="text-yellow-neo w-3 h-3" />
                                <span className="text-text-muted">Secured</span>
                            </div>
                            <span className="text-text-muted font-mono">v1.0.0</span>
                        </div>
                    </div>
                </div>
            </aside>

            <style jsx global>{`
        @keyframes slide {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px;
          }
        }
        .animate-slide {
          animation: slide 1s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 194, 26, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 194, 26, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 194, 26, 0.5);
        }
      `}</style>
        </>
    );
}
