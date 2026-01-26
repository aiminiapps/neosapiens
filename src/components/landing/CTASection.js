'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
    RiArrowRightLine, 
    RiDashboard3Line, 
    RiTimerFlashLine, 
    RiEye2Line, 
    RiDatabase2Line 
} from 'react-icons/ri';

// --- 1. THE "REACTOR" BUTTON ---
const LaunchButton = () => {
    return (
        <Link href='/ai'>
                <motion.button
            whileHover="hover"
            initial="initial"
            className="group relative px-10 py-5 bg-transparent overflow-hidden rounded-sm w-fit mx-auto cursor-pointer"
        >
            {/* A. ROTATING BORDER GRADIENT */}
            <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_90deg,#FFD700_180deg,transparent_270deg,transparent_360deg)]" />
            </div>

            {/* B. INNER BLACK CHASSIS (Masks the center of the spinning border) */}
            <div className="absolute inset-[1px] bg-[#050505] rounded-sm z-0" />

            {/* C. HOVER FILL EFFECT (Power Up) */}
            <motion.div 
                variants={{
                    initial: { x: '-100%' },
                    hover: { x: '0%' }
                }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                className="absolute inset-[1px] bg-[#FFD700] z-0" 
            />

            {/* D. CONTENT LAYER */}
            <div className="relative z-10 flex items-center gap-3">
                <span className="font-mono sm:text-sm text-xs uppercase tracking-[0.2em] font-semibold text-white group-hover:text-black transition-colors duration-300">
                    Launch Dashboard
                </span>
                
                {/* Arrow Interaction */}
                <div className="relative overflow-hidden w-4 h-4 flex items-center justify-center">
                    <motion.div
                        variants={{
                            initial: { x: 0 },
                            hover: { x: 20 }
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute text-white group-hover:text-black"
                    >
                        <RiArrowRightLine size={16} />
                    </motion.div>
                    <motion.div
                        variants={{
                            initial: { x: -20 },
                            hover: { x: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute text-black"
                    >
                        <RiArrowRightLine size={16} />
                    </motion.div>
                </div>
            </div>

            {/* E. DECORATIVE CORNERS */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-black/30 z-20 transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-black/30 z-20 transition-colors" />
        </motion.button>
        </Link>
    );
};

// --- 3. MAIN SECTION ---
export default function CommandCTA() {
    return (
        <section className="relativee w-full bg-black py-20 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none z-[1]" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
            />

            <div className="relative z-10 container mx-auto">
                {/* B. GLASS PANEL CONTAINER */}
                <div className="relative max-w-7xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="px-5 py-10 md:p-16 text-center">
                        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
                            style={{ backgroundImage: "url('/background.png')" }}
                        />
                        <motion.h2 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
                        >
                            Ready to access the <br/>
                            <span className="text-transparent pt-2 bg-clip-text bg-gradient-to-r from-[#FFD700] via-yellow-100 to-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]">Intelligence Layer?</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="sm:text-lg text-sm text-gray-400 font-light max-w-xl mx-auto mb-10 leading-relaxed"
                        >
                            Enter the NEO-SAPIENS command center. Monitor AI agents, track economic signals, and observe blockchain intelligence in real-time.
                        </motion.p>

                        {/* 2. The Reactor Button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <LaunchButton />
                        </motion.div>
                        
                        {/* Subtext */}
                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 text-xs text-gray-500 font-mono"
                        >
                            No signup required. Connect wallet to personalize.
                        </motion.p>
                    </div>
                </div>

            </div>

            {/* Global Style for the shimmer animation */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { left: -50%; }
                    100% { left: 150%; }
                }
            `}</style>
        </section>
    );
}