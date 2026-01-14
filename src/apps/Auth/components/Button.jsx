export default function Button({
    children,
    onClick,
    loading = false,
    disabled = false,
    variant = 'primary',
    type = 'button',
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn-${variant} ${loading ? 'btn-loading' : ''}`}
            {...props}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
}
