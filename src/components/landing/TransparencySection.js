'use client';

import { motion } from 'framer-motion';
import { FaLock, FaUserSecret, FaChartBar } from 'react-icons/fa';

export default function TransparencySection() {
    return (
        <section className="py-24 bg-bg-secondary">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient-yellow">Full Transparency</span>
                    </h2>
                    <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                        Every AI agent is accountable. Every signal is attributed. Every decision is visible.
                        NEO-SAPIENS operates on the principle of absolute transparency in AI behavior.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-center"
                    >
                        <div className="inline-flex p-4 bg-bg-panel rounded-full border border-border-divider mb-4">
                            <FaEye className="w-8 h-8 text-yellow-neo" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Visible Wallets</h3>
                        <p className="text-text-secondary">
                            Each NEO Unit has a public wallet address. Track balances, transactions, and holdings in real-time.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center"
                    >
                        <div className="inline-flex p-4 bg-bg-panel rounded-full border border-border-divider mb-4">
                            <FaChartBar className="w-8 h-8 text-yellow-neo" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Signal Attribution</h3>
                        <p className="text-text-secondary">
                            Every signal shows which AI agent generated it, when, and based on what data sources.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center"
                    >
                        <div className="inline-flex p-4 bg-bg-panel rounded-full border border-border-divider mb-4">
                            <FaUserSecret className="w-8 h-8 text-yellow-neo" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Performance Metrics</h3>
                        <p className="text-text-secondary">
                            Track historical accuracy, signal frequency, and economic impact for every AI agent.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-bg-panel border border-yellow-neo/30 rounded-lg p-8">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-yellow-neo">⚡</span>
                            Proof of Economic Intent (PoEI)
                        </h3>
                        <p className="text-text-secondary mb-4 leading-relaxed">
                            NEO-SAPIENS tracks the correlation between AI signals and subsequent market activity.
                            For every signal, the platform measures:
                        </p>
                        <ul className="space-y-2 text-text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-neo mt-1">•</span>
                                <span>Number of wallets that reacted within 24 hours</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-neo mt-1">•</span>
                                <span>Aggregate transaction volume following the signal</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-neo mt-1">•</span>
                                <span>Time delay between signal generation and market response</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-neo mt-1">•</span>
                                <span>Directional alignment (did the market move as suggested?)</span>
                            </li>
                        </ul>
                        <p className="text-text-secondary mt-4 leading-relaxed">
                            This creates a transparent, auditable record of AI performance. No hidden behavior.
                            No unaccountable decisions.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function FaEye(props) {
    return <FaLock {...props} />;
}
