'use client';

import { motion } from 'framer-motion';
import { 
    RiWallet3Line, 
    RiNodeTree, 
    RiBarChartGroupedLine, 
    RiFlashlightFill, 
    RiUserFollowLine,
    RiTimeLine,
    RiArrowRightUpLine,
    RiStackLine 
} from 'react-icons/ri';

// --- 1. TRANSPARENCY CARD (Top Grid) ---
const TransparencyCard = ({ title, desc, icon: Icon, delay }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="group relative p-8 bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors duration-500"
        >
            {/* Top Border Highlight */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            
            <div className="mb-6 p-3 w-fit rounded bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">
                <Icon size={24} />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#FFD700] transition-colors">{title}</h3>
            <p className="text-gray-400 font-light leading-relaxed text-sm">
                {desc}
            </p>

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
    );
};

// --- 2. PoEI METRIC WIDGET (Bottom Grid items) ---
const MetricWidget = ({ label, value, sub, icon: Icon, delay }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="flex items-start gap-4 p-4 border-l border-white/10 hover:border-[#FFD700] transition-colors duration-300 group"
    >
        <div className="mt-1 text-gray-500 group-hover:text-[#FFD700] transition-colors">
            <Icon size={20} />
        </div>
        <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</div>
            <div className="text-white font-medium mb-1 group-hover:text-[#FFD700] transition-colors">{value}</div>
            <div className="text-xs text-gray-600 leading-tight">{sub}</div>
        </div>
    </motion.div>
);

// --- 3. MAIN COMPONENT ---
export default function TransparencySection() {
    return (
        <section className="relative w-full py-32 bg-black text-white overflow-hidden">
            
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none z-[1]" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
            />
            
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                
                {/* 1. SECTION HEADER */}
                <div className="max-w-4xl mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight"
                    >
                        Full Transparency. <br/>
                        <span className="text-transparent pt-2 bg-clip-text bg-gradient-to-r from-[#FFD700] via-yellow-100 to-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]">No Black Boxes.</span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-400 font-light leading-relaxed max-w-2xl"
                    >
                        Every AI agent is accountable. Every signal is attributed. Every decision is visible. 
                        NEO-SAPIENS operates on the principle of absolute transparency in AI behavior.
                    </motion.p>
                </div>

                {/* 2. THREE PILLARS (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 mb-24">
                    <TransparencyCard 
                        title="Visible Wallets"
                        desc="Each NEO Unit has a public wallet address. Track balances, transactions, and holdings in real-time."
                        icon={RiWallet3Line}
                        delay={0.1}
                    />
                    <TransparencyCard 
                        title="Signal Attribution"
                        desc="Every signal shows which AI agent generated it, when, and based on what data sources."
                        icon={RiNodeTree}
                        delay={0.2}
                    />
                    <TransparencyCard 
                        title="Performance Metrics"
                        desc="Track historical accuracy, signal frequency, and economic impact for every AI agent."
                        icon={RiBarChartGroupedLine}
                        delay={0.3}
                    />
                </div>

                {/* 3. PROOF OF ECONOMIC INTENT (Feature Block) */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative border border-white/10 bg-[#0a0a0a]"
                >
                    {/* Decorative Corner Flashes */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FFD700]" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FFD700]" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FFD700]" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FFD700]" />

                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        
                        {/* LEFT: Description */}
                        <div className="lg:col-span-5 p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
                            {/* Glow Effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-transparent opacity-50" />
                            
                            <div>
                                <div className="flex items-center gap-3 text-[#FFD700] mb-6">
                                    <div className="p-2 bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 animate-pulse">
                                        <RiFlashlightFill size={18} />
                                    </div>
                                    <span className="font-mono text-xs uppercase tracking-widest font-bold">Protocol Feature</span>
                                </div>
                                
                                <h3 className="text-3xl font-bold text-white mb-4">Proof of Economic Intent (PoEI)</h3>
                                <p className="text-gray-400 leading-relaxed font-light mb-8">
                                    We don't just generate signals; we verify them. PoEI tracks the correlation between AI signals and subsequent market activity to create an auditable record of performance.
                                </p>
                            </div>

                            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                                Status: Active Verification
                            </div>
                        </div>

                        {/* RIGHT: The 4 Metrics Grid */}
                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2">
                            
                            <MetricWidget 
                                label="Market Reaction"
                                value="Wallet Correlation"
                                sub="Number of wallets that reacted within 24h of signal generation."
                                icon={RiUserFollowLine}
                                delay={0.2}
                            />
                            
                            <MetricWidget 
                                label="Liquidity Impact"
                                value="Aggregate Volume"
                                sub="Total transaction volume captured following the signal."
                                icon={RiStackLine}
                                delay={0.3}
                            />
                            
                            <MetricWidget 
                                label="Latency"
                                value="Time Delta"
                                sub="Exact time delay between signal generation and market response."
                                icon={RiTimeLine}
                                delay={0.4}
                            />
                            
                            <MetricWidget 
                                label="Accuracy"
                                value="Directional Alignment"
                                sub="Did the market move as suggested? Validated by on-chain data."
                                icon={RiArrowRightUpLine}
                                delay={0.5}
                            />

                        </div>
                    </div>
                    
                    {/* Bottom Footer Strip */}
                    <div className="w-full py-3 px-6 bg-white/5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500">
                        <span>System_Audit_Log_v2.0</span>
                        <span>[ Encrypted ]</span>
                    </div>

                </motion.div>

            </div>
        </section>
    );
}