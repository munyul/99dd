import { Route, Routes } from 'react-router'
import Master from './pages/Master/Master.jsx'
import ContractPhotography from './pages/2.동율/7_contractPhotography.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Master />} />
      <Route
        path="/screen/7"
        element={<ContractPhotography />}
      />
    </Routes>
  )
}

export default App
