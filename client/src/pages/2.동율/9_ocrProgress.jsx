import { useEffect, useRef, useState } from 'react'
import StatusBar from '../../components/layout/StatusBar.jsx'

const DOCUMENT_LINES = [
  { width: 48, height: 9 },
  { width: 84, height: 7, topGap: 8 },
  { width: 93, height: 7 },
  { width: 68, height: 7 },
  { width: 86, height: 7, topGap: 7 },
  { width: 73, height: 7 },
  { width: 90, height: 7 },
  { width: 57, height: 7 },
  { width: 81, height: 7, topGap: 7 },
  { width: 94, height: 7 },
  { width: 64, height: 7 },
  { width: 85, height: 7, topGap: 7 },
  { width: 71, height: 7 },
  { width: 43, height: 7 },
]

const OCR_STAGES = {
  preparing: {
    label: '이미지 준비',
    title: '계약서를 준비하고 있어요',
    description: (
      <>
        선명한 글자 인식을 위해
        <br />
        이미지를 정돈하고 있어요
      </>
    ),
  },
  recognizing: {
    label: '텍스트 인식',
    title: '글자를 읽고 있어요',
    description: (
      <>
        계약서 이미지를 텍스트로
        <br />
        변환하는 중이에요
      </>
    ),
  },
  organizing: {
    label: '결과 정리',
    title: '인식한 문장을 정리하고 있어요',
    description: (
      <>
        문장과 조항의 순서를
        <br />
        확인하는 중이에요
      </>
    ),
  },
  complete: {
    label: '변환 완료',
    title: '텍스트 변환을 마쳤어요',
    description: (
      <>
        인식된 계약서를 검토할
        <br />
        준비가 완료됐어요
      </>
    ),
  },
}

const pageStyles = `
  .op-page,
  .op-page * {
    box-sizing: border-box;
  }

  .op-page {
    min-height: 100dvh;
  }

  .op-page .op-device {
    background: #ffffff;
  }

  .op-content {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 34px 30px 74px;
    overflow: hidden;
    text-align: center;
  }

  .op-document {
    position: relative;
    width: min(230px, 74vw);
    aspect-ratio: 23 / 30;
    flex-shrink: 0;
    overflow: hidden;
    border: 1px solid rgba(25, 25, 25, 0.035);
    border-radius: 18px;
    background:
      radial-gradient(circle at 78% 12%, rgba(255, 255, 255, 0.9), transparent 32%),
      linear-gradient(155deg, #fafaf9 0%, #f4f5f1 100%);
    box-shadow: 0 22px 50px rgba(20, 20, 20, 0.1),
      0 5px 14px rgba(20, 20, 20, 0.045);
  }

  .op-document::after {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
    content: '';
    pointer-events: none;
  }

  .op-document-lines {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0;
    padding: 26px 22px 25px;
  }

  .op-document-line {
    flex-shrink: 0;
    border-radius: 100px;
  }

  .op-document-lines.is-pending {
    opacity: 0.11;
    filter: blur(0.35px);
  }

  .op-document-lines.is-pending .op-document-line {
    background: #aeb4a8;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
  }

  .op-recognition-layer {
    position: absolute;
    z-index: 2;
    inset: 0;
    overflow: hidden;
    clip-path: inset(0 0 100% 0);
    animation: op-recognition-reveal 4s linear infinite;
    will-change: clip-path, opacity;
  }

  .op-document-lines.is-recognized {
    z-index: 1;
  }

  .op-document-lines.is-recognized .op-document-line {
    background: linear-gradient(90deg, #bfc4b8 0%, #cdd1c7 100%);
    box-shadow: 0 1px 1px rgba(25, 25, 25, 0.025);
  }

  .op-scan-beam {
    position: absolute;
    z-index: 3;
    top: -2px;
    right: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(217, 255, 63, 0.25),
      #d9ff3f 12%,
      #d9ff3f 88%,
      rgba(217, 255, 63, 0.25)
    );
    box-shadow: 0 0 10px 2px rgba(217, 255, 63, 0.52);
    animation: op-scan-beam 4s linear infinite;
    pointer-events: none;
    will-change: top, opacity;
  }

  .op-scan-beam::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 42px;
    background: linear-gradient(
      to top,
      rgba(217, 255, 63, 0.22) 0%,
      rgba(217, 255, 63, 0.08) 46%,
      transparent 100%
    );
    content: '';
    pointer-events: none;
  }

  .op-scan-beam::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 84%;
    height: 1px;
    background: rgba(255, 255, 255, 0.92);
    filter: blur(0.4px);
    transform: translate(-50%, -50%);
    content: '';
    pointer-events: none;
  }

  .op-status-copy {
    margin-top: 30px;
  }

  .op-stage-badge {
    display: inline-flex;
    min-height: 28px;
    align-items: center;
    gap: 7px;
    padding: 6px 11px;
    border: 1px solid #ecefe4;
    border-radius: 100px;
    background: #f8faf3;
    color: #686c62;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
  }

  .op-stage-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #c9f42b;
    box-shadow: 0 0 0 4px rgba(217, 255, 63, 0.2);
    animation: op-stage-pulse 1.8s ease-in-out infinite;
  }

  .op-title {
    margin-top: 12px;
    color: #191919;
    font-size: 19px;
    font-weight: 800;
    line-height: 1.45;
    letter-spacing: -0.025em;
  }

  .op-description {
    margin-top: 7px;
    color: #8a8a8e;
    font-size: 13px;
    line-height: 1.55;
  }

  .op-progress-wrap {
    width: 100%;
    margin-top: 27px;
  }

  .op-progress-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 9px;
  }

  .op-progress-label {
    color: #8a8a8e;
    font-size: 11px;
    font-weight: 700;
  }

  .op-progress-value {
    color: #4b4b4f;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    font-weight: 800;
    line-height: 1;
  }

  .op-progress-track {
    width: 100%;
    height: 9px;
    overflow: hidden;
    border-radius: 100px;
    background: #eceee9;
    box-shadow: inset 0 1px 2px rgba(25, 25, 25, 0.04);
  }

  .op-progress-fill {
    position: relative;
    height: 100%;
    overflow: hidden;
    border-radius: inherit;
    background: linear-gradient(90deg, #c9f42b 0%, #d9ff3f 100%);
    box-shadow: 0 0 8px rgba(217, 255, 63, 0.28);
    transition: width 360ms cubic-bezier(0.2, 0.7, 0.25, 1);
  }

  .op-progress-fill::after {
    position: absolute;
    inset: 0;
    width: 45%;
    transform: translateX(-140%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.65),
      transparent
    );
    animation: op-progress-shimmer 2s ease-in-out infinite;
    content: '';
  }

  .op-progress-fill.is-complete::after {
    display: none;
  }

  @keyframes op-recognition-reveal {
    0% {
      clip-path: inset(0 0 100% 0);
      opacity: 0;
    }

    5% {
      clip-path: inset(0 0 100% 0);
      opacity: 1;
    }

    72% {
      clip-path: inset(0 0 14% 0);
      opacity: 1;
    }

    88%,
    96% {
      clip-path: inset(0 0 0 0);
      opacity: 1;
    }

    100% {
      clip-path: inset(0 0 0 0);
      opacity: 0;
    }
  }

  @keyframes op-scan-beam {
    0% {
      top: -2px;
      opacity: 0;
    }

    5% {
      top: 0;
      opacity: 1;
    }

    72% {
      top: 86%;
      opacity: 1;
    }

    88%,
    96% {
      top: calc(100% - 4px);
      opacity: 1;
    }

    100% {
      top: calc(100% - 4px);
      opacity: 0;
    }
  }

  @keyframes op-stage-pulse {
    0%,
    100% {
      opacity: 0.65;
      transform: scale(0.92);
    }

    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes op-progress-shimmer {
    0%,
    24% {
      transform: translateX(-140%);
    }

    70%,
    100% {
      transform: translateX(320%);
    }
  }

  @media (max-height: 760px) and (min-width: 481px) {
    .op-content {
      padding-block: 22px 42px;
    }

    .op-document {
      width: 196px;
    }

    .op-document-lines {
      padding: 22px 18px;
    }

    .op-status-copy {
      margin-top: 22px;
    }

    .op-progress-wrap {
      margin-top: 18px;
    }
  }

  @media (max-width: 480px) {
    .op-content {
      padding: 24px 30px max(42px, env(safe-area-inset-bottom));
    }
  }

  @media (max-width: 360px) {
    .op-document {
      width: 204px;
    }

    .op-title {
      font-size: 17px;
    }

    .op-description {
      font-size: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .op-recognition-layer {
      clip-path: inset(0 0 36% 0);
      opacity: 1;
      animation: none;
    }

    .op-scan-beam {
      top: 64%;
      opacity: 1;
      animation: none;
    }

    .op-stage-dot,
    .op-progress-fill::after {
      animation: none;
    }

    .op-progress-fill {
      transition: none;
    }
  }
`

function clampProgress(value) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function resolveStage(progress, stageName) {
  if (stageName && OCR_STAGES[stageName]) {
    return OCR_STAGES[stageName]
  }

  if (progress >= 100) return OCR_STAGES.complete
  if (progress >= 86) return OCR_STAGES.organizing
  if (progress >= 12) return OCR_STAGES.recognizing
  return OCR_STAGES.preparing
}

function DocumentLines({ recognized = false }) {
  return (
    <div
      className={`op-document-lines ${recognized ? 'is-recognized' : 'is-pending'}`}
    >
      {DOCUMENT_LINES.map((line, index) => (
        <span
          key={`${line.width}-${index}`}
          className="op-document-line"
          style={{
            width: `${line.width}%`,
            height: `${line.height}px`,
            marginTop: line.topGap ? `${line.topGap}px` : undefined,
          }}
        />
      ))}
    </div>
  )
}

function OcrProgress({
  progress,
  stage,
  demoTarget = 64,
  onComplete,
}) {
  const [demoProgress, setDemoProgress] = useState(0)
  const hasCompletedRef = useRef(false)
  const isControlled = Number.isFinite(progress)
  const currentProgress = clampProgress(isControlled ? progress : demoProgress)
  const currentStage = resolveStage(currentProgress, stage)

  useEffect(() => {
    if (isControlled) return undefined

    const target = clampProgress(demoTarget)
    const duration = 4800
    let animationFrameId
    let startTime

    const updateProgress = (time) => {
      startTime ??= time

      const elapsedRatio = Math.min((time - startTime) / duration, 1)
      const easedRatio = 1 - (1 - elapsedRatio) ** 3
      setDemoProgress(Math.round(target * easedRatio))

      if (elapsedRatio < 1) {
        animationFrameId = window.requestAnimationFrame(updateProgress)
      }
    }

    animationFrameId = window.requestAnimationFrame(updateProgress)

    return () => window.cancelAnimationFrame(animationFrameId)
  }, [demoTarget, isControlled])

  useEffect(() => {
    if (currentProgress < 100 || hasCompletedRef.current) return

    hasCompletedRef.current = true
    onComplete?.()
  }, [currentProgress, onComplete])

  return (
    <div className="master-stage op-page">
      <style>{pageStyles}</style>

      <section className="device op-device" aria-label="OCR 진행 화면">
        <div className="notch" aria-hidden="true" />

        <div className="app-shell">
          <StatusBar />

          <main className="op-content">
            <div className="op-document" aria-hidden="true">
              <DocumentLines />
              <div className="op-recognition-layer">
                <DocumentLines recognized />
              </div>
              <div className="op-scan-beam" />
            </div>

            <div className="op-status-copy" role="status" aria-live="polite">
              <div className="op-stage-badge">
                <span className="op-stage-dot" />
                <span>{currentStage.label}</span>
              </div>
              <h1 className="op-title">{currentStage.title}</h1>
              <p className="op-description">{currentStage.description}</p>
            </div>

            <div
              className="op-progress-wrap"
              role="progressbar"
              aria-label="계약서 OCR 진행률"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={currentProgress}
              aria-valuetext={`${currentStage.label}, ${currentProgress}%`}
            >
              <div className="op-progress-meta">
                <span className="op-progress-label">전체 진행률</span>
                <span className="op-progress-value">{currentProgress}%</span>
              </div>
              <div className="op-progress-track">
                <div
                  className={`op-progress-fill ${
                    currentProgress >= 100 ? 'is-complete' : ''
                  }`.trim()}
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  )
}

export default OcrProgress
