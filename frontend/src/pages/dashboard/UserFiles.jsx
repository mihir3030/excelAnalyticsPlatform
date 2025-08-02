import TopBar from '../../components/Dashboard/dashboard/TopBar'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUploads } from '../../features/upload/uploadSlice'
import { axiosInstance } from '../../utils/axiosUtil'
import { useNavigate } from 'react-router-dom'
import { FiFile, FiBarChart2, FiDownload, FiClock } from 'react-icons/fi'

function UserFiles() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const uploads = useSelector((state) => state.upload.uploadData)

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

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <TopBar title="My Files" />
          
          <div className='p-6'>
            {uploads && uploads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploads.map((file) => (
                  <div 
                    key={file._id} 
                    className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className='p-5'>
                      <div className='flex items-start mb-4'>
                        <div className='p-3 bg-blue-50 rounded-lg mr-4'>
                          <FiFile className='w-5 h-5 text-blue-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {file.originalFileName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <FiClock className='w-3.5 h-3.5 mr-1' />
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className='flex justify-between items-center mt-4'>
                        <button
                          onClick={() => navigate(`/dashboard/files/${file._id}`)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none transition-colors"
                        >
                          <FiBarChart2 className='w-4 h-4 mr-2' />
                          Analyze
                        </button>
                        
                        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <FiDownload className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <div className='mx-auto h-24 w-24 text-gray-300 mb-4'>
                  <FiFile className='w-full h-full' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-1'>No files uploaded yet</h3>
                <p className='text-gray-500 max-w-md mx-auto'>
                  Upload your first Excel file to start analyzing your data
                </p>
                <button className='mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none'>
                  Upload File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserFiles