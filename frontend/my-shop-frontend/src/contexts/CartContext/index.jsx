import { useState, useEffect, useContext, useCallback } from 'react'
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

  // Fetch cart items.
  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setCartItems([])
      setError(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getCartItems()
      setCartItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Refetch cart when authentication user changes.
  useEffect(() => {
    fetchCartItems()
  }, [fetchCartItems])

  const value = {
    cartItems,
    loading,
    error,
    refreshCart: fetchCartItems,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cartItems.reduce((sum, item) => {
      const unitPrice = Number(item?.product?.price ?? item?.price ?? 0)
      const quantity = Number(item?.quantity ?? 0)
      return sum + unitPrice * quantity
    }, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
} 
