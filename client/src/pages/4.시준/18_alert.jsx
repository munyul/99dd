import { useNavigate } from 'react-router'
import DeviceShell from '../../components/layout/DeviceShell.jsx'
import Header from '../../components/layout/Header.jsx'
import BottomNavigation from '../../components/layout/BottomNavigation.jsx'
import { SCREEN_PATHS } from '../../constants/screenRoutes.js'

// 알림 API가 연결되면 이 배열 대신 서버에서 받은 notifications를 전달하면 됩니다.
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'analysis-danger',
    title: '분석이 완료됐어요',
    message: "'알바몬 카페 근로계약서'에서 위험 조항 3건이 발견됐어요",
    createdAt: '2026-08-01T09:31:00+09:00',
    isRead: false,
    target: { tab: 'history', analysisId: 1 },
  },
  {
    id: 2,
    type: 'analysis-complete',
    title: '분석이 완료됐어요',
    message: "'스타트업 인턴 계약서' 분석이 정상적으로 완료됐어요",
    createdAt: '2026-08-01T08:20:00+09:00',
    isRead: true,
    target: { tab: 'history', analysisId: 2 },
  },
  {
    id: 3,
    type: 'expert-reply',
    title: '노무사 답변이 도착했어요',
    message: '문의하신 손해배상 조항에 대한 답변을 확인해 보세요',
    createdAt: '2026-07-30T14:10:00+09:00',
    isRead: false,
    target: { tab: 'feedback', consultationId: 1 },
  },
  {
    id: 4,
    type: 'labor-news',
    title: '2026년 최저임금 안내',
    message: '최저임금 변경 내용과 적용 시점을 확인하세요',
    createdAt: '2026-07-27T10:00:00+09:00',
    isRead: true,
    target: { tab: 'labor-news', noticeId: 1 },
  },
]

const NOTIFICATION_TYPE_MAP = {
  'analysis-danger': { icon: 'warning', className: 'notification-icon-danger' },
  'analysis-complete': { icon: 'task_alt', className: 'notification-icon-complete' },
  'expert-reply': { icon: 'support_agent', className: 'notification-icon-default' },
  'labor-news': { icon: 'campaign', className: 'notification-icon-default' },
}

const DEFAULT_NOTIFICATION_TYPE = NOTIFICATION_TYPE_MAP['labor-news']

function formatRelativeTime(dateString) {
  const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000)

  if (!Number.isFinite(minutes) || minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`

  return `${Math.floor(hours / 24)}일 전`
}

function isToday(dateString, now = new Date()) {
  const date = new Date(dateString)

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

// 한국에서 일반적으로 쓰는 월요일~일요일 기준의 "이번 주"입니다.
function isWithinThisWeek(dateString, now = new Date()) {
  const date = new Date(dateString)
  const weekStart = new Date(now)
  const day = weekStart.getDay()
  const daysFromMonday = day === 0 ? 6 : day - 1

  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - daysFromMonday)

  return date >= weekStart && date <= now
}

function NotificationItem({ notification, onClick }) {
  const config = NOTIFICATION_TYPE_MAP[notification.type] ?? DEFAULT_NOTIFICATION_TYPE

  return (
    <button
      className="alert-notification-item"
      type="button"
      onClick={() => onClick?.(notification.target, notification.id)}
    >
      <span className={`alert-notification-icon ${config.className}`} aria-hidden="true">
        <span className="msr">{config.icon}</span>
      </span>

      <span className="alert-notification-content">
        <strong className="alert-notification-title">{notification.title}</strong>
        <span className="alert-notification-description">{notification.message}</span>
        <time className="alert-notification-time" dateTime={notification.createdAt}>
          {formatRelativeTime(notification.createdAt)}
        </time>
      </span>

      {!notification.isRead && <span className="unread-dot" aria-label="읽지 않은 알림" />}
    </button>
  )
}

function NotificationSection({ title, notifications, emptyMessage, onNotificationClick }) {
  return (
    <section className="alert-notification-section" aria-labelledby={`${title}-heading`}>
      <h2 id={`${title}-heading`} className="alert-notification-section-title">{title}</h2>

      {notifications.length > 0 ? (
        <div className="alert-notification-items">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={onNotificationClick}
            />
          ))}
        </div>
      ) : (
        <p className="alert-notification-empty">{emptyMessage}</p>
      )}
    </section>
  )
}

function AlertContent({ notifications = MOCK_NOTIFICATIONS, onNotificationClick }) {
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const todayNotifications = sortedNotifications.filter((item) => isToday(item.createdAt))
  const weeklyNotifications = sortedNotifications.filter(
    (item) => !isToday(item.createdAt) && isWithinThisWeek(item.createdAt),
  )

  return (
    <div className="alert-notification-list">
      <NotificationSection
        title="오늘"
        notifications={todayNotifications}
        emptyMessage="오늘 새로 도착한 알림이 없어요"
        onNotificationClick={onNotificationClick}
      />
      <NotificationSection
        title="이번 주"
        notifications={weeklyNotifications}
        emptyMessage="이번 주 알림이 없어요"
        onNotificationClick={onNotificationClick}
      />
    </div>
  )
}

export default function AlertPage({ notifications = MOCK_NOTIFICATIONS, onNotificationClick }) {
  const navigate = useNavigate()

  function handleNotificationClick(target) {
    if (onNotificationClick) {
      onNotificationClick(target)
      return
    }

    if (target?.tab === 'history') {
      navigate(SCREEN_PATHS.analysisHistory)
      return
    }

    if (target?.tab === 'feedback') {
      navigate(SCREEN_PATHS.professionalFeedback)
    }
  }

  return (
    <DeviceShell>
      <Header title="알림" />
      <main className="content-slot">
        <AlertContent
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        />
      </main>
      <BottomNavigation activeTab="alarm" />
    </DeviceShell>
  )
}
