import React from "react";
import { useNavigate } from "react-router";

/**
 * 마이페이지 서브 상세 화면 공통 레이아웃
 */
const SubPageLayout = ({ title, icon, children }) => {
  const navigate = useNavigate();

  // 해결책 3: 히스토리가 없을 경우 예외 처리하며 안전하게 마이페이지로 이동
  const handleBack = () => {
    if (window.history.length > 1 && document.referrer) {
      navigate(-1);
    } else {
      navigate("/screen/19");
    }
  };

  return (
    <div style={{ padding: "10px 0" }}>
      {/* 상단 서브 헤더 (뒤로가기 버튼 + 타이틀) */}
      <div
        className="row gap12"
        style={{
          marginBottom: "20px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            className="msr"
            style={{ fontSize: "20px", color: "var(--ink)" }}
          >
            arrow_back_ios_new
          </span>
        </button>
        <span className="f18 fw8">{title}</span>
      </div>

      {/* 서브 페이지 내용 */}
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <span
          className="msr"
          style={{ fontSize: "48px", color: "var(--ink-3)" }}
        >
          {icon}
        </span>
        <h3 style={{ marginTop: "16px", fontSize: "18px" }}>{title} 화면</h3>
        <p className="tc f13" style={{ marginTop: "8px" }}>
          현재 상세 기능 개발 중입니다.
        </p>
        {children}
      </div>
    </div>
  );
};

export const WorkInfoPage = () => (
  <SubPageLayout title="내 근무 정보 관리" icon="badge" />
);
export const AlarmSetPage = () => (
  <SubPageLayout title="알림 설정" icon="notifications" />
);
export const PrivacyPage = () => (
  <SubPageLayout title="개인정보 처리방침" icon="lock" />
);
export const FaqPage = () => (
  <SubPageLayout title="자주 묻는 질문" icon="help" />
);
export const ContactPage = () => <SubPageLayout title="문의하기" icon="mail" />;
