export const SCREEN_PATHS = {
  home: '/',
  capture: '/screen/7',
  professionalFeedback: '/screen/16',
  analysisHistory: '/screen/17',
  alert: '/screen/18',
  myPage: '/screen/19',
}

export const BOTTOM_NAV_ITEMS = [
  { key: 'home', path: SCREEN_PATHS.home, icon: 'home', label: '홈' },
  { key: 'capture', path: SCREEN_PATHS.capture, icon: 'photo_camera', label: '촬영' },
  { key: 'history', path: SCREEN_PATHS.analysisHistory, icon: 'folder', label: '내역' },
  { key: 'alarm', path: SCREEN_PATHS.alert, icon: 'notifications', label: '알림' },
  { key: 'my', path: SCREEN_PATHS.myPage, icon: 'person', label: '마이' },
]

export function getActiveTabFromPath(pathname) {
  if (pathname.startsWith(SCREEN_PATHS.myPage)) return 'my'
  if (pathname.startsWith(SCREEN_PATHS.analysisHistory)) return 'history'
  if (pathname.startsWith(SCREEN_PATHS.alert)) return 'alarm'
  if (pathname.startsWith(SCREEN_PATHS.capture)) return 'capture'
  return 'home'
}
