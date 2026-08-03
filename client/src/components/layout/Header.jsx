import Avatar from '../master/Avatar.jsx'

function Header({
  variant = 'standard',
  title = '',
  userName = '지민',
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
}) {
  if (variant === 'home') {
    return (
      <header className="homehead">
        <div>
          <div className="f13 tc fw7">안녕하세요 👋</div>
          <div className="f20 fw8 homehead-name">{userName} 님</div>
        </div>
        <button className="icon-button avatar-button" type="button" aria-label="알림" onClick={onRightClick}>
          <Avatar icon="notifications" />
        </button>
      </header>
    )
  }

  return (
    <header className="topnav">
      {leftIcon ? (
        <button className="topnav-button" type="button" aria-label="이전" onClick={onLeftClick}>
          <span className="msr">{leftIcon}</span>
        </button>
      ) : (
        <span className="topnav-placeholder" />
      )}

      <div className="topnav-title">{title}</div>

      {rightIcon ? (
        <button className="topnav-button" type="button" aria-label={rightIcon === 'settings' ? '설정' : '메뉴'} onClick={onRightClick}>
          <span className="msr topnav-action-icon">{rightIcon}</span>
        </button>
      ) : (
        <span className="topnav-placeholder" />
      )}
    </header>
  )
}

export default Header
