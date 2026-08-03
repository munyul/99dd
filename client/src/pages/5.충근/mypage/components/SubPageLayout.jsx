// ===============================================
// 서브 페이지 레이아웃 컴포넌트
// ===============================================
import { useNavigate } from "react-router";

/**
 * SubPageLayout 컴포넌트 (서브 페이지 공통 레이아웃 및 상단 네비게이션)
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.title - 상단 네비게이션 바에 표시될 페이지 제목
 * @param {React.ReactNode} props.children - 레이아웃 내부에 렌더링될 자식 컴포넌트들
 */
export default function SubPageLayout({ title, children }) {
  // 페이지 이동을 위한 리액트 Router 훅
  const navigate = useNavigate();

  // 뒤로 가기 버튼 클릭 시 특정 화면(스크린 ID: 19)으로 이동
  const handleBack = () => {
    navigate("/screen/19");
  };

  return (
    <div className="app-shell">
      {/* 상단 네비게이션 바 영역 */}
      <div className="topnav">
        {/* 뒤로 가기 버튼 */}
        <div className="back" onClick={handleBack}>
          <span className="msr">arrow_back_ios_new</span>
        </div>
        {/* 페이지 타이틀 */}
        <div className="title">{title}</div>
        {/* 타이틀을 중앙에 정렬하기 위한 빈 플레이스홀더 영역 */}
        <div className="placeholder"></div>
      </div>

      {/* 실제 컨텐츠가 렌더링되는 슬롯 영역 */}
      <div className="content-slot" style={{ paddingTop: "10px" }}>
        {children}
      </div>
    </div>
  );
}
