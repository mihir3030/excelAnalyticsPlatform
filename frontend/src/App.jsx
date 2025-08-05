import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import Sidebar from "./components/Dashboard/Sidebar/Sidebar";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import SIgnupPage from "./pages/SIgnupPage";
import Dashboard from "./components/Dashboard/dashboard/Dashboard";
import UserInfo from "./pages/dashboard/UserInfo";
import UploadExcel from "./pages/dashboard/UploadExcel";
import UserFiles from "./pages/dashboard/UserFiles";
import FileAnalysis from "./pages/dashboard/FileAnalysis";
import Charts from "./pages/dashboard/Charts";
import PieChart from "./pages/dashboard/PieChart";
import BarChart from "./pages/dashboard/BarChart";
import ContactPage from "./pages/ContactPage";
import LineChart from "./pages/dashboard/LineChart";

import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminUsers from "./pages/admin/AdminUsers";
import SavedCharts from "./pages/dashboard/SavedCharts";
import ViewChart from "./pages/dashboard/ViewChart";
import AdminLogin from "./pages/admin/AdminLogin";
import PageNotFound from "./components/PageNotFound";


function App() {
  const location = useLocation();

  // define side bar and navbar show
  const showNavbar = ["/", "/contact", "/login", "/signup"].includes(location.pathname);
  // const showSidebar = location.pathname.startsWith("/dashboard")
  return (
    <div>
      {showNavbar && <Navbar />}
      {/* {showSidebar && <Sidebar />} */}

      <Routes>
        {/* Navbar routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SIgnupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          {/* Main Dashboard  */}
          <Route index element={<Dashboard />} />
          <Route path="user-info" element={<UserInfo />} />
          <Route path="upload-excel" element={<UploadExcel />} />
          <Route path="user-files" element={<UserFiles />} />
          <Route path="saved-charts" element={<SavedCharts />} />
           {/* View Chart Routes - Multiple patterns to handle different navigation scenarios */}
         <Route path="/dashboard/saved-charts" element={<SavedCharts />} />
        <Route path="/dashboard/saved-charts/view/:id/:chartType" element={<ViewChart />} />

          {/* File-specific routes with nested charts */}
          <Route path="files/:id" element={<FileAnalysis />} />
          <Route path="files/:id/charts" element={<Charts />}>
            <Route path="pie-chart" element={<PieChart />} />
            <Route path="bar-chart" element={<BarChart />} />
            <Route path="line-chart" element={<LineChart />} />
            {/* <Route path="doughnut" element={<DoughnutChart />} />
            <Route path="radar" element={<RadarChart />} /> */}
          </Route>
        </Route>

       {/* ADMIN ROUTES */}
       
        <Route path="admin-login" element={<AdminLogin />} />

       <Route path="/admin"
       element={
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
       }>

        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:userId" element={<AdminUserManagement />} />

       </Route>

       {/* 404 */}
       <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
