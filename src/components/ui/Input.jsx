/**
 * Input — labeled text/email/password input with optional icon and error.
 */
export function Input({
  label,
  id,
  icon: Icon,
  error,
  hint,
  className = '',
  containerClassName = '',
  ...rest
}) {
  const inputId = id || rest.name
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span
            className="absolute top-1/2 -translate-y-1/2 text-brand-600 pointer-events-none"
            style={{ insetInlineStart: '0.85rem' }}
          >
            <Icon size={18} />
          </span>
        )}
        <input
          id={inputId}
          className={`input ${Icon ? 'ps-11' : ''} ${error ? 'border-danger' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
      </div>
      {error && (
        <span id={`${inputId}-err`} className="text-danger text-xs mt-1 font-medium">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${inputId}-hint`} className="text-ink-400 text-xs mt-1">
          {hint}
        </span>
      )}
    </div>
  )
}

/**
 * Textarea — labeled textarea.
 */
export function Textarea({ label, id, error, className = '', containerClassName = '', ...rest }) {
  const inputId = id || rest.name
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <textarea
        id={inputId}
        className={`textarea ${error ? 'border-danger' : ''} ${className}`}
        {...rest}
      />
      {error && <span className="text-danger text-xs mt-1 font-medium">{error}</span>}
    </div>
  )
}

/**
 * Select — labeled select with options.
 */
export function Select({ label, id, error, options = [], className = '', containerClassName = '', ...rest }) {
  const inputId = id || rest.name
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <select id={inputId} className={`select ${className}`} {...rest}>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      {error && <span className="text-danger text-xs mt-1 font-medium">{error}</span>}
    </div>
  )
}
