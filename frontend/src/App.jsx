import Navbar from "./components/Navbar"
import {Route, Routes, useLocation} from "react-router-dom"
import HomePage from "./pages/HomePage"
import DashboardPage from "./pages/DashboardPage"
import Sidebar from "./components/Dashboard/Sidebar/Sidebar"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Logout from "./components/Logout"
import SIgnupPage from "./pages/SIgnupPage"
import Dashboard from "./components/Dashboard/dashboard/Dashboard"
import UserInfo from "./pages/dashboard/UserInfo"
import UploadExcel from "./pages/dashboard/UploadExcel"

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
       
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SIgnupPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }>

          {/* Main Dashboard  */}
          <Route index element={<Dashboard />} />
          <Route path="user-info" element={<UserInfo />} />
          <Route path="upload-excel" element={<UploadExcel />} />

        </Route>

      </Routes>
    </div>
  )
}

export default App
