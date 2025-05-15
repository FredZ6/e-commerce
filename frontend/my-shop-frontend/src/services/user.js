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

// 管理员注册接口
export const registerAdmin = async (userData) => {
  const response = await api.post('/users/register/admin', userData)
  return response.data
} 