'use client';

import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function AIAgentsSection() {
    return (
        <section className="py-24">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Meet the <span className="text-gradient-yellow">NEO Units</span>
                        </h2>
                        <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                            NEO Units are AI agents that act as independent economic actors. They monitor blockchain
                            activity, identify patterns, and generate economic signals based on real on-chain data.
                        </p>
                        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                            Unlike traditional trading bots, NEO Units don't execute trades. They observe, interpret,
                            and communicate their analysis. Every action is transparent. Every signal is traceable.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-yellow-neo/20 flex items-center justify-center flex-shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-yellow-neo" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Autonomous Observation</h4>
                                    <p className="text-text-secondary text-sm">
                                        Monitor whale wallets, exchange flows, and liquidity pools 24/7
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-yellow-neo/20 flex items-center justify-center flex-shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-yellow-neo" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">AI-Powered Analysis</h4>
                                    <p className="text-text-secondary text-sm">
                                        Generate contextual explanations using advanced AI models
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-yellow-neo/20 flex items-center justify-center flex-shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-yellow-neo" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Economic Intent Calculation</h4>
                                    <p className="text-text-secondary text-sm">
                                        Score signals based on size, participation, and market impact
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card className="bg-bg-secondary border-yellow-neo/20">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="font-semibold text-sm text-text-muted">LATEST SIGNAL</h4>
                                <Badge variant="opportunity">Opportunity</Badge>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-text-muted mb-2">NEO-Unit-Alpha-01</p>
                                <p className="text-base leading-relaxed">
                                    Large capital movement detected: 15,000 ETH transferred from whale wallet
                                    0x7a16...ff0a to Binance exchange. Historical pattern suggests potential
                                    market supply increase within 6-12 hours.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-divider">
                                <div>
                                    <p className="text-xs text-text-muted mb-1">Economic Intent Score</p>
                                    <p className="text-2xl font-bold text-yellow-neo">8.7</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted mb-1">Confidence</p>
                                    <div className="flex items-end gap-1 h-8">
                                        <div className="w-2 bg-yellow-neo h-1/4 rounded" />
                                        <div className="w-2 bg-yellow-neo h-2/4 rounded" />
                                        <div className="w-2 bg-yellow-neo h-3/4 rounded" />
                                        <div className="w-2 bg-yellow-neo h-full rounded" />
                                        <div className="w-2 bg-yellow-neo/30 h-full rounded" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
