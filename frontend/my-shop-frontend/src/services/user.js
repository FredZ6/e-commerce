import api from './api'

export const register = async (userData) => {
  const response = await api.post('/users/register', userData)
  return response.data
}

export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials)
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/users/me')
  return response.data
}

// Admin registration endpoint
export const registerAdmin = async (userData) => {
  const response = await api.post('/users/register/admin', userData)
  return response.data
} 
