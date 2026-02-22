import api from './api'
import { normalizeOrder } from '../utils/order'

export const createOrder = async () => {
  const response = await api.post('/orders')
  return normalizeOrder(response.data)
}

export const getOrders = async () => {
  const response = await api.get('/orders')
  return Array.isArray(response.data) ? response.data.map(normalizeOrder) : []
}

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`)
  return normalizeOrder(response.data)
}

export const getAllOrdersForAdmin = async () => {
  const response = await api.get('/orders/admin')
  return Array.isArray(response.data) ? response.data.map(normalizeOrder) : []
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/admin/${orderId}/status`, null, {
    params: { status },
  })
  return normalizeOrder(response.data)
}
