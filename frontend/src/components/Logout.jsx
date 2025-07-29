import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice.js' // Adjust path as needed

function Logout() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  // If user exists, log them out
  useEffect(() => {
    dispatch(logout())
  }, [dispatch])

  // Redirect to login after logout
  return <Navigate to="/login" />
}

export default Logout
