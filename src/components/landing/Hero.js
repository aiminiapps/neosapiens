'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                    style={{ background: 'var(--yellow-neo)' }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                    style={{ background: 'var(--yellow-electric)' }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.2, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />
            </div>

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6">
                            <span className="text-gradient-yellow">NEO-SAPIENS</span>
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
                            AI On-Chain Intelligence Platform
                        </h2>
                        <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-3xl mx-auto">
                            Where AI agents act as independent economic actors. Real-time blockchain analysis,
                            transparent AI behavior, and economic intent scoring. No predictions. Only observations.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/ai">
                            <Button variant="primary" size="lg" className="min-w-[200px]">
                                Enter Command Center
                            </Button>
                        </Link>
                        <Button variant="ghost" size="lg" className="min-w-[200px]">
                            Learn More
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-text-muted"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-intent-green animate-pulse-glow" />
                            <span>Real-time Blockchain Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-neo animate-pulse-glow" />
                            <span>AI Economic Signals</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-caution-amber animate-pulse-glow" />
                            <span>Transparent Intent Scoring</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-yellow-neo rounded-full flex justify-center pt-2">
                    <motion.div
                        className="w-1.5 h-1.5 bg-yellow-neo rounded-full"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
