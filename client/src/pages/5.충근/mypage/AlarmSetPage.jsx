// ===============================================
// 알림 설정 화면 컴포넌트
// ===============================================
import { useState } from "react";
import SubPageLayout from "./components/SubPageLayout.jsx";
import AlarmSetItem from "./components/AlarmSetItem.jsx";

/**
 * AlarmSetPage 컴포넌트 (앱 푸시 알림 설정 및 권한 관리 화면)
 */
export default function AlarmSetPage() {
  // 알림 설정 상태 객체 (전체 알림 및 개별 항목들의 On/Off 상태)
  const [settings, setSettings] = useState({
    isAllEnabled: true, // 전체 알림 수신 여부 (마스터 토글)
    analysisComplete: true, // 계약서 분석 완료 알림 (필수)
    riskDetected: true, // 위험 조항 발견 즉시 알림 (필수)
    consultationAnswer: true, // 전문가 상담 답변 알림 (필수)
    laborLawUpdates: true, // 노동법 개정 및 정보 알림 (선택)
    marketingEvent: false, // 마케팅 혜택 및 이벤트 알림 (선택)
    nightTimeAd: false, // 야간 알림 수신 동의 (선택)
  });

  /**
   * 전체 알림 마스터 토글 핸들러
   * 전체 알림을 끄거나 켤 때 하위 알림들의 상태를 일괄 제어합니다.
   */
  const handleMasterToggle = () => {
    const newValue = !settings.isAllEnabled;
    setSettings((prev) => ({
      isAllEnabled: newValue,
      // 전체 알림이 켜질 때 필수/정보 알림은 기본적으로 켜거나 이전 상태 복구, 꺼질 때는 마케팅 관련 옵션 초기화 등 조절
      analysisComplete: newValue ? true : prev.analysisComplete,
      riskDetected: newValue ? true : prev.riskDetected,
      consultationAnswer: newValue ? true : prev.consultationAnswer,
      laborLawUpdates: newValue ? true : prev.laborLawUpdates,
      marketingEvent: newValue ? prev.marketingEvent : false,
      nightTimeAd: newValue ? prev.nightTimeAd : false,
    }));
  };

  /**
   * 개별 알림 토글 핸들러
   * @param {string} key - 변경할 설정 항목의 키 이름
   */
  const handleToggle = (key) => {
    // 전체 알림이 꺼져있는 경우 개별 토글 조작 차단
    if (!settings.isAllEnabled) {
      alert("전체 알림 수신이 꺼져있습니다. 먼저 전체 알림을 켜주세요.");
      return;
    }

    const newValue = !settings[key];

    // 마케팅 혜택 알림을 끄는 경우, 연관된 야간 알림도 함께 자동으로 끔
    if (key === "marketingEvent" && !newValue) {
      setSettings((prev) => ({
        ...prev,
        [key]: newValue,
        nightTimeAd: false,
      }));
    }
    // 마케팅 알림이 꺼진 상태에서 야간 알림을 켜려고 할 때 경고 메시지 출력
    else if (key === "nightTimeAd" && newValue && !settings.marketingEvent) {
      alert(
        "야간 알림 수신을 위해서는 마케팅 혜택 알림에 먼저 동의해야 합니다.",
      );
    }
    // 일반적인 개별 토글 상태 변경
    else {
      setSettings((prev) => ({ ...prev, [key]: newValue }));
    }
  };

  return (
    <SubPageLayout title="알림 설정">
      <div style={{ paddingBottom: "20px" }}>
        {/* ================= 전체 알림 수신 섹션 ================= */}
        <div style={{ marginBottom: "28px" }}>
          <div className="card" style={{ padding: "0 20px" }}>
            <AlarmSetItem
              title="전체 알림 수신"
              description="앱에서 보내는 모든 푸시 알림을 켜거나 끕니다."
              isOn={settings.isAllEnabled}
              onToggle={handleMasterToggle}
              isLast={true}
            />
          </div>
        </div>

        {/* ================= 서비스 알림 (필수) 섹션 ================= */}
        <div style={{ marginBottom: "28px" }}>
          <div
            className="f13 fw7 tc2"
            style={{ marginBottom: "10px", marginLeft: "4px" }}
          >
            서비스 알림 (필수)
          </div>
          <div className="card" style={{ padding: "0 20px" }}>
            <AlarmSetItem
              title="계약서 분석 완료 알림"
              description="등록하신 근로계약서의 AI 분석이 완료되면 알려드려요."
              isOn={settings.analysisComplete}
              onToggle={() => handleToggle("analysisComplete")}
              disabled={!settings.isAllEnabled}
            />
            <AlarmSetItem
              title="위험 조항 발견 즉시 알림"
              description="치명적인 독소조항이 발견될 경우 즉시 알려드려요."
              isOn={settings.riskDetected}
              onToggle={() => handleToggle("riskDetected")}
              disabled={!settings.isAllEnabled}
            />
            <AlarmSetItem
              title="전문가 상담 답변 알림"
              description="요청하신 노무 상담에 답변이 등록되면 알려드려요."
              isOn={settings.consultationAnswer}
              onToggle={() => handleToggle("consultationAnswer")}
              disabled={!settings.isAllEnabled}
              isLast={true}
            />
          </div>
        </div>

        {/* ================= 정보 및 혜택 알림 (선택) 섹션 ================= */}
        <div style={{ marginBottom: "28px" }}>
          <div
            className="f13 fw7 tc2"
            style={{ marginBottom: "10px", marginLeft: "4px" }}
          >
            정보 및 혜택 알림 (선택)
          </div>
          <div className="card" style={{ padding: "0 20px" }}>
            <AlarmSetItem
              title="노동법 개정 및 정보 알림"
              description="최저임금 변경 등 근로자에게 유용한 정보를 보내드려요."
              isOn={settings.laborLawUpdates}
              onToggle={() => handleToggle("laborLawUpdates")}
              disabled={!settings.isAllEnabled}
            />
            <AlarmSetItem
              title="마케팅 혜택 및 이벤트 알림"
              description="프로모션, 할인 혜택 등의 정보를 보내드려요."
              isOn={settings.marketingEvent}
              onToggle={() => handleToggle("marketingEvent")}
              disabled={!settings.isAllEnabled}
            />
            <AlarmSetItem
              title="야간 알림 수신 동의"
              description="오후 9시 ~ 오전 8시 사이에도 혜택 알림을 받습니다."
              isOn={settings.nightTimeAd}
              onToggle={() => handleToggle("nightTimeAd")}
              // 전체 알림이 꺼져있거나 마케팅 알림이 꺼져있으면 비활성화
              disabled={!settings.isAllEnabled || !settings.marketingEvent}
              isLast={true}
            />
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
