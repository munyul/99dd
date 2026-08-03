// ===============================================
// 문의하기 화면 컴포넌트
// ===============================================
import { useState } from "react";
import SubPageLayout from "./components/SubPageLayout.jsx";

// 문의 유형 카테고리 목록
const CATEGORIES = ["분석 오류", "기능 제안", "이용 문의", "기타"];

/**
 * ContactSuccessView 컴포넌트 (문의 접수 완료 안내 화면)
 * @param {Object} props - 컴포넌트 속성
 * @param {Function} props.onReset - 추가 문의하기 클릭 시 초기 폼 화면으로 돌아가는 콜백 함수
 */
function ContactSuccessView({ onReset }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      {/* 성공 아이콘 래퍼 */}
      <div
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: "var(--yellow-soft)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px auto",
        }}
      >
        <span
          className="msr"
          style={{ fontSize: "36px", color: "var(--yellow)" }}
        >
          check_circle
        </span>
      </div>
      {/* 성공 안내 제목 */}
      <h3
        className="f18 fw8"
        style={{ marginBottom: "8px", color: "var(--ink)" }}
      >
        문의가 성공적으로 접수되었습니다
      </h3>
      {/* 안내 설명 텍스트 */}
      <p
        className="f13 tc2"
        style={{ lineHeight: "1.5", marginBottom: "32px" }}
      >
        보내주신 소중한 의견과 문의 사항은 담당자 확인 후
        <br />
        입력해주신 이메일로 빠르게 답변해 드리겠습니다.
      </p>
      {/* 추가 문의하기 버튼 */}
      <button
        onClick={onReset}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: "var(--yellow)",
          color: "var(--ink)",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        추가 문의하기
      </button>
    </div>
  );
}

/**
 * ContactPage 컴포넌트 (고객센터 문의 입력 및 접수 화면)
 */
export default function ContactPage() {
  // 문의 작성 폼 상태 관리
  const [category, setCategory] = useState("분석 오류"); // 선택된 문의 유형
  const [email, setEmail] = useState(""); // 답변 받을 이메일
  const [content, setContent] = useState(""); // 문의 내용
  const [agreed, setAgreed] = useState(false); // 개인정보 수집 동의 여부
  const [submitted, setSubmitted] = useState(false); // 문의 접수 완료 여부

  /**
   * 문의 제출 핸들러 (유효성 검사 포함)
   * @param {React.FormEvent} e - 폼 제출 이벤트
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // 이메일 입력 여부 검증
    if (!email.trim()) {
      alert("답변받으실 이메일 주소를 입력해주세요.");
      return;
    }
    // 문의 내용 입력 여부 검증
    if (!content.trim()) {
      alert("문의 내용을 입력해주세요.");
      return;
    }
    // 개인정보 동의 여부 검증
    if (!agreed) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    // 모든 검증 통과 시 접수 완료 상태로 전환
    setSubmitted(true);
  };

  /**
   * 폼 초기화 및 추가 문의 화면으로 전환하는 핸들러
   */
  const handleReset = () => {
    setSubmitted(false);
    setEmail("");
    setContent("");
    setAgreed(false);
  };

  // 제출 완료 상태인 경우 완료 뷰 컴포넌트 렌더링
  if (submitted) {
    return (
      <SubPageLayout title="문의하기">
        <ContactSuccessView onReset={handleReset} />
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout title="문의하기">
      <div style={{ paddingBottom: "30px" }}>
        {/* ================= 안내 배너 섹션 ================= */}
        <div
          className="card"
          style={{
            background: "var(--yellow-soft)",
            border: "1px solid var(--yellow)",
            marginBottom: "20px",
            padding: "16px",
          }}
        >
          <div className="row gap8" style={{ marginBottom: "6px" }}>
            <span
              className="msr"
              style={{ fontSize: "20px", color: "var(--ink)" }}
            >
              support_agent
            </span>
            <div className="f15 fw8">궁금한 점이나 불편한 점이 있으신가요?</div>
          </div>
          <p className="f12 tc2" style={{ lineHeight: "1.5" }}>
            근로계약서 분석 오류나 개선 제안 등 남겨주시면 성심껏 답변해
            드리겠습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ================= 문의 유형 선택 섹션 ================= */}
          <div
            className="card"
            style={{ marginBottom: "16px", padding: "20px" }}
          >
            <div
              className="f14 fw7"
              style={{ marginBottom: "12px", color: "var(--ink)" }}
            >
              문의 유형
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "20px",
                    // 선택된 카테고리에 따라 스타일 동적 적용
                    border:
                      category === cat
                        ? "1px solid var(--ink)"
                        : "1px solid var(--line)",
                    backgroundColor:
                      category === cat ? "var(--ink)" : "var(--white)",
                    color: category === cat ? "var(--white)" : "var(--ink-2)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ================= 이메일 입력 섹션 ================= */}
          <div
            className="card"
            style={{ marginBottom: "16px", padding: "20px" }}
          >
            <div
              className="f14 fw7"
              style={{ marginBottom: "8px", color: "var(--ink)" }}
            >
              답변 받을 이메일
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                backgroundColor: "var(--bg)",
                fontSize: "14px",
                color: "var(--ink)",
                outline: "none",
              }}
            />
          </div>

          {/* ================= 문의 내용 입력 섹션 ================= */}
          <div
            className="card"
            style={{ marginBottom: "16px", padding: "20px" }}
          >
            <div
              className="f14 fw7"
              style={{ marginBottom: "8px", color: "var(--ink)" }}
            >
              문의 내용
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="불편하신 사항이나 제안 내용을 자세히 적어주세요."
              rows={5}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                backgroundColor: "var(--bg)",
                fontSize: "14px",
                color: "var(--ink)",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* ================= 개인정보 수집 동의 체크박스 섹션 ================= */}
          <div
            className="card"
            style={{ marginBottom: "24px", padding: "16px 20px" }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "var(--yellow)",
                }}
              />
              <span className="f13 tc2" style={{ lineHeight: "1.4" }}>
                [필수] 문의 처리를 위한 개인정보 수집 및 이용에 동의합니다.
              </span>
            </label>
          </div>

          {/* ================= 제출 버튼 ================= */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "var(--yellow)",
              color: "var(--ink)",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(255, 214, 0, 0.3)",
            }}
          >
            문의하기 제출
          </button>
        </form>
      </div>
    </SubPageLayout>
  );
}
