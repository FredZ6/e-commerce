import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderById } from '../../services/order'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id)
        setOrder(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!order) return <ErrorMessage message="订单不存在" />

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            订单详情
          </h1>
        </div>

        <div className="mt-10 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">订单编号</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {order.orderNumber}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">下单时间</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(order.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">订单状态</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {order.status}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">收货地址</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {order.shippingAddress}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-medium text-gray-900">订单商品</h2>
          <div className="mt-4 space-y-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="border-t border-gray-200 py-6 flex items-center"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-20 w-20 object-cover rounded"
                />
                <div className="ml-6 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    单价：¥{item.price}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    数量：{item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  小计：¥{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <div className="flex justify-end text-base font-medium text-gray-900">
            <p>订单总计</p>
            <p className="ml-4">¥{order.totalAmount}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 