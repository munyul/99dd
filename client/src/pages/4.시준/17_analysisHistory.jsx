import { useState } from 'react'
import DeviceShell from '../../components/layout/DeviceShell.jsx'
import Header from '../../components/layout/Header.jsx'
import BottomNavigation from '../../components/layout/BottomNavigation.jsx'
import Card from '../../components/master/Card.jsx'
import Badge from '../../components/master/Badge.jsx'


// ===============================
// 1. 필터 옵션
// ===============================

const FILTERS = [
  {
    key: 'all',
    label: '전체',
  },
  {
    key: 'danger',
    label: '위험',
  },
  {
    key: 'caution',
    label: '주의',
  },
  {
    key: 'safe',
    label: '안전',
  },
]


// ===============================
// 2. 목업 데이터
// API 연결 시 이 부분만 교체
// ===============================

const MOCK_ITEMS = [
  {
    id: 1,
    title: '알바몬 카페 근로계약서',
    date: '2026.07.26',
    score: 32,
    status: 'danger',
    issueCount: 3,
  },
  {
    id: 2,
    title: '편의점 아르바이트 계약서',
    date: '2026.07.24',
    score: 61,
    status: 'caution',
    issueCount: 1,
  },
  {
    id: 3,
    title: '스타트업 인턴 계약서',
    date: '2026.07.20',
    score: 94,
    status: 'safe',
    issueCount: 0,
  },
  {
    id: 4,
    title: '프리랜서 업무 계약서',
    date: '2026.07.18',
    score: 28,
    status: 'danger',
    issueCount: 2,
  },
  {
    id: 5,
    title: '신규 계약서 분석 요청',
    date: '2026.07.15',
    score: null,
    status: 'pending',
    issueCount: 0,
  },
]


// ===============================
// 상태별 설정
// ===============================

const STATUS_CONFIG = {
  danger: {
    label: '위험',
    icon: 'description',
  },
  caution: {
    label: '주의',
    icon: 'description',
  },
  safe: {
    label: '안전',
    icon: 'description',
  },
  pending: {
    label: '대기',
    icon: 'hourglass_empty',
  },
}


// ===============================
// 3. 카드 하나 컴포넌트
// ===============================

function HistoryItemCard({ item }) {
  const {
    title,
    date,
    score,
    status,
    issueCount,
  } = item

  const isPending = status === 'pending'
  const config = STATUS_CONFIG[status]


  return (
    <Card className="history-card">
      <div className="row between gap12">

        {/* 왼쪽 아이콘 */}
        <div
          className={`history-icon history-icon-${status}`}
        >
          <span className="msr">
            {config.icon}
          </span>
        </div>


        {/* 가운데 내용 */}
        <div className="history-body">

          <div className="f14 fw8 ellipsis">
            {title}
          </div>


          <div className="f12 tc mt4">
            {
              isPending
                ? '분석 대기중'
                : `${date} · 위험도 ${score}점`
            }
          </div>

        </div>


        {/* 오른쪽 상태 */}
        {
          isPending ? (

            <span className="badge badge-gray">
              대기
            </span>

          ) : (

            <Badge status={status}>
              {config.label}

              {
                issueCount > 0 &&
                ` ${issueCount}`
              }

            </Badge>

          )
        }

      </div>
    </Card>
  )
}



// ===============================
// 4. 페이지 콘텐츠
// ===============================

function AnalysisHistoryContent() {
  const [filter, setFilter] = useState('all')


  // 필터 적용
  const visibleItems = MOCK_ITEMS.filter((item) => {

    // 전체는 모든 상태 표시
    if (filter === 'all') {
      return true
    }


    // 위험/주의/안전만 표시
    return item.status === filter

  })


  return (

    <>

      {/* =====================
          필터 칩
      ===================== */}

      <div className="row gap8 chip-row">

        {
          FILTERS.map(({ key, label }) => (

            <button
              key={key}
              type="button"
              className={
                `chip ${filter === key ? 'active' : ''}`
              }
              onClick={() => setFilter(key)}
            >
              {label}
            </button>

          ))
        }

      </div>



      {/* =====================
          분석 내역 리스트
      ===================== */}

      <div className="col gap12 mt16">

        {
          visibleItems.map((item) => (

            <HistoryItemCard
              key={item.id}
              item={item}
            />

          ))
        }

      </div>


    </>
  )
}

export default function AnalysisHistoryPage() {
  return (
    <DeviceShell>
      <Header title="분석 내역" />
      <main className="content-slot">
        <AnalysisHistoryContent />
      </main>
      <BottomNavigation activeTab="history" />
    </DeviceShell>
  )
}
