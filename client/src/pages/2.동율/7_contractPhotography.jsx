import { useNavigate } from 'react-router'

const ROUTE_PATHS = {
  home: '/',
  upload: '/8_fileUpload',
  ocrProgress: '/9_ocrProgress',
}

const ICON_PATHS = {
  close:
    'M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z',
  flashOff:
    'm657-800-57 200h45q36 0 53.5 32t-3.5 62l-25 36q-11 15-29 17t-32-12q-10-10-11.5-24t6.5-26l4-5h-61q-20 0-32-15.5t-7-35.5l66-229H320q-17 0-28.5-11.5T280-840q0-17 11.5-28.5T320-880h274q32 0 51.5 25t11.5 55ZM763-84 550-296l-95 137q-6 9-15.5 12t-18.5 0q-9-3-15-10.5t-6-18.5v-224h-40q-33 0-56.5-23.5T280-480v-86L83-763q-12-12-12-28.5T83-820q12-12 28.5-12t28.5 12l680 680q12 12 12 28t-12 28q-12 12-28.5 12T763-84ZM444-644Z',
  image:
    'M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Zm80-80h400q12 0 18-11t-2-21L586-459q-6-8-16-8t-16 8L450-320l-74-99q-6-8-16-8t-16 8l-80 107q-8 10-2 21t18 11Z',
  cameraSwitch:
    'M320-280q-33 0-56.5-23.5T240-360v-240q0-33 23.5-56.5T320-680h40l28-28q6-6 13.5-9t15.5-3h126q8 0 15.5 3t13.5 9l28 28h40q33 0 56.5 23.5T720-600v240q0 33-23.5 56.5T640-280H320Zm0-80h320v-240H320v240Zm160-40q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Zm0 480Q304 0 171.5-110.5T7-389q-3-17 6.5-31T40-436q17-2 30 8.5T86-400q26 131 124.5 219T444-82l-34-34q-11-11-11-28t11-28q11-11 28-11t28 11L598-40q7 7 4.5 16T591-13q-27 7-54.5 10T480 0Zm0-960q176 0 308.5 110T953-571q3 17-6.5 31T920-524q-17 2-30-8.5T874-560q-26-131-124.5-219T516-878l34 34q11 11 11 28t-11 28q-11 11-28 11t-28-11L362-920q-7-7-4.5-16t11.5-11q27-7 54.5-10t56.5-3Z',
  signal:
    'M260-160q-25 0-42.5-17.5T200-220v-120q0-25 17.5-42.5T260-400q25 0 42.5 17.5T320-340v120q0 25-17.5 42.5T260-160Zm240 0q-25 0-42.5-17.5T440-220v-320q0-25 17.5-42.5T500-600q25 0 42.5 17.5T560-540v320q0 25-17.5 42.5T500-160Zm240 0q-25 0-42.5-17.5T680-220v-520q0-25 17.5-42.5T740-800q25 0 42.5 17.5T800-740v520q0 25-17.5 42.5T740-160Z',
  wifi:
    'M480-120q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm0-440q75 0 142.5 24T745-470q20 15 20.5 39.5T748-388q-17 17-42 17.5T661-384q-38-26-84-41t-97-15q-51 0-97 15t-84 41q-20 14-45 13t-42-18q-17-18-17-42.5t20-39.5q55-42 122.5-65.5T480-560Zm0-240q125 0 235.5 41T914-643q20 17 21 42t-17 43q-17 17-42 17.5T831-556q-72-59-161.5-91.5T480-680q-100 0-189.5 32.5T129-556q-20 16-45 15.5T42-558q-18-18-17-43t21-42q88-75 198.5-116T480-800Z',
  battery:
    'M320-80q-17 0-28.5-11.5T280-120v-640q0-17 11.5-28.5T320-800h80v-40q0-17 11.5-28.5T440-880h80q17 0 28.5 11.5T560-840v40h80q17 0 28.5 11.5T680-760v640q0 17-11.5 28.5T640-80H320Z',
}

const pageStyles = `
  .cp-page,
  .cp-page * {
    box-sizing: border-box;
  }

  .cp-page {
    display: grid;
    min-height: 100dvh;
    place-items: center;
    padding: 28px;
    background: #ededed;
  }

  .cp-device {
    position: relative;
    width: 390px;
    height: min(844px, calc(100dvh - 56px));
    overflow: hidden;
    flex-shrink: 0;
    border: 10px solid #111111;
    border-radius: 55px;
    background: #0b0b0b;
    box-shadow: 0 16px 40px rgba(20, 20, 20, 0.12),
      0 4px 12px rgba(20, 20, 20, 0.06);
  }

  .cp-screen {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
    background: #0b0b0b;
    color: #ffffff;
  }

  .cp-notch {
    position: absolute;
    z-index: 50;
    top: 10px;
    left: 50%;
    width: 120px;
    height: 28px;
    transform: translateX(-50%);
    border-radius: 20px;
    background: #111111;
  }

  .cp-statusbar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 18px 28px 4px;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    line-height: normal;
  }

  .cp-status-icons {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .cp-header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
  }

  .cp-top-action,
  .cp-control,
  .cp-shutter {
    appearance: none;
    border: 0;
    color: #ffffff;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .cp-top-action {
    display: flex;
    width: 44px;
    height: 44px;
    margin: -9px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: transparent;
  }

  .cp-title {
    color: #ffffff;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.2;
  }

  .cp-main {
    position: relative;
    display: flex;
    min-height: 0;
    flex: 1;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    container-type: size;
  }

  .cp-guide {
    position: relative;
    width: min(
      330px,
      calc(100% - 40px),
      max(40px, calc(71.739cqh - 46px))
    );
    aspect-ratio: 33 / 46;
    flex: 0 1 auto;
    border: 3px solid #d9ff3f;
    border-radius: 20px;
  }

  .cp-corner {
    position: absolute;
    width: 34px;
    height: 34px;
    border-color: #d9ff3f;
  }

  .cp-corner-tl {
    top: -3px;
    left: -3px;
    border-top: 6px solid #d9ff3f;
    border-left: 6px solid #d9ff3f;
    border-radius: 16px 0 0;
  }

  .cp-corner-tr {
    top: -3px;
    right: -3px;
    border-top: 6px solid #d9ff3f;
    border-right: 6px solid #d9ff3f;
    border-radius: 0 16px 0 0;
  }

  .cp-corner-bl {
    bottom: -3px;
    left: -3px;
    border-bottom: 6px solid #d9ff3f;
    border-left: 6px solid #d9ff3f;
    border-radius: 0 0 0 16px;
  }

  .cp-corner-br {
    right: -3px;
    bottom: -3px;
    border-right: 6px solid #d9ff3f;
    border-bottom: 6px solid #d9ff3f;
    border-radius: 0 0 16px;
  }

  .cp-hint {
    position: absolute;
    bottom: 36px;
    left: 50%;
    max-width: calc(100% - 24px);
    transform: translateX(-50%);
    overflow-wrap: anywhere;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.55);
    color: #ffffff;
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 700;
    line-height: normal;
    text-align: center;
    white-space: nowrap;
  }

  .cp-footer {
    display: grid;
    flex-shrink: 0;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 20px 20px max(44px, env(safe-area-inset-bottom));
  }

  .cp-control {
    display: flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #2a2a2a;
  }

  .cp-control:last-child {
    justify-self: end;
  }

  .cp-shutter {
    width: 78px;
    height: 78px;
    border: 5px solid #555555;
    border-radius: 50%;
    background: #ffffff;
  }

  .cp-top-action,
  .cp-control,
  .cp-shutter {
    transition: transform 120ms ease, background-color 120ms ease;
  }

  .cp-top-action:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .cp-control:hover {
    background: #363636;
  }

  .cp-shutter:hover {
    background: #f5f5f5;
  }

  .cp-top-action:active,
  .cp-control:active,
  .cp-shutter:active {
    transform: scale(0.95);
  }

  .cp-top-action:focus-visible,
  .cp-control:focus-visible,
  .cp-shutter:focus-visible {
    outline: 2px solid #d9ff3f;
    outline-offset: 3px;
  }

  @media (max-width: 480px) {
    .cp-page {
      display: block;
      padding: 0;
      background: #0b0b0b;
    }

    .cp-device {
      width: 100%;
      height: 100dvh;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .cp-notch,
    .cp-statusbar {
      display: none;
    }

    .cp-header {
      padding-top: max(10px, env(safe-area-inset-top));
    }
  }

  @media (max-width: 350px) {
    .cp-hint {
      width: calc(100% - 24px);
      white-space: normal;
    }
  }

  @media (max-height: 640px) {
    .cp-footer {
      padding-top: 12px;
      padding-bottom: max(18px, env(safe-area-inset-bottom));
    }

    .cp-hint {
      bottom: 18px;
      padding-block: 7px;
      font-size: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cp-top-action,
    .cp-control,
    .cp-shutter {
      transition: none;
    }
  }
`

function MaterialIcon({ name, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

function CameraIconButton({ label, icon, onClick }) {
  return (
    <button
      type="button"
      className="cp-control"
      aria-label={label}
      onClick={onClick}
    >
      <MaterialIcon name={icon} />
    </button>
  )
}

function DocumentGuide() {
  return (
    <div className="cp-guide" aria-hidden="true">
      <span className="cp-corner cp-corner-tl" />
      <span className="cp-corner cp-corner-tr" />
      <span className="cp-corner cp-corner-bl" />
      <span className="cp-corner cp-corner-br" />
    </div>
  )
}

function ContractPhotography({
  onClose,
  onToggleFlash,
  onOpenGallery,
  onCapture,
  onSwitchCamera,
}) {
  const navigate = useNavigate()

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }

    navigate(ROUTE_PATHS.home)
  }

  const handleOpenGallery = () => {
    if (onOpenGallery) {
      onOpenGallery()
      return
    }

    navigate(ROUTE_PATHS.upload)
  }

  const handleCapture = () => {
    if (onCapture) {
      onCapture()
      return
    }

    navigate(ROUTE_PATHS.ocrProgress)
  }

  return (
    <div className="cp-page">
      <style>{pageStyles}</style>

      <section className="cp-device" aria-label="계약서 촬영 화면">
        <div className="cp-notch" aria-hidden="true" />

        <div className="cp-screen">
          <div className="cp-statusbar" aria-hidden="true">
            <span>9:41</span>
            <div className="cp-status-icons">
              <MaterialIcon name="signal" size={16} />
              <MaterialIcon name="wifi" size={16} />
              <MaterialIcon name="battery" size={16} />
            </div>
          </div>

          <header className="cp-header">
            <button
              type="button"
              className="cp-top-action"
              aria-label="촬영 화면 닫기"
              onClick={handleClose}
            >
              <MaterialIcon name="close" size={26} />
            </button>

            <div className="cp-title" role="heading" aria-level="1">
              계약서 촬영
            </div>

            <button
              type="button"
              className="cp-top-action"
              aria-label="플래시 켜기"
              onClick={onToggleFlash}
            >
              <MaterialIcon name="flashOff" size={26} />
            </button>
          </header>

          <main className="cp-main">
            <DocumentGuide />
            <div className="cp-hint">
              계약서 전체가 잘 보이게 맞춰주세요
            </div>
          </main>

          <footer className="cp-footer">
            <CameraIconButton
              label="앨범에서 계약서 선택"
              icon="image"
              onClick={handleOpenGallery}
            />

            <button
              type="button"
              className="cp-shutter"
              aria-label="계약서 촬영"
              onClick={handleCapture}
            />

            <CameraIconButton
              label="카메라 전환"
              icon="cameraSwitch"
              onClick={onSwitchCamera}
            />
          </footer>
        </div>
      </section>
    </div>
  )
}

export default ContractPhotography
