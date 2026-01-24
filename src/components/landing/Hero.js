'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
    RiArrowRightLine, 
    RiCpuLine, 
    RiShieldCheckLine 
} from 'react-icons/ri';

// --- CUSTOM SVG CONTAINER COMPONENT ---
// This creates the "Cut Corner" shape from your reference image
const GamingContainer = ({ children, className = "" }) => {
    return (
        <div className={`relative group ${className}`}>
            {/* 1. The SVG Background & Border */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <svg className="w-full h-full drop-shadow-[0_0_30px_rgba(255,194,26,0.1)]" preserveAspectRatio="none" viewBox="0 0 1000 600">
                    <defs>
                        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#333" />
                            <stop offset="50%" stopColor="#FFC21A" /> {/* Yellow Neo Highlight */}
                            <stop offset="100%" stopColor="#333" />
                        </linearGradient>
                        <mask id="cutout-mask">
                            <rect width="100%" height="100%" fill="white" />
                            {/* Cut corners logic visualization */}
                        </mask>
                    </defs>
                    
                    {/* Main Shape Path */}
                    {/* This path creates the specific angled shape from the reference */}
                    <path 
                        d="M 40,0 L 960,0 L 1000,40 L 1000,560 L 960,600 L 40,600 L 0,560 L 0,40 Z" 
                        fill="#0a0a0a" 
                        fillOpacity="0.8"
                        stroke="url(#borderGrad)" 
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                    />
                    
                    {/* Decorative HUD Lines (Top & Bottom Accents) */}
                    <path d="M 60,10 L 300,10" stroke="#FFC21A" strokeWidth="2" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
                    <path d="M 700,590 L 940,590" stroke="#FFC21A" strokeWidth="2" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>

            {/* 2. Inner Glow/Grid Layer */}
            <div className="absolute inset-[2px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,194,26,0.03),transparent_70%)] z-0 pointer-events-none" style={{ clipPath: 'polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)' }}>
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>

            {/* 3. Content Area */}
            <div className="relative z-10 h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                {children}
            </div>
        </div>
    );
};

// --- ANIMATION VARIANTS ---
const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 30 },
    visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
    float: { y: [-10, 10, -10], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
};

// --- HERO SECTION COMPONENT ---

export default function HeroSection() {
    return (
        <section className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] p-4 md:p-8 overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-neo/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto max-w-7xl h-full relative z-10">
                
                {/* The Main Container (Reference Style) */}
                <GamingContainer className="w-full min-h-[600px] md:min-h-[700px] flex items-center">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                        
                        {/* LEFT: Text Content */}
                        <div className="space-y-8">
                            
                            {/* Tagline */}
                            <motion.div 
                                variants={textVariants} 
                                initial="hidden" 
                                animate="visible"
                                className="flex items-center gap-2"
                            >
                                <span className="px-3 py-1 rounded bg-yellow-neo/10 border border-yellow-neo/20 text-yellow-neo text-[10px] font-bold uppercase tracking-widest">
                                    Next Gen Protocol
                                </span>
                                <div className="h-px w-12 bg-yellow-neo/30" />
                            </motion.div>

                            {/* Headline */}
                            <motion.h1 
                                variants={textVariants} 
                                initial="hidden" 
                                animate="visible" 
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
                            >
                                UNLOCK THE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-neo via-[#FFD700] to-[#FFF]">
                                    FUTURE OF AI
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p 
                                variants={textVariants} 
                                initial="hidden" 
                                animate="visible" 
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl"
                            >
                                Welcome to <strong>NEO-SAPIENS</strong>. We are redefining the digital economy by merging autonomous AI Agents with verifiable financial accountability. 
                                Secure, transparent, and built for the next era of gaming and finance.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div 
                                variants={textVariants} 
                                initial="hidden" 
                                animate="visible" 
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <Link href="/dashboard" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-yellow-neo hover:bg-white text-black font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(255,194,26,0.4)] transition-all flex items-center justify-center gap-2 group">
                                        Launch App <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Link href="/whitepaper" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-yellow-neo/50 text-white font-bold uppercase tracking-wider rounded-lg backdrop-blur-md transition-all flex items-center justify-center gap-2">
                                        Learn More
                                    </button>
                                </Link>
                            </motion.div>

                            {/* Trust Signals */}
                            <motion.div 
                                variants={textVariants} 
                                initial="hidden" 
                                animate="visible" 
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-6 pt-8 border-t border-white/10"
                            >
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase">
                                    <RiShieldCheckLine className="text-intent-green" size={16} />
                                    Audited
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase">
                                    <RiCpuLine className="text-blue-500" size={16} />
                                    AI Powered
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT: Token Image & Visuals */}
                        <motion.div 
                            variants={imageVariants} 
                            initial="hidden" 
                            animate="visible"
                            className="relative flex items-center justify-center"
                        >
                            {/* Floating Animation Wrapper */}
                            <motion.div variants={imageVariants} animate="float" className="relative z-20 w-[300px] md:w-[450px] aspect-square">
                                {/* Glow behind image */}
                                <div className="absolute inset-0 bg-yellow-neo/20 blur-[60px] rounded-full" />
                                
                                {/* The Token Image */}
                                <Image 
                                    src="/token.png" 
                                    alt="NEOS Token" 
                                    fill
                                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                    priority
                                />
                            </motion.div>

                            {/* Decorative Tech Elements behind image */}
                            <div className="absolute inset-0 z-10 border border-white/5 rounded-full scale-125 animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-0 z-10 border border-yellow-neo/10 rounded-full scale-110 animate-[spin_15s_linear_infinite_reverse] border-dashed" />
                        </motion.div>

                    </div>
                </GamingContainer>
            </div>
        </section>
    );
}