import StatusBar from './StatusBar.jsx'

function joinClassNames(...classNames) {
  return classNames.filter(Boolean).join(' ')
}

function DeviceShell({
  children,
  className = '',
  deviceClassName = '',
  ariaLabel = '앱 화면',
  showStatusBar = true,
}) {
  return (
    <div className={joinClassNames('master-stage', className)}>
      <section
        className={joinClassNames('device', deviceClassName)}
        aria-label={ariaLabel}
      >
        <div className="notch" aria-hidden="true" />

        <div className="app-shell">
          {showStatusBar ? <StatusBar /> : null}
          {children}
        </div>
      </section>
    </div>
  )
}

export default DeviceShell
