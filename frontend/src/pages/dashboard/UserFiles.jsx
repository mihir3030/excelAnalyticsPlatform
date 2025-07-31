import TopBar from '../../components/Dashboard/dashboard/TopBar'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUploads } from '../../features/upload/uploadSlice';
import { axiosInstance } from '../../utils/axiosUtil'
import { useNavigate } from 'react-router-dom'

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
                dispatch(setUploads(res.data));
            } catch (error) {
                console.error('Failed to fetch uploads:', error);
            }
        }
        fetchUpload();
    }, [dispatch, token])

    console.log(uploads);
    

    return (
    <div className='bg-white rounded-lg pb-5 shadow h-auto'>
      <TopBar />

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {uploads && uploads.length > 0 ? (
          uploads.map((file) => (
            <div key={file._id} className="bg-stone-100 rounded-xl mx-5 shadow p-5 
              hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-gray-800 truncate">{file.originalFileName}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Uploaded: {new Date(file.uploadedAt).toLocaleString()}
              </p>
              <a
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-blue-600 hover:underline cursor-pointer text-sm font-medium"
                onClick={() => navigate(`/dashboard/files/${file._id}`)}
              >
                View File
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No files uploaded yet.</p>
        )}
      </div>

    </div>
  )
}

export default UserFiles
