const statusClasses = {
  safe: 'badge-safe',
  caution: 'badge-caution',
  danger: 'badge-danger',
}

function Badge({ children, status = 'safe', className = '', ...props }) {
  return (
    <span className={`badge ${statusClasses[status] ?? statusClasses.safe} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}

export default Badge
