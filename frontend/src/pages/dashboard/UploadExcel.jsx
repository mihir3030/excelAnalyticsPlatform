import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axiosUtil.js";
import { uploadStart, uploadSuccess, uploadFailure } from "../../features/upload/uploadSlice";
import { FiUpload, FiX, FiCheckCircle, FiFile, FiAlertCircle } from "react-icons/fi";

function UploadExcel() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });
  const token = useSelector((state) => state.auth.token);
  const { loading, error } = useSelector((state) => state.upload);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const validateFile = (file) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type)) {
      setMessage({ 
        text: "Please upload a valid Excel file (.xlsx, .xls, .csv)", 
        type: "error" 
      });
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ 
        text: "File size exceeds 10MB limit", 
        type: "error" 
      });
      return false;
    }
    
    setMessage({ text: "", type: "" });
    return true;
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setMessage({ text: "", type: "" });
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage({ 
        text: "Please select a file to upload", 
        type: "error" 
      });
      return;
    }

    dispatch(uploadStart());
    setMessage({ 
      text: "Uploading file...", 
      type: "info" 
    });
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post("/uploads/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });
      
      dispatch(uploadSuccess(res.data));
      setMessage({ 
        text: "File uploaded successfully!", 
        type: "success" 
      });
      
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
      }, 3000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Upload failed";
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
      dispatch(uploadFailure(errorMessage));
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar title="Upload Excel File" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl">
          {/* Upload Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <FiUpload className="mr-2 text-blue-500" />
              Upload Your Excel File
            </h2>
            <p className="text-gray-600 mb-6">
              Upload .xlsx, .xls, or .csv files for analysis (max 10MB)
            </p>
            
            {/* Drag and Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              />
              
              <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUpload className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-sm text-gray-600">
                  {file ? (
                    <span className="font-medium text-blue-600">{file.name}</span>
                  ) : (
                    <>
                      <span>Drag and drop your file here or </span>
                      <span className="text-blue-600 font-medium">browse files</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">Max file size: 10MB</p>
              </div>
            </div>
            
            {/* Selected File Preview */}
            {file && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiFile className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Remove file"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Message Display */}
            {message.text && (
              <div className={`mt-6 p-4 rounded-lg flex items-start ${
                message.type === "error" 
                  ? "bg-red-50 border border-red-200 text-red-700" 
                  : message.type === "success" 
                    ? "bg-green-50 border border-green-200 text-green-700" 
                    : "bg-blue-50 border border-blue-200 text-blue-700"
              }`}>
                {message.type === "error" ? (
                  <FiAlertCircle className="mr-3 flex-shrink-0 mt-0.5" />
                ) : message.type === "success" ? (
                  <FiCheckCircle className="mr-3 flex-shrink-0 mt-0.5" />
                ) : null}
                <span>{message.text}</span>
              </div>
            )}
            
            {/* Upload Button */}
            <div className="mt-8">
              <button
                onClick={handleFileUpload}
                disabled={!file || loading}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all flex items-center justify-center ${
                  !file || loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow hover:shadow-md'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload File"
                )}
              </button>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Upload Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Ensure your file has headers in the first row</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Remove any empty rows or columns before uploading</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>For best results, keep file size under 5MB</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Supported formats: .xlsx, .xls, .csv</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadExcel;