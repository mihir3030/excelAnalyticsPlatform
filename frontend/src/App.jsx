import Navbar from "./components/Navbar"
import {Route, Routes, useLocation} from "react-router-dom"
import HomePage from "./pages/HomePage"
import DashboardPage from "./pages/DashboardPage"
import Sidebar from "./components/Dashboard/Sidebar/Sidebar"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Logout from "./components/Logout"
import SIgnupPage from "./pages/SIgnupPage"

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
        <Route path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SIgnupPage />} />


      </Routes>
    </div>
  )
}

export default App
