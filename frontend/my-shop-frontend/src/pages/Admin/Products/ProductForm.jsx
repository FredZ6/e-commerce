import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Dialog, Transition } from '@headlessui/react'
import { addProduct, updateProduct } from '../../../services/product'

export default function ProductForm({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    imageUrl: product?.imageUrl || '',
    details: product?.details || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (product) {
        await updateProduct(product.id, formData)
      } else {
        await addProduct(formData)
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Transition.Root show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#1f2a40]/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-3 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-3 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl rounded-3xl border border-[color:var(--brand-line)] bg-[color:var(--brand-surface)] p-6 shadow-2xl sm:p-8">
                <Dialog.Title as="h3" className="text-3xl">
                  {product ? 'Edit product' : 'Add product'}
                </Dialog.Title>
                <p className="mt-2 text-sm text-[color:var(--brand-muted)]">
                  Fill in clear product details so storefront content remains consistent.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && <div className="rounded-2xl border border-[#f2cccc] bg-[#fff3f3] px-4 py-3 text-sm text-[color:var(--brand-danger)]">{error}</div>}

                  <div>
                    <label className="label">Product name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-shell"
                    />
                  </div>

                  <div>
                    <label className="label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="input-shell"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="input-shell"
                      />
                    </div>

                    <div>
                      <label className="label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="input-shell"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      required
                      className="input-shell"
                    />
                  </div>

                  <div>
                    <label className="label">Detail notes</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows={4}
                      className="input-shell"
                    />
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} className="button-secondary">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="button-primary">
                      {submitting ? 'Saving...' : product ? 'Update product' : 'Create product'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

ProductForm.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    imageUrl: PropTypes.string,
    details: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}
