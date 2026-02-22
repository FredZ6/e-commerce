import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children, requiredRole = null }) {
  const { isAuthenticated, loading, roles } = useAuth()
  const location = useLocation()

  // Show loading state while auth status is being initialized.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // Redirect to login when user is not authenticated.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect to products when required role is missing.
  if (requiredRole && !roles.includes(`ROLE_${requiredRole}`)) {
    return <Navigate to="/products" replace />
  }

  return children
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
}
