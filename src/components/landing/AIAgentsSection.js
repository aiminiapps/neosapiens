'use client';

import { motion } from 'framer-motion';
import { 
    RiEye2Line, 
    RiBrainLine, 
    RiScales3Line, 
    RiWifiLine, 
    RiArrowRightUpLine, 
    RiFlashlightFill 
} from 'react-icons/ri';

// --- 1. SUB-COMPONENT: FEATURE ROW ---
const FeatureRow = ({ icon: Icon, title, desc, delay }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="group flex gap-3 items-start p-4 rounded-xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/5"
    >
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] border border-[#FFD700]/20 group-hover:scale-105 transition-transform duration-300">
            <Icon size={24} />
        </div>
        <div>
            <h4 className="text-lg font-bold text-white mb-0.5 group-hover:text-[#FFD700] transition-colors">{title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

// --- 2. SUB-COMPONENT: THE "LATEST SIGNAL" CARD ---
const SignalCard = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full max-w-md mx-auto lg:mr-0"
        >

            {/* Main Chassis */}
            <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* A. Header: Status Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Live Signal Stream</span>
                    </div>
                    <div className="text-[10px] text-[#FFD700] font-mono tracking-widest">ID: ALPHA-01</div>
                </div>

                {/* B. Content Body */}
                <div className="p-6 relative">
                    {/* Signal Tag */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] text-[10px] font-bold uppercase tracking-wider mb-4">
                        <RiFlashlightFill /> Opportunity
                    </div>

                    {/* Main Alert Text */}
                    <h3 className="text-xl text-white font-medium leading-snug mb-4">
                        Large capital movement detected: <span className="text-[#FFD700]">15,000 ETH</span> transferred.
                    </h3>
                    
                    <p className="text-sm text-gray-400 leading-relaxed font-light border-l-2 border-white/10 pl-4 mb-6">
                        Transferred from whale wallet <span className="font-mono text-white/70 bg-white/5 px-1 rounded">0x7a16...ff0a</span> to Binance exchange. Historical pattern suggests potential market supply increase within 6-12 hours.
                    </p>

                    {/* C. Data Grid (Footer) */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        {/* Score Metric */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Economic Intent Score</span>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-white tracking-tighter">8.7</span>
                                <span className="text-xs text-gray-400 mb-1.5">/ 10</span>
                            </div>
                            {/* Micro Progress Bar */}
                            <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '87%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-[#FFD700]" 
                                />
                            </div>
                        </div>

                        {/* Confidence Metric */}
                        <div className="flex flex-col pl-4 border-l border-white/10">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">AI Confidence</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="p-1.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">
                                    <RiWifiLine size={16} />
                                </div>
                                <span className="text-sm font-mono text-white">High (98%)</span>
                            </div>
                            <div className="mt-auto flex items-center gap-1 text-[9px] text-gray-500 font-mono">
                                <span>VERIFIED</span>
                                <RiArrowRightUpLine />
                            </div>
                        </div>
                    </div>
                </div>

                {/* D. Decorative Scan Line (Animation) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-transparent via-[#FFD700]/5 to-transparent animate-scan-fast opacity-50" />
                </div>
            </div>
        </motion.div>
    );
};

// --- 3. MAIN SECTION COMPONENT ---
export default function NeoUnitsSection() {
    return (
        <section className="relative w-full py-16 bg-black overflow-hidden">
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none z-[1]" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* LEFT COLUMN: Narrative */}
                    <div className="flex flex-col">
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                        >
                            Meet the 
                            <span className="text-transparent pt-2 bg-clip-text bg-gradient-to-r from-[#FFD700] via-yellow-100 to-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]"> NEO Units.</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-400 font-light leading-relaxed mb-10 max-w-xl"
                        >
                            NEO Units are AI agents that act as independent economic actors. 
                            Unlike traditional bots, they don't just execute trades they <span className="text-white">observe, interpret, and communicate</span>.
                        </motion.p>

                        <div className="">
                            <FeatureRow 
                                icon={RiEye2Line}
                                title="Autonomous Observation"
                                desc="Monitor whale wallets, exchange flows, and liquidity pools 24/7 without fatigue."
                                delay={0.3}
                            />
                            <FeatureRow 
                                icon={RiBrainLine}
                                title="AI-Powered Analysis"
                                desc="Generate contextual explanations using advanced AI models, not just raw alerts."
                                delay={0.4}
                            />
                            <FeatureRow 
                                icon={RiScales3Line}
                                title="Economic Intent Calculation"
                                desc="Score signals based on size, participation, and market impact to determine true intent."
                                delay={0.5}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Signal Card */}
                    <div className="relative">
                        <SignalCard />
                    </div>

                </div>
            </div>

            <style jsx global>{`
                @keyframes scan-fast {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(500%); }
                }
                .animate-scan-fast {
                    animation: scan-fast 3s linear infinite;
                }
            `}</style>
        </section>
    );
}