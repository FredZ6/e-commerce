import api from './api'

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise} 登录响应
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
    throw error.message ? error : { message: '登录失败，请检查用户名和密码' }
  }
}

/**
 * 用户注册
 * @param {Object} userData 用户数据
 * @returns {Promise} 注册响应
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
    throw error.message ? error : { message: '注册失败，请稍后重试' }
  }
}

/**
 * 用户登出
 */
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // 可选：清除其他用户相关状态
  localStorage.removeItem('cart')
}

/**
 * 获取当前认证状态
 * @returns {Object|null} 用户信息
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