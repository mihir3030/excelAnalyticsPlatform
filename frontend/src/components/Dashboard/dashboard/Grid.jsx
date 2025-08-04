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
  FiActivity,
  FiEye,
  FiArrowUpRight,
  FiFolder,
  FiZap,
  FiCircle 
} from 'react-icons/fi';
import { Pie} from 'react-chartjs-2';
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

function Grid() {
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
    
    // Get file types for pie chart
    const fileTypes = uploads.reduce((acc, file) => {
      const extension = file.originalFileName.split('.').pop().toLowerCase();
      acc[extension] = (acc[extension] || 0) + 1;
      return acc;
    }, {});

    // Prepare bar chart data showing file sizes
    const barChartData = {
      labels: uploads.slice(0, 8).map(file => 
        file.originalFileName.length > 15 
          ? `${file.originalFileName.substring(0, 15)}...` 
          : file.originalFileName
      ),
      datasets: [{
        label: 'File Size (KB)',
        data: uploads.slice(0, 8).map(file => (file.size / 1024).toFixed(2)),
        backgroundColor: uploads.slice(0, 8).map((_, index) => {
          const colors = [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(244, 63, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(249, 115, 22, 0.8)'
          ];
          return colors[index % colors.length];
        }),
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };

    return {
      barChart: barChartData,
      pieChart: {
        labels: Object.keys(fileTypes),
        datasets: [{
          data: Object.values(fileTypes),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(244, 63, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)'
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      }
    };
  };

  const chartData = prepareChartData();
  const recentFiles = uploads?.slice(0, 4) || [];
  const totalDataPoints = uploads?.reduce((acc, file) => acc + (file.data?.length || 0), 0) || 0;
  const totalSize = uploads?.reduce((acc, file) => acc + file.size, 0) || 0;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 12,
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { font: { size: 11 } }
      }
    }
  };


  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.fullName?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your Excel files and visualize data with powerful charts
              </p>
            </div>
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate('/dashboard/upload-excel')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
              >
                <FiUpload className="w-5 h-5 mr-2" />
                Upload Excel File
              </button>
              <button 
                onClick={() => navigate('/dashboard/files')}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200"
              >
                <FiFolder className="w-5 h-5 mr-2" />
                View All Files
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Files Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:bg-white transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl text-indigo-600 mr-4 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300">
                  <FiFile className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Files</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {uploads?.length || 0}
                  </h3>
                </div>
              </div>
              <FiArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                +{uploads?.length || 0} this month
              </span>
            </div>
          </div>

          {/* Data Points Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:bg-white transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl text-emerald-600 mr-4 group-hover:from-emerald-100 group-hover:to-green-200 transition-all duration-300">
                  <FiDatabase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Data Points</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {totalDataPoints.toLocaleString()}
                  </h3>
                </div>
              </div>
              <FiArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Across all files
              </span>
            </div>
          </div>

          

          {/* Recent Activity Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:bg-white transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl text-amber-600 mr-4 group-hover:from-amber-100 group-hover:to-orange-200 transition-all duration-300">
                  <FiActivity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Upload</p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {uploads?.[0] ? 
                      new Date(uploads[0].uploadedAt).toLocaleDateString() : 
                      'No activity'}
                  </h3>
                </div>
              </div>
              <FiArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors duration-300" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 truncate">
                {uploads?.[0]?.originalFileName || 'Upload your first file'}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid - File Types and Saved Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* File Types Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">File Types Distribution</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                {Object.keys(chartData?.pieChart?.labels || {}).length} types
              </span>
            </div>
            <div className="h-80">
              {chartData ? (
                <Pie data={chartData.pieChart} options={chartOptions} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <FiPieChart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No file type data</p>
                  <p className="text-gray-400 text-sm mt-1">Upload files to see distribution</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Saved Charts */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Saved Charts</h3>
              <button 
                onClick={() => navigate('/dashboard/charts')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all duration-200"
              >
                View All
              </button>
            </div>
            <div className="h-80">
              {/* Mock saved charts data - replace with actual saved charts */}
              {uploads && uploads.length > 0 ? (
                <div className="space-y-4 overflow-y-auto h-full">
                  {uploads.slice(0, 4).map((file, index) => {
                    const chartTypes = ['Pie Chart', 'Bar Chart', 'Line Chart', 'Doughnut Chart'];
                    const chartIcons = [<FiPieChart key="pie" />, <FiBarChart2 key="bar" />, <FiTrendingUp key="line" />, <FiCircle key="doughnut" />];
                    const chartType = chartTypes[index % chartTypes.length];
                    const chartIcon = chartIcons[index % chartIcons.length];
                    
                    return (
                      <div 
                        key={`${file._id}-${index}`}
                        className="group flex items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200"
                        onClick={() => navigate(`/dashboard/files/${file._id}/charts`)}
                      >
                        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg text-purple-600 mr-4 group-hover:from-purple-100 group-hover:to-indigo-200 transition-all duration-200">
                          {chartIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {chartType} - {file.originalFileName.split('.')[0]}
                          </h4>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="flex items-center text-xs text-gray-500">
                              <FiClock className="w-3 h-3 mr-1" />
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                              Saved
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/files/${file._id}/charts`);
                            }}
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add export/download chart functionality here
                            }}
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <FiBarChart2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No saved charts yet</p>
                  <p className="text-gray-400 text-sm mt-1 mb-4">Create charts from your uploaded files</p>
                  <button 
                    onClick={() => navigate('/dashboard/upload-excel')}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <FiUpload className="w-4 h-4 mr-2" />
                    Upload First File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Recent Files List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Files</h3>
            <button 
              onClick={() => navigate('/dashboard/files')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all duration-200"
            >
              View All
            </button>
          </div>
          
          {recentFiles.length > 0 ? (
            <div className="space-y-3">
              {recentFiles.map((file, index) => (
                <div 
                  key={file._id} 
                  className="group flex items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200"
                  onClick={() => navigate(`/dashboard/files/${file._id}`)}
                >
                  <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg text-indigo-600 mr-4 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-200">
                    <FiFile className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {file.originalFileName}
                    </h4>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="flex items-center text-xs text-gray-500">
                        <FiClock className="w-3 h-3 mr-1" />
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/files/${file._id}/charts`);
                      }}
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add download functionality here
                      }}
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FiFile className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No files yet</h4>
              <p className="text-gray-500 mb-6">Upload your first Excel file to get started</p>
              <button 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/dashboard/upload-excel')}
              >
                <FiUpload className="w-4 h-4 mr-2" />
                Upload Excel File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Grid