// ===============================================
// 토글 스위치 컴포넌트
// ===============================================

/**
 * ToggleSwitch 컴포넌트 (켜기/끄기 상태를 전환하는 커스텀 스위치)
 * @param {Object} props - 컴포넌트 속성
 * @param {boolean} props.isOn - 토글 스위치의 활성화(켜짐) 여부
 * @param {Function} props.onToggle - 토글 스위치 클릭 시 상태를 변경하는 콜백 함수
 * @param {boolean} [props.disabled=false] - 비활성화 여부 (true일 경우 클릭 불가 및 투명도 적용)
 */
export default function ToggleSwitch({ isOn, onToggle, disabled }) {
  return (
    <div
      // 비활성화 상태가 아닐 때만 onToggle 함수를 실행하여 상태 변경
      onClick={() => !disabled && onToggle()}
      style={{
        width: "46px",
        height: "26px",
        // 켜진 상태(isOn)일 때와 꺼진 상태일 때 배경색 동적 변경
        backgroundColor: isOn ? "var(--safe)" : "var(--line)",
        borderRadius: "13px",
        position: "relative",
        // 비활성화 여부에 따른 마우스 커서 모양 및 투명도 조절
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background-color 0.2s ease-in-out",
        flexShrink: 0,
      }}
    >
      {/* 스위치 내부에서 좌우로 움직이는 원형 핸들 */}
      <div
        style={{
          width: "22px",
          height: "22px",
          backgroundColor: "var(--white)",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          // 켜진 상태에 따라 원의 위치를 좌우로 이동
          left: isOn ? "22px" : "2px",
          transition: "left 0.2s ease-in-out",
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}
