import { useState } from "react";
import { assets } from "../assets/assets.js";
import { axiosInstance } from '../utils/axiosUtil.js'
import { useNavigate, Navigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../features/auth/authSlice.js";

function Login() {
    //dispatch - action and data go to store or reducer
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    // check if user aleady logged in so user will rediredt to dashboard page
    const user =  useSelector((state) => state.auth.user)
    if(user && user.token) return <Navigate to="/dashboard" />



    // here we select loading and error from "auth" this name same as slice name
    const {loading, error} = useSelector((state) => state.auth) 
    
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    // when Form Submit run this Function
    const handleLoginSubmit = async (e) => {
     e.preventDefault()

     // start dispatch
     dispatch(loginStart())  // set loading true and error null
     try {
        const res = await axiosInstance.post("/auth/login", {
          email,
          password
        })      

        dispatch(loginSuccess(res.data))  // store user data and token in redux
        console.log(res.data)
        navigate("/dashboard")
     } catch (error) {
        const erroMesage = error.response?.data?.message || "Login Failed"
        dispatch(loginFailure(erroMesage))  // store error message
        console.log(erroMesage)
     }
    }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">

            {/* FORM */}
            <form onSubmit={handleLoginSubmit}>
            <div className="w-full flex-1 mt-2">
              <div className="flex flex-col items-center">
                <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-green-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                  <div className="bg-white p-2 rounded-full"></div>
                  <span className="ml-4">Sign In with Google</span>
                </button>
              </div>

              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign In with Cartesian E-mail
                </div>
              </div>

              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="mt-5 tracking-wide font-semibold bg-green-400 text-white-500 w-full 
                py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex 
                items-center justify-center focus:shadow-outline focus:outline-none cursor-pointer"
                type="submit">
                  <span className="ml-">Sign In</span>
                </button>
              </div>
            </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-green-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
            <img src={assets.loginBg} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
