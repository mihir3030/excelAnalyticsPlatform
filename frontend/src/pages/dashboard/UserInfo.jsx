import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { axiosInstance } from "../../utils/axiosUtil.js";
import { loginSuccess } from "../../features/auth/authSlice.js";
import { FiUpload, FiUser, FiMail, FiCheckCircle, FiLock } from "react-icons/fi";
import './UserInfo.css'

function UserInfo() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [fullName, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

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
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <TopBar />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white shadow-xl rounded-2xl overflow-hidden border border-blue-100 animate-fade-in">
        {/* Profile Card (Left) */}
        <div className="relative lg:col-span-1 p-8 bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div className="relative flex flex-col items-center text-center">
            <div 
              className="relative group mb-6"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                src={user.profilePic || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/50 shadow-lg transition-all duration-300 group-hover:scale-105"
              />
              {isHovering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-opacity duration-300">
                  <FiUpload className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{user.fullName}</h2>
            <p className="text-blue-100">{user.email}</p>
          </div>
        </div>

        {/* Form Section (Right) */}
        <div className="lg:col-span-2 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiUser className="mr-2 text-blue-500" />
            Edit Profile
          </h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="space-y-4">
              <FloatingInput
                label="Email"
                type="email"
                value={email}
                icon={<FiMail className="w-5 h-5 text-blue-400" />}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <FloatingInput
                label="Full Name"
                type="text"
                value={fullName}
                icon={<FiUser className="w-5 h-5 text-blue-400" />}
                onChange={(e) => setFullname(e.target.value)}
              />

              <FloatingInput
                label="New Password (leave blank to keep current)"
                type="password"
                value={password}
                icon={<FiLock className="w-5 h-5 text-blue-400" />}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 transition">
                      <span className="text-sm text-gray-500 truncate">
                        {profilePic ? profilePic.name : "Choose file..."}
                      </span>
                      <FiUpload className="w-5 h-5 text-blue-500" />
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
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Update Profile
            </button>

            {message && (
              <div className={`p-3 rounded-lg flex items-center ${
                message.includes("failed") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              } transition-all duration-300`}>
                <FiCheckCircle className="mr-2" />
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function FloatingInput({ label, type, value, onChange, icon }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        placeholder={label}
      />
    </div>
  );
}

export default UserInfo;