'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export default function TheIdeaSection() {
    return (
        <section className="relative w-full h-fit bg-black py-32 flex items-center justify-center overflow-hidden">
            {/* Cinematic Grain (Subtle Texture) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none z-[1]" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[0]" 
                 style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <SpotlightText />
            </div>
        </section>
    );
}

const SpotlightText = () => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    // Smooth spring physics for the spotlight movement (prevents jitter)
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // Dynamic Mask: Creates a hole in the darkness to reveal the yellow text
    // Reduced size to 150px to highlighting only specific characters
    const maskImage = useMotionTemplate`radial-gradient(150px circle at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`;

    // Content
    const label = "The Idea";
    const content = "AI should think inside the economy.\nNEO-SAPIENS reveals economic intent from real on-chain activity.";

    return (
        <div 
            className="relative group cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
        >
            {/* --- LAYER 1: DULL TEXT (Low Visibility) --- */}
            <div className="relative pointer-events-none">
                <AnimatedTextContent content={content} label={label} isBright={false} />
            </div>

            {/* --- LAYER 2: BRIGHT TEXT (Yellow - Masked) --- */}
            <motion.div 
                className="absolute inset-0 z-10 text-[#FFD700]"
                style={{ 
                    maskImage: maskImage,
                    WebkitMaskImage: maskImage, // Safari support
                    background: "transparent"
                }}
            >
                <AnimatedTextContent content={content} label={label} isBright={true} />
            </motion.div>
        </div>
    );
};

// Sub-component to handle the "Jump" loading animation logic
const AnimatedTextContent = ({ content, label, isBright }) => {
    // Split description by newlines first, then words
    const lines = content.split('\n');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { 
                staggerChildren: 0.05, 
                delayChildren: 0.2 
            }
        }
    };

    const wordVariants = {
        hidden: { 
            y: 40, // Start lower for the "Jump" effect
            opacity: 0,
            rotateX: -45
        },
        visible: { 
            y: 0, 
            opacity: isBright ? 1 : 0.2, // Low visibility for dull layer
            rotateX: 0,
            transition: { 
                type: "spring", 
                damping: 12, 
                stiffness: 100 
            }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col gap-6"
        >
            {/* Label ("The Idea") */}
            <motion.div 
                variants={wordVariants}
                className={`text-sm font-mono uppercase tracking-[0.3em] ${isBright ? 'text-[#FFD700]' : 'text-white'}`}
            >
                {label}
            </motion.div>

            {/* Main Description */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                {lines.map((line, i) => (
                    <div key={i} className="block">
                        {line.split(" ").map((word, wIndex) => (
                            <span key={wIndex} className="inline-block whitespace-pre mr-3 lg:mr-5 overflow-hidden py-2">
                                <motion.span 
                                    variants={wordVariants}
                                    className="inline-block"
                                >
                                    {word}
                                </motion.span>
                            </span>
                        ))}
                    </div>
                ))}
            </h2>
        </motion.div>
    );
};