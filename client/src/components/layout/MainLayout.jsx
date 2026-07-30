import BottomNavigation from './BottomNavigation.jsx'
import StatusBar from './StatusBar.jsx'

function MainLayout({ header, children, activeTab, onTabChange }) {
  return (
    <div className="master-stage">
      <div className="device">
        <div className="notch" aria-hidden="true" />
        <div className="app-shell">
          <StatusBar />
          {header}
          <main className="content-slot">{children}</main>
          <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
