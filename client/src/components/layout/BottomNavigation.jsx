import { useLocation, useNavigate } from 'react-router'
import { BOTTOM_NAV_ITEMS, getActiveTabFromPath } from '../../constants/screenRoutes.js'

function BottomNavigation({ activeTab, onTabChange }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentTab = activeTab ?? getActiveTabFromPath(location.pathname)

  function handleTabClick(item) {
    if (onTabChange) {
      onTabChange(item.key)
      return
    }

    navigate(item.path)
  }

  return (
    <nav className="bottomnav" aria-label="하단 메뉴">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = item.key === currentTab

        return (
          <button
            key={item.key}
            type="button"
            className={`navitem ${isActive ? 'active' : ''}`.trim()}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => handleTabClick(item)}
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
