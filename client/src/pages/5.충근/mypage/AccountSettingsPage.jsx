// ===============================================
// 계정 설정 화면 컴포넌트
// ===============================================
import { useState } from "react";
import SubPageLayout from "./components/SubPageLayout.jsx";
import EmailAutocompleteInput from "../../../components/common/EmailAutocompleteInput.jsx";

// 입력 필드(input)에 공통으로 적용될 기본 스타일 객체
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid var(--line)",
  backgroundColor: "var(--bg)",
  fontSize: "14px",
  color: "var(--ink)",
  outline: "none",
};

/**
 * AccountSettingsPage 컴포넌트 (사용자 계정 정보 및 보안 설정 화면)
 */
export default function AccountSettingsPage() {
  // 기본 정보 상태 관리
  const [name, setName] = useState("지민");
  const [email, setEmail] = useState("jimin_park@email.com");

  // 비밀번호 변경 관련 상태 관리
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * 기본 정보 저장 핸들러
   * @param {React.FormEvent} e - 폼 제출 이벤트
   */
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // 이름 입력 여부 검증
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    // 이메일 입력 여부 검증
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    alert("회원 정보가 성공적으로 수정되었습니다.");
  };

  /**
   * 비밀번호 변경 핸들러
   * @param {React.FormEvent} e - 폼 제출 이벤트
   */
  const handleChangePassword = (e) => {
    e.preventDefault();
    // 현재 비밀번호 입력 여부 검증
    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    // 새 비밀번호 입력 여부 검증
    if (!newPassword) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }
    // 새 비밀번호와 확인용 비밀번호 일치 여부 검증
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    alert("비밀번호가 성공적으로 변경되었습니다.");
    // 변경 완료 후 비밀번호 입력 필드 초기화
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <SubPageLayout title="마이페이지 설정">
      <div style={{ paddingBottom: "40px" }}>
        {/* ================= 기본 정보 관리 섹션 ================= */}
        <div style={{ marginBottom: "28px" }}>
          <div
            className="f13 fw7 tc2"
            style={{ marginBottom: "10px", marginLeft: "4px" }}
          >
            기본 정보 관리
          </div>
          <div className="card" style={{ padding: "20px" }}>
            <form onSubmit={handleSaveProfile}>
              {/* 이름 입력 필드 */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  className="f14 fw7"
                  style={{ marginBottom: "8px", color: "var(--ink)" }}
                >
                  이름
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* 이메일 입력 필드 */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  className="f14 fw7"
                  style={{ marginBottom: "8px", color: "var(--ink)" }}
                >
                  이메일 (아이디)
                </div>
                <EmailAutocompleteInput
                  value={email}
                  onChange={setEmail}
                  style={inputStyle}
                />
              </div>

              {/* 기본 정보 저장 버튼 */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "var(--yellow)",
                  color: "var(--ink)",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                기본 정보 저장
              </button>
            </form>
          </div>
        </div>

        {/* ================= 비밀번호 변경 섹션 ================= */}
        <div style={{ marginBottom: "28px" }}>
          <div
            className="f13 fw7 tc2"
            style={{ marginBottom: "10px", marginLeft: "4px" }}
          >
            비밀번호 변경
          </div>
          <div className="card" style={{ padding: "20px" }}>
            <form onSubmit={handleChangePassword}>
              {/* 현재 비밀번호 입력 */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  className="f14 fw7"
                  style={{ marginBottom: "8px", color: "var(--ink)" }}
                >
                  현재 비밀번호
                </div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  style={inputStyle}
                />
              </div>

              {/* 새 비밀번호 입력 */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  className="f14 fw7"
                  style={{ marginBottom: "8px", color: "var(--ink)" }}
                >
                  새 비밀번호
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  style={inputStyle}
                />
              </div>

              {/* 새 비밀번호 확인 입력 */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  className="f14 fw7"
                  style={{ marginBottom: "8px", color: "var(--ink)" }}
                >
                  새 비밀번호 확인
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 한번 더 입력하세요"
                  style={inputStyle}
                />
              </div>

              {/* 비밀번호 변경 버튼 */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "var(--ink)",
                  color: "var(--white)",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                비밀번호 변경
              </button>
            </form>
          </div>
        </div>

        {/* ================= 회원 탈퇴 섹션 ================= */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => alert("회원 탈퇴 기능은 준비 중입니다.")}
            style={{
              background: "none",
              border: "none",
              color: "var(--ink-3)",
              fontSize: "13px",
              cursor: "pointer",
              textDecoration: "underline",
              fontFamily: "inherit",
            }}
          >
            형광펜 회원 탈퇴하기
          </button>
        </div>
      </div>
    </SubPageLayout>
  );
}
