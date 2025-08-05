import TopBar from '../../components/Dashboard/dashboard/TopBar'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUploads } from '../../features/upload/uploadSlice'
import { axiosInstance } from '../../utils/axiosUtil'
import { useNavigate } from 'react-router-dom'
import { 
  FiFile, 
  FiBarChart2, 
  FiDownload, 
  FiClock,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiUpload,
  FiDatabase,
  FiTrendingUp,
  FiEye,
  FiFileText,
  FiTrash
} from 'react-icons/fi'

function UserFiles() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const uploads = useSelector((state) => state.upload.uploadData)

  // New state for enhanced UI
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    const fetchUpload = async () => {
      try {
        const res = await axiosInstance.get("/uploads/get-files", {
          headers: { Authorization: `Bearer ${token}` },
        })
        dispatch(setUploads(res.data))
      } catch (error) {
        console.error('Failed to fetch uploads:', error)
      }
    }
    fetchUpload()
  }, [dispatch, token])


const handleDeleteFile = async (fileId) => {
  if (window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
    try {
      await axiosInstance.delete(`/uploads/delete-file/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Optimistically update the UI by filtering out the deleted file
      dispatch(setUploads(uploads.filter(file => file._id !== fileId)));
      
      // Show success message
      alert("File deleted successfully");
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || "Failed to delete file");
    }
  }
};
  // Filter and sort files
  const filteredFiles = uploads ? uploads
    .filter(file => 
      file.originalFileName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        case 'name':
          return a.originalFileName.localeCompare(b.originalFileName);
        default:
          return 0;
      }
    }) : []

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'xlsx':
      case 'xls':
        return <FiFileText className="w-6 h-6 text-green-600" />;
      case 'csv':
        return <FiDatabase className="w-6 h-6 text-blue-600" />;
      default:
        return <FiFile className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          <TopBar title="My Files" />
          
          {/* Header Controls */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="name">File Name</option>
                  </select>
                </div>
              </div>

              {/* View Controls and Actions */}
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-indigo-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-sm text-indigo-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>

                {/* Upload Button */}
                <button 
                  onClick={() => navigate('/dashboard/upload-excel')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                >
                  <FiUpload className="w-4 h-4 mr-2" />
                  Upload File
                </button>
              </div>
            </div>

            {/* File Stats */}
            {uploads && uploads.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4">
                  <div className="flex items-center">
                    <FiFile className="w-8 h-8 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Files</p>
                      <p className="text-2xl font-bold text-gray-900">{uploads.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center">
                    <FiDatabase className="w-8 h-8 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Data Files</p>
                      <p className="text-2xl font-bold text-gray-900">{uploads.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-4">
                  <div className="flex items-center">
                    <FiTrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ready for Analysis</p>
                      <p className="text-2xl font-bold text-gray-900">{uploads.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6">
            {filteredFiles && filteredFiles.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFiles.map((file) => (
                      <div 
                        key={file._id} 
                        className="group relative bg-white rounded-2xl border border-gray-200/50 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-3">
                              <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl">
                                {getFileIcon(file.originalFileName)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
                                  {file.originalFileName}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                                  <FiClock className="w-3 h-3" />
                                  <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => navigate(`/dashboard/files/${file._id}`)}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                            >
                              <FiEye className="w-4 h-4 mr-1" />
                              View
                            </button>
                            
                            <button
                              onClick={() => navigate(`/dashboard/files/${file._id}/charts`)}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                            >
                              <FiBarChart2 className="w-4 h-4 mr-1" />
                              Charts
                            </button>
                            
                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            onClick={() => handleDeleteFile(file._id)}>
                              <FiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="space-y-3">
                    {filteredFiles.map((file) => (
                      <div 
                        key={file._id}
                        className="group flex items-center p-4 bg-white rounded-xl border border-gray-200/50 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg">
                            {getFileIcon(file.originalFileName)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {file.originalFileName}
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center">
                                <FiClock className="w-3 h-3 mr-1" />
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard/files/${file._id}`)}
                            className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none transition-colors"
                          >
                            <FiBarChart2 className='w-4 h-4 mr-2' />
                            Analyze
                          </button>
                          
                          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          onClick={() => handleDeleteFile(file._id)}>
                            <FiTrash className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Empty State - keeping your original structure
              <div className='text-center py-12'>
                <div className='mx-auto h-24 w-24 mb-4'>
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                    <FiFile className='w-12 h-12 text-gray-400' />
                  </div>
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-1'>
                  {searchTerm ? 'No files found' : 'No files uploaded yet'}
                </h3>
                <p className='text-gray-500 max-w-md mx-auto'>
                  {searchTerm 
                    ? `No files match "${searchTerm}". Try adjusting your search.`
                    : 'Upload your first Excel file to start analyzing your data'
                  }
                </p>
                {!searchTerm && (
                  <button 
                    onClick={() => navigate('/dashboard/upload-excel')}
                    className='mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none'
                  >
                    Upload File
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserFiles