// ===============================================
// 마이페이지 메인 컴포넌트 (19번 화면)
// ===============================================
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";

/**
 * StatItem 컴포넌트 (마이페이지 상단 통계 건수 및 레이블 표시용)
 * @param {Object} props - 컴포넌트 속성
 * @param {number} [props.count=0] - 통계 수치 값
 * @param {string} props.label - 통계 항목 설명 레이블
 * @param {boolean} [props.isDanger=false] - 위험 수치 여부 (true일 경우 경고 색상 적용)
 */
const StatItem = ({ count = 0, label, isDanger = false }) => (
  <div style={{ flex: 1, textAlign: "center" }}>
    <div
      className="f18 fw8"
      style={{ color: isDanger ? "var(--danger)" : "var(--ink)" }}
    >
      {count}
    </div>
    <div className="f11 tc" style={{ marginTop: "6px" }}>
      {label}
    </div>
  </div>
);

/**
 * MenuItem 컴포넌트 (설정 및 지원 메뉴 목록의 개별 행 항목)
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.icon - 구글 Material Symbol 아이콘 이름
 * @param {string} props.title - 메뉴 항목 제목
 * @param {Function} props.onClick - 메뉴 클릭 시 실행될 이동 콜백 함수
 * @param {boolean} [props.isLast=false] - 마지막 메뉴 항목 여부 (하단 구분선 제거용)
 */
const MenuItem = ({ icon, title, onClick, isLast = false }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 0",
      cursor: "pointer",
      // 마지막 항목일 경우 하단 구분선 제거
      borderBottom: isLast ? "none" : "1px solid var(--line)",
    }}
  >
    <div className="row gap12">
      <span className="msr" style={{ color: "var(--ink)" }}>
        {icon}
      </span>
      <span className="f15 fw7" style={{ color: "var(--ink)" }}>
        {title}
      </span>
    </div>
    <span className="msr" style={{ color: "var(--ink-3)", fontSize: "20px" }}>
      chevron_right
    </span>
  </div>
);

/**
 * MyPage 컴포넌트 (마이페이지 메인 화면 및 사용자 대시보드)
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} [props.userData] - 사용자 프로필 및 통계 데이터 객체
 */
const MyPage = ({ userData }) => {
  const navigate = useNavigate();
  // 로그아웃 확인 모달의 열림/닫힘 상태 관리
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 전달받은 사용자 데이터가 없는 경우 기본 목업(Mock) 데이터 사용
  const user = userData || {
    name: "지민",
    email: "jimin_park@email.com",
    stats: { total: 4, danger: 3, consult: 1 },
  };

  // 설정 관련 메뉴 항목 데이터 배열 (useMemo를 통한 최적화)
  const settingsMenu = useMemo(
    () => [
      {
        id: "work-info",
        path: "/screen/19/work-info",
        icon: "badge",
        title: "내 근무 정보 관리",
      },
      {
        id: "alarm-set",
        path: "/screen/19/alarm-set",
        icon: "notifications",
        title: "알림 설정",
      },
      {
        id: "privacy",
        path: "/screen/19/privacy",
        icon: "lock",
        title: "개인정보 처리방침",
      },
    ],
    [],
  );

  // 지원 및 고객센터 관련 메뉴 항목 데이터 배열
  const supportMenu = useMemo(
    () => [
      {
        id: "faq",
        path: "/screen/19/faq",
        icon: "help",
        title: "자주 묻는 질문",
      },
      {
        id: "contact",
        path: "/screen/19/contact",
        icon: "mail",
        title: "문의하기",
      },
    ],
    [],
  );

  /**
   * 로그아웃 최종 확인 핸들러
   */
  const handleConfirmLogout = () => {
    alert("로그아웃 되었습니다.");
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* ================= 1. 프로필 영역 ================= */}
      <div className="row gap12" style={{ padding: "8px 0 24px" }}>
        <div
          className="avatar"
          style={{
            width: "56px",
            height: "56px",
            background: "var(--yellow-soft)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="msr" style={{ fontSize: "26px" }}>
            person
          </span>
        </div>
        <div>
          <div className="f18 fw8">{user.name} 님</div>
          <div className="f12 tc" style={{ marginTop: "6px" }}>
            {user.email}
          </div>
        </div>
      </div>

      {/* ================= 2. 통계 요약 카드 영역 ================= */}
      <div
        className="card row"
        style={{ padding: "20px 16px", marginBottom: "32px" }}
      >
        <StatItem count={user.stats?.total} label="분석 건수" />
        <div
          style={{ width: "1px", height: "32px", background: "var(--line)" }}
        ></div>
        <StatItem
          count={user.stats?.danger}
          label="발견된 위험조항"
          isDanger={true}
        />
        <div
          style={{ width: "1px", height: "32px", background: "var(--line)" }}
        ></div>
        <StatItem count={user.stats?.consult} label="상담 이력" />
      </div>

      {/* ================= 3. 설정 메뉴 섹션 ================= */}
      <div style={{ marginBottom: "28px" }}>
        <div
          className="f13 fw7 tc2"
          style={{ marginBottom: "10px", marginLeft: "4px" }}
        >
          설정
        </div>
        <div className="card" style={{ padding: "0 20px" }}>
          {settingsMenu.map((menu, index) => (
            <MenuItem
              key={menu.id}
              icon={menu.icon}
              title={menu.title}
              onClick={() => navigate(menu.path)}
              isLast={index === settingsMenu.length - 1}
            />
          ))}
        </div>
      </div>

      {/* ================= 4. 지원 메뉴 섹션 ================= */}
      <div style={{ marginBottom: "40px" }}>
        <div
          className="f13 fw7 tc2"
          style={{ marginBottom: "10px", marginLeft: "4px" }}
        >
          지원
        </div>
        <div className="card" style={{ padding: "0 20px" }}>
          {supportMenu.map((menu, index) => (
            <MenuItem
              key={menu.id}
              icon={menu.icon}
              title={menu.title}
              onClick={() => navigate(menu.path)}
              isLast={index === supportMenu.length - 1}
            />
          ))}
        </div>
      </div>

      {/* ================= 5. 로그아웃 버튼 영역 ================= */}
      <div style={{ textAlign: "center", paddingBottom: "40px" }}>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          style={{
            background: "none",
            border: "none",
            color: "var(--danger)",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          로그아웃
        </button>
      </div>

      {/* ================= 6. 로그아웃 확인 모달 ================= */}
      {isLogoutModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="card"
            style={{
              width: "80%",
              maxWidth: "320px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <span
              className="msr"
              style={{
                color: "var(--caution)",
                fontSize: "36px",
                marginBottom: "12px",
              }}
            >
              warning
            </span>
            <div className="f16 fw8" style={{ marginBottom: "8px" }}>
              로그아웃 하시겠습니까?
            </div>
            <div className="f13 tc" style={{ marginBottom: "24px" }}>
              서비스를 이용하려면 다시 로그인해야 해요.
            </div>
            <div className="row gap12">
              <button
                className="btn btn-outline"
                onClick={() => setIsLogoutModalOpen(false)}
                style={{ flex: 1 }}
              >
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmLogout}
                style={{ flex: 1 }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyPage;
