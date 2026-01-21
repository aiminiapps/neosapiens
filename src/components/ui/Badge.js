export default function Badge({ children, variant = 'default', className = '' }) {
    const variants = {
        default: 'bg-bg-hover text-text-primary border-border-divider',
        observation: 'bg-yellow-neo/10 text-yellow-electric border-yellow-muted',
        risk: 'bg-critical-red/10 text-critical-red border-critical-red',
        opportunity: 'bg-intent-green/10 text-intent-green border-intent-green',
        action: 'bg-caution-amber/10 text-caution-amber border-caution-amber'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
