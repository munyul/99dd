import StatusBar from './StatusBar.jsx'

function DeviceShell({
  children,
  className = '',
  deviceClassName = '',
  showStatusBar = true,
}) {
  return (
    <div className={`master-stage ${className}`.trim()}>
      <div className={`device ${deviceClassName}`.trim()}>
        <div className="notch" aria-hidden="true" />

        <div className="app-shell">
          {showStatusBar ? <StatusBar /> : null}
          {children}
        </div>
      </div>
    </div>
  )
}

export default DeviceShell

