import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import AdminOrders from '../../pages/Admin/Orders'

vi.mock('../../services/order', () => ({
  getAllOrdersForAdmin: vi.fn(),
  updateOrderStatus: vi.fn(),
}))

import { getAllOrdersForAdmin, updateOrderStatus } from '../../services/order'

test('admin can update order status from list', async () => {
  getAllOrdersForAdmin.mockResolvedValue([
    {
      id: 201,
      status: 'PAID',
      totalPrice: 88.88,
      orderItems: [{ id: 1, productName: 'Keyboard', quantity: 1, unitPrice: 88.88 }],
    },
  ])
  updateOrderStatus.mockResolvedValue({
    id: 201,
    status: 'SHIPPED',
    totalPrice: 88.88,
    orderItems: [{ id: 1, productName: 'Keyboard', quantity: 1, unitPrice: 88.88 }],
  })

  render(
    <MemoryRouter>
      <AdminOrders />
    </MemoryRouter>
  )

  expect(await screen.findByText('Order #201')).toBeInTheDocument()

  fireEvent.change(screen.getByLabelText('Order 201 status'), {
    target: { value: 'SHIPPED' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Update status' }))

  await waitFor(() => {
    expect(updateOrderStatus).toHaveBeenCalledWith(201, 'SHIPPED')
  })
  await waitFor(() => {
    expect(getAllOrdersForAdmin).toHaveBeenCalledTimes(2)
  })
})
