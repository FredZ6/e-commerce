import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../services/order'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getProductImage, handleImageError } from '../../utils/image'
import { formatUSD } from '../../utils/currency'
import { normalizeOrder } from '../../utils/order'

const getStatusClass = (status) => {
  if (!status) return 'status-pill status-pill-warn'

  const value = status.toUpperCase()
  if (value.includes('DELIVER') || value.includes('PAID') || value.includes('COMPLET')) {
    return 'status-pill status-pill-success'
  }
  if (value.includes('CANCEL') || value.includes('FAIL')) {
    return 'status-pill status-pill-danger'
  }
  return 'status-pill status-pill-warn'
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(Array.isArray(data) ? data.map(normalizeOrder) : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />

  if (orders.length === 0) {
    return (
      <section className="section-frame p-10 text-center">
        <h1 className="text-3xl">No orders yet</h1>
        <p className="mt-3 text-sm text-[color:var(--brand-muted)]">Your completed checkouts will appear here.</p>
        <Link to="/products" className="button-primary mt-6">
          Start shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="section-frame p-6 sm:p-8">
      <div className="section-header">
        <div>
          <h1 className="section-title">My Orders</h1>
          <p className="section-subtitle mt-2">Track purchases, delivery status, and totals in one timeline.</p>
        </div>
        <span className="chip">{orders.length} records</span>
      </div>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="card-lift">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">Order number</p>
                <h2 className="mt-1 text-xl">{order.orderNumber}</h2>
              </div>
              <div className="text-right">
                <span className={getStatusClass(order.status)}>{order.status}</span>
                <p className="mt-2 text-xs text-[color:var(--brand-muted)]">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t border-[color:var(--brand-line)] pt-4">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getProductImage(item.product?.imageUrl)}
                      alt={item.product.name}
                      className="h-12 w-12 rounded-xl object-cover"
                      onError={handleImageError}
                    />
                    <div>
                      <p className="text-sm font-semibold">{item.product.name}</p>
                      <p className="text-xs text-[color:var(--brand-muted)]">Qty {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{formatUSD(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--brand-line)] pt-4">
              <p className="text-sm text-[color:var(--brand-muted)]">Total</p>
              <div className="flex items-center gap-3">
                <p className="text-xl font-semibold text-[color:var(--brand-accent)]">{formatUSD(order.totalAmount)}</p>
                <Link to={`/orders/${order.id}`} className="button-secondary py-2">
                  View detail
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
