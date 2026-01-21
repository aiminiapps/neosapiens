export default function Panel({ title, children, actions, className = '' }) {
    return (
        <div className={`bg-bg-panel border border-border-divider rounded-lg overflow-hidden ${className}`}>
            {title && (
                <div className="border-b border-border-divider px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
