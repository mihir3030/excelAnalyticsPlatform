import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { axiosInstance } from "../../utils/axiosUtil.js";
import { loginSuccess } from "../../features/auth/authSlice.js";
import { 
  FiUpload, 
  FiUser, 
  FiMail, 
  FiCheckCircle, 
  FiLock, 
  FiEdit3, 
  FiCamera,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff
} from "react-icons/fi";

function UserInfo() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [fullName, setFullname] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const res = await axiosInstance.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = res.data.updatedUser;
      setFullname(updatedUser.fullName);
      setEmail(updatedUser.email);
      setProfilePic(null);
      setPassword("");

      dispatch(loginSuccess({ ...updatedUser, token }));
      setMessage("Profile updated successfully!");
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <FiUser className="mr-3 text-indigo-600" />
                Profile Settings
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your account information and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Main Profile Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Profile Header with Gradient */}
              <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div 
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                      <img
                        src={user.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    
                    {/* Upload Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                      <FiCamera className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Edit Badge */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:bg-indigo-700 transition-colors duration-200">
                      <FiEdit3 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FiEdit3 className="mr-3 text-indigo-600" />
                  Edit Profile Information
                </h3>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <FiUser className="w-4 h-4 mr-2 text-indigo-600" />
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullname(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <FiMail className="w-4 h-4 mr-2 text-indigo-600" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <FiLock className="w-4 h-4 mr-2 text-indigo-600" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 pr-12"
                      placeholder="Leave blank to keep current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                {/* Profile Picture Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <FiCamera className="w-4 h-4 mr-2 text-indigo-600" />
                    Profile Picture
                  </label>
                  <div className="relative">
                    <label className="cursor-pointer group">
                      <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group-hover:shadow-sm">
                        <span className="text-sm text-gray-600 truncate">
                          {profilePic ? profilePic.name : "Choose a new profile picture..."}
                        </span>
                        <div className="flex items-center space-x-2">
                          {profilePic && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setProfilePic(null);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          )}
                          <FiUpload className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" />
                        </div>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => setProfilePic(e.target.files[0])}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </button>
                </div>

                {/* Success/Error Message */}
                {message && (
                  <div className={`p-4 rounded-xl flex items-center space-x-3 ${
                    message.includes("failed") || message.includes("error")
                      ? "bg-red-50 border border-red-200 text-red-700" 
                      : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  } transition-all duration-300 animate-fade-in`}>
                    <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}

export default UserInfo;