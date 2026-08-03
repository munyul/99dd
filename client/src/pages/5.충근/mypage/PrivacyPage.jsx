// ===============================================
// 개인정보 처리방침 화면 컴포넌트
// ===============================================
import SubPageLayout from "./components/SubPageLayout.jsx";

/**
 * PrivacyPage 컴포넌트 (서비스 개인정보 처리방침 및 보호 원칙 안내 화면)
 */
export default function PrivacyPage() {
  return (
    <SubPageLayout title="개인정보 처리방침">
      <div style={{ paddingBottom: "30px" }}>
        {/* ================= 개인정보 보호 원칙 요약 배너 ================= */}
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
              security
            </span>
            <div className="f15 fw8">형광펜 개인정보 보호 원칙</div>
          </div>
          <p className="f12 tc2" style={{ lineHeight: "1.5" }}>
            본 서비스는 사용자의 소중한 개인정보와 근로계약서 원본을 안전하게
            보호하며, 관련 법령을 엄격히 준수합니다.
          </p>
        </div>

        {/* ================= 제1조: 계약서 원본 이미지 즉시 삭제 ================= */}
        <div className="card" style={{ marginBottom: "16px" }}>
          <div
            className="f15 fw8"
            style={{ marginBottom: "8px", color: "var(--ink)" }}
          >
            1. 계약서 원본 이미지 즉시 삭제
          </div>
          <p className="f13 tc2" style={{ lineHeight: "1.6" }}>
            사용자가 업로드하거나 촬영한 근로계약서 원본 이미지는 AI 분석이
            완료되는 즉시 서버에서 영구 파기됩니다. 원본 파일은 어떠한 경우에도
            장기 저장되거나 마케팅 목적으로 활용되지 않습니다.
          </p>
        </div>

        {/* ================= 제2조: 최소한의 데이터 일시 처리 ================= */}
        <div className="card" style={{ marginBottom: "16px" }}>
          <div
            className="f15 fw8"
            style={{ marginBottom: "8px", color: "var(--ink)" }}
          >
            2. 최소한의 데이터 일시 처리
          </div>
          <p className="f13 tc2" style={{ lineHeight: "1.6" }}>
            서비스 제공에 필수적인 최소한의 데이터(위험 조항 분석 결과, 계약
            형태 등)만 일시적으로 처리하며, 목적 달성 즉시 안전한 방식으로
            파기합니다. 불필요한 개인정보는 일체 수집하지 않습니다.
          </p>
        </div>

        {/* ================= 제3조: 개인정보 수집·이용 동의 명시 ================= */}
        <div className="card" style={{ marginBottom: "16px" }}>
          <div
            className="f15 fw8"
            style={{ marginBottom: "8px", color: "var(--ink)" }}
          >
            3. 개인정보 수집·이용 동의 명시
          </div>
          <p className="f13 tc2" style={{ lineHeight: "1.6" }}>
            회사는 회원 가입 및 서비스 이용 과정에서 이용자의 명확한 동의를
            기반으로 필수적인 개인정보(계정 식별 정보 등)를 수집 및 이용하며,
            동의 없이는 개인정보를 수집하지 않습니다.
          </p>
        </div>

        {/* ================= 제4조: 관련 법령 준수 (전자상거래법 및 통신비밀보호법) ================= */}
        <div className="card" style={{ marginBottom: "16px" }}>
          <div
            className="f15 fw8"
            style={{ marginBottom: "8px", color: "var(--ink)" }}
          >
            4. 관련 법령 준수 (전자상거래법 및 통신비밀보호법)
          </div>
          {/* 전자상거래법 준수 사항 */}
          <p
            className="f13 tc2"
            style={{ lineHeight: "1.6", marginBottom: "12px" }}
          >
            - <strong>전자상거래법 준수:</strong> 계약 또는 청약철회 등에 관한
            기록 및 소비자 불만·분쟁 처리에 관한 기록은 전자상거래 등에서의
            소비자보호에 관한 법률에 따라 안전하게 보관되며, 정해진 기간이
            지나면 지체 없이 파기합니다.
          </p>
          {/* 통신비밀보호법 준수 사항 */}
          <p className="f13 tc2" style={{ lineHeight: "1.6" }}>
            - <strong>통신비밀보호법 준수:</strong> 서비스 이용 과정에서
            생성되는 접속 로그 및 접속지 추적 자료 등은 통신비밀보호법에
            의거하여 적법하게 관리되며, 법정 보존 기간 경과 후 안전하게
            파기됩니다.
          </p>
        </div>

        {/* ================= 공고 및 시행 일자 표시 영역 ================= */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span className="f11 tc">
            공고 일자: 2026년 8월 3일 / 시행 일자: 2026년 8월 3일
          </span>
        </div>
      </div>
    </SubPageLayout>
  );
}
