import { Route, Routes } from "react-router";
import Master from "./pages/Master/Master.jsx";
import ContractPhotography from "./pages/2.동율/7_contractPhotography.jsx";

import ProfessionalFeedback from "./pages/4.시준/16_professionalFeedback.jsx";
import AnalysisHistory from "./pages/4.시준/17_analysisHistory.jsx";
import Alert from "./pages/4.시준/18_alert.jsx";

import FileUpload from "./pages/2.동율/8_fileUpload.jsx";
import OcrProgress from "./pages/2.동율/9_ocrProgress.jsx";
import OcrReview from "./pages/2.동율/10_ocrReview.jsx";
import AiAnalysis from "./pages/2.동율/11_aiAnalysis.jsx";
import AnalysisResult from "./pages/2.동율/12_result.jsx";

import MyPage from "./pages/5.충근/19_mypage.jsx";
import {
  WorkInfoPage,
  AlarmSetPage,
  PrivacyPage,
  FaqPage,
  ContactPage,
  AccountSettingsPage,
} from "./pages/5.충근/mypage/index.js";

function App() {
  return (
    <Routes>
      {/* 해결책 1: Master 컴포넌트를 레이아웃으로 감싸는 중첩 라우팅 구조 */}
      <Route element={<Master />}>
        <Route path="/" element={null} />
        <Route path="/screen/7" element={<ContractPhotography />} />
        <Route path="/screen/8" element={<FileUpload />} />
        <Route path="/screen/9" element={<OcrProgress />} />
        <Route path="/screen/10" element={<OcrReview />} />
        <Route path="/screen/11" element={<AiAnalysis />} />
        <Route path="/screen/12" element={<AnalysisResult />} />
        <Route path="/screen/16" element={<ProfessionalFeedback />} />
        <Route path="/screen/17" element={<AnalysisHistory />} />
        <Route path="/screen/18" element={<Alert />} />
        <Route path="/screen/19" element={<MyPage />} />
        <Route path="/screen/19/work-info" element={<WorkInfoPage />} />
        <Route path="/screen/19/alarm-set" element={<AlarmSetPage />} />
        <Route path="/screen/19/privacy" element={<PrivacyPage />} />
        <Route path="/screen/19/faq" element={<FaqPage />} />
        <Route path="/screen/19/contact" element={<ContactPage />} />
        <Route path="/screen/19/account-settings" element={<AccountSettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;