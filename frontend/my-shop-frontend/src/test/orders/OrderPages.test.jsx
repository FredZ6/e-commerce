import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import Orders from '../../pages/Orders'
import OrderDetail from '../../pages/Orders/OrderDetail'

vi.mock('../../services/order', () => ({
  getOrders: vi.fn(),
  getOrderById: vi.fn(),
}))

import { getOrders, getOrderById } from '../../services/order'

const mockOrder = {
  id: 101,
  createdAt: '2026-02-22T00:00:00',
  status: 'PAID',
  totalPrice: 49.98,
  orderItems: [
    {
      id: 1,
      productName: 'Mouse',
      productImageUrl: 'https://img/mouse',
      quantity: 2,
      unitPrice: 24.99,
      totalPrice: 49.98,
    },
  ],
}

test('renders order list using orderItems fields', async () => {
  getOrders.mockResolvedValue([mockOrder])

  render(
    <MemoryRouter>
      <Orders />
    </MemoryRouter>
  )

  expect(await screen.findByText('Mouse')).toBeInTheDocument()
  expect(screen.getByText('Qty 2')).toBeInTheDocument()
  expect(screen.getAllByText('$49.98').length).toBeGreaterThan(0)
})

test('renders order detail using orderItems contract fields', async () => {
  getOrderById.mockResolvedValue(mockOrder)

  render(
    <MemoryRouter initialEntries={['/orders/101']}>
      <Routes>
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Routes>
    </MemoryRouter>
  )

  expect(await screen.findByText('Mouse')).toBeInTheDocument()
  expect(screen.getByText('Unit price')).toBeInTheDocument()
  expect(screen.getByText('Subtotal')).toBeInTheDocument()
  expect(screen.getByText('$24.99')).toBeInTheDocument()
  expect(screen.getAllByText('$49.98').length).toBeGreaterThan(0)
})
