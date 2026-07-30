const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : ''

  return (
    <button
      type={type}
      className={`btn ${variantClasses[variant] ?? variantClasses.primary} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
