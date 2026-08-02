import { Route, Routes } from 'react-router'
import Master from './pages/Master/Master.jsx'
import ContractPhotography from './pages/2.동율/7_contractPhotography.jsx'
import FileUpload from './pages/2.동율/8_fileUpload.jsx'
import OcrProgress from './pages/2.동율/9_ocrProgress.jsx'
import OcrReview from './pages/2.동율/10_ocrReview.jsx'
import AiAnalysis from './pages/2.동율/11_aiAnalysis.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Master />} />
      <Route
        path="/screen/7"
        element={<ContractPhotography />}
      />
      <Route path="/screen/8" element={<FileUpload />} />
      <Route path="/screen/9" element={<OcrProgress />} />
      <Route path="/screen/10" element={<OcrReview />} />
      <Route path="/screen/11" element={<AiAnalysis />} />
    </Routes>
  )
}

export default App
