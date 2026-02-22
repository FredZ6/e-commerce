import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { logout as authLogout } from '../services/auth'

const AuthContext = createContext(null)

const normalizeRoles = (userData) => {
  if (!userData) return []
  if (Array.isArray(userData.roles)) return userData.roles
  if (typeof userData.role === 'string') {
    return [userData.role.startsWith('ROLE_') ? userData.role : `ROLE_${userData.role}`]
  }
  return []
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
          setRoles(normalizeRoles(parsedUser))
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error)
        logout() // Clear auth state on initialization failure.
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Update user and auth state together.
  const updateUser = (userData) => {
    setUser(userData)
    setIsAuthenticated(!!userData)
    setRoles(normalizeRoles(userData))
  }

  // Logout
  const logout = () => {
    authLogout()
    setUser(null)
    setIsAuthenticated(false)
    setRoles([])
  }

  const value = {
    user,
    setUser: updateUser,
    isAuthenticated,
    loading,
    roles,
    logout,
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
