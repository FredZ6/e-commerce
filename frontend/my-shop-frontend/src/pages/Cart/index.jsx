import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { updateCartItem, removeFromCart, clearCart } from '../../services/cart'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { createOrder } from '../../services/order'
import { useToast } from '../../components/common/Toast'
import { useConfirm } from '../../components/common/ConfirmDialog'

export default function Cart() {
  const { cartItems, loading, error: cartError, refreshCart, totalPrice } = useCart()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const showToast = useToast()
  const confirm = useConfirm()

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      setUpdating(true)
      setError(null)
      await updateCartItem(itemId, quantity)
      await refreshCart()
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    const confirmed = await confirm({
      title: '删除商品',
      message: '确定要从购物车中删除此商品吗？',
      confirmText: '删除',
      cancelText: '取消',
    })

    if (confirmed) {
      try {
        setUpdating(true)
        await removeFromCart(itemId)
        await refreshCart()
        showToast('商品已删除', 'success')
      } catch (err) {
        showToast(err.message, 'error')
      } finally {
        setUpdating(false)
      }
    }
  }

  const handleClearCart = async () => {
    const confirmed = await confirm({
      title: '清空购物车',
      message: '确定要清空购物车吗？此操作不可撤销。',
      confirmText: '清空',
      cancelText: '取消',
    })

    if (confirmed) {
      try {
        setUpdating(true)
        await clearCart()
        await refreshCart()
        showToast('购物车已清空', 'success')
      } catch (err) {
        showToast(err.message, 'error')
      } finally {
        setUpdating(false)
      }
    }
  }

  const handleCheckout = async () => {
    try {
      setUpdating(true)
      setError(null)
      const order = await createOrder()
      navigate(`/orders/${order.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (cartError || error) return <ErrorMessage message={cartError || error} />
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">购物车是空的</h2>
        <p className="mt-2 text-gray-500">去添加一些商品吧</p>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">购物车</h1>

        <div className="mt-12">
          {cartItems.map((item) => (
            <div key={item.id} className="flex py-6 border-b">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.product.name}</h3>
                    <p className="ml-4">¥{item.product.price}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.product.description}</p>
                </div>

                <div className="flex flex-1 items-end justify-between">
                  <div className="flex items-center">
                    <select
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                      disabled={updating}
                      className="rounded-md border border-gray-300 py-1.5 text-base sm:text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating}
                      className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      删除
                    </button>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    小计：¥{item.product.price * item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-8">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>总计</p>
              <p>¥{totalPrice}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleClearCart}
              disabled={updating}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              清空购物车
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={updating}
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              结算
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 