import Navbar from "./components/Navbar"
import {Route, Routes, useLocation} from "react-router-dom"
import HomePage from "./pages/HomePage"
import DashboardPage from "./pages/DashboardPage"
import Sidebar from "./components/Dashboard/Sidebar/Sidebar"

function App() {
  const location = useLocation()

  // define side bar and navbar show
  const showNavbar = ["/", "/contact"].includes(location.pathname)
  // const showSidebar = location.pathname.startsWith("/dashboard")
  return (
    <div>
      {showNavbar && <Navbar />}
      {/* {showSidebar && <Sidebar />} */}
  
      <Routes>
        {/* Navbar routes */}
        <Route path="/" element={<HomePage />} />
       
       {/* sidebar routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  )
}

export default App
