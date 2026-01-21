'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartLine, FaExchangeAlt, FaBrain, FaListUl, FaBars, FaTimes } from 'react-icons/fa';

const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: FaChartLine, href: '/ai' },
    { id: 'signals', label: 'Signal Feed', icon: FaBrain, href: '/ai/signals' },
    { id: 'watchlist', label: 'Token Watchlist', icon: FaListUl, href: '/ai/watchlist' },
    { id: 'analytics', label: 'Analytics', icon: FaExchangeAlt, href: '/ai/analytics' },
];

export default function DashboardSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-yellow-neo text-bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-electric transition-all"
            >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen bg-bg-secondary border-r border-border-divider transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                style={{ width: '240px' }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-border-divider">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-neo/10 rounded-lg flex items-center justify-center border border-yellow-neo/30">
                                <span className="text-xl font-bold text-yellow-neo">N</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gradient-yellow">NEO-SAPIENS</h2>
                                <p className="text-xs text-text-muted">AI Intelligence</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <li key={item.id}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                                    ? 'bg-yellow-neo text-bg-primary font-semibold'
                                                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            <span className="text-sm">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer Info */}
                    <div className="p-4 border-t border-border-divider">
                        <div className="bg-bg-panel rounded-lg p-3">
                            <div className="text-xs text-text-muted mb-1">System Status</div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-intent-green animate-pulse-glow" />
                                <span className="text-sm font-semibold text-intent-green">All Systems Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
