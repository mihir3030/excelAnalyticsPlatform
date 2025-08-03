import { useState, useEffect } from "react";
import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { axiosInstance } from "../../utils/axiosUtil";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiChevronLeft, FiChevronRight, FiBarChart2, FiFile } from "react-icons/fi";
import './FileAnalysis.css'

function FileAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/uploads/get-files/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFileData(res.data);
      } catch (error) {
        setError("Failed to fetch file data");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFile();
  }, [id, token]);

  const handleChartsNavigation = () => {
    navigate(`/dashboard/files/${id}/charts`, {
      state: {
        fileData: fileData,
        fileId: id,
        fileName: fileData?.metadata?.originalFileName || "Unknown File"
      }
    });
  };

  // Pagination logic
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentRows = fileData?.data?.slice(startIdx, endIdx);
  const totalPages = Math.ceil(fileData?.data?.length / rowsPerPage);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <div className="text-red-500 mb-4">⚠️ {error}</div>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Retry
      </button>
    </div>
  );

  if (!fileData) return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <FiFile className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-600">No data found for this file.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <TopBar title={fileData.metadata?.originalFileName || "File Analysis"} />
          
          <div className="p-6">
            {/* File Info Card */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">File Details</h3>
                  <p className="text-sm text-blue-600">
                    {fileData.data?.length} rows | {fileData.metadata?.columns?.length} columns
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                    {fileData.metadata?.fileType || "Excel"}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-xs animate-fade-in-up">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-500">
                    <tr>
                      {fileData.metadata?.columns?.map((col, idx) => (
                        <th 
                          key={idx}
                          className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
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
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        {fileData.metadata.columns.map((col, i) => (
                          <td 
                            key={i} 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
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

            {/* Navigation and Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex space-x-3">
                <button
                  onClick={handleChartsNavigation}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:shadow-md transition-all hover:scale-105"
                >
                  <FiBarChart2 className="mr-2" />
                  View Charts
                </button>
                <button
                  onClick={() => navigate("/dashboard/user-files")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Back to Files
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileAnalysis;