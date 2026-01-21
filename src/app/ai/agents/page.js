'use client';

import AIAgentsDashboard from '@/components/dashboard/AIAgentsDashboard';

export default function AgentsPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    AI <span className="text-gradient-yellow">Agents</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                    Select an agent to view performance, wallet activity, and transparency metrics
                </p>
            </div>

            <AIAgentsDashboard />
        </div>
    );
}
