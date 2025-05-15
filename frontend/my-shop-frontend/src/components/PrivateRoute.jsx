import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // 如果正在加载认证状态，显示加载中
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // 如果未认证，重定向到登录页，并记录当前路径
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 如果需要特定角色但用户没有该角色，重定向到商品页
  if (requiredRole && (!user.roles || !user.roles.includes(`ROLE_${requiredRole}`))) {
    return <Navigate to="/products" replace />
  }

  return children
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
}

PrivateRoute.defaultProps = {
  requiredRole: null
} 