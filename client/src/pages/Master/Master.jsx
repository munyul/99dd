import { useState } from 'react'
import Header from '../../components/layout/Header.jsx'
import MainLayout from '../../components/layout/MainLayout.jsx'
import Avatar from '../../components/master/Avatar.jsx'
import Badge from '../../components/master/Badge.jsx'
import Button from '../../components/master/Button.jsx'
import Card from '../../components/master/Card.jsx'

function HomeContent({ onStart }) {
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
        <Card className="action-card">
          <div className="f15 fw8">계약서 촬영</div>
          <div className="f12 tc action-card-description">카메라로 바로 찍기</div>
        </Card>
        <Card className="action-card">
          <div className="f15 fw8">파일 업로드</div>
          <div className="f12 tc action-card-description">PDF·이미지 올리기</div>
        </Card>
      </div>

      <div className="section-label">최근 분석 내역</div>
      <Card className="recent-card">
        <div className="row between">
          <div className="f14 fw8">알바몬 카페 근로계약서</div>
          <Badge status="danger">위험</Badge>
        </div>
      </Card>
    </>
  )
}

function CaptureContent() {
  return (
    <>
      <section className="camera-preview">
        <div className="camera-guide" />
        <div className="camera-hint">계약서 전체가 잘 보이게 맞춰주세요</div>
      </section>
      <div className="capture-button-wrap">
        <button className="capture-button" type="button" aria-label="계약서 촬영" />
      </div>
    </>
  )
}

function HistoryContent() {
  return (
    <>
      <div className="row gap8 chip-row">
        <button className="chip active" type="button">전체</button>
        <button className="chip" type="button">위험</button>
        <button className="chip" type="button">주의</button>
        <button className="chip" type="button">안전</button>
      </div>

      <Card className="history-card">
        <div className="row between">
          <div className="f14 fw8">알바몬 카페 근로계약서</div>
          <Badge status="danger">위험 3</Badge>
        </div>
        <div className="f12 tc card-date">2026.07.26</div>
      </Card>

      <Card className="history-card">
        <div className="row between">
          <div className="f14 fw8">편의점 야간알바 계약서</div>
          <Badge status="caution">주의 1</Badge>
        </div>
        <div className="f12 tc card-date">2026.07.22</div>
      </Card>

      <Card>
        <div className="row between">
          <div className="f14 fw8">스타트업 인턴 계약서</div>
          <Badge status="safe">안전</Badge>
        </div>
        <div className="f12 tc card-date">2026.07.20</div>
      </Card>
    </>
  )
}

function AlarmContent() {
  return (
    <div className="notification-list">
      <article className="notification-item">
        <span className="msr notification-danger">warning</span>
        <div>
          <div className="f14 fw8">분석이 완료됐어요</div>
          <div className="f12 tc notification-description">위험 조항 3건이 발견됐어요 · 10분 전</div>
        </div>
      </article>
      <article className="notification-item with-border">
        <span className="msr notification-default">support_agent</span>
        <div>
          <div className="f14 fw8">노무사 답변이 도착했어요</div>
          <div className="f12 tc notification-description">2일 전</div>
        </div>
      </article>
    </div>
  )
}

function MyContent() {
  return (
    <>
      <div className="row gap12 profile-summary">
        <Avatar icon="person" size={56} className="profile-avatar" />
        <div>
          <div className="f18 fw8">지민 님</div>
          <div className="f12 tc profile-email">jimin_park@email.com</div>
        </div>
      </div>

      <Card className="profile-stats">
        <div className="profile-stat">
          <div className="f18 fw8">4</div>
          <div className="f11 tc profile-stat-label">분석 건수</div>
        </div>
        <div className="profile-divider" />
        <div className="profile-stat">
          <div className="f18 fw8 danger-text">3</div>
          <div className="f11 tc profile-stat-label">위험조항</div>
        </div>
        <div className="profile-divider" />
        <div className="profile-stat">
          <div className="f18 fw8">1</div>
          <div className="f11 tc profile-stat-label">상담 이력</div>
        </div>
      </Card>
    </>
  )
}

const headers = {
  home: <Header variant="home" userName="지민" />,
  capture: <Header title="계약서 촬영" leftIcon="close" />,
  history: <Header title="분석 내역" />,
  alarm: <Header title="알림" />,
  my: <Header title="마이페이지" rightIcon="settings" />,
}

function Master() {
  const [activeTab, setActiveTab] = useState('home')

  const content = {
    home: <HomeContent onStart={() => setActiveTab('capture')} />,
    capture: <CaptureContent />,
    history: <HistoryContent />,
    alarm: <AlarmContent />,
    my: <MyContent />,
  }

  return (
    <MainLayout
      header={headers[activeTab]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {content[activeTab]}
    </MainLayout>
  )
}

export default Master
