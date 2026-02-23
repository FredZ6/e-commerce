import { useEffect, useState } from 'react'
import { getAllProducts, deleteProduct } from '../../../services/product'
import { useToast } from '../../../components/common/Toast'
import { useConfirm } from '../../../components/common/ConfirmDialog'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import ErrorMessage from '../../../components/common/ErrorMessage'
import ProductForm from './ProductForm'
import { getProductImage, handleImageError } from '../../../utils/image'
import { formatUSD } from '../../../utils/currency'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const showToast = useToast()
  const confirm = useConfirm()

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleEdit = (product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = async (productId) => {
    const confirmed = await confirm({
      title: 'Delete product',
      message: 'This action cannot be undone. Continue?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })

    if (!confirmed) return

    try {
      await deleteProduct(productId)
      showToast('Product deleted', 'success')
      fetchProducts()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    fetchProducts()
    showToast(editingProduct ? 'Product updated' : 'Product added', 'success')
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />

  return (
    <section className="section-frame p-6 sm:p-8">
      <div className="section-header">
        <div>
          <span className="chip">Admin Console</span>
          <h1 className="mt-3 section-title">Product Management</h1>
          <p className="section-subtitle mt-2">Create, update, and retire products from the storefront catalog.</p>
        </div>
        <button type="button" onClick={() => setIsFormOpen(true)} className="button-primary">
          Add product
        </button>
      </div>

      <div className="table-shell thin-scrollbar mt-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-[color:var(--brand-line)] bg-[color:var(--brand-paper)]">
            <tr className="text-xs uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[color:var(--brand-line)]/60 last:border-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="h-12 w-12 rounded-xl object-cover"
                      src={getProductImage(product.imageUrl)}
                      alt={product.name}
                      onError={handleImageError}
                    />
                    <div>
                      <p className="font-semibold text-[color:var(--brand-ink)]">{product.name}</p>
                      <p className="mt-1 max-w-md text-sm text-[color:var(--brand-muted)]">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-[color:var(--brand-accent)]">
                  {formatUSD(product.price)}
                </td>
                <td className="px-4 py-4 text-sm font-semibold">{product.stock}</td>
                <td className="px-4 py-4">
                  <span className={product.stock > 0 ? 'status-pill status-pill-success' : 'status-pill status-pill-danger'}>
                    {product.stock > 0 ? 'In stock' : 'Out of stock'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => handleEdit(product)} className="button-secondary py-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="button-danger py-2">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && <ProductForm product={editingProduct} onClose={handleFormClose} onSuccess={handleFormSuccess} />}
    </section>
  )
}
