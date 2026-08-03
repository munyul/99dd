// ===============================================
// 자주 묻는 질문 화면 컴포넌트
// ===============================================
import { useState } from "react";
import SubPageLayout from "./components/SubPageLayout.jsx";

// 자주 묻는 질문(FAQ) 데이터 목록
const FAQ_DATA = [
  {
    q: "Q1. ‘형광펜’은 어떤 서비스인가요?",
    a: "계약서 사진을 한 장 올리면, AI가 불리한 조항(독소조항)을 노란색 하이라이트로 칠해 한눈에 알아보도록 도와주는 서비스입니다. 복잡한 법률 용어를 알기 쉽게 설명해 주고, 상대방에게 보낼 수 있는 대응 문장까지 함께 제공합니다.",
  },
  {
    q: "Q2. 법률 자문이나 공식적인 법적 효력이 있는 서비스인가요?",
    a: "아닙니다. ‘형광펜’은 전문적인 법률 자문이나 공식 법률 판단이 아니라, 계약서 읽기를 돕는 참고용 정보 및 가이드 서비스입니다. 판단의 주체는 사용자 본인이며, 정보의 비대칭을 좁혀 스스로 확인하고 질문할 수 있도록 돕는 도구입니다.",
  },
  {
    q: "Q3. 사용하기 위해 회원가입이 필수인가요?",
    a: "아니요, 회원가입 절차 없이 앱 실행 후 바로 진입하여 이용하실 수 있습니다.",
  },
  {
    q: "Q4. 계약서 사진을 올리면 개인정보는 안전하게 보호되나요?",
    a: "분석이 완료된 후 원본 이미지는 즉시 삭제됩니다. 서비스 제공에 필요한 최소한의 데이터만 일시 처리하며, 개인정보 처리방침에 따라 이름, 주소, 민감정보 보호를 철저히 준수합니다.",
  },
  {
    q: "Q5. AI가 계약서를 잘못 읽거나 오판할 수도 있나요?",
    a: "분석 전 ‘이렇게 읽었습니다, 맞나요?’를 거치는 OCR 검증 단계를 거치며, 결과 화면에 피드백/신고 버튼이 상시 노출됩니다. 모든 조항을 단정하지 않고 위험도를 초록·노랑·빨강 3단계로 구분하여 신중하게 안내합니다.",
  },
  {
    q: "Q6. 서비스 이용 요금은 무료인가요?",
    a: "MVP 단계에서는 전면 무료로 제공되며, 첫 경험을 완주할 수 있도록 지원합니다. 향후에는 긴 계약서 분석, 전문가 연결, 문서 변환 등 일부 기능에 대해 유료 모델이나 수익 구조가 도입될 예정입니다.",
  },
];

/**
 * FaqPage 컴포넌트 (자주 묻는 질문 아코디언 목록 화면)
 */
export default function FaqPage() {
  // 현재 펼쳐져 있는 FAQ 항목의 인덱스 상태 관리 (열린 항목이 없으면 null)
  const [openIndex, setOpenIndex] = useState(null);

  /**
   * FAQ 항목 클릭 시 열림/닫힘 상태를 전환하는 핸들러
   * @param {number} index - 클릭한 FAQ 항목의 인덱스
   */
  const handleToggle = (index) => {
    // 이미 열려있는 항목을 다시 클릭하면 닫고(null), 다른 항목이면 해당 인덱스로 설정
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SubPageLayout title="자주 묻는 질문">
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
              help_outline
            </span>
            <div className="f15 fw8">궁금하신 점을 빠르게 해결해 드려요</div>
          </div>
          <p className="f12 tc2" style={{ lineHeight: "1.5" }}>
            서비스 이용과 관련된 주요 질문과 답변을 모아두었습니다. 추가 문의는
            '문의하기'를 이용해 주세요.
          </p>
        </div>

        {/* ================= FAQ 아코디언 목록 섹션 ================= */}
        <div className="card" style={{ padding: "0 20px" }}>
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index; // 현재 항목이 열려있는지 여부
            const isLast = index === FAQ_DATA.length - 1; // 마지막 항목 여부 (하단 구분선 제거용)

            return (
              <div
                key={index}
                style={{
                  borderBottom: isLast ? "none" : "1px solid var(--line)",
                  padding: "18px 0",
                  cursor: "pointer",
                }}
                onClick={() => handleToggle(index)}
              >
                {/* 질문 제목 및 화살표 아이콘 행 */}
                <div className="row between">
                  <div
                    className="f15 fw7"
                    style={{
                      color: "var(--ink)",
                      paddingRight: "12px",
                      flex: 1,
                      lineHeight: "1.4",
                    }}
                  >
                    {item.q}
                  </div>
                  {/* 상태에 따라 회전하는 확장/축소 화살표 아이콘 */}
                  <span
                    className="msr"
                    style={{
                      fontSize: "20px",
                      color: "var(--ink-3)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease-in-out",
                      flexShrink: 0,
                    }}
                  >
                    expand_more
                  </span>
                </div>

                {/* 질문이 열렸을 때만 렌더링되는 상세 답변 영역 */}
                {isOpen && (
                  <div
                    className="f13 tc2"
                    style={{
                      marginTop: "12px",
                      lineHeight: "1.6",
                      background: "var(--bg)",
                      padding: "14px",
                      borderRadius: "8px",
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SubPageLayout>
  );
}
