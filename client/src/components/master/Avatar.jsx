function Avatar({ icon = 'person', size = 40, className = '', ...props }) {
  return (
    <span
      className={`avatar ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
      {...props}
    >
      <span className="msr">{icon}</span>
    </span>
  )
}

export default Avatar
