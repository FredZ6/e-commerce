import api from './api'

export const getCartItems = async () => {
  const response = await api.get('/cart')
  return response.data
}

export const addToCart = async (productId, quantity) => {
  const response = await api.post('/cart', null, {
    params: { productId, quantity }
  })
  return response.data
}

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await api.put(`/cart/${cartItemId}`, null, {
    params: { quantity }
  })
  return response.data
}

export const removeFromCart = async (cartItemId) => {
  const response = await api.delete(`/cart/${cartItemId}`)
  return response.data
}

export const clearCart = async () => {
  const response = await api.delete('/cart/clear')
  return response.data
} 