import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../contexts/CartContext'
import { updateCartItem, removeFromCart, clearCart } from '../../services/cart'
import { createOrder } from '../../services/order'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { useToast } from '../../components/common/Toast'
import { useConfirm } from '../../components/common/ConfirmDialog'
import { getProductImage, handleImageError } from '../../utils/image'
import { formatUSD } from '../../utils/currency'

export default function Cart() {
  const { cartItems, loading, error: cartError, refreshCart, totalPrice } = useCart()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const showToast = useToast()
  const confirm = useConfirm()

  // Entering cart page should always sync latest server cart state.
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      setUpdating(true)
      setError(null)
      await updateCartItem(itemId, quantity)
      await refreshCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    const confirmed = await confirm({
      title: 'Remove item',
      message: 'Do you want to remove this item from your cart?',
      confirmText: 'Remove',
      cancelText: 'Keep',
    })

    if (!confirmed) return

    try {
      setUpdating(true)
      await removeFromCart(itemId)
      await refreshCart()
      showToast('Item removed', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleClearCart = async () => {
    const confirmed = await confirm({
      title: 'Clear cart',
      message: 'This will remove all items from your cart.',
      confirmText: 'Clear cart',
      cancelText: 'Cancel',
    })

    if (!confirmed) return

    try {
      setUpdating(true)
      await clearCart()
      await refreshCart()
      showToast('Cart cleared', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleCheckout = async () => {
    try {
      setUpdating(true)
      setError(null)
      const order = await createOrder()
      showToast('Order created', 'success')
      navigate(`/orders/${order.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (cartError || error) return <ErrorMessage message={cartError || error} />

  if (cartItems.length === 0) {
    return (
      <section className="section-frame p-10 text-center">
        <h1 className="text-3xl">Your cart is empty</h1>
        <p className="mt-3 text-sm text-[color:var(--brand-muted)]">Pick something from the latest product collection.</p>
        <Link to="/products" className="button-primary mt-6">
          Browse products
        </Link>
      </section>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] pb-4">
      <section className="section-frame p-6 sm:p-8">
        <div className="section-header">
          <div>
            <h1 className="section-title">Shopping Cart</h1>
            <p className="section-subtitle mt-2">Review and adjust quantities before checkout.</p>
          </div>
          <button type="button" onClick={handleClearCart} disabled={updating} className="button-danger">
            Clear cart
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <article key={item.id} className="card-lift p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row">
                <img
                  src={getProductImage(item.product?.imageUrl)}
                  alt={item.product.name}
                  className="h-24 w-full rounded-2xl object-cover sm:w-24"
                  onError={handleImageError}
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg">{item.product.name}</h2>
                      <p className="mt-1 text-sm text-[color:var(--brand-muted)]">{item.product.description}</p>
                    </div>
                    <p className="text-lg font-semibold text-[color:var(--brand-accent)]">
                      {formatUSD(item.product.price)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`qty-${item.id}`} className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">
                        Qty
                      </label>
                      <div className="relative">
                        <select
                          id={`qty-${item.id}`}
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                          disabled={updating}
                          className="input-shell w-[100px] appearance-none py-2 pl-4 pr-10 text-center font-semibold tabular-nums"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--brand-muted)]" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updating}
                        className="button-secondary py-2"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-[color:var(--brand-ink)]">
                      Subtotal {formatUSD(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="section-frame h-fit p-6">
        <p className="chip">Order Summary</p>
        <div className="mt-5 space-y-2 text-sm text-[color:var(--brand-muted)]">
          <div className="flex items-center justify-between">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[color:var(--brand-paper)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[color:var(--brand-muted)]">Total</span>
            <span className="text-2xl font-semibold text-[color:var(--brand-accent)]">{formatUSD(totalPrice)}</span>
          </div>
        </div>

        <button type="button" onClick={handleCheckout} disabled={updating} className="button-primary mt-5 w-full">
          {updating ? 'Processing...' : 'Proceed to checkout'}
        </button>
      </aside>
    </div>
  )
}
