import StatusBar from './StatusBar.jsx'

/**
 * 공통 휴대폰 프레임.
 * Header, content-slot, BottomNavigation 등은 children으로 각 페이지에서 구성합니다.
 */
function DeviceShell({ children }) {
  return (
    <div className="master-stage">
      <div className="device">
        <div className="notch" aria-hidden="true" />
        <div className="app-shell">
          <StatusBar />
          {children}
        </div>
      </div>
    </div>
  )
}

export default DeviceShell
