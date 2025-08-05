import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
    const { user, token } = useSelector((state) => state.auth)
    
    // If not authenticated, redirect to login
    if (!user || !token) {
        return <Navigate to="/admin-login" />
    }

    // If authenticated but not admin, redirect to home or unauthorized page
    if (user.role !== 'admin') {
        return <Navigate to="/" /> // or '/unauthorized' if you have such a route
    }

    // If authenticated and admin, render the children
    return children
}

export default AdminRoute