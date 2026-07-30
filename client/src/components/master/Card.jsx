function Card({ children, flat = false, className = '', ...props }) {
  return (
    <section className={`${flat ? 'card-flat' : 'card'} ${className}`.trim()} {...props}>
      {children}
    </section>
  )
}

export default Card
