import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { createOrder } from '../../services/order'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { useToast } from '../../components/common/Toast'
import { getProductImage, handleImageError } from '../../utils/image'
import { formatUSD } from '../../utils/currency'

export default function Checkout() {
  const navigate = useNavigate()
  const showToast = useToast()
  const { cartItems, totalPrice, loading, error, refreshCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0),
    [cartItems]
  )

  const handlePayNow = async () => {
    try {
      setSubmitError('')
      setSubmitting(true)
      const order = await createOrder()
      await refreshCart()
      showToast('Payment successful. Order placed.', 'success')
      navigate(`/orders/${order.id}`)
    } catch (err) {
      setSubmitError(err.message || 'Unable to complete payment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />

  if (cartItems.length === 0) {
    return (
      <section className="section-frame p-10 text-center">
        <h1 className="text-3xl">Checkout</h1>
        <p className="mt-3 text-sm text-[color:var(--brand-muted)]">
          Your cart is empty. Add items before payment.
        </p>
        <Link to="/products" className="button-primary mt-6">
          Browse products
        </Link>
      </section>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] pb-4">
      <section className="section-frame p-6 sm:p-8">
        <div className="section-header">
          <div>
            <span className="chip">Secure Checkout</span>
            <h1 className="mt-3 section-title">Payment</h1>
            <p className="section-subtitle mt-2">
              Confirm your items and complete the order.
            </p>
          </div>
          <span className="chip">{totalItems} items</span>
        </div>

        <div className="mt-6 space-y-4">
          {cartItems.map((item) => {
            const unitPrice = Number(item?.product?.price ?? item?.price ?? 0)
            const quantity = Number(item?.quantity ?? 0)
            const subtotal = unitPrice * quantity

            return (
              <article key={item.id} className="card-lift p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <img
                    src={getProductImage(item.product?.imageUrl)}
                    alt={item.product?.name}
                    className="h-24 w-full rounded-2xl object-cover sm:w-24"
                    onError={handleImageError}
                  />
                  <div className="flex-1">
                    <h2 className="text-lg">{item.product?.name}</h2>
                    <p className="mt-1 text-sm text-[color:var(--brand-muted)]">
                      Qty {quantity}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">
                      Unit price
                    </p>
                    <p className="text-sm font-semibold">{formatUSD(unitPrice)}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">
                      Subtotal
                    </p>
                    <p className="text-lg font-semibold text-[color:var(--brand-accent)]">
                      {formatUSD(subtotal)}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <aside className="section-frame h-fit p-6">
        <p className="chip">Order Summary</p>
        <div className="mt-5 space-y-2 text-sm text-[color:var(--brand-muted)]">
          <div className="flex items-center justify-between">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[color:var(--brand-paper)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[color:var(--brand-muted)]">Total</span>
            <span className="text-2xl font-semibold text-[color:var(--brand-accent)]">
              {formatUSD(totalPrice)}
            </span>
          </div>
        </div>

        {submitError && (
          <div className="mt-4">
            <ErrorMessage message={submitError} />
          </div>
        )}

        <button
          type="button"
          onClick={handlePayNow}
          disabled={submitting}
          className="button-primary mt-5 w-full"
        >
          {submitting ? 'Processing payment...' : 'Pay now'}
        </button>

        <Link to="/cart" className="button-secondary mt-3 w-full">
          Back to cart
        </Link>
      </aside>
    </div>
  )
}
