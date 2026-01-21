'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full max-w-3xl bg-yellow-neo/10 blur-3xl" />
            </div>

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Ready to access the <span className="text-gradient-yellow">intelligence layer</span>?
                    </h2>
                    <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
                        Enter the NEO-SAPIENS command center. Monitor AI agents, track economic signals,
                        and observe blockchain intelligence in real-time.
                    </p>

                    <Link href="/ai">
                        <Button variant="primary" size="lg" className="text-lg px-12 py-4 glow-yellow">
                            Launch Dashboard →
                        </Button>
                    </Link>

                    <p className="text-sm text-text-muted mt-6">
                        No signup required. Connect wallet to personalize your experience.
                    </p>
                </motion.div>

                {/* Stats grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                >
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-yellow-neo mb-2">24/7</div>
                        <div className="text-sm text-text-muted">Real-time Monitoring</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-yellow-neo mb-2">100%</div>
                        <div className="text-sm text-text-muted">Transparent AI</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-yellow-neo mb-2">0</div>
                        <div className="text-sm text-text-muted">Mock Data</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-yellow-neo mb-2">Real</div>
                        <div className="text-sm text-text-muted">Blockchain Data</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
