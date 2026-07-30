const navigationItems = [
  { key: 'home', icon: 'home', label: '홈' },
  { key: 'capture', icon: 'photo_camera', label: '촬영' },
  { key: 'history', icon: 'folder', label: '내역' },
  { key: 'alarm', icon: 'notifications', label: '알림' },
  { key: 'my', icon: 'person', label: '마이' },
]

function BottomNavigation({ activeTab, onTabChange }) {
  return (
    <nav className="bottomnav" aria-label="하단 메뉴">
      {navigationItems.map((item) => {
        const isActive = item.key === activeTab

        return (
          <button
            key={item.key}
            type="button"
            className={`navitem ${isActive ? 'active' : ''}`.trim()}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onTabChange(item.key)}
          >
            <span className={`msr ${isActive ? 'fill' : ''}`.trim()}>{item.icon}</span>
            <span>{item.label}</span>
            <span className="nav-dot" />
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNavigation
