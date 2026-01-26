'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
    RiTwitterXLine, 
    RiTelegramLine, 
    RiGlobalLine, 
    RiFileTextLine,
    RiArrowRightUpLine
} from 'react-icons/ri';

// --- 1. LUXURY SOCIAL BUTTON ---
const SocialButton = ({ icon: Icon, href, label }) => (
    <motion.a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center justify-center w-12 h-12 bg-[#0F0F0F] border border-white/10 rounded-full overflow-hidden transition-all duration-300 hover:border-[#FFD700]"
    >
        {/* Hover Liquid Fill */}
        <div className="absolute inset-0 bg-[#FFD700] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        
        <Icon size={20} className="relative z-10 text-gray-400 group-hover:text-black transition-colors duration-300" />
        <span className="sr-only">{label}</span>
    </motion.a>
);

// --- 2. "DATA CARTRIDGE" WHITEPAPER LINK ---
const WhitepaperCard = () => (
    <Link href="https://neo-sapiens.gitbook.io/neo-sapiens-docs/" target='_blank' className="group relative block w-full md:w-auto">
        <div className="relative flex items-center gap-4 p-2 pr-6 bg-[#0F0F0F] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#FFD700]/50 group-hover:bg-[#FFD700]/5">
            
            {/* Animated Icon Box */}
            <div className="relative w-12 h-12 flex items-center justify-center bg-black border border-white/10 rounded-lg group-hover:border-[#FFD700] transition-colors">
                <RiFileTextLine size={22} className="text-gray-400 group-hover:text-[#FFD700]" />
            </div>

            <div className="flex flex-col">
                <span className="text-white font-medium flex items-center gap-2">
                    Read Whitepaper
                    <RiArrowRightUpLine className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#FFD700]" size={14} />
                </span>
            </div>

            {/* Shine Effect */}
            <div className="absolute top-0 right-0 w-[200%] h-full bg-gradient-to-l from-white/5 to-transparent transform skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700" />
        </div>
    </Link>
);

// --- 3. MAIN FOOTER COMPONENT ---
export default function LuxuryFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative w-full bg-black pt-32 pb-10 overflow-hidden flex flex-col items-center justify-end min-h-[600px]">
            
            {/* A. PARALLAX WATERMARK (The Depth Layer) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none z-0">
                <motion.h1 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    className="text-[18vw] md:text-[22vw] font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#1a1a1a] to-transparent leading-none tracking-tighter"
                >
                    NEO
                </motion.h1>
            </div>

            {/* B. MAIN CONTENT CARD */}
            <div className="container relative z-10 px-4 md:px-6 w-full">
                
                {/* Glass Chassis */}
                <div className="relative w-full bg-[#050505]/80 backdrop-blur-3xl border-t border-l border-r border-white/10 rounded-t-[3rem] p-8 md:p-16 overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
                    
                    {/* Top Gold Accent Line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50" />

                    <div className="grid grid-cols-1 md:grid-cols-13 gap-12 lg:gap-20">
                        
                        {/* LEFT: Identity */}
                        <div className="md:col-span-7 flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                    <Image 
                                        src="/logo.png" 
                                        alt="NEO Sapiens" 
                                        width={240} 
                                        height={70}
                                        className="object-contain"
                                    />
                            </div>
                        </div>
                        {/* Social Row */}
                        <div className="flex gap-4">
                            <SocialButton icon={RiTwitterXLine} href="https://x.com/Neosapiens_ai" label="X" />
                            <SocialButton icon={RiTelegramLine} href="https://telegram.org" label="Telegram" />
                            <SocialButton icon={RiGlobalLine} href="https://bscscan.com" label="BscScan" />
                        </div>
                        {/* RIGHT: Actions */}
                        <div className="md:col-span-5 flex flex-col justify-between items-start md:items-end gap-10">
                            <WhitepaperCard />
                        </div>
                    </div>

                    {/* C. COPYRIGHT BAR */}
                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-600 font-mono uppercase tracking-wider">
                        <span>© {currentYear} NEO-SAPIENS</span>
                        <span className="opacity-50">All Rights Reserved</span>
                    </div>

                </div>
            </div>

            {/* Bottom Fade to blend into page bottom */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />

        </footer>
    );
}