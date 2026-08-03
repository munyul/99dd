// ===============================================
// 커밍순 레이아웃 컴포넌트
// ===============================================
import SubPageLayout from "./SubPageLayout.jsx";

/**
 * ComingSoonLayout 컴포넌트 (개발 중인 페이지 안내 화면)
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.title - 화면의 제목 (서브 페이지 타이틀 및 안내 텍스트에 사용)
 * @param {string|React.ReactNode} props.icon - 화면 중앙에 표시될 아이콘 (텍스트 또는 아이콘 컴포넌트)
 */
export default function ComingSoonLayout({ title, icon }) {
  return (
    <SubPageLayout title={title}>
      {/* 화면 중앙 정렬 및 여백 설정을 위한 컨테이너 */}
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        {/* 아이콘 표시 영역 */}
        <span
          className="msr"
          style={{ fontSize: "56px", color: "var(--ink-3)" }}
        >
          {icon}
        </span>

        {/* 동적 제목 표시 영역 */}
        <h3 className="f18 fw8" style={{ marginTop: "16px" }}>
          {title} 화면
        </h3>

        {/* 개발 중 안내 문구 */}
        <p className="f13 tc" style={{ marginTop: "8px" }}>
          현재 상세 기능 개발 중입니다.
        </p>
      </div>
    </SubPageLayout>
  );
}
