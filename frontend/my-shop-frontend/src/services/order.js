import api from './api'

export const createOrder = async () => {
  const response = await api.post('/orders')
  return response.data
}

export const getOrders = async () => {
  const response = await api.get('/orders')
  return response.data
}

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`)
  return response.data
} 