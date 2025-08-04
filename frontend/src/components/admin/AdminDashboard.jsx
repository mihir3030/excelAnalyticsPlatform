import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axiosUtil";
import {
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiTrendingUp,
  FiActivity,
  FiUser,
  FiMail,
  FiClock,
  FiShield,
  FiPieChart
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, userRes] = await Promise.all([
        axiosInstance.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosInstance.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data.stats);
      setUsers(userRes.data.users);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };



  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <p className="text-sm text-green-600 flex items-center mt-2">
              <FiTrendingUp className="w-4 h-4 mr-1" />
              +{trend} This Month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, uploads, and system analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={FiUsers}
            trend={stats?.recentUsers}
            color="blue"
          />
          <StatCard
            title="Total Admins"
            value={stats?.totalAdmins || 0}
            icon={FiShield}
            color="purple"
          />
          <StatCard
            title="Total Uploads"
            value={stats?.totalUploads || 0}
            icon={FiFileText}
            trend={stats?.recentUploads}
            color="green"
          />
          <StatCard
            title="Total Charts"
            value={stats?.totalSavedCharts || 0}
            icon={FiBarChart2}
            trend={stats?.recentCharts}
            color="orange"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Users
          </h3>
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/admin/users/${user._id}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.role === 'admin' ? (
                      <FiShield className="w-5 h-5 text-purple-600" />
                    ) : (
                      <FiUser className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.fullName}
                      {user.role === 'admin' && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.uploadsCount} uploads
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.analysesCount || 0} charts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              System Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total System Users:</span>
                <span className="font-medium">{(stats?.totalUsers || 0) + (stats?.totalAdmins || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active This Month:</span>
                <span className="font-medium text-green-600">
                  {(stats?.recentUsers || 0) + (stats?.recentUploads || 0) + (stats?.recentCharts || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage Used:</span>
                <span className="font-medium">{stats?.totalUploads || 0} files</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Activity Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">New Users This Month:</span>
                <span className="font-medium text-blue-600">+{stats?.recentUsers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Uploads This Month:</span>
                <span className="font-medium text-green-600">+{stats?.recentUploads || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Charts This Month:</span>
                <span className="font-medium text-orange-600">+{stats?.recentCharts || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;