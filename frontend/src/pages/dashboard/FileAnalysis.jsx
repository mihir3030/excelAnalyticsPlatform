import React, { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiBarChart2,
  FiFile,
  FiDatabase,
  FiCalendar,
  FiDownload,
  FiArrowLeft,
  FiGrid,
  FiList,
  FiFilter,
  FiSearch,
  FiActivity,
} from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosUtil";
import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { useSelector } from "react-redux";

function EnhancedFileAnalysis() {
  const { id } = useParams();
  console.log("file ifddddddd", id);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await axiosInstance.get(`/uploads/get-files/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFileData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load file data");
        setLoading(false);
        console.error("Error fetching file data:", err);
      }
    };

    fetchFileData();
  }, [id]);

  // Improved filter function
  const filteredData =
    fileData?.data?.filter((row) => {
      return fileData.metadata.columns.some((column) => {
        const value = row[column];
        if (value === null || value === undefined) return false;
        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }) || [];

  // Pagination logic
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentRows = filteredData.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleChartsNavigation = () => {
    navigate(`/dashboard/files/${id}/charts`);
  };

  const handleBackToFiles = () => {
    navigate("/dashboard/files");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading file data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFile className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading File
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBackToFiles}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Files
          </button>
        </div>
      </div>
    );

  if (!fileData)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFile className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 mb-4">
            The file data could not be loaded
          </p>
          <button
            onClick={handleBackToFiles}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Files
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
                    {new Date(
                      fileData?.metadata?.uploadedAt
                    ).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <FiDatabase className="w-4 h-4 mr-1" />
                    {((fileData?.metadata?.size || 0) / 1024 / 1024).toFixed(
                      2
                    )}{" "}
                    MB
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
  
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Records
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {fileData?.data?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                <FiDatabase className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Columns
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {fileData?.metadata?.columns?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl">
                <FiGrid className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

        
        </div>

        {/* Search Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
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
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Showing {startIdx + 1} to {Math.min(endIdx, filteredData.length)}{" "}
              of {filteredData.length} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              {/* Always show first page */}
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                }`}
              >
                1
              </button>

              {/* Show ellipsis if current page is far from start */}
              {currentPage > 3 && (
                <span className="px-2 text-gray-500">...</span>
              )}

              {/* Show pages around current page */}
              {Array.from({ length: Math.min(5, totalPages - 2) }, (_, i) => {
                let pageNum;
                if (currentPage <= 3) {
                  pageNum = i + 2; // Show 2,3,4,5,6 when on early pages
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i; // Show last pages when near end
                } else {
                  pageNum = currentPage - 2 + i; // Show pages around current
                }

                if (pageNum > 1 && pageNum < totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}

              {/* Show ellipsis if current page is far from end */}
              {currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}

              {/* Always show last page if there is one */}
              {totalPages > 1 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => setCurrentPage(totalPages)}
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
