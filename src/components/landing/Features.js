'use client';

import { motion } from 'framer-motion';
import { FaBrain, FaChartLine, FaEye, FaNetworkWired } from 'react-icons/fa';
import Card from '../ui/Card';

const features = [
    {
        icon: FaBrain,
        title: 'AI Economic Signals',
        description: 'AI agents generate real-time economic signals based on whale movements, exchange flows, and liquidity changes. No predictions—only analytical observations.',
    },
    {
        icon: FaChartLine,
        title: 'Economic Intent Scoring',
        description: 'Each signal receives an Intent Score calculated from transaction size, wallet participation, and market reactions. Transparent scoring, no black boxes.',
    },
    {
        icon: FaEye,
        title: 'Transparent AI Behavior',
        description: 'Every AI agent (NEO Unit) has a visible wallet, action history, and performance metrics. Full transparency into AI decision-making.',
    },
    {
        icon: FaNetworkWired,
        title: 'On-Chain Intelligence',
        description: 'Real blockchain data from Ethereum and other networks. Track capital flows, wallet clustering, and protocol interactions in real-time.',
    },
];

export default function Features() {
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
                        High-Intelligence <span className="text-gradient-yellow">Command System</span>
                    </h2>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        AI agents observe, analyze, and interpret blockchain economic activity.
                        This is not a trading tool. This is an intelligence platform.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card hover className="h-full">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-yellow-neo/10 rounded-lg border border-yellow-neo/30">
                                        <feature.icon className="w-6 h-6 text-yellow-neo" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
