import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUploads } from '../../../features/upload/uploadSlice';
import { axiosInstance } from '../../../utils/axiosUtil';
import TopBar from '../../../components/Dashboard/dashboard/TopBar';
import { 
  FiFile, 
  FiBarChart2, 
  FiTrendingUp, 
  FiUsers,
  FiDatabase,
  FiPieChart,
  FiDownload,
  FiClock,
  FiUpload,
  FiActivity
} from 'react-icons/fi';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

function DashboardGrid() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const uploads = useSelector((state) => state.upload.uploadData);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUpload = async () => {
      try {
        const res = await axiosInstance.get("/uploads/get-files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUploads(res.data));
      } catch (error) {
        console.error('Failed to fetch uploads:', error);
      }
    };
    fetchUpload();
  }, [dispatch, token]);

  // Prepare chart data from actual uploads
  const prepareChartData = () => {
    if (!uploads || uploads.length === 0) return null;
    
    // Group files by month for the line chart
    const monthlyData = uploads.reduce((acc, file) => {
      const date = new Date(file.uploadedAt);
      const month = date.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    // Get file types for pie chart
    const fileTypes = uploads.reduce((acc, file) => {
      const extension = file.originalFileName.split('.').pop().toLowerCase();
      acc[extension] = (acc[extension] || 0) + 1;
      return acc;
    }, {});

    return {
      lineChart: {
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Files Uploaded',
          data: Object.values(monthlyData),
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.1
        }]
      },
      barChart: {
        labels: uploads.slice(0, 5).map(file => 
          file.originalFileName.length > 15 
            ? `${file.originalFileName.substring(0, 15)}...` 
            : file.originalFileName
        ),
        datasets: [{
          label: 'File Size (KB)',
          data: uploads.slice(0, 5).map(file => (file.size / 1024).toFixed(2)),
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2
        }]
      },
      pieChart: {
        labels: Object.keys(fileTypes),
        datasets: [{
          data: Object.values(fileTypes),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(244, 63, 94, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(139, 92, 246, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    };
  };

  const chartData = prepareChartData();
  const recentFiles = uploads?.slice(0, 5) || [];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Files Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mr-4">
                <FiFile className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Files</p>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {uploads?.length || 0}
                </h3>
                <p className="text-xs text-green-500 mt-1">
                  +{uploads?.length || 0} this month
                </p>
              </div>
            </div>
          </div>

          {/* Data Points Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg text-green-600 mr-4">
                <FiDatabase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data Points</p>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {uploads?.reduce((acc, file) => acc + (file.data?.length || 0), 0) || 0}
                </h3>
                <p className="text-xs text-green-500 mt-1">
                  {/* +{(uploads?.reduce((acc, file) => acc + (file.data?.length || 0), 0) / 2 || 0} this month */}
                </p>
              </div>
            </div>
          </div>

          {/* Active User Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-600 mr-4">
                <FiUsers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active User</p>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {user?.fullName || 'You'}
                </h3>
                <p className="text-xs text-blue-500 mt-1">
                  Active now
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600 mr-4">
                <FiActivity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Activity</p>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {uploads?.[0] ? 
                    new Date(uploads[0].uploadedAt).toLocaleDateString() : 
                    'No activity'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {uploads?.[0]?.originalFileName || ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line Chart - Upload Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Trends</h3>
            <div className="h-64">
              {chartData ? (
                <Line data={chartData.lineChart} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <FiTrendingUp className="w-12 h-12 text-gray-300" />
                  <p className="ml-4 text-gray-400">No data available for trends</p>
                </div>
              )}
            </div>
          </div>

          {/* Pie Chart - File Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">File Types</h3>
            <div className="h-64">
              {chartData ? (
                <Pie data={chartData.pieChart} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <FiPieChart className="w-12 h-12 text-gray-300" />
                  <p className="ml-4 text-gray-400">No file type data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart - Recent Files Size */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Files Analysis</h3>
            <div className="h-64">
              {chartData ? (
                <Bar data={chartData.barChart} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <FiBarChart2 className="w-12 h-12 text-gray-300" />
                  <p className="ml-4 text-gray-400">No files to analyze</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Files List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Files</h3>
              <button 
                onClick={() => navigate('/dashboard/files')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>
            
            {recentFiles.length > 0 ? (
              <div className="space-y-4">
                {recentFiles.map((file) => (
                  <div 
                    key={file._id} 
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/files/${file._id}`)}
                  >
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-4">
                      <FiFile className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {file.originalFileName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <FiClock className="w-3 h-3 mr-1" />
                        {new Date(file.uploadedAt).toLocaleDateString()} • 
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add download functionality here
                      }}
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiFile className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent files</p>
                <button 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  onClick={() => navigate('/dashboard/files')}
                >
                  <FiUpload className="w-4 h-4 mr-2" />
                  Upload Files
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardGrid;