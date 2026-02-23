import api from './api'

/**
 * User login
 * @param {string} username username
 * @param {string} password password
 * @returns {Promise} login response
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/users/login', {
      username,
      password,
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error.message ? error : { message: 'Login failed, please check username and password' }
  }
}

/**
 * User registration
 * @param {Object} userData user payload
 * @returns {Promise} registration response
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  } catch (error) {
    console.error('Register error:', error)
    throw error.message ? error : { message: 'Registration failed, please try again later' }
  }
}

/**
 * User logout
 */
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // Optional: clear other user-related state
  localStorage.removeItem('cart')
}

/**
 * Get current authentication state
 * @returns {Object|null} user info
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
} 
