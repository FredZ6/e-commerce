import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { logout as authLogout } from '../services/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
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
  }

  // Logout
  const logout = () => {
    authLogout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    setUser: updateUser,
    isAuthenticated,
    loading,
    logout
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
