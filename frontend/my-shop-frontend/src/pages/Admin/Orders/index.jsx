import { useEffect, useState } from 'react'
import { getAllOrdersForAdmin, updateOrderStatus } from '../../../services/order'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import { formatUSD } from '../../../utils/currency'

const STATUS_OPTIONS = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [statusDrafts, setStatusDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState(null)
  const [error, setError] = useState(null)

  const loadOrders = async () => {
    setError(null)
    const data = await getAllOrdersForAdmin()
    setOrders(data)
    setStatusDrafts(
      data.reduce((acc, order) => {
        acc[order.id] = order.status
        return acc
      }, {})
    )
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await loadOrders()
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId) => {
    setSubmittingId(orderId)
    setError(null)
    try {
      await updateOrderStatus(orderId, statusDrafts[orderId])
      await loadOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmittingId(null)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />

  return (
    <section className="section-frame p-6 sm:p-8">
      <div className="section-header">
        <div>
          <span className="chip">Admin Console</span>
          <h1 className="mt-3 section-title">Order Management</h1>
          <p className="section-subtitle mt-2">
            Update fulfillment status and monitor all customer orders.
          </p>
        </div>
        <span className="chip">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-[color:var(--brand-muted)]">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="card-lift">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl">Order #{order.id}</h2>
                  <p className="mt-1 text-sm text-[color:var(--brand-muted)]">
                    Total {formatUSD(order.totalAmount ?? order.totalPrice)} | Status {order.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor={`status-${order.id}`} className="sr-only">
                    Order {order.id} status
                  </label>
                  <select
                    id={`status-${order.id}`}
                    aria-label={`Order ${order.id} status`}
                    value={statusDrafts[order.id] || order.status}
                    onChange={(e) =>
                      setStatusDrafts((prev) => ({
                        ...prev,
                        [order.id]: e.target.value,
                      }))
                    }
                    className="input-shell py-2"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(order.id)}
                    disabled={submittingId === order.id}
                    className="button-primary py-2"
                  >
                    {submittingId === order.id ? 'Updating...' : 'Update status'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
