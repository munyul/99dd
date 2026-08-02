import { useState } from 'react'
import { useNavigate } from 'react-router'
import DeviceShell from '../../components/layout/DeviceShell.jsx'
import Header from '../../components/layout/Header.jsx'

const ROUTE_PATHS = {
  ocrProgress: '/screen/9',
  aiAnalysis: '/screen/11',
}

const DEFAULT_REVIEW_VALUES = {
  companyName: '(주)모카커피',
  startDate: '2026년 08월 01일',
  hourlyWage: '9,860원',
  contractText:
    '제3조(근로시간) 근로자의 근무시간은 09:00~18:00로 한다. 회사의 필요에 따라 근로자는 추가 수당 없이 연장 근무를 할 수 있다.\n제4조(임금) 시급 9,860원을 지급하며 주휴수당은 별도 지급하지 않는다.',
}

const pageStyles = `
  .or-page,
  .or-page * {
    box-sizing: border-box;
  }

  .or-page {
    min-height: 100dvh;
  }

  .or-page .or-device {
    background: #ffffff;
  }

  .or-form-shell {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
  }

  .or-content {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    padding: 2px 20px 16px;
    scrollbar-width: none;
  }

  .or-content::-webkit-scrollbar {
    display: none;
  }

  .or-guidance {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 20px;
    border-radius: 20px;
    background: #f7f7f5;
  }

  .or-guidance-icon {
    display: grid;
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
    place-items: center;
    margin-top: 1px;
    color: #626267;
  }

  .or-guidance-copy {
    color: #626267;
    font-size: 12px;
    line-height: 1.65;
    word-break: keep-all;
  }

  .or-fields {
    display: flex;
    flex-direction: column;
    gap: 22px;
    margin-top: 22px;
  }

  .or-field {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .or-label {
    color: #8a8a8e;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.02em;
    line-height: 1.45;
  }

  .or-input,
  .or-textarea {
    width: 100%;
    border: 1.5px solid #e4e4e6;
    border-radius: 14px;
    outline: none;
    background: #ffffff;
    color: #191919;
    caret-color: #9bbe18;
    transition: border-color 160ms ease, box-shadow 160ms ease,
      background 160ms ease;
  }

  .or-input {
    height: 54px;
    padding: 0 16px;
    font-size: 15px;
    line-height: 1;
  }

  .or-textarea {
    min-height: 180px;
    padding: 15px 16px;
    resize: none;
    font-size: 14px;
    line-height: 1.7;
  }

  .or-input:hover,
  .or-textarea:hover {
    border-color: #d2d3d0;
  }

  .or-input:focus,
  .or-textarea:focus {
    border-color: #bddd35;
    background: #fefff9;
    box-shadow: 0 0 0 3px rgba(217, 255, 63, 0.2);
  }

  .or-footer {
    flex-shrink: 0;
    padding: 16px 20px 40px;
    background: #ffffff;
  }

  .or-analyze-button {
    display: flex;
    width: 100%;
    min-height: 54px;
    align-items: center;
    justify-content: center;
    padding: 14px 20px;
    border: 0;
    border-radius: 18px;
    background: #d9ff3f;
    color: #191919;
    cursor: pointer;
    font-size: 16px;
    font-weight: 800;
    transition: filter 160ms ease, transform 160ms ease;
    -webkit-tap-highlight-color: transparent;
  }

  .or-analyze-button:hover:not(:disabled),
  .or-analyze-button:focus-visible:not(:disabled) {
    filter: brightness(0.96);
    outline: none;
  }

  .or-analyze-button:active:not(:disabled) {
    transform: scale(0.995);
  }

  .or-analyze-button:disabled {
    background: #eceee5;
    color: #a2a49c;
    cursor: not-allowed;
  }

  @media (max-height: 760px) and (min-width: 481px) {
    .or-guidance {
      min-height: 68px;
      padding-block: 13px;
    }

    .or-fields {
      gap: 13px;
      margin-top: 14px;
    }

    .or-input {
      height: 48px;
    }

    .or-textarea {
      min-height: 132px;
    }

    .or-footer {
      padding-bottom: 18px;
    }
  }

  @media (max-width: 480px) {
    .or-content {
      padding-top: 8px;
    }

    .or-footer {
      padding-bottom: max(24px, env(safe-area-inset-bottom));
    }
  }

  @media (max-width: 360px) {
    .or-content,
    .or-footer {
      padding-inline: 16px;
    }

    .or-guidance {
      padding-inline: 16px;
    }

    .or-guidance-copy {
      font-size: 11.5px;
    }

    .or-textarea {
      min-height: 150px;
    }
  }
`

function InfoIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 10.5v5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.9"
      />
      <circle cx="12" cy="7.7" r="1.05" fill="currentColor" />
    </svg>
  )
}

function createInitialValues(initialValues) {
  return Object.fromEntries(
    Object.entries(DEFAULT_REVIEW_VALUES).map(([key, fallbackValue]) => [
      key,
      initialValues?.[key] == null ? fallbackValue : String(initialValues[key]),
    ]),
  )
}

function OcrReview({ initialValues, onBack, onAnalyze }) {
  const navigate = useNavigate()
  const [reviewValues, setReviewValues] = useState(() =>
    createInitialValues(initialValues),
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setReviewValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    navigate(ROUTE_PATHS.ocrProgress)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const reviewedContract = Object.fromEntries(
      Object.entries(reviewValues).map(([key, value]) => [key, value.trim()]),
    )

    if (onAnalyze) {
      onAnalyze(reviewedContract)
      return
    }

    navigate(ROUTE_PATHS.aiAnalysis, {
      state: { reviewedContract },
    })
  }

  const isFormComplete = Object.values(reviewValues).every(
    (value) => value.trim().length > 0,
  )

  return (
    <>
      <style>{pageStyles}</style>

      <DeviceShell className="or-page" deviceClassName="or-device">
        <Header
          title="인식된 내용 확인"
          leftIcon="arrow_back"
          onLeftClick={handleBack}
        />

        <form className="or-form-shell" onSubmit={handleSubmit}>
          <main
            className="or-content"
            aria-label="OCR 인식 내용 검토"
            aria-describedby="ocr-review-guidance"
          >
            <aside id="ocr-review-guidance" className="or-guidance">
              <span className="or-guidance-icon">
                <InfoIcon />
              </span>
              <p className="or-guidance-copy">
                틀리게 인식된 부분이 있다면 직접 고쳐주세요. 정확할수록 분석이
                정확해져요.
              </p>
            </aside>

            <div className="or-fields">
              <label className="or-field" htmlFor="ocr-company-name">
                <span className="or-label">회사명</span>
                <input
                  id="ocr-company-name"
                  className="or-input"
                  name="companyName"
                  type="text"
                  value={reviewValues.companyName}
                  autoComplete="organization"
                  onChange={handleChange}
                />
              </label>

              <label className="or-field" htmlFor="ocr-start-date">
                <span className="or-label">근무 시작일</span>
                <input
                  id="ocr-start-date"
                  className="or-input"
                  name="startDate"
                  type="text"
                  value={reviewValues.startDate}
                  autoComplete="off"
                  onChange={handleChange}
                />
              </label>

              <label className="or-field" htmlFor="ocr-hourly-wage">
                <span className="or-label">시급</span>
                <input
                  id="ocr-hourly-wage"
                  className="or-input"
                  name="hourlyWage"
                  type="text"
                  inputMode="decimal"
                  value={reviewValues.hourlyWage}
                  autoComplete="off"
                  onChange={handleChange}
                />
              </label>

              <label className="or-field" htmlFor="ocr-contract-text">
                <span className="or-label">계약서 전문</span>
                <textarea
                  id="ocr-contract-text"
                  className="or-textarea"
                  name="contractText"
                  value={reviewValues.contractText}
                  spellCheck="false"
                  onChange={handleChange}
                />
              </label>
            </div>
          </main>

          <footer className="or-footer">
            <button
              type="submit"
              className="or-analyze-button"
              disabled={!isFormComplete}
            >
              이대로 분석하기
            </button>
          </footer>
        </form>
      </DeviceShell>
    </>
  )
}

export default OcrReview
