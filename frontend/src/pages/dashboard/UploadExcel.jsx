import React, { useState, useCallback } from 'react';
import {axiosInstance} from '../../utils/axiosUtil.js'
import { 
  FiUpload, 
  FiX, 
  FiCheckCircle, 
  FiFile, 
  FiAlertCircle,
  FiFileText,
  FiDatabase,
  FiZap,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiBarChart,
  FiPieChart,
  FiDownload,
} from 'react-icons/fi';
import TopBar from '../../components/Dashboard/dashboard/TopBar';
import { useSelector } from 'react-redux';

function EnhancedUploadExcel() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isUploading, setIsUploading] = useState(false);
  const token = useSelector((state) => state.auth.token);

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

 // EnhancedUploadExcel.js
const handleFileUpload = async () => {
    if (!file) {
        setMessage({ 
            text: "Please select a file to upload", 
            type: "error" 
        });
        return;
    }

    setIsUploading(true);
    setMessage({ 
        text: "Checking file...", 
        type: "info" 
    });

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/uploads/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
            }
        });

        if (response.data.success) {
            setMessage({ 
                text: response.data.message || "File uploaded successfully! Ready to create charts.", 
                type: "success" 
            });
            
            // Optional: Redirect or refresh file list
            setTimeout(() => {
                setFile(null);
                setUploadProgress(0);
            }, 3000);
        } else {
            setMessage({ 
                text: response.data.message || "Upload completed but with issues", 
                type: "warning" 
            });
        }

    } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Failed to upload file";
        
        setMessage({ 
            text: errorMessage, 
            type: "error" 
        });
        
        // If duplicate file error, keep the file selected so user can rename it
        if (!errorMessage.includes("already exists")) {
            setUploadProgress(0);
        }
    } finally {
        setIsUploading(false);
    }
};

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
      <TopBar />
     
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upload Your File</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FiShield className="w-4 h-4" />
                    <span>Secure Upload</span>
                  </div>
                </div>
                
                {/* Drag and Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    isDragging 
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 scale-105' 
                      : file 
                        ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50'
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
                    accept=".xlsx,.xls,.csv"
                  />
                  
                  <div className="flex flex-col items-center justify-center space-y-6 pointer-events-none">
                    {file ? (
                      <>
                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-lg">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 mb-2">{file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                          <FiUpload className="w-10 h-10 text-indigo-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-semibold text-gray-900 mb-2">
                            Drop your Excel file here
                          </p>
                          <p className="text-gray-600 mb-4">
                            or <span className="text-indigo-600 font-medium">browse files</span> to get started
                          </p>
                          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FiFile className="w-4 h-4 mr-1" />
                              .xlsx, .xls, .csv
                            </span>
                            <span>•</span>
                            <span>Max 10MB</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {file && (
                    <button
                      onClick={removeFile}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 pointer-events-auto"
                      aria-label="Remove file"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {/* Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Uploading your file...</span>
                      <span className="text-sm font-bold text-indigo-600">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Message Display */}
                {message.text && (
                  <div className={`mt-6 p-4 rounded-xl border backdrop-blur-sm flex items-start space-x-3 ${
                    message.type === "error" 
                      ? "bg-red-50/80 border-red-200 text-red-700" 
                      : message.type === "success" 
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-700" 
                        : "bg-blue-50/80 border-blue-200 text-blue-700"
                  } transition-all duration-300 animate-fade-in`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {message.type === "error" ? (
                        <FiAlertCircle className="w-5 h-5" />
                      ) : message.type === "success" ? (
                        <FiCheckCircle className="w-5 h-5" />
                      ) : (
                        <FiClock className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-medium">{message.text}</span>
                  </div>
                )}
                
                {/* Upload Button */}
                <div className="mt-8">
                  <button
                    onClick={handleFileUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-3 ${
                      !file || isUploading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FiZap className="w-5 h-5" />
                        <span>Upload & Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Features & Tips */}
          <div className="space-y-6">
            
            {/* What You Can Do */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiTrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                What You Can Create
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                    <FiBarChart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Interactive Charts</p>
                    <p className="text-xs text-gray-600">Bar, line, pie, and more</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg">
                    <FiPieChart className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Data Insights</p>
                    <p className="text-xs text-gray-600">Automatic analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg">
                    <FiDownload className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Export Options</p>
                    <p className="text-xs text-gray-600">Save as PNG, PDF, etc.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Tips */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiShield className="w-5 h-5 mr-2 text-emerald-600" />
                Upload Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include headers in the first row</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Remove empty rows and columns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use consistent data formats</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>File size limit: 10MB</span>
                </li>
              </ul>
            </div>

            {/* Supported Formats */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <FiFile className="w-5 h-5 mr-2" />
                Supported Formats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <span className="font-medium">.XLSX</span>
                  <span className="text-sm opacity-90">Excel 2007+</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <span className="font-medium">.XLS</span>
                  <span className="text-sm opacity-90">Excel 97-2003</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <span className="font-medium">.CSV</span>
                  <span className="text-sm opacity-90">Comma Separated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedUploadExcel;