import { Route, Routes } from 'react-router'
import Master from './pages/Master/Master.jsx'
import ContractPhotography from './pages/2.동율/7_contractPhotography.jsx'

import ProfessionalFeedback from './pages/4.시준/16_professionalFeedback.jsx'
import AnalysisHistory from './pages/4.시준/17_analysisHistory.jsx'
import Alert from './pages/4.시준/18_alert.jsx'

import FileUpload from './pages/2.동율/8_fileUpload.jsx'
import OcrProgress from './pages/2.동율/9_ocrProgress.jsx'
import OcrReview from './pages/2.동율/10_ocrReview.jsx'
import AiAnalysis from './pages/2.동율/11_aiAnalysis.jsx'
import AnalysisResult from './pages/2.동율/12_result.jsx'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Master />} />

      <Route path="/screen/7" element={<ContractPhotography />} />
      <Route path="/screen/16" element={<ProfessionalFeedback />} />
      <Route path="/screen/17" element={<AnalysisHistory />} />
      <Route path="/screen/18" element={<Alert />} />
      <Route path="/screen/8" element={<FileUpload />} />
      <Route path="/screen/9" element={<OcrProgress />} />
      <Route path="/screen/10" element={<OcrReview />} />
      <Route path="/screen/11" element={<AiAnalysis />} />
      <Route path="/screen/12" element={<AnalysisResult />} />
    </Routes>
  )
}

export default App
