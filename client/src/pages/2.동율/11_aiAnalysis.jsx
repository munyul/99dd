import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { analyzeContractText } from '../../api/claude.js'
import DeviceShell from '../../components/layout/DeviceShell.jsx'

const inFlightAnalysisByText = new Map()

function getSharedAnalysisPromise(contractText) {
  const existing = inFlightAnalysisByText.get(contractText)
  if (existing) return existing

  const promise = analyzeContractText(contractText).finally(() => {
    inFlightAnalysisByText.delete(contractText)
  })

  inFlightAnalysisByText.set(contractText, promise)
  return promise
}

const ANALYSIS_RESULT_PATH = '/screen/12'

const ANALYSIS_STEPS = [
  {
    pendingLabel: '텍스트 인식',
    activeLabel: '텍스트 인식 중...',
    completeLabel: '텍스트 인식 완료',
  },
  {
    pendingLabel: '근로기준법 대조',
    activeLabel: '근로기준법 대조 중...',
    completeLabel: '근로기준법 대조 완료',
  },
  {
    pendingLabel: '독소조항 탐지',
    activeLabel: '독소조항 탐지 중...',
    completeLabel: '독소조항 탐지 완료',
  },
  {
    pendingLabel: '수정 제안 생성',
    activeLabel: '수정 제안 생성 중...',
    completeLabel: '수정 제안 생성 완료',
  },
]

const DEMO_FINDINGS = [
  '제3조에서 무급 연장근로 조항을 발견했어요',
  '제4조에서 주휴수당 미지급 조항을 발견했어요',
]

const pageStyles = `
  .aa-page,
  .aa-page * {
    box-sizing: border-box;
  }

  .aa-page {
    min-height: 100dvh;
  }

  .aa-page .aa-device {
    background: #ffffff;
  }

  .aa-content {
    display: flex;
    min-height: 0;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 34px;
    overflow: hidden;
  }

  .aa-analysis-panel {
    display: flex;
    width: 100%;
    max-width: 300px;
    flex-direction: column;
    align-items: center;
  }

  .aa-visual {
    position: relative;
    display: grid;
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    place-items: center;
    border-radius: 50%;
    background: rgba(217, 255, 63, 0.35);
  }

  .aa-progress-ring {
    position: absolute;
    z-index: 1;
    inset: -7px;
    width: 134px;
    height: 134px;
    overflow: visible;
    transform: rotate(-90deg);
    pointer-events: none;
  }

  .aa-progress-track,
  .aa-progress-value {
    fill: none;
    stroke-width: 2;
  }

  .aa-progress-track {
    stroke: rgba(201, 244, 43, 0.22);
  }

  .aa-progress-value {
    stroke: #b8df24;
    stroke-dasharray: 100;
    stroke-linecap: round;
    filter: drop-shadow(0 0 2px rgba(184, 223, 36, 0.32));
    transition: stroke-dashoffset 620ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .aa-visual-core {
    display: grid;
    width: 88px;
    height: 88px;
    place-items: center;
    border-radius: 50%;
    background: #d9ff3f;
  }

  .aa-symbol-stack {
    display: grid;
    width: 44px;
    height: 44px;
    place-items: center;
  }

  .aa-brain-icon {
    color: #191919;
    line-height: 1;
    transform-origin: center;
  }

  .aa-brain-icon {
    font-size: 40px;
    font-variation-settings: 'FILL' 1;
    animation: aa-brain-intro 680ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .aa-visual.is-complete .aa-brain-icon {
    animation: aa-brain-finish 680ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .aa-title {
    align-self: center;
    margin-top: 32px;
    color: #191919;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.28;
    letter-spacing: -0.025em;
    text-align: left;
  }

  .aa-live-finding {
    display: flex;
    width: 100%;
    min-height: 44px;
    align-items: center;
    margin-top: 22px;
    padding: 10px 12px;
    border: 1px solid #edf1df;
    border-radius: 14px;
    background: #fafcf4;
    animation: aa-finding-enter 360ms ease-out both;
  }

  .aa-finding-text {
    color: #4b4b4f;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.5;
    word-break: keep-all;
  }

  .aa-live-finding + .aa-steps {
    margin-top: 20px;
  }

  .aa-steps {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 14px;
    margin: 32px 0 0;
    padding: 0;
    list-style: none;
  }

  .aa-step {
    display: flex;
    min-height: 24px;
    align-items: center;
    gap: 10px;
    color: #191919;
    transition: opacity 220ms ease, color 220ms ease;
  }

  .aa-step.is-pending {
    opacity: 0.35;
  }

  .aa-step-icon {
    display: grid;
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
    font-size: 22px;
    line-height: 1;
  }

  .aa-step.is-complete .aa-step-icon {
    color: #2fbe5c;
  }

  .aa-step.is-active .aa-step-icon {
    color: #191919;
    animation: aa-spinner 0.9s linear infinite;
  }

  .aa-step-label {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.5;
  }

  .aa-step.is-active .aa-step-label {
    font-weight: 800;
  }

  .aa-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @keyframes aa-brain-intro {
    0% {
      opacity: 0.45;
      transform: rotate(-180deg) scale(0.88);
    }

    100% {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
  }

  @keyframes aa-brain-finish {
    0% {
      transform: rotate(0) scale(1);
    }

    100% {
      transform: rotate(360deg) scale(1);
    }
  }

  @keyframes aa-finding-enter {
    0% {
      opacity: 0;
      transform: translateY(5px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes aa-spinner {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-height: 720px) and (min-width: 481px) {
    .aa-analysis-panel {
      transform: scale(0.92);
    }
  }

  @media (max-width: 360px) {
    .aa-content {
      padding-inline: 28px;
    }

    .aa-title {
      font-size: 17px;
    }

    .aa-step-label {
      font-size: 13px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .aa-visual.is-complete .aa-brain-icon,
    .aa-brain-icon,
    .aa-live-finding,
    .aa-step.is-active .aa-step-icon {
      animation: none;
    }

    .aa-progress-value,
    .aa-step {
      transition: none;
    }
  }
`

function clampStep(step) {
  return Math.min(
    ANALYSIS_STEPS.length,
    Math.max(0, Math.floor(Number(step) || 0)),
  )
}

function resolveStepState(index, currentStep) {
  if (index < currentStep) return 'complete'
  if (index === currentStep && currentStep < ANALYSIS_STEPS.length) {
    return 'active'
  }
  return 'pending'
}

function resolveStepLabel(step, state) {
  if (state === 'complete') return step.completeLabel
  if (state === 'active') return step.activeLabel
  return step.pendingLabel
}

function StepIcon({ state }) {
  const iconName = {
    complete: 'check_circle',
    active: 'progress_activity',
    pending: 'radio_button_unchecked',
  }[state]

  return (
    <span className="msr aa-step-icon" aria-hidden="true">
      {iconName}
    </span>
  )
}

function AiAnalysis({
  currentStep,
  liveMessage,
  demoTarget = ANALYSIS_STEPS.length,
  onComplete,
}) {
  const navigate = useNavigate()
  const [demoStep, setDemoStep] = useState(0)
  const [demoFindingIndex, setDemoFindingIndex] = useState(-1)
  const hasCompletedRef = useRef(false)
  const isControlled = Number.isFinite(currentStep)
  const resolvedStep = clampStep(isControlled ? currentStep : demoStep)
  const activeStep = ANALYSIS_STEPS[Math.min(resolvedStep, ANALYSIS_STEPS.length - 1)]
  const isComplete = resolvedStep >= ANALYSIS_STEPS.length
  const analysisProgress = (resolvedStep / ANALYSIS_STEPS.length) * 100
  const resolvedLiveMessage =
    typeof liveMessage === 'string'
      ? liveMessage
      : !isControlled && demoFindingIndex >= 0
        ? DEMO_FINDINGS[demoFindingIndex]
        : ''
  useEffect(() => {
    if (isControlled) return undefined

    const targetStep = clampStep(demoTarget)
    setDemoStep(0)
    setDemoFindingIndex(-1)

    if (targetStep === 0) return undefined

    const timeoutIds = []
    const schedule = (callback, delay) => {
      timeoutIds.push(window.setTimeout(callback, delay))
    }

    if (targetStep >= 1) schedule(() => setDemoStep(1), 1100)
    if (targetStep >= 2) {
      schedule(() => setDemoStep(2), 2200)
      schedule(() => setDemoFindingIndex(0), 2900)
      schedule(() => setDemoFindingIndex(1), 3800)
    }
    if (targetStep >= 3) schedule(() => setDemoStep(3), 4700)
    if (targetStep >= 4) schedule(() => setDemoStep(4), 6000)

    return () => timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
  }, [demoTarget, isControlled])

  useEffect(() => {
    if (!isComplete) {
      hasCompletedRef.current = false
      return
    }

    if (hasCompletedRef.current) return undefined

    const completionTimerId = window.setTimeout(() => {
      if (hasCompletedRef.current) return

      hasCompletedRef.current = true

      if (onComplete) {
        onComplete()
        return
      }

      navigate(ANALYSIS_RESULT_PATH)
    }, 700)

    return () => window.clearTimeout(completionTimerId)
  }, [isComplete, navigate, onComplete])

  const liveStatus = isComplete
    ? 'AI 계약서 분석이 완료되었습니다.'
    : activeStep.activeLabel

  return (
    <>
      <style>{pageStyles}</style>

      <DeviceShell className="aa-page" deviceClassName="aa-device">
        <main
          className="aa-content"
          aria-label="AI 계약서 분석 진행"
          aria-busy={!isComplete}
        >
          <section className="aa-analysis-panel" aria-labelledby="ai-analysis-title">
            <div
              className={`aa-visual ${isComplete ? 'is-complete' : ''}`.trim()}
              aria-hidden="true"
            >
              <svg className="aa-progress-ring" viewBox="0 0 134 134">
                <circle className="aa-progress-track" cx="67" cy="67" r="63" />
                <circle
                  className="aa-progress-value"
                  cx="67"
                  cy="67"
                  r="63"
                  pathLength="100"
                  style={{ strokeDashoffset: 100 - analysisProgress }}
                />
              </svg>
              <div className="aa-visual-core">
                <span className="aa-symbol-stack">
                  <span className="msr aa-brain-icon">neurology</span>
                </span>
              </div>
            </div>

            <h1 id="ai-analysis-title" className="aa-title">
              {isComplete ? (
                <>
                  계약서 분석을
                  <br />
                  모두 마쳤어요
                </>
              ) : (
                <>
                  AI가 계약서를
                  <br />
                  꼼꼼히 살펴보고 있어요
                </>
              )}
            </h1>

            {resolvedLiveMessage ? (
              <div
                key={resolvedLiveMessage}
                className="aa-live-finding"
                role="status"
                aria-live="polite"
              >
                <span className="aa-finding-text">{resolvedLiveMessage}</span>
              </div>
            ) : null}

            <ol className="aa-steps">
              {ANALYSIS_STEPS.map((step, index) => {
                const state = resolveStepState(index, resolvedStep)

                return (
                  <li
                    key={step.pendingLabel}
                    className={`aa-step is-${state}`}
                    aria-current={state === 'active' ? 'step' : undefined}
                  >
                    <StepIcon state={state} />
                    <span className="aa-step-label">
                      {resolveStepLabel(step, state)}
                    </span>
                  </li>
                )
              })}
            </ol>

            <p className="aa-sr-only" role="status" aria-live="polite">
              {liveStatus}
            </p>
          </section>
        </main>
      </DeviceShell>
    </>
  )
}

export default AiAnalysisPage

function AiAnalysisPage({ onComplete }) {
  const navigate = useNavigate()
  const location = useLocation()
  const reviewedContract = location.state?.reviewedContract
  const [currentStep, setCurrentStep] = useState(0)
  const [liveFinding, setLiveFinding] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  const isApiDoneRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const contractText =
      reviewedContract?.contractText || '계약서 내용이 없습니다.'

    const runAnalysis = async () => {
      try {
        const result = await getSharedAnalysisPromise(contractText)

        if (cancelled) return

        setAnalysisData(result)
        isApiDoneRef.current = true

        if (result.clauses?.length > 0) {
          setLiveFinding(`${result.clauses[0].title} 항목을 발견했어요`)
        }
      } catch (err) {
        if (cancelled) return

        console.error('AI 분석 실패:', err)
        alert('계약서 분석 중 오류가 발생했습니다.')
        navigate('/screen/10')
      }
    }

    runAnalysis()

    const timer1 = setTimeout(() => !cancelled && setCurrentStep(1), 1200)
    const timer2 = setTimeout(() => !cancelled && setCurrentStep(2), 2500)
    const timer3 = setTimeout(() => !cancelled && setCurrentStep(3), 3800)

    return () => {
      cancelled = true
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [reviewedContract, navigate])

  useEffect(() => {
    if (currentStep === 3 && isApiDoneRef.current) {
      const finalTimer = setTimeout(() => {
        setCurrentStep(4)
      }, 1000)

      return () => clearTimeout(finalTimer)
    }
  }, [currentStep, analysisData])

  useEffect(() => {
    if (currentStep >= ANALYSIS_STEPS.length) {
      const navTimer = setTimeout(() => {
        if (onComplete) {
          onComplete(analysisData)
          return
        }

        navigate(ANALYSIS_RESULT_PATH, {
          state: { analysisResult: analysisData, reviewedContract },
        })
      }, 700)

      return () => clearTimeout(navTimer)
    }
  }, [currentStep, analysisData, navigate, onComplete, reviewedContract])

  return (
    <AiAnalysis
      currentStep={currentStep}
      liveMessage={liveFinding}
      onComplete={() => {}}
    />
  )
}
