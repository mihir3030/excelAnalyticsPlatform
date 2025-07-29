import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function ProtectedRoute({children}) {
    const user = useSelector((state) => state.auth.user)

    // if user is there so user can visit dashboard if not user redirect to login
    if(!user || !user.token) return <Navigate to="/login" />

    return children
}

export default ProtectedRoute
