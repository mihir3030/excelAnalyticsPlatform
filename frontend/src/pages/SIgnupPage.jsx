import { useState } from "react";
import { assets } from "../assets/assets.js";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../features/auth/authSlice.js";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosUtil.js";
import { useEffect } from "react";

function SIgnupPage() {
    const [fullName, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // // check if user already there so user cant visit signup page
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        if(user && user.token){
            navigate("/dashboard");
        }
    })


    // when form submit if user register we want to login as well
    const handleRegisterSubmit = async (e) => {
        e.preventDefault()
        dispatch(loginStart())
        console.log({ fullName, email, password })


        try {
            // sen post request to backend
            const res = await axiosInstance.post("/auth/signup", {
                fullName,
                email,
                password
            })

            const userData = res.data
            dispatch(loginSuccess(userData))
            navigate("/dashboard")

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup Failed";
            dispatch(loginFailure(errorMessage));
            console.log(errorMessage);
            
        }

    }

  return (
    <div className="h-full bg-stone-300">
      <div className="mx-auto">
        <div className="flex justify-center px-6 py-12">
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            <div
              className="w-full h-auto bg-gray-400 dark:bg-gray-800 hidden lg:block 
                lg:w-5/12 bg-cover rounded-l-lg login-main-image"
            >
              <img src={assets.loginBg} />
            </div>
            <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
              <h3 className="py-4 text-2xl text-center text-gray-800 dark:text-white">
                Create an Account!
              </h3>

              {/* FORM */}
              <form 
              className="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded"
              onSubmit={handleRegisterSubmit}>
                {/* FULL NAME */}
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="fullname"
                  >
                    Full Name
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 
                                dark:text-white border rounded shadow appearance-none focus:outline-none 
                                focus:shadow-outline"
                    id="fullname"
                    type="fullname"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                {/* EMAIL */}
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Password */}
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="email"
                  >
                    Password
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 
                                dark:text-white border rounded shadow appearance-none focus:outline-none 
                                focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 
                                rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white 
                                dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline cursor-pointer"
                    type="submit"
                  >
                    Register Account
                  </button>
                </div>
                <hr className="mb-6 border-t" />
                {/* <div className="text-center">
							<a className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
								href="#">
								Forgot Password?
							</a>
						</div> */}
                <div className="text-center">
                  <Link
                    className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline
                     hover:text-blue-800" 
                     to="/login">
                    Already have an account? Login!
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SIgnupPage;
