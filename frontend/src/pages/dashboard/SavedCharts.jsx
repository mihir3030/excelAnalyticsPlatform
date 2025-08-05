import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../utils/axiosUtil';
import TopBar from '../../components/Dashboard/dashboard/TopBar';
import {
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiCircle,
  FiCalendar,
  FiFile,
  FiEye,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiBookmark,
  FiGrid,
  FiList,
  FiX,
  FiCheck,
  FiAlertTriangle
} from 'react-icons/fi';

const SavedCharts = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chartToDelete, setChartToDelete] = useState(null);

  useEffect(() => {
    fetchSavedAnalyses();
  }, []);

  const fetchSavedAnalyses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/analysis/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyses(response.data);
    } catch (error) {
      console.error('Error fetching saved analyses:', error);
      setError('Failed to load saved charts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (analysis) => {
    setChartToDelete(analysis);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!chartToDelete) return;

    try {
      setDeleteLoading(chartToDelete._id);
      await axiosInstance.delete(`/analysis/${chartToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyses(prev => prev.filter(analysis => analysis._id !== chartToDelete._id));
      setShowDeleteModal(false);
      setChartToDelete(null);
    } catch (error) {
      console.error('Error deleting analysis:', error);
      alert('Failed to delete chart. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setChartToDelete(null);
  };

  const handleViewChart = (analysis) => {
    // Ensure upload exists before navigation
    if (!analysis.upload || !analysis.upload._id) {
      alert('Cannot view chart - file information is missing');
      return;
    }

    // Navigate to the dedicated view chart route
    navigate(`/dashboard/saved-charts/view/${analysis._id}/${analysis.chartType}`, {
      state: {
        savedAnalysis: analysis,
        fileId: analysis.upload._id,
        fileName: analysis.upload.originalFileName || 'Unknown File',
        chartType: analysis.chartType
      }
    });
  };

  const getChartIcon = (chartType) => {
    const iconMap = {
      'pie-chart': <FiPieChart size={20} />,
      'bar-chart': <FiBarChart2 size={20} />,
      'line-chart': <FiTrendingUp size={20} />,
      'doughnut-chart': <FiCircle size={20} />,
      'radar-chart': <FiCircle size={20} />
    };
    return iconMap[chartType] || <FiPieChart size={20} />;
  };

  const getChartTypeLabel = (chartType) => {
    const labelMap = {
      'pie-chart': 'Pie Chart',
      'bar-chart': 'Bar Chart',
      'line-chart': 'Line Chart',
      'doughnut-chart': 'Doughnut Chart',
      'radar-chart': 'Radar Chart'
    };
    return labelMap[chartType] || chartType;
  };

  const getChartTypeColor = (chartType) => {
    const colorMap = {
      'pie-chart': 'bg-blue-100 text-blue-600',
      'bar-chart': 'bg-green-100 text-green-600',
      'line-chart': 'bg-purple-100 text-purple-600',
      'doughnut-chart': 'bg-orange-100 text-orange-600',
      'radar-chart': 'bg-pink-100 text-pink-600'
    };
    return colorMap[chartType] || 'bg-gray-100 text-gray-600';
  };

  const filteredAnalyses = analyses.filter(analysis => {
    // Ensure upload exists and has originalFileName
    if (!analysis.upload || !analysis.upload.originalFileName) {
      return false;
    }

    const matchesSearch = 
      analysis.upload.originalFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.chartType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.xAxis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (analysis.yAxis && analysis.yAxis.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterType === 'all' || analysis.chartType === filterType;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your saved charts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FiBookmark className="mr-3 text-blue-600" />
                Saved Charts
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your saved data visualizations
              </p>
            </div>
            <button
              onClick={fetchSavedAnalyses}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FiRefreshCw className="mr-2" size={16} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search charts by file name, chart type, or axis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Charts</option>
                  <option value="pie-chart">Pie Charts</option>
                  <option value="bar-chart">Bar Charts</option>
                  <option value="line-chart">Line Charts</option>
                  <option value="doughnut-chart">Doughnut Charts</option>
                  <option value="radar-chart">Radar Charts</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredAnalyses.length} chart{filteredAnalyses.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Charts Grid/List */}
        {filteredAnalyses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <FiBookmark className="inline-block" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {analyses.length === 0 ? 'No Saved Charts Yet' : 'No Charts Match Your Search'}
            </h3>
            <p className="text-gray-600 mb-6">
              {analyses.length === 0 
                ? 'Start creating and saving your data visualizations to see them here.'
                : 'Try adjusting your search terms or filters to find the charts you\'re looking for.'
              }
            </p>
            {analyses.length === 0 && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredAnalyses.map((analysis) => (
              <div
                key={analysis._id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'overflow-hidden'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${getChartTypeColor(analysis.chartType)}`}>
                          {getChartIcon(analysis.chartType)}
                        </div>
                        <button
                          onClick={() => handleDeleteClick(analysis)}
                          disabled={deleteLoading === analysis._id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === analysis._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                          ) : (
                            <FiTrash2 size={16} />
                          )}
                        </button>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                        {getChartTypeLabel(analysis.chartType)}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FiFile className="mr-2" size={14} />
                          <span className="truncate">
                            {analysis.upload?.originalFileName || 'Unknown File'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="mr-2" size={14} />
                          <span>{formatDate(analysis.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart Details */}
                    <div className="px-6 pb-4">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>X-Axis:</strong> {analysis.xAxis}</div>
                        {analysis.yAxis && <div><strong>Y-Axis:</strong> {analysis.yAxis}</div>}
                        {analysis.zAxis && <div><strong>Z-Axis:</strong> {analysis.zAxis}</div>}
                      </div>
                    </div>

                    {/* AI Summary */}
                    {analysis.aiSummary && (
                      <div className="px-6 pb-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="text-xs font-medium text-blue-800 mb-1">AI Summary</h4>
                          <p className="text-xs text-blue-700 line-clamp-3">{analysis.aiSummary}</p>
                        </div>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="px-6 pb-6">
                      <button
                        onClick={() => handleViewChart(analysis)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <FiEye className="mr-2" size={16} />
                        View Chart
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className={`p-3 rounded-lg mr-4 ${getChartTypeColor(analysis.chartType)}`}>
                      {getChartIcon(analysis.chartType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {getChartTypeLabel(analysis.chartType)}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {analysis.upload?.originalFileName || 'Unknown File'}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>X: {analysis.xAxis}</span>
                            {analysis.yAxis && <span className="ml-4">Y: {analysis.yAxis}</span>}
                            {analysis.zAxis && <span className="ml-4">Z: {analysis.zAxis}</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(analysis.createdAt)}
                          </span>
                          <button
                            onClick={() => handleViewChart(analysis)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(analysis)}
                            disabled={deleteLoading === analysis._id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteLoading === analysis._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                            ) : (
                              <FiTrash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {analysis.aiSummary && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
                          <p className="text-xs text-blue-700 line-clamp-2">{analysis.aiSummary}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <FiAlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Chart</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            {chartToDelete && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${getChartTypeColor(chartToDelete.chartType)}`}>
                    {getChartIcon(chartToDelete.chartType)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getChartTypeLabel(chartToDelete.chartType)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {chartToDelete.upload?.originalFileName || 'Unknown File'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this saved chart? This will permanently remove the chart configuration and any associated AI summary.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX className="inline mr-2" size={16} />
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <FiCheck className="mr-2" size={16} />
                )}
                Delete Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedCharts;