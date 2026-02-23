import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrderById } from '../../services/order'
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

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id)
        setOrder(normalizeOrder(data))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />
  if (!order) return <ErrorMessage message="Order not found" />

  return (
    <div className="space-y-6 pb-4">
      <section className="section-frame p-6 sm:p-8">
        <div className="section-header">
          <div>
            <p className="text-sm text-[color:var(--brand-muted)]">
              <Link to="/orders" className="transition hover:text-[color:var(--brand-accent)]">
                Orders
              </Link>
              <span className="mx-2">/</span>
              <span>{order.orderNumber}</span>
            </p>
            <h1 className="mt-2 section-title text-3xl">Order Detail</h1>
          </div>
          <span className={getStatusClass(order.status)}>{order.status}</span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--brand-line)] bg-white p-4">
            <dt className="label mb-1">Order number</dt>
            <dd className="text-sm font-semibold">{order.orderNumber}</dd>
          </div>
          <div className="rounded-2xl border border-[color:var(--brand-line)] bg-white p-4">
            <dt className="label mb-1">Created at</dt>
            <dd className="text-sm font-semibold">{new Date(order.createdAt).toLocaleString()}</dd>
          </div>
          <div className="rounded-2xl border border-[color:var(--brand-line)] bg-white p-4 sm:col-span-2">
            <dt className="label mb-1">Shipping address</dt>
            <dd className="text-sm font-semibold">{order.shippingAddress || 'Not provided'}</dd>
          </div>
        </dl>
      </section>

      <section className="section-frame p-6 sm:p-8">
        <h2 className="text-2xl">Order Items</h2>

        <div className="mt-5 space-y-4">
          {order.items.map((item) => (
            <article key={item.id} className="card-lift p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={getProductImage(item.product?.imageUrl)}
                  alt={item.product.name}
                  className="h-20 w-full rounded-2xl object-cover sm:w-20"
                  onError={handleImageError}
                />
                <div className="flex-1">
                  <h3 className="text-lg">{item.product.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">Qty {item.quantity}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">Unit price</p>
                  <p className="text-sm font-semibold">{formatUSD(item.price)}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">Subtotal</p>
                  <p className="text-lg font-semibold text-[color:var(--brand-accent)]">
                    {formatUSD(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-[color:var(--brand-paper)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">Order total</span>
            <span className="text-3xl font-semibold text-[color:var(--brand-accent)]">{formatUSD(order.totalAmount)}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
