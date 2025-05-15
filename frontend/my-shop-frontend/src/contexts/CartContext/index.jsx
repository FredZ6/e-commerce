import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { CartContext } from './context'
import { getCartItems } from '../../services/cart'
import { useAuth } from '../AuthContext'

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // 获取购物车商品
  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([])
      setLoading(false)
      return
    }

    try {
      const data = await getCartItems()
      setCartItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 当用户登录状态改变时重新获取购物车
  useEffect(() => {
    fetchCartItems()
  }, [user])

  const value = {
    cartItems,
    loading,
    error,
    refreshCart: fetchCartItems,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
} 