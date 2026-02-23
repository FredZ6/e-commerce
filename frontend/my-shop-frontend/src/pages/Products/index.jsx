import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProducts } from '../../services/product'
import { addToCart } from '../../services/cart'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getProductImage, handleImageError } from '../../utils/image'
import { formatUSD } from '../../utils/currency'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useToast } from '../../components/common/Toast'

export default function Products() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refreshCart } = useCart()
  const showToast = useToast()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [pendingAction, setPendingAction] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    const filtered = products.filter((product) => {
      if (!normalized) return true
      return (
        product.name?.toLowerCase().includes(normalized) ||
        product.description?.toLowerCase().includes(normalized)
      )
    })

    if (sortBy === 'price-low') {
      return [...filtered].sort((a, b) => Number(a.price) - Number(b.price))
    }

    if (sortBy === 'price-high') {
      return [...filtered].sort((a, b) => Number(b.price) - Number(a.price))
    }

    return filtered
  }, [products, query, sortBy])

  const runCartAction = async (productId, buyNow = false) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/products' } } })
      return
    }

    try {
      setPendingAction({ productId, type: buyNow ? 'buy' : 'cart' })
      await addToCart(productId, 1)
      await refreshCart()

      if (buyNow) {
        showToast('Item added. Redirecting to checkout.', 'success')
        navigate('/checkout')
        return
      }

      showToast('Added to cart successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Unable to update cart', 'error')
    } finally {
      setPendingAction(null)
    }
  }

  const isPendingForProduct = (productId) => pendingAction?.productId === productId
  const isPendingAction = (productId, type) =>
    pendingAction?.productId === productId && pendingAction?.type === type
  const openProductDetail = (productId) => navigate(`/products/${productId}`)

  if (loading) return <LoadingSpinner fullScreen />
  if (error) {
    return (
      <section className="space-y-4">
        <ErrorMessage message={error} />
        <button
          type="button"
          onClick={fetchProducts}
          className="button-secondary px-6"
        >
          Try again
        </button>
      </section>
    )
  }

  return (
    <div className="space-y-6 pb-4">
      <section className="section-frame overflow-hidden p-6 sm:p-8">
        <div className="section-header">
          <div>
            <span className="chip">Product Library</span>
            <h1 className="mt-3 section-title">Curated Goods</h1>
            <p className="section-subtitle mt-2 max-w-2xl">
              Hand-picked essentials for work, living, and travel. Each item is selected for function and aesthetic.
            </p>
          </div>
          <p className="rounded-full bg-[color:var(--brand-paper)] px-4 py-2 text-sm font-semibold text-[color:var(--brand-muted)]">
            {visibleProducts.length} items
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="label">Search products</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or description"
              className="input-shell"
            />
          </label>

          <label className="block sm:min-w-56">
            <span className="label">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-shell"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product, index) => (
          <article
            key={product.id}
            className="card-lift cursor-pointer overflow-hidden p-0"
            style={{ animationDelay: `${index * 0.03}s` }}
            onClick={() => openProductDetail(product.id)}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openProductDetail(product.id)
              }
            }}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={getProductImage(product.imageUrl)}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
                loading="lazy"
                onError={handleImageError}
              />
              <span className="absolute left-3 top-3 chip bg-white/85">ID {product.id}</span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl leading-tight">{product.name}</h2>
                <p className="whitespace-nowrap text-lg font-semibold text-[color:var(--brand-accent)]">
                  {formatUSD(product.price)}
                </p>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[color:var(--brand-muted)]">
                {product.description}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="button-secondary w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    runCartAction(product.id, false)
                  }}
                  disabled={isPendingForProduct(product.id)}
                >
                  {isPendingAction(product.id, 'cart') ? 'Adding...' : 'Add to cart'}
                </button>
                <button
                  type="button"
                  className="button-primary w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    runCartAction(product.id, true)
                  }}
                  disabled={isPendingForProduct(product.id)}
                >
                  {isPendingAction(product.id, 'buy') ? 'Redirecting...' : 'Buy now'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {visibleProducts.length === 0 && (
        <section className="section-frame p-8 text-center">
          <h2 className="text-2xl">No products found</h2>
          <p className="mt-2 text-sm text-[color:var(--brand-muted)]">Try a different keyword or clear your filters.</p>
        </section>
      )}
    </div>
  )
}
