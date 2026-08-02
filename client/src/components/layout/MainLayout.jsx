import BottomNavigation from './BottomNavigation.jsx'
import DeviceShell from './DeviceShell.jsx'

function MainLayout({ header, children, activeTab, onTabChange }) {
  return (
    <DeviceShell ariaLabel="형광펜 앱">
      {header}
      <main className="content-slot">{children}</main>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </DeviceShell>
  )
}

export default MainLayout
