export default function Card({ children, className = '', glow = false, hover = false }) {
    const glowClass = glow ? 'glow-yellow' : '';
    const hoverClass = hover ? 'panel-hover' : '';

    return (
        <div className={`panel ${glowClass} ${hoverClass} ${className}`}>
            {children}
        </div>
    );
}
