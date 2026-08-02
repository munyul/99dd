import BottomNavigation from './BottomNavigation.jsx'
import DeviceShell from './DeviceShell.jsx'

function MainLayout({ header, children, activeTab, onTabChange }) {
  return (
    <DeviceShell>
      {header}
      <main className="content-slot">{children}</main>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </DeviceShell>
  )
}

export default MainLayout
