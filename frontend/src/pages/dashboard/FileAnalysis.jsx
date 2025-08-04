import React, { useState, useEffect } from "react";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiBarChart2, 
  FiFile,
  FiDatabase,
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiDownload,
  FiEye,
  FiArrowLeft,
  FiGrid,
  FiList,
  FiFilter,
  FiSearch,
  FiFileText,
  FiPieChart,
  FiActivity
} from "react-icons/fi";

// Mock TopBar component since we don't have the actual one
const TopBar = ({ title }) => (
  <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  </div>
);

function EnhancedFileAnalysis() {
  // Mock data for demonstration
  const [fileData, setFileData] = useState({
    metadata: {
      originalFileName: "Sales_Data_Q4_2024.xlsx",
      fileType: "Excel",
      uploadedAt: "2024-12-15T10:30:00Z",
      size: 2048576,
      columns: ["Product", "Category", "Sales", "Date", "Region", "Revenue"]
    },
    data: [
      { Product: "Laptop Pro", Category: "Electronics", Sales: 150, Date: "2024-01-15", Region: "North", Revenue: 225000 },
      { Product: "Wireless Mouse", Category: "Accessories", Sales: 320, Date: "2024-01-16", Region: "South", Revenue: 9600 },
      { Product: "Smartphone X", Category: "Electronics", Sales: 89, Date: "2024-01-17", Region: "East", Revenue: 62300 },
      { Product: "USB Cable", Category: "Accessories", Sales: 450, Date: "2024-01-18", Region: "West", Revenue: 4500 },
      { Product: "Tablet Air", Category: "Electronics", Sales: 67, Date: "2024-01-19", Region: "North", Revenue: 33500 },
      { Product: "Keyboard", Category: "Accessories", Sales: 123, Date: "2024-01-20", Region: "South", Revenue: 12300 },
      { Product: "Monitor 4K", Category: "Electronics", Sales: 78, Date: "2024-01-21", Region: "East", Revenue: 46800 },
      { Product: "Webcam HD", Category: "Accessories", Sales: 200, Date: "2024-01-22", Region: "West", Revenue: 15000 },
      { Product: "Headphones", Category: "Accessories", Sales: 189, Date: "2024-01-23", Region: "North", Revenue: 18900 },
      { Product: "Smart Watch", Category: "Electronics", Sales: 145, Date: "2024-01-24", Region: "South", Revenue: 43500 },
      { Product: "Power Bank", Category: "Accessories", Sales: 267, Date: "2024-01-25", Region: "East", Revenue: 13350 },
      { Product: "Gaming Chair", Category: "Furniture", Sales: 45, Date: "2024-01-26", Region: "West", Revenue: 13500 }
    ]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const rowsPerPage = 8;

  // Get unique categories for filter
  const categories = ['all', ...new Set(fileData?.data?.map(row => row.Category) || [])];

  // Filter data based on search and category
  const filteredData = fileData?.data?.filter(row => {
    const matchesSearch = Object.values(row).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesCategory = selectedCategory === 'all' || row.Category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Pagination logic
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentRows = filteredData.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Calculate statistics
  const totalRevenue = fileData?.data?.reduce((sum, row) => sum + (row.Revenue || 0), 0) || 0;
  const totalSales = fileData?.data?.reduce((sum, row) => sum + (row.Sales || 0), 0) || 0;
  const averageRevenue = totalRevenue / (fileData?.data?.length || 1);

  const handleChartsNavigation = () => {
    console.log("Navigate to charts");
  };

  const handleBackToFiles = () => {
    console.log("Navigate back to files");
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading file data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiFile className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading File</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar title={fileData?.metadata?.originalFileName || "File Analysis"} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section with Navigation */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToFiles}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {fileData?.metadata?.originalFileName}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    {new Date(fileData?.metadata?.uploadedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <FiDatabase className="w-4 h-4 mr-1" />
                    {((fileData?.metadata?.size || 0) / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <button
                onClick={handleChartsNavigation}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
              >
                <FiBarChart2 className="w-4 h-4 mr-2" />
                Create Charts
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-semibold rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200">
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Records</p>
                <h3 className="text-2xl font-bold text-gray-900">{fileData?.data?.length || 0}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                <FiDatabase className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Columns</p>
                <h3 className="text-2xl font-bold text-gray-900">{fileData?.metadata?.columns?.length || 0}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl">
                <FiGrid className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalSales.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl">
                <FiTrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl">
                <FiActivity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'cards' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <tr>
                    {fileData?.metadata?.columns?.map((col, idx) => (
                      <th 
                        key={idx}
                        className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRows?.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-indigo-50 transition-colors duration-200 group"
                    >
                      {fileData.metadata.columns.map((col, i) => (
                        <td 
                          key={i} 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 group-hover:text-gray-900"
                        >
                          {typeof row[col] === 'number' && col.toLowerCase().includes('revenue') 
                            ? `$${row[col].toLocaleString()}`
                            : row[col]
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRows?.map((row, idx) => (
                <div key={idx} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:border-indigo-200">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 truncate">{row[fileData.metadata.columns[0]]}</h4>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                      {row.Category}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {fileData.metadata.columns.slice(1).map((col, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{col}:</span>
                        <span className="font-medium text-gray-900">
                          {typeof row[col] === 'number' && col.toLowerCase().includes('revenue') 
                            ? `$${row[col].toLocaleString()}`
                            : row[col]
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Showing {startIdx + 1} to {Math.min(endIdx, filteredData.length)} of {filteredData.length} results
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedFileAnalysis;