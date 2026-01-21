export default function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    return (
        <div className={`spinner ${sizes[size]} ${className}`} />
    );
}
