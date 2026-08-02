import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";

// [공통 컴포넌트 1] 통계 숫자 표시
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

// [공통 컴포넌트 2] 리스트 메뉴 아이템
const MenuItem = ({ icon, title, onClick, isLast = false }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 0",
      cursor: "pointer",
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

// [메인 컴포넌트] 마이페이지 (19번 화면)
const MyPage = ({ userData }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 백엔드 연결 전 기본값 설정
  const user = userData || {
    name: "지민",
    email: "jimin_park@email.com",
    stats: { total: 4, danger: 3, consult: 1 },
  };

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

  const handleConfirmLogout = () => {
    alert("로그아웃 되었습니다.");
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* 1. 프로필 영역 */}
      <div className="row gap12" style={{ padding: "16px 0 24px" }}>
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

      {/* 2. 통계 카드 */}
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

      {/* 3. 설정 메뉴 */}
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

      {/* 4. 지원 메뉴 */}
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

      {/* 5. 로그아웃 버튼 */}
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

      {/* 6. 로그아웃 모달 */}
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
