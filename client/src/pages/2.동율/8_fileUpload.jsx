import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import DeviceShell from '../../components/layout/DeviceShell.jsx'
import Header from '../../components/layout/Header.jsx'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png']
const ROUTE_PATHS = {
  home: '/',
  ocrProgress: '/screen/9',
}

const pageStyles = `
  .fu-page,
  .fu-page * {
    box-sizing: border-box;
  }

  .fu-page {
    min-height: 100dvh;
  }

  .fu-page .fu-device {
    background: #ffffff;
  }

  .fu-content {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    padding: 0 20px 20px;
    scrollbar-width: none;
  }

  .fu-content::-webkit-scrollbar {
    display: none;
  }

  .fu-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .fu-upload-zone {
    display: flex;
    width: 100%;
    min-height: 244px;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 34px 20px;
    border: 2px dashed #e4e4e6;
    border-radius: 20px;
    background: #fafaf9;
    color: #191919;
    cursor: pointer;
    text-align: center;
    transition: border-color 160ms ease, background 160ms ease,
      transform 160ms ease;
    -webkit-tap-highlight-color: transparent;
  }

  .fu-upload-zone:hover,
  .fu-upload-zone:focus-visible,
  .fu-upload-zone.is-dragging {
    border-color: #bfe81f;
    background: #fbfff0;
    outline: none;
  }

  .fu-upload-zone:active {
    transform: scale(0.995);
  }

  .fu-upload-icon-box {
    display: grid;
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    place-items: center;
    border-radius: 18px;
    background: rgba(217, 255, 63, 0.35);
  }

  .fu-upload-title {
    margin-top: 16px;
    color: #191919;
    font-size: 15px;
    font-weight: 800;
    line-height: 1.45;
  }

  .fu-upload-description {
    margin-top: 8px;
    color: #8a8a8e;
    font-size: 12px;
    line-height: 1.5;
  }

  .fu-select-button {
    display: inline-flex;
    min-height: 42px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    padding: 10px 16px;
    border-radius: 14px;
    background: #191919;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
  }

  .fu-error {
    margin-top: 10px;
    color: #ff3b30;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.5;
    text-align: center;
  }

  .fu-file-section {
    margin-top: 24px;
  }

  .fu-section-label {
    margin-bottom: 12px;
    color: #8a8a8e;
    font-size: 12px;
    font-weight: 800;
  }

  .fu-file-card,
  .fu-empty-file {
    width: 100%;
    border: 1px solid #efefef;
    border-radius: 20px;
    background: #ffffff;
  }

  .fu-file-card {
    display: flex;
    min-height: 70px;
    align-items: center;
    gap: 10px;
    padding: 14px;
    box-shadow: 0 8px 24px rgba(20, 20, 20, 0.06),
      0 2px 6px rgba(20, 20, 20, 0.04);
  }

  .fu-file-icon-box {
    display: grid;
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    place-items: center;
    border-radius: 13px;
    background: #ffeceb;
    color: #ff3b30;
  }

  .fu-file-icon-box.is-image {
    background: #eef9ff;
    color: #2388c7;
  }

  .fu-file-info {
    min-width: 0;
    flex: 1;
  }

  .fu-file-name {
    overflow: hidden;
    color: #191919;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .fu-file-size {
    margin-top: 6px;
    color: #8a8a8e;
    font-size: 12px;
    line-height: 1.4;
  }

  .fu-remove-file {
    display: grid;
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: #8a8a8e;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .fu-remove-file:hover,
  .fu-remove-file:focus-visible {
    background: #f5f5f4;
    color: #191919;
    outline: none;
  }

  .fu-empty-file {
    display: grid;
    min-height: 70px;
    place-items: center;
    border-style: dashed;
    color: #8a8a8e;
    font-size: 12px;
    font-weight: 700;
  }

  .fu-footer {
    flex-shrink: 0;
    padding: 16px 20px 40px;
    background: #ffffff;
  }

  .fu-analyze-button {
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

  .fu-analyze-button:hover:not(:disabled),
  .fu-analyze-button:focus-visible:not(:disabled) {
    filter: brightness(0.96);
    outline: none;
  }

  .fu-analyze-button:active:not(:disabled) {
    transform: scale(0.995);
  }

  .fu-analyze-button:disabled {
    background: #eceee5;
    color: #a2a49c;
    cursor: not-allowed;
  }

  @media (max-height: 760px) and (min-width: 481px) {
    .fu-upload-zone {
      min-height: 210px;
      padding-block: 24px;
    }

    .fu-file-section {
      margin-top: 18px;
    }

    .fu-footer {
      padding-bottom: 24px;
    }
  }

  @media (max-width: 480px) {
    .fu-content {
      padding-top: 8px;
      padding-bottom: 16px;
    }

    .fu-upload-zone {
      min-height: 238px;
    }

    .fu-footer {
      padding-bottom: max(24px, env(safe-area-inset-bottom));
    }
  }

  @media (max-width: 360px) {
    .fu-upload-zone {
      min-height: 224px;
      padding-inline: 14px;
    }

    .fu-upload-title {
      font-size: 14px;
    }
  }
`

function UploadFileIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M8.5 3.75h10.25l4.75 4.75v18.75a1.5 1.5 0 0 1-1.5 1.5H8.5A1.5 1.5 0 0 1 7 27.25v-22a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <path
        d="M18.75 3.75V8.5h4.75M15.25 23V13.25m0 0-4 4m4-4 4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}

function PdfIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 2.75h7l4 4v14.5h-11a1.5 1.5 0 0 1-1.5-1.5V4.25a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M13.5 2.75v4h4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="2.75" y="10" width="15.5" height="7" rx="1.5" fill="currentColor" />
      <text
        x="10.5"
        y="15.15"
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
        fontSize="4.7"
        fontWeight="700"
        textAnchor="middle"
      >
        PDF
      </text>
    </svg>
  )
}

function ImageFileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8.2" cy="9" r="1.5" fill="currentColor" />
      <path
        d="m5.5 17 4.2-4.2 2.8 2.7 2.4-2.2 3.6 3.7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m6 6 12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  )
}

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

function isSupportedFile(file) {
  return ACCEPTED_EXTENSIONS.includes(getFileExtension(file.name))
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(bytes / 1024, 0.1).toFixed(1)}KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function FileUpload({ onClose, onFileSelect, onStartAnalysis }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const dragDepthRef = useRef(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const selectFile = (file) => {
    if (!file) return

    if (!isSupportedFile(file)) {
      setErrorMessage('PDF, JPG, PNG 파일만 선택할 수 있어요.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('파일은 최대 20MB까지 선택할 수 있어요.')
      return
    }

    setSelectedFile(file)
    setErrorMessage('')
    onFileSelect?.(file)
  }

  const handleInputChange = (event) => {
    selectFile(event.target.files?.[0])
  }

  const handleDragEnter = (event) => {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDragging(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setErrorMessage('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    onFileSelect?.(null)
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }

    navigate(ROUTE_PATHS.home)
  }

  const handleStartAnalysis = () => {
    if (!selectedFile) return

    if (onStartAnalysis) {
      onStartAnalysis(selectedFile)
      return
    }

    navigate(ROUTE_PATHS.ocrProgress)
  }

  const isPdf = getFileExtension(selectedFile?.name ?? '') === 'pdf'

  return (
    <>
      <style>{pageStyles}</style>

      <DeviceShell
        className="fu-page"
        deviceClassName="fu-device"
        ariaLabel="파일 업로드 화면"
      >
        <Header title="파일 업로드" leftIcon="close" onLeftClick={handleClose} />

        <main className="fu-content">
          <input
            ref={fileInputRef}
            className="fu-file-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            tabIndex={-1}
            aria-hidden="true"
            onChange={handleInputChange}
          />

          <button
            type="button"
            className={`fu-upload-zone ${isDragging ? 'is-dragging' : ''}`.trim()}
            aria-describedby={errorMessage ? 'file-upload-error' : undefined}
            onClick={openFilePicker}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="fu-upload-icon-box">
              <UploadFileIcon />
            </span>
            <span className="fu-upload-title">여기를 눌러 파일을 선택하세요</span>
            <span className="fu-upload-description">PDF, JPG, PNG · 최대 20MB</span>
            <span className="fu-select-button">파일 선택하기</span>
          </button>

          {errorMessage ? (
            <p id="file-upload-error" className="fu-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <section className="fu-file-section" aria-labelledby="selected-file-title">
            <h2 id="selected-file-title" className="fu-section-label">
              선택된 파일
            </h2>

            {selectedFile ? (
              <article className="fu-file-card">
                <span className={`fu-file-icon-box ${isPdf ? '' : 'is-image'}`.trim()}>
                  {isPdf ? <PdfIcon /> : <ImageFileIcon />}
                </span>

                <div className="fu-file-info">
                  <div className="fu-file-name" title={selectedFile.name}>
                    {selectedFile.name}
                  </div>
                  <div className="fu-file-size">{formatFileSize(selectedFile.size)}</div>
                </div>

                <button
                  type="button"
                  className="fu-remove-file"
                  aria-label={`${selectedFile.name} 선택 취소`}
                  onClick={handleRemoveFile}
                >
                  <CloseIcon />
                </button>
              </article>
            ) : (
              <div className="fu-empty-file">선택된 파일이 없습니다.</div>
            )}
          </section>
        </main>

        <footer className="fu-footer">
          <button
            type="button"
            className="fu-analyze-button"
            disabled={!selectedFile}
            onClick={handleStartAnalysis}
          >
            분석 시작하기
          </button>
        </footer>
      </DeviceShell>
    </>
  )
}

export default FileUpload
