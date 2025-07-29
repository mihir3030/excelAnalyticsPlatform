import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice.js' // Adjust path as needed
import { axiosInstance } from '../utils/axiosUtil.js'



function Logout() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const navigate = useNavigate()

  useEffect(() => {
      const perFormlogout = async () => {
        try {
          // send post request to backend to blacklished toekn
          await axiosInstance.post("/auth/logout", null, {
            headers:{
              Authorization: `Bearer ${token}`,
            },
          })
          console.log("Logout success from backend");
          
        } catch (error) {
          console.log("Logout request fialed", error);
        }
        dispatch(logout())
        navigate("/login")
      };
    perFormlogout()

  },[dispatch, token])

  
}

export default Logout
