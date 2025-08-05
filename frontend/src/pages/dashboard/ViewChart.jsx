import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../utils/axiosUtil';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import TopBar from '../../components/Dashboard/dashboard/TopBar';
import {
  FiArrowLeft,
  FiDownload,
  FiInfo,
  FiTrash2,
  FiRefreshCw,
  FiCalendar,
  FiFile,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiCircle,
  FiEye,
  FiMaximize2
} from 'react-icons/fi';
import { generateChartData } from '../../utils/chartDataGenerators'; // Import the unified generator

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

const ViewChart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, chartType } = useParams();
  const token = useSelector((state) => state.auth.token);
  
  const isFromSavedCharts = location.pathname.includes('/saved-charts/view/');
  const [fileData, setFileData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const { savedAnalysis, fileData: stateFileData } = location.state || {};
    
    if (isFromSavedCharts) {
      if (savedAnalysis) {
        setAnalysisData(savedAnalysis);
        stateFileData ? setFileData(stateFileData) : fetchFileData(savedAnalysis.upload._id);
      } else {
        fetchAnalysisData(id);
      }
    } else {
      if (stateFileData) setFileData(stateFileData);
      else fetchFileData(id);
      if (savedAnalysis) setAnalysisData(savedAnalysis);
    }
  }, [id, location.state, isFromSavedCharts]);

  const fetchAnalysisData = async (analysisId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/analysis/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalysisData(res.data);
      if (res.data.upload._id) fetchFileData(res.data.upload._id);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      setError("Failed to fetch analysis data");
      setLoading(false);
    }
  };

  const fetchFileData = async (fileId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/uploads/get-files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFileData(res.data);
    } catch (error) {
      console.error('Error fetching file data:', error);
      setError("Failed to fetch file data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async () => {
    if (!analysisData?._id || !window.confirm('Are you sure you want to delete this saved chart?')) return;
    
    try {
      setLoading(true);
      await axiosInstance.delete(`/analysis/${analysisData._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Chart deleted successfully!');
      navigate('/dashboard/saved-charts');
    } catch (error) {
      console.error('Error deleting analysis:', error);
      alert('Failed to delete chart. Please try again.');
      setLoading(false);
    }
  };

  // Prepare grouped data for chart generation
  const prepareGroupedData = () => {
    if (!fileData?.data || !analysisData) return null;

    const { xAxis, yAxis, aggregation = 'sum' } = analysisData;
    const groupedData = { data: [], validCount: 0 };

    try {
      // Group and aggregate data
      const dataMap = {};
      fileData.data.forEach(row => {
        const xValue = row[xAxis];
        const yValue = parseFloat(row[yAxis]);
        
        if (xValue !== undefined && xValue !== null && xValue !== '' && !isNaN(yValue)) {
          if (!dataMap[xValue]) dataMap[xValue] = [];
          dataMap[xValue].push(yValue);
          groupedData.validCount++;
        }
      });

      // Apply aggregation
      Object.entries(dataMap).forEach(([label, values]) => {
        let aggregatedValue;
        switch (aggregation) {
          case 'sum': aggregatedValue = values.reduce((a, b) => a + b, 0); break;
          case 'average': aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length; break;
          case 'count': aggregatedValue = values.length; break;
          case 'max': aggregatedValue = Math.max(...values); break;
          case 'min': aggregatedValue = Math.min(...values); break;
          default: aggregatedValue = values.reduce((a, b) => a + b, 0);
        }
        groupedData.data.push([label, aggregatedValue]);
      });

      return groupedData;
    } catch (error) {
      console.error('Error preparing grouped data:', error);
      return null;
    }
  };

  // Generate chart data using the unified generator
  const getChartData = () => {
    const groupedData = prepareGroupedData();
    if (!groupedData) return null;

    return generateChartData(
      groupedData,
      chartType.includes('-') ? chartType.split('-')[0] : chartType,
      analysisData.xAxis,
      analysisData.yAxis
    );
  };

  const chartData = getChartData();
  const fileName = analysisData?.upload?.originalFileName || 'Unknown File';

  // Chart options configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: chartType === 'pie-chart' ? 'right' : 'top',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: isFullscreen ? 14 : 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { size: isFullscreen ? 16 : 14, weight: 'bold' },
        bodyFont: { size: isFullscreen ? 14 : 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            if (chartType === 'pie-chart') {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
            return `${label}: ${value}`;
          }
        }
      },
      title: {
        display: true,
        text: analysisData 
          ? `${analysisData.yAxis || 'Count'} by ${analysisData.xAxis}${analysisData.aggregation ? ` (${analysisData.aggregation})` : ''}`
          : `${fileName} Data Visualization`,
        font: {
          size: isFullscreen ? 18 : 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        padding: { top: 10, bottom: 20 }
      }
    }
  };

  const renderChart = () => {
    if (!chartData) return null;
    
    const normalizedType = chartType.includes('-') ? chartType.split('-')[0] : chartType;
    const chartProps = { data: chartData, options: chartOptions };
    
    switch (normalizedType) {
      case 'pie': return <Pie {...chartProps} />;
      case 'bar': return <Bar {...chartProps} />;
      case 'line': return <Line {...chartProps} />;
      case 'doughnut': return <Doughnut {...chartProps} />;
      default: return <Pie {...chartProps} />;
    }
  };

  // Helper functions
  const getChartIcon = () => {
    const icons = {
      'pie': <FiPieChart size={24} />,
      'bar': <FiBarChart2 size={24} />,
      'line': <FiTrendingUp size={24} />,
      'doughnut': <FiCircle size={24} />
    };
    const type = chartType.includes('-') ? chartType.split('-')[0] : chartType;
    return icons[type] || <FiPieChart size={24} />;
  };

  const getChartTypeLabel = () => {
    const labels = {
      'pie': 'Pie Chart',
      'bar': 'Bar Chart',
      'line': 'Line Chart',
      'doughnut': 'Doughnut Chart'
    };
    const type = chartType.includes('-') ? chartType.split('-')[0] : chartType;
    return labels[type] || 'Chart';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadChart = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${fileName}-${chartType}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Loading and error states
  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading chart data...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Error Loading Chart</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FiRefreshCw className="inline mr-2" size={16} />
                Try Again
              </button>
              <button 
                onClick={() => navigate('/dashboard/saved-charts')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Back to Charts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <TopBar />
      
      <div className={`${isFullscreen ? 'h-screen overflow-auto' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {/* Header */}
        <div className={`${isFullscreen ? 'px-8 py-4' : 'mb-8'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(isFromSavedCharts ? '/dashboard/saved-charts' : `/dashboard/files/${id}`)}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition mr-4"
              >
                <FiArrowLeft className="mr-2" size={16} />
                {isFromSavedCharts ? 'Back to Saved Charts' : 'Back to Data'}
              </button>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-3">
                  {getChartIcon()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getChartTypeLabel()}
                  </h1>
                  <p className="text-gray-600">{fileName}</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                title="Toggle Details"
              >
                <FiInfo size={16} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                title="Toggle Fullscreen"
              >
                <FiMaximize2 size={16} />
              </button>
              <button
                onClick={downloadChart}
                className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                title="Download Chart"
              >
                <FiDownload size={16} />
              </button>
              {analysisData && (
                <button
                  onClick={handleDeleteAnalysis}
                  disabled={loading}
                  className="p-2 bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Chart"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                  ) : (
                    <FiTrash2 size={16} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${isFullscreen ? 'px-8 pb-8 h-full' : ''} ${isFullscreen ? 'flex gap-6' : 'grid grid-cols-1 lg:grid-cols-4 gap-6'}`}>
          {/* Chart */}
          <div className={`${isFullscreen ? 'flex-1' : 'lg:col-span-3'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className={`${isFullscreen ? 'h-full' : 'h-96 lg:h-[500px]'} relative`}>
                {chartData ? renderChart() : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No chart data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Sidebar */}
          {showDetails && (
            <div className={`${isFullscreen ? 'w-80 flex-shrink-0' : 'lg:col-span-1'}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Chart Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FiBarChart2 className="mr-3 mt-1 text-gray-400" size={16} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Chart Type</p>
                        <p className="text-sm text-gray-600">{getChartTypeLabel()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiFile className="mr-3 mt-1 text-gray-400" size={16} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Source File</p>
                        <p className="text-sm text-gray-600 break-words">{fileName}</p>
                      </div>
                    </div>

                    {analysisData && (
                      <div className="flex items-start">
                        <FiCalendar className="mr-3 mt-1 text-gray-400" size={16} />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Created</p>
                          <p className="text-sm text-gray-600">{formatDate(analysisData.createdAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Axis Configuration */}
                {analysisData && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Configuration</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-800">X-Axis (Category)</p>
                        <p className="text-sm text-blue-700">{analysisData.xAxis}</p>
                      </div>
                      
                      {analysisData.yAxis && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-800">Y-Axis (Value)</p>
                          <p className="text-sm text-green-700">{analysisData.yAxis}</p>
                        </div>
                      )}
                      
                      {analysisData.aggregation && (
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-orange-800">Aggregation Method</p>
                          <p className="text-sm text-orange-700 capitalize">{analysisData.aggregation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                {analysisData?.aiSummary && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{analysisData.aiSummary}</p>
                    </div>
                  </div>
                )}

                {/* Data Stats */}
                {chartData && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Statistics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-900">{chartData.labels.length}</p>
                        <p className="text-xs text-gray-600">Data Points</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.max(...chartData.datasets[0].data).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Max Value</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/dashboard/files/${analysisData?.upload?._id || id}`)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      <FiEye className="mr-2" size={14} />
                      View Source Data
                    </button>
                    <button
                      onClick={downloadChart}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                    >
                      <FiDownload className="mr-2" size={14} />
                      Download PNG
                    </button>
                    {analysisData && (
                      <button
                        onClick={handleDeleteAnalysis}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></div>
                        ) : (
                          <FiTrash2 className="mr-2" size={14} />
                        )}
                        Delete Chart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewChart;