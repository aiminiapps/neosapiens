export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    type = 'button',
    className = ''
}) {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-yellow-neo text-bg-primary hover:bg-yellow-electric hover:shadow-glow',
        secondary: 'bg-bg-panel border border-border-divider text-text-primary hover:border-yellow-neo',
        ghost: 'bg-transparent text-yellow-neo hover:bg-bg-hover'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}
