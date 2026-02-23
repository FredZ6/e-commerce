import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../../services/product'
import { addToCart } from '../../services/cart'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { useToast } from '../../components/common/Toast'
import { getProductImage, handleImageError } from '../../utils/image'
import { formatUSD } from '../../utils/currency'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refreshCart } = useCart()
  const showToast = useToast()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } })
      return
    }

    try {
      setAddingToCart(true)
      await addToCart(product.id, quantity)
      await refreshCart()
      showToast('Added to cart successfully', 'success')
    } catch (err) {
      setError(err.message)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />
  if (!product) return <ErrorMessage message="Product not found" />

  return (
    <div className="space-y-6 pb-4">
      <section className="section-frame p-6 sm:p-8">
        <div className="text-sm text-[color:var(--brand-muted)]">
          <Link to="/products" className="transition hover:text-[color:var(--brand-accent)]">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-[color:var(--brand-line)] bg-white">
            <img
              src={getProductImage(product.imageUrl)}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          </div>

          <div>
            <span className="chip">Featured Item</span>
            <h1 className="mt-4 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-[color:var(--brand-muted)]">{product.description}</p>

            <div className="mt-6 rounded-2xl border border-[color:var(--brand-line)] bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--brand-muted)]">Price</span>
                <span className="text-3xl font-semibold text-[color:var(--brand-accent)]">{formatUSD(product.price)}</span>
              </div>

              <div className="mt-5">
                <label htmlFor="quantity" className="label">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input-shell"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="button-primary mt-6 w-full"
              >
                {addingToCart ? 'Adding...' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {product.details && (
        <section className="section-frame p-6 sm:p-8">
          <h2 className="section-title text-2xl">Product Notes</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[color:var(--brand-muted)]">{product.details}</p>
        </section>
      )}
    </div>
  )
}
