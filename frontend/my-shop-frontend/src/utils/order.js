const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const normalizeOrderItem = (item) => {
  const quantity = toNumber(item?.quantity, 0)
  const unitPrice = toNumber(item?.unitPrice ?? item?.price, 0)
  const totalPrice = toNumber(item?.totalPrice, unitPrice * quantity)

  const productId = item?.product?.id ?? item?.productId ?? null
  const productName = item?.product?.name ?? item?.productName ?? 'Product'
  const productImage = item?.product?.imageUrl ?? item?.imageUrl ?? null

  return {
    id: item?.id ?? `${productId ?? 'item'}-${productName}`,
    quantity,
    price: unitPrice,
    unitPrice,
    totalPrice,
    product: {
      id: productId,
      name: productName,
      imageUrl: productImage,
    },
  }
}

export const normalizeOrder = (order) => {
  const rawItems = Array.isArray(order?.items)
    ? order.items
    : Array.isArray(order?.orderItems)
      ? order.orderItems
      : []

  const items = rawItems.map(normalizeOrderItem)
  const inferredTotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalAmount = toNumber(order?.totalAmount ?? order?.totalPrice, inferredTotal)

  return {
    ...order,
    orderNumber: order?.orderNumber ?? (order?.id ? `#${order.id}` : 'N/A'),
    shippingAddress: order?.shippingAddress ?? null,
    totalAmount,
    items,
  }
}
