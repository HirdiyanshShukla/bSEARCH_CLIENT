export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    required = false,
    ...props
}) {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label} {required && <span className="text-rose-400">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input-field ${error ? 'input-error' : ''}`}
                required={required}
                {...props}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}
