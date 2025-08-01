import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { axiosInstance } from "../../utils/axiosUtil.js";
import { loginSuccess } from "../../features/auth/authSlice.js";

function UserInfo() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [fullName, setFullname] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);

    if (profilePic) {

      formData.append("profilePic", profilePic);
    }

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

      dispatch(loginSuccess({ ...updatedUser, token }));
      setMessage("Profile updated");

      console.log("ProfilePic URL:", updatedUser);
      
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-white rounded-lg pb-5 shadow h-auto">
      <TopBar />

      <div className="px-4 grid gap-4 grid-cols-12">
        <div
          className="p-4 bg-stone-100 rounded-xl col-span-12 sm:col-span-4
            flex flex-col items-center justify-center"
        >
          {/* user Info */}
          <img src={user.profilPic} className="h-30 rounded-full" />
          <p className="mt-3 text-stone-600 text-l">{user.fullname}</p>
          <p className="text-stone-500 text-sm">{user.email}</p>
        </div>

        {/* Form */}
        <div
          className="p-4 bg-stone-100 rounded-xl col-span-12 sm:col-span-8
            flex flex-col items-center"
        >
          <div>
            {/* FORM */}
            <form onSubmit={handleUpdateProfile} encType="multipart/form-data">
              <div className="w-full flex-1 mt-2">
                <div className="mx-auto max-w-xs">
                  <input
                    id="email"
                    name="email"
                    className="w-full px-8 py-3 rounded-lg font-medium bg-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    id="fullname"
                    name="fullname"
                    className="w-full px-8 pb-3 py-3 rounded-lg font-medium bg-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder="full Name"
                    value={fullName}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                  <input
                    id="file"
                    name="file"
                    className="w-full px-8 py-3 mt-5 rounded-lg font-medium bg-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="file"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                  />

                  <button
                    className="mt-5 tracking-wide font-semibold bg-teal-300 text-white-500 w-full 
                py-3 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex 
                items-center justify-center focus:shadow-outline focus:outline-none cursor-pointer"
                    type="submit"
                  >
                    <span className="ml-">Update Profile</span>
                  </button>
                  {message && (
                    <p className="mt-3 text-center text-sm text-stone-600">
                      {message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
