import { Route, Routes } from 'react-router'
import Master from './pages/Master/Master.jsx'
import ContractPhotography from './pages/2.동율/7_contractPhotography.jsx'
import ProfessionalFeedback from './pages/4.시준/16_professionalFeedback.jsx'
import AnalysisHistory from './pages/4.시준/17_analysisHistory.jsx'
import Alert from './pages/4.시준/18_alert.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Master />} />
      <Route path="/screen/7" element={<ContractPhotography />} />
      <Route path="/screen/16" element={<ProfessionalFeedback />} />
      <Route path="/screen/17" element={<AnalysisHistory />} />
      <Route path="/screen/18" element={<Alert />} />
    </Routes>
  )
}

export default App
