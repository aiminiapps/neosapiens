'use client';
import TaskCenter from '@/components/dashboard/TaskCenter';
import { motion } from 'framer-motion';

// --- SHARED UI COMPONENTS ---

const SectionHeader = ({ title, subtitle }) => (
    <div className="relative mb-10 pl-6">
        <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-3xl font-semibold tracking-tight text-white"
        >
            {title}
        </motion.h1>
        {subtitle && (
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 text-sm mt-1 "
            >
                 {subtitle}
            </motion.p>
        )}
    </div>
);

export default function AgentsPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#050505]">
            
            {/* --- BACKGROUND LAYER --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 1. Mesh Texture */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ 
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                        backgroundSize: '32px 32px' 
                    }} 
                />
                
                {/* 2. The Tech Line Animation */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-20" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFC21A" stopOpacity="0" />
                            <stop offset="50%" stopColor="#FFC21A" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FFC21A" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 60 0 L 60 150 L 100 180 L 100 1000" 
                        fill="none" 
                        stroke="url(#lineGradient)" 
                        strokeWidth="1" 
                    />
                    <circle r="3" fill="#FFC21A">
                        <animateMotion 
                            dur="8s" 
                            repeatCount="indefinite"
                            path="M 60 0 L 60 150 L 100 180 L 100 1000"
                        />
                    </circle>
                </svg>

                {/* 3. Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-neo/5 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-10 container mx-auto md:px-12 py-10 max-w-7xl">
                
                {/* <SectionHeader 
                    title={<span>Task <span className="text-yellow-neo">Center</span></span>}
                    subtitle="Complete missions to earn NEOS tokens"
                /> */}

                <div className="pl-2 md:pl-8 border-l border-white/5">
                    <TaskCenter/>
                </div>
            </div>
        </div>
    );
}