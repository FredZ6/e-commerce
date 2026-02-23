export const FALLBACK_IMAGE = '/product-placeholder.svg'

export const getProductImage = (imageUrl) => {
  if (typeof imageUrl !== 'string') {
    return FALLBACK_IMAGE
  }

  const trimmed = imageUrl.trim()
  return trimmed.length > 0 ? trimmed : FALLBACK_IMAGE
}

export const handleImageError = (event) => {
  event.currentTarget.src = FALLBACK_IMAGE
  event.currentTarget.onerror = null
}
