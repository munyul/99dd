// ===============================================
// 알림 설정 아이템 컴포넌트
// ===============================================
import ToggleSwitch from "./ToggleSwitch.jsx";

/**
 * AlarmSetItem 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.title - 설정 항목의 제목
 * @param {string} props.description - 설정 항목에 대한 상세 설명
 * @param {boolean} props.isOn - 토글 스위치의 활성화(켜짐) 여부
 * @param {Function} props.onToggle - 토글 스위치 클릭 시 실행되는 콜백 함수
 * @param {boolean} [props.disabled=false] - 비활성화 여부 (기본값: false)
 * @param {boolean} [props.isLast=false] - 마지막 항목 여부 (하단 구분선 제거용, 기본값: false)
 */
export default function AlarmSetItem({
  title,
  description,
  isOn,
  onToggle,
  disabled = false,
  isLast = false,
}) {
  return (
    <div
      className="row between"
      style={{
        padding: "16px 0",
        // 마지막 항목일 경우 하단 구분선(borderBottom)을 제거하여 깔끔한 UI 유지
        borderBottom: isLast ? "none" : "1px solid var(--line)",
      }}
    >
      {/* 텍스트 영역 (제목 및 설명) */}
      <div style={{ paddingRight: "16px", flex: 1 }}>
        <div
          className="f15 fw7"
          style={{
            // 비활성화 상태일 경우 흐린 색상(var(--ink-3))을 적용하여 시각적으로 구분
            color: disabled ? "var(--ink-3)" : "var(--ink)",
            marginBottom: "4px",
          }}
        >
          {title}
        </div>
        <div className="f12 tc" style={{ lineHeight: "1.4" }}>
          {description}
        </div>
      </div>

      {/* 상태 변경을 위한 토글 스위치 컴포넌트 */}
      <ToggleSwitch isOn={isOn} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}
