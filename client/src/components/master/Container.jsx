function Container({ children, className = '', ...props }) {
  return (
    <div className={`master-container ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

export default Container
