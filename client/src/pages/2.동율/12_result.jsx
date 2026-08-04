import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import DeviceShell from '../../components/layout/DeviceShell.jsx'
import { buildContractAnalysisPresentation } from '../../api/contractParser.js'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'danger', label: '위험' },
  { key: 'caution', label: '주의' },
  { key: 'safe', label: '안전' },
]

const SEVERITY_LABELS = {
  danger: '위험 조항',
  caution: '주의 조항',
  safe: '안전 조항',
}

const SEVERITY_ALIASES = {
  danger: 'danger',
  caution: 'caution',
  safe: 'safe',
  위험: 'danger',
  주의: 'caution',
  안전: 'safe',
}

function normalizeSeverity(severity) {
  const key = String(severity ?? '').trim().toLowerCase()
  return SEVERITY_ALIASES[key] || SEVERITY_ALIASES[severity] || severity
}

function normalizeClauses(clauses) {
  return clauses.map((clause) => ({
    ...clause,
    severity: normalizeSeverity(clause.severity),
  }))
}

const DEFAULT_ANALYSIS_RESULT = {
  clauses: [
    {
      id: 'overtime-pay',
      severity: 'danger',
      title: '연장근무 수당 미지급',
      contractText: '근로자는 추가 수당 없이 연장 근무를 할 수 있다.',
      description: '추가 수당을 지급하지 않는다는 문구가 법정 가산임금 기준과 충돌할 수 있어요.',
      lawStandard: '연장근로에는 통상임금의 50% 이상을 가산해 지급해야 해요.',
      reference: '근로기준법 제56조 위반 소지',
      sourceUrl: 'https://law.go.kr/',
    },
    {
      id: 'weekly-holiday',
      severity: 'danger',
      title: '주휴수당 누락',
      contractText: '주휴수당은 별도 지급하지 않는다.',
      description: '근무 조건을 따지지 않고 주휴수당을 배제하는 문구는 위험할 수 있어요.',
      lawStandard: '사용자는 근로자에게 1주에 평균 1회 이상의 유급휴일을 보장해야 해요.',
      reference: '근로기준법 제55조 확인 필요',
      sourceUrl: 'https://www.law.go.kr/',
    },
    {
      id: 'unfair-dismissal',
      severity: 'danger',
      title: '일방적 계약 해지 조건',
      contractText: '회사는 필요할 경우 즉시 계약을 해지할 수 있다.',
      description: '회사의 필요만으로 즉시 해지할 수 있다는 문구는 근로자에게 매우 불리해요.',
      lawStandard: '사용자는 정당한 이유 없이 근로자를 해고하거나 징벌할 수 없어요.',
      reference: '근로기준법 제23조 위반 소지',
      sourceUrl: 'https://www.law.go.kr/',
    },
    {
      id: 'excessive-damages',
      severity: 'caution',
      title: '과도한 손해배상 조항',
      contractText: '근로자의 귀책 사유 발생 시 월 급여의 3배를 배상한다.',
      description: '실제 손해와 관계없이 배상액을 미리 정한 것으로 해석될 가능성이 있어요.',
      lawStandard: '근로계약 불이행에 대한 위약금이나 손해배상액을 미리 정할 수 없어요.',
      reference: '근로기준법 제20조 위반 소지',
      sourceUrl: 'https://law.go.kr/',
    },
    {
      id: 'unclear-duties',
      severity: 'caution',
      title: '업무 범위가 불명확해요',
      contractText: '근로자는 회사가 지정하는 기타 업무를 수행한다.',
      description: '업무 범위가 지나치게 넓어 계약 후 예상하지 못한 업무가 추가될 수 있어요.',
      lawStandard: '근로조건은 계약할 때 구체적으로 확인하고 서면으로 명확히 두는 것이 안전해요.',
      reference: '근로기준법 제17조 및 업무 범위 확인 필요',
      sourceUrl: 'https://law.go.kr/',
    },
    {
      id: 'working-hours',
      severity: 'safe',
      title: '근무시간이 명확해요',
      contractText: '근로자의 근무시간은 09:00~18:00로 한다.',
      description: '근무 시작과 종료 시간이 구체적으로 작성되어 있어 확인하기 쉬워요.',
      lawStandard: '사용자는 근로계약을 체결할 때 소정근로시간을 명시해야 해요.',
      reference: '근로기준법 제17조 기준 충족 가능',
      sourceUrl: 'https://law.go.kr/',
    },
  ],
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12M8 7l4-4 4 4M6 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

function ContractHighlight({ clause, severity, activeFilter, isSelected, onSelect, children }) {
  const resolvedSeverity = severity || clause?.severity || 'danger'
  const isMuted = activeFilter !== 'all' && activeFilter !== resolvedSeverity

  const selectClause = () => {
    if (!isMuted && clause) onSelect(clause)
  }

  const handleKeyDown = (event) => {
    if (isMuted || !clause || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    onSelect(clause)
  }

  return (
    <mark
      className={`rs-highlight is-${resolvedSeverity}${isMuted ? ' is-muted' : ''}${isSelected ? ' is-selected' : ''}`}
      role="button"
      tabIndex={isMuted ? -1 : 0}
      aria-disabled={isMuted}
      aria-pressed={isSelected}
      aria-label={`${clause?.title ?? '조항'}: ${children}`}
      onClick={selectClause}
      onKeyDown={handleKeyDown}
    >
      {children}
    </mark>
  )
}

function AnalysisResult({
  result: propsResult,
  onBack,
  onShare,
  onClauseSelect,
  onViewSuggestions,
  onConsult,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const feedbackTimerRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedClauseId, setSelectedClauseId] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const analysisResult = useMemo(() => {
    const data = propsResult || location.state?.analysisResult || {}
    const contractText = location.state?.reviewedContract?.contractText || ''
    const rawClauses = normalizeClauses(data.clauses || DEFAULT_ANALYSIS_RESULT.clauses)

    return buildContractAnalysisPresentation(contractText, rawClauses)
  }, [propsResult, location.state])

  const clausesById = useMemo(
    () => Object.fromEntries(analysisResult.clauses.map((clause) => [clause.id, clause])),
    [analysisResult.clauses],
  )

  const counts = useMemo(() => {
    const clauseCounts = { all: analysisResult.clauses.length, danger: 0, caution: 0, safe: 0 }

    analysisResult.clauses.forEach(({ severity }) => {
      if (severity in clauseCounts) clauseCounts[severity] += 1
    })

    return clauseCounts
  }, [analysisResult.clauses])

  const selectedClause = selectedClauseId ? clausesById[selectedClauseId] : null

  useEffect(() => () => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current)
  }, [])

  const showFeedback = (message) => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current)
    setFeedbackMessage(message)
    feedbackTimerRef.current = window.setTimeout(() => setFeedbackMessage(''), 2400)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    navigate('/screen/10')
  }

  const handleShare = async () => {
    if (onShare) {
      onShare(analysisResult)
      return
    }

    const shareData = {
      title: '계약서 분석 결과',
      text: `위험 ${counts.danger}건 · 주의 ${counts.caution}건 · 안전 ${counts.safe}건`,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        showFeedback('분석 결과를 공유했어요.')
        return
      }

      await navigator.clipboard.writeText(shareData.text)
      showFeedback('분석 결과를 복사했어요.')
    } catch (error) {
      if (error?.name !== 'AbortError') showFeedback('공유 기능을 사용할 수 없어요.')
    }
  }

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey)

    if (selectedClause && filterKey !== 'all' && selectedClause.severity !== filterKey) {
      setSelectedClauseId(null)
    }
  }

  const handleClauseSelect = (clause) => {
    setSelectedClauseId(clause.id)
    onClauseSelect?.(clause)
  }

  const handleViewSuggestions = () => {
    if (onViewSuggestions) {
      onViewSuggestions(analysisResult)
      return
    }

    showFeedback('수정 제안 기능은 다음 연결 단계에서 제공돼요.')
  }

  const handleConsult = () => {
    if (onConsult) {
      onConsult(analysisResult)
      return
    }

    showFeedback('전문가 상담 기능은 다음 연결 단계에서 제공돼요.')
  }

  const highlightProps = (segment) => ({
    clause: clausesById[segment.clauseId],
    severity: segment.severity ?? clausesById[segment.clauseId]?.severity,
    activeFilter,
    isSelected: selectedClauseId === segment.clauseId,
    onSelect: handleClauseSelect,
  })

  return (
    <DeviceShell className="rs-page" deviceClassName="rs-device">
      <style>{`
        .rs-page {
          --rs-ink: #18181a;
          --rs-subtle: #8b8b92;
          --rs-line: #e8e8ea;
          --rs-danger: #ff403b;
          --rs-danger-soft: #ffe9e7;
          --rs-caution: #ff9f0a;
          --rs-caution-soft: #fff3dc;
          --rs-safe: #20c66a;
          --rs-safe-soft: #e7f8ed;
          --rs-lime: #caff2c;
          color: var(--rs-ink);
          font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
        }

        .rs-device .app-shell {
          position: relative;
          min-height: 0;
          overflow: hidden;
          background: #fff;
        }

        .rs-header {
          z-index: 20;
          display: grid;
          grid-template-columns: 48px 1fr 48px;
          align-items: center;
          flex: 0 0 auto;
          min-height: 62px;
          padding: 0 18px;
          background: rgba(255, 255, 255, 0.97);
        }

        .rs-header-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.2;
          text-align: center;
          letter-spacing: -0.04em;
        }

        .rs-icon-button {
          display: inline-grid;
          width: 42px;
          height: 42px;
          place-items: center;
          padding: 0;
          border: 0;
          border-radius: 13px;
          color: var(--rs-ink);
          background: #f5f5f5;
          cursor: pointer;
          transition: transform 160ms ease, background-color 160ms ease;
        }

        .rs-icon-button:last-child {
          justify-self: end;
          background: transparent;
        }

        .rs-icon-button:hover {
          background: #ececee;
        }

        .rs-icon-button:active {
          transform: scale(0.94);
        }

        .rs-icon-button svg {
          width: 27px;
          height: 27px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .rs-content {
          flex: 1 1 auto;
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 6px 24px 24px;
          scrollbar-width: none;
          overscroll-behavior: contain;
        }

        .rs-content::-webkit-scrollbar,
        .rs-filter-list::-webkit-scrollbar {
          display: none;
        }

        .rs-filter-list {
          display: flex;
          gap: 9px;
          margin: 2px -2px 22px;
          padding: 0 2px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .rs-filter {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          min-height: 42px;
          flex: 0 0 auto;
          padding: 0 18px;
          border: 1px solid transparent;
          border-radius: 999px;
          color: var(--rs-filter-color);
          background: var(--rs-filter-bg);
          font: inherit;
          font-size: 15px;
          font-weight: 750;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, color 160ms ease, background-color 160ms ease;
        }

        .rs-filter.is-all {
          --rs-filter-color: #222;
          --rs-filter-bg: #f0f0f2;
        }

        .rs-filter.is-danger {
          --rs-filter-color: var(--rs-danger);
          --rs-filter-bg: var(--rs-danger-soft);
        }

        .rs-filter.is-caution {
          --rs-filter-color: var(--rs-caution);
          --rs-filter-bg: var(--rs-caution-soft);
        }

        .rs-filter.is-safe {
          --rs-filter-color: var(--rs-safe);
          --rs-filter-bg: var(--rs-safe-soft);
        }

        .rs-filter.is-active {
          color: #fff;
          background: var(--rs-filter-color);
          box-shadow: 0 7px 16px rgba(24, 24, 24, 0.12);
        }

        .rs-filter:active {
          transform: scale(0.96);
        }

        .rs-section-title {
          margin: 0 0 12px;
          color: #85858c;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .rs-contract-card {
          padding: 24px 22px;
          border: 1px solid var(--rs-line);
          border-radius: 22px;
          background: #fff;
          box-shadow: 0 10px 24px rgba(21, 21, 21, 0.07);
          color: #363638;
          font-size: 15.5px;
          line-height: 2.08;
          letter-spacing: -0.026em;
          white-space: pre-wrap;
          word-break: keep-all;
        }

        .rs-contract-card p {
          margin: 0 0 10px;
        }

        .rs-contract-card p:last-child {
          margin-bottom: 0;
        }

        .rs-highlight {
          --rs-marker: rgba(255, 93, 87, 0.5);
          position: relative;
          padding: 1px 2px;
          border-radius: 3px;
          color: inherit;
          background: linear-gradient(180deg, transparent 54%, var(--rs-marker) 54%, var(--rs-marker) 90%, transparent 90%);
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
          cursor: pointer;
          transition: opacity 180ms ease, filter 180ms ease, box-shadow 180ms ease;
        }

        .rs-highlight.is-danger {
          --rs-marker: rgba(255, 64, 59, 0.62);
        }

        .rs-highlight.is-caution {
          --rs-marker: rgba(255, 159, 10, 0.62);
        }

        .rs-highlight.is-safe {
          --rs-marker: rgba(32, 198, 106, 0.52);
        }

        .rs-highlight:hover,
        .rs-highlight.is-selected {
          box-shadow: inset 0 -3px 0 var(--rs-marker);
        }

        .rs-highlight.is-muted {
          opacity: 0.18;
          filter: saturate(0.1);
          cursor: default;
        }

        .rs-highlight:focus-visible {
          outline: 2px solid #2f84ff;
          outline-offset: 2px;
        }

        .rs-tap-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin: 15px 0 0;
          color: var(--rs-subtle);
          font-size: 13px;
          font-weight: 650;
          text-align: center;
        }

        .rs-tap-dot {
          width: 17px;
          height: 17px;
          border: 1.5px solid #aaaab0;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 800;
          line-height: 15px;
        }

        .rs-sheet-backdrop {
          position: absolute;
          z-index: 70;
          inset: 0;
          padding: 0;
          border: 0;
          background: rgba(14, 14, 16, 0.42);
          cursor: pointer;
          animation: rs-backdrop-in 180ms ease-out;
        }

        .rs-explanation {
          --rs-severity: var(--rs-danger);
          --rs-explanation-bg: var(--rs-danger-soft);
          position: absolute;
          z-index: 80;
          right: 0;
          bottom: 0;
          left: 0;
          max-height: 76%;
          overflow-y: auto;
          padding: 12px 24px 28px;
          border-radius: 28px 28px 0 0;
          background: #fff;
          box-shadow: 0 -18px 45px rgba(0, 0, 0, 0.18);
          scrollbar-width: none;
          animation: rs-sheet-up 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .rs-explanation::-webkit-scrollbar {
          display: none;
        }

        .rs-explanation.is-caution {
          --rs-severity: var(--rs-caution);
          --rs-explanation-bg: var(--rs-caution-soft);
        }

        .rs-explanation.is-safe {
          --rs-severity: var(--rs-safe);
          --rs-explanation-bg: var(--rs-safe-soft);
        }

        .rs-sheet-handle {
          width: 42px;
          height: 5px;
          margin: 0 auto 17px;
          border-radius: 999px;
          background: #d7d7da;
        }

        .rs-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .rs-sheet-heading {
          margin: 0;
          font-size: 18px;
          font-weight: 850;
          letter-spacing: -0.04em;
        }

        .rs-explanation-close {
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          padding: 0;
          border: 0;
          border-radius: 50%;
          color: #74747b;
          background: #f2f2f3;
          cursor: pointer;
        }

        .rs-explanation-close svg {
          width: 17px;
          height: 17px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
        }

        .rs-severity-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 29px;
          padding: 0 11px;
          border-radius: 999px;
          color: var(--rs-severity);
          background: var(--rs-explanation-bg);
          font-size: 12px;
          font-weight: 850;
        }

        .rs-severity-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--rs-severity);
        }

        .rs-explanation-title {
          margin: 10px 0 16px;
          font-size: 21px;
          font-weight: 850;
          line-height: 1.3;
          letter-spacing: -0.045em;
        }

        .rs-comparison {
          display: grid;
          gap: 9px;
        }

        .rs-comparison-card {
          padding: 15px 16px;
          border: 1px solid var(--rs-line);
          border-radius: 16px;
          background: #f8f8f9;
        }

        .rs-comparison-card.is-law {
          border-color: var(--rs-severity);
          background: var(--rs-explanation-bg);
        }

        .rs-comparison-label {
          display: block;
          margin-bottom: 7px;
          color: #898990;
          font-size: 11px;
          font-weight: 800;
        }

        .rs-comparison-card.is-law .rs-comparison-label {
          color: var(--rs-severity);
        }

        .rs-comparison-text {
          margin: 0;
          color: #36363a;
          font-size: 14px;
          font-weight: 650;
          line-height: 1.55;
          letter-spacing: -0.025em;
        }

        .rs-compare-arrow {
          justify-self: center;
          color: var(--rs-severity);
          font-size: 18px;
          font-weight: 900;
          line-height: 1;
        }

        .rs-analysis-note {
          margin: 15px 0 0;
          color: #55555c;
          font-size: 13.5px;
          line-height: 1.55;
          letter-spacing: -0.02em;
        }

        .rs-explanation-reference {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          color: var(--rs-severity);
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .rs-explanation-reference::after {
          content: '원문 보기 →';
          flex: 0 0 auto;
          font-size: 12px;
        }

        .rs-legal-notice {
          margin: 16px 0 0;
          padding-top: 13px;
          border-top: 1px solid var(--rs-line);
          color: #9999a0;
          font-size: 11px;
          line-height: 1.5;
        }

        .rs-footer {
          z-index: 30;
          display: grid;
          grid-template-columns: 0.92fr 1.12fr;
          gap: 11px;
          flex: 0 0 auto;
          padding: 14px 24px 26px;
          border-top: 1px solid rgba(235, 235, 235, 0.8);
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 -10px 22px rgba(255, 255, 255, 0.94);
        }

        .rs-action {
          min-height: 58px;
          padding: 0 12px;
          border: 1.5px solid #dedee1;
          border-radius: 18px;
          color: var(--rs-ink);
          background: #fff;
          font: inherit;
          font-size: 16px;
          font-weight: 850;
          letter-spacing: -0.035em;
          cursor: pointer;
          transition: transform 160ms ease, filter 160ms ease;
        }

        .rs-action.is-primary {
          border-color: var(--rs-lime);
          background: var(--rs-lime);
        }

        .rs-action:active {
          transform: scale(0.98);
        }

        .rs-toast {
          position: absolute;
          z-index: 60;
          right: 24px;
          bottom: 104px;
          left: 24px;
          padding: 11px 16px;
          border-radius: 999px;
          color: #fff;
          background: rgba(22, 22, 22, 0.9);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          animation: rs-explanation-in 180ms ease-out;
        }

        .rs-icon-button:focus-visible,
        .rs-filter:focus-visible,
        .rs-action:focus-visible,
        .rs-explanation-close:focus-visible {
          outline: 3px solid rgba(47, 132, 255, 0.4);
          outline-offset: 2px;
        }

        @keyframes rs-explanation-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rs-sheet-up {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rs-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 480px) {
          .rs-header {
            min-height: 58px;
            padding: 0 16px;
          }

          .rs-content {
            padding: 4px 18px 22px;
          }

          .rs-filter {
            min-height: 40px;
            padding: 0 16px;
          }

          .rs-contract-card {
            padding: 22px 19px;
          }

          .rs-footer {
            padding: 12px 18px calc(18px + env(safe-area-inset-bottom));
          }

          .rs-action {
            min-height: 56px;
            font-size: 15px;
          }

          .rs-toast {
            right: 18px;
            bottom: calc(94px + env(safe-area-inset-bottom));
            left: 18px;
          }
        }

        @media (max-width: 360px) {
          .rs-filter {
            padding: 0 14px;
            font-size: 14px;
          }

          .rs-contract-card {
            padding: 20px 17px;
            font-size: 14.5px;
          }

          .rs-footer {
            gap: 8px;
          }

          .rs-action {
            padding: 0 8px;
            font-size: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rs-page *,
          .rs-page *::before,
          .rs-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <header className="rs-header">
        <button className="rs-icon-button" type="button" aria-label="이전 화면" onClick={handleBack}>
          <BackIcon />
        </button>
        <h1 className="rs-header-title">분석 결과</h1>
        <button className="rs-icon-button" type="button" aria-label="분석 결과 공유" onClick={handleShare}>
          <ShareIcon />
        </button>
      </header>

      <main className="rs-content" aria-label="계약서 분석 결과 상세">
        <div className="rs-filter-list" role="group" aria-label="위험도별 조항 필터">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`rs-filter is-${filter.key}${activeFilter === filter.key ? ' is-active' : ''}`}
              type="button"
              aria-pressed={activeFilter === filter.key}
              onClick={() => handleFilterChange(filter.key)}
            >
              <span>{filter.label}</span>
              <span>{counts[filter.key]}</span>
            </button>
          ))}
        </div>

        <section aria-labelledby="contract-highlight-title">
          <h2 className="rs-section-title" id="contract-highlight-title">형광펜으로 표시된 계약서</h2>
          <article className="rs-contract-card">
            {/* contractText + quote 매칭으로 생성한 segments 렌더링 */}
            {analysisResult.segments.map((segment, index) =>
              segment.clauseId ? (
                <ContractHighlight
                  key={`${segment.clauseId}-${index}`}
                  {...highlightProps(segment)}
                >
                  {segment.text}
                </ContractHighlight>
              ) : (
                <span key={`text-${index}`}>{segment.text}</span>
              ),
            )}
          </article>

          <p className="rs-tap-hint">
            <span className="rs-tap-dot" aria-hidden="true">i</span>
            형광펜 표시를 누르면 법 기준과 비교할 수 있어요
          </p>
        </section>
      </main>

      <footer className="rs-footer">
        <button className="rs-action" type="button" onClick={handleViewSuggestions}>수정 제안 보기</button>
        <button className="rs-action is-primary" type="button" onClick={handleConsult}>전문가 상담</button>
      </footer>

      {selectedClause ? (
        <>
          <button
            className="rs-sheet-backdrop"
            type="button"
            aria-label="발견된 조항 닫기"
            onClick={() => setSelectedClauseId(null)}
          />
          <aside
            className={`rs-explanation is-${selectedClause.severity}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-clause-title"
          >
            <div className="rs-sheet-handle" aria-hidden="true" />
            <div className="rs-sheet-header">
              <h2 className="rs-sheet-heading">발견된 조항</h2>
              <button
                className="rs-explanation-close"
                type="button"
                aria-label="발견된 조항 닫기"
                onClick={() => setSelectedClauseId(null)}
              >
                <CloseIcon />
              </button>
            </div>

            <span className="rs-severity-label">
              <span className="rs-severity-dot" aria-hidden="true" />
              {SEVERITY_LABELS[selectedClause.severity]}
            </span>
            <h3 className="rs-explanation-title" id="selected-clause-title">{selectedClause.title}</h3>

            <div className="rs-comparison">
              <div className="rs-comparison-card">
                <span className="rs-comparison-label">계약서 내용</span>
                <p className="rs-comparison-text">
                  “{selectedClause.quote || selectedClause.contractText}”
                </p>
              </div>
              <span className="rs-compare-arrow" aria-hidden="true">↓</span>
              <div className="rs-comparison-card is-law">
                <span className="rs-comparison-label">근로기준법 기준</span>
                <p className="rs-comparison-text">{selectedClause.lawStandard}</p>
              </div>
            </div>

            <p className="rs-analysis-note">{selectedClause.description}</p>
            <a
              className="rs-explanation-reference"
              href="https://www.law.go.kr/법령/근로기준법"
              target="_blank"
              rel="noreferrer"
            >
              <span>{selectedClause.reference}</span>
            </a>
            <p className="rs-legal-notice">
              AI 분석은 계약서 검토를 돕기 위한 참고 정보이며, 구체적인 법률 판단은 전문가 상담이 필요할 수 있어요.
            </p>
          </aside>
        </>
      ) : null}

      {feedbackMessage ? (
        <div className="rs-toast" role="status" aria-live="polite">{feedbackMessage}</div>
      ) : null}
    </DeviceShell>
  )
}

export default AnalysisResultPage

function AnalysisResultPage(props) {
  const location = useLocation()

  return (
    <AnalysisResult
      {...props}
      result={props.result ?? location.state?.analysisResult}
    />
  )
}
