function StatusBar() {
  return (
    <div className="statusbar" aria-hidden="true">
      <span>9:41</span>
      <div className="statusbar-icons">
        <span className="msr statusbar-icon">signal_cellular_alt</span>
        <span className="msr statusbar-icon">wifi</span>
        <span className="msr statusbar-icon">battery_full</span>
      </div>
    </div>
  )
}

export default StatusBar
