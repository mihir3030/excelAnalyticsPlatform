import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiClock, 
  FiArrowLeft,
  FiShield,
  FiUpload,
  FiPieChart,
  FiTrash2,
  FiFileText,
  FiBarChart2,
  FiActivity
} from 'react-icons/fi';
import { axiosInstance } from '../../utils/axiosUtil';

function AdminUserManagement() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('uploads');
  const [uploadsPagination, setUploadsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [chartsPagination, setChartsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [userId, uploadsPagination.page, chartsPagination.page]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/users/${userId}`, {
        params: {
          uploadsPage: uploadsPagination.page,
          uploadsLimit: uploadsPagination.limit,
          chartsPage: chartsPagination.page,
          chartsLimit: chartsPagination.limit
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      setUploads(response.data.uploads.data || []);
      setCharts(response.data.savedCharts.data || []);
      setUploadsPagination({
        ...uploadsPagination,
        total: response.data.uploads.pagination.total,
        totalPages: response.data.uploads.pagination.totalPages
      });
      setChartsPagination({
        ...chartsPagination,
        total: response.data.savedCharts.pagination.total,
        totalPages: response.data.savedCharts.pagination.totalPages
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (newRole) => {
    try {
      await axiosInstance.put(
        `/admin/users/${userId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser({ ...user, role: newRole });
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm(`Are you sure you want to delete ${user?.fullName}? This will also delete all their data.`)) {
      try {
        await axiosInstance.delete(`/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/admin/users');
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    if (window.confirm('Are you sure you want to delete this upload and all associated charts?')) {
      try {
        await axiosInstance.delete(`/admin/users/${userId}/uploads/${uploadId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh data after deletion
        fetchUserData();
      } catch (error) {
        console.error('Failed to delete upload:', error);
      }
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (window.confirm('Are you sure you want to delete this chart?')) {
      try {
        await axiosInstance.delete(`/admin/users/${userId}/charts/${chartId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh data after deletion
        fetchUserData();
      } catch (error) {
        console.error('Failed to delete chart:', error);
      }
    }
  };

  const handleUploadsPageChange = (newPage) => {
    setUploadsPagination({ ...uploadsPagination, page: newPage });
  };

  const handleChartsPageChange = (newPage) => {
    setChartsPagination({ ...chartsPagination, page: newPage });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <FiUser className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">User not found</h3>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="w-5 h-5 mr-1" />
        Back to Users
      </button>

      {/* User Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {user.role === 'admin' ? (
                <FiShield className="w-8 h-8 text-purple-600" />
              ) : (
                <FiUser className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.fullName}
                {user.role === 'admin' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Admin
                  </span>
                )}
              </h2>
              <p className="text-gray-600 flex items-center">
                <FiMail className="w-4 h-4 mr-1" />
                {user.email}
              </p>
              <p className="text-gray-500 text-sm flex items-center mt-1">
                <FiClock className="w-3 h-3 mr-1" />
                {user.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString()}`
                 : 'Join Date Unknow'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <select
              value={user.role}
              onChange={(e) => handleRoleUpdate(e.target.value)}
              className={`text-sm border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                user.role === 'admin' 
                  ? 'bg-purple-50 border-purple-200 text-purple-800' 
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleDeleteUser}
              className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Uploads</p>
              <p className="text-2xl font-bold text-gray-900">
                {uploadsPagination.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiUpload className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Charts</p>
              <p className="text-2xl font-bold text-gray-900">
                {chartsPagination.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiPieChart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Activity</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.lastActivity ? 
                  new Date(user.lastActivity).toLocaleDateString() : 
                  'Never'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiActivity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'uploads'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiFileText className="inline mr-2" />
            Uploads ({uploadsPagination.total})
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'charts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiBarChart2 className="inline mr-2" />
            Saved Charts ({chartsPagination.total})
          </button>
        </nav>
      </div>

      {/* Uploads Tab */}
      {activeTab === 'uploads' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploads.map((upload) => (
                  <tr key={upload._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {upload.originalFileName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {upload.fileType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(upload.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {upload.rowCount} rows
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUpload(upload._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Upload"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Uploads Pagination */}
          {uploadsPagination.totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between items-center">
                <button
                  onClick={() => handleUploadsPageChange(uploadsPagination.page - 1)}
                  disabled={uploadsPagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {uploadsPagination.page} of {uploadsPagination.totalPages}
                </span>
                <button
                  onClick={() => handleUploadsPageChange(uploadsPagination.page + 1)}
                  disabled={uploadsPagination.page >= uploadsPagination.totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {uploads.length === 0 && (
            <div className="text-center py-12">
              <FiFileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No uploads found</h3>
              <p className="mt-1 text-sm text-gray-500">
                This user hasn't uploaded any files yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chart Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From File
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {charts.map((chart) => (
                  <tr key={chart._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {chart.name || 'Untitled Chart'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        {chart.chartType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(chart.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {chart.upload?.originalFileName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteChart(chart._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Chart"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts Pagination */}
          {chartsPagination.totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between items-center">
                <button
                  onClick={() => handleChartsPageChange(chartsPagination.page - 1)}
                  disabled={chartsPagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {chartsPagination.page} of {chartsPagination.totalPages}
                </span>
                <button
                  onClick={() => handleChartsPageChange(chartsPagination.page + 1)}
                  disabled={chartsPagination.page >= chartsPagination.totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {charts.length === 0 && (
            <div className="text-center py-12">
              <FiBarChart2 className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No charts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                This user hasn't created any charts yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminUserManagement;