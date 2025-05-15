import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../services/order'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">暂无订单</h2>
        <p className="mt-2 text-gray-500">去购物吧</p>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">我的订单</h1>
        <div className="mt-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow overflow-hidden sm:rounded-md mb-4"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    订单号：{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    下单时间：{new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex items-center">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            数量：{item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ¥{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      订单状态：{order.status}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg font-medium text-gray-900 mr-4">
                      总计：¥{order.totalAmount}
                    </p>
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                    >
                      查看详情
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 