import { Route, Routes } from 'react-router'
import Master from './pages/Master/Master.jsx'
import ContractPhotography from './pages/2.동율/7_contractPhotography.jsx'
import FileUpload from './pages/2.동율/8_fileUpload.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Master />} />
      <Route
        path="/screen/7"
        element={<ContractPhotography />}
      />
      <Route path="/screen/8" element={<FileUpload />} />
    </Routes>
  )
}

export default App
