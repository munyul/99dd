import { Outlet, useLocation, useNavigate } from 'react-router'
import Header from '../../components/layout/Header.jsx'
import MainLayout from '../../components/layout/MainLayout.jsx'
import Badge from '../../components/master/Badge.jsx'
import Button from '../../components/master/Button.jsx'
import Card from '../../components/master/Card.jsx'
import { getActiveTabFromPath, SCREEN_PATHS } from '../../constants/screenRoutes.js'

const STANDALONE_SCREEN_PATTERN = /^\/screen\/(7|8|9|10|11|12|16|17|18)$/
const MY_PAGE_PATTERN = /^\/screen\/19/

function HomeContent({ onStart, onCapture, onUpload, onViewHistory, onViewRecent }) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-decoration" />
        <div className="f13 fw7 hero-eyebrow">지금 바로 확인하세요</div>
        <h1 className="hero-title">
          계약서 서명 전,
          <br />
          1분만 투자해보세요
        </h1>
        <Button size="sm" className="hero-button" onClick={onStart}>
          분석 시작 <span className="msr button-icon">arrow_forward</span>
        </Button>
      </section>

      <div className="row gap12 home-actions">
        <Card
          className="action-card"
          role="button"
          tabIndex={0}
          onClick={onCapture}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onCapture()
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="f15 fw8">계약서 촬영</div>
          <div className="f12 tc action-card-description">카메라로 바로 찍기</div>
        </Card>
        <Card
          className="action-card"
          role="button"
          tabIndex={0}
          onClick={onUpload}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onUpload()
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="f15 fw8">파일 업로드</div>
          <div className="f12 tc action-card-description">PDF·이미지 올리기</div>
        </Card>
      </div>

      <button
        type="button"
        className="section-label"
        onClick={onViewHistory}
        style={{
          background: 'none',
          border: 0,
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        최근 분석 내역
      </button>
      <Card
        className="recent-card"
        role="button"
        tabIndex={0}
        onClick={onViewRecent}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onViewRecent()
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="row between">
          <div className="f14 fw8">알바몬 카페 근로계약서</div>
          <Badge status="danger">위험</Badge>
        </div>
      </Card>
    </>
  )
}

function Master() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const activeTab = getActiveTabFromPath(pathname)

  if (STANDALONE_SCREEN_PATTERN.test(pathname)) {
    return <Outlet />
  }

  if (MY_PAGE_PATTERN.test(pathname)) {
    const isSubPage = pathname !== '/screen/19'

    return (
      <MainLayout
        header={
          isSubPage ? null : (
            <Header
              title="마이페이지"
              rightIcon="settings"
              onRightClick={() => navigate('/screen/19/account-settings')}
            />
          )
        }
        activeTab={activeTab}
      >
        <Outlet />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      header={
        <Header
          variant="home"
          userName="지민"
          onRightClick={() => navigate(SCREEN_PATHS.alert)}
        />
      }
      activeTab={activeTab}
    >
      <HomeContent
        onStart={() => navigate(SCREEN_PATHS.capture)}
        onCapture={() => navigate(SCREEN_PATHS.capture)}
        onUpload={() => navigate('/screen/8')}
        onViewHistory={() => navigate(SCREEN_PATHS.analysisHistory)}
        onViewRecent={() => navigate('/screen/12')}
      />
    </MainLayout>
  )
}

export default Master
