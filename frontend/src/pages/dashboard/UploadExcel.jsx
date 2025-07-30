import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { FaFileUpload } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axiosUtil.js";
import {
  uploadStart,
  uploadSuccess,
  uploadFailure,
} from "../../features/upload/uploadSlice";

function UploadExcel() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const token = useSelector((state) => state.auth.token);
const data = useSelector((state) => state.upload.uploadData);
  console.log("data is --------", data);
  

  const handleFileUpload = async () => {
    if (!file) {
      return setMessage("please select file");
    }

    // upload start
    dispatch(uploadStart())
    const formData = new FormData()
    formData.append("file", file)

    try {
        const res = await axiosInstance.post("/uploads/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            },
        });
        dispatch(uploadSuccess(res.data));
        console.log(res.data);
        
        setMessage("Upload Success To Cloud")
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Upload Failed Frontend"
        setMessage("Upload Error from frontend -", errorMessage)
        dispatch(uploadFailure(errorMessage))

    }

  };

  return (
    <div className="bg-white rounded-lg pb-5 shadow h-auto">
      <TopBar />

      {/* UPLOAD FILE */}
      <div className="px-4 grid gap-4 grid-cols-12">
        <div
          className="w-[80%] mt-10 mb-10 mx-auto relative border-2 border-gray-300 border-dashed rounded-lg p-6
             bg-stone-100 col-span-12"
          id="dropzone"
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 z-50"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="text-center">
            <FaFileUpload className="text-6xl text-center w-full" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              <label htmlFor="file-upload" className="relative">
                <span>Drag and drop</span>
                <span className="text-indigo-600"> or browse </span>
                <span>to Analysis</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only cursor-pointer "
                />
              </label>
            </h3>
            <p className="mt-1 text-xs text-gray-500">.xlsx .xls 10MB</p>
          </div>
        </div>

        {/* Button */}
        <div className="w-[30%] justify-center items-center mx-auto col-span-12">
          <button
            className="w-full  p-2 bg-green-400 cursor-pointer "
            onClick={handleFileUpload}
          >
            Upload
          </button>

          {message && <p className="text-center mt-4 text-stone-700">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default UploadExcel;
