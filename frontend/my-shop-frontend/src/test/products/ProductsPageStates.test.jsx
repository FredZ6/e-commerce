import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Products from '../../pages/Products'

vi.mock('../../services/product', () => ({
  getAllProducts: vi.fn(),
}))

vi.mock('../../services/cart', () => ({
  addToCart: vi.fn(),
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}))

vi.mock('../../contexts/CartContext', () => ({
  useCart: () => ({ refreshCart: vi.fn() }),
}))

vi.mock('../../components/common/Toast', () => ({
  useToast: () => vi.fn(),
}))

import { getAllProducts } from '../../services/product'

const productFixture = {
  id: 1,
  name: 'Wireless Mouse',
  description: 'Smooth and responsive',
  price: 19.99,
  imageUrl: '/demo-products/wireless-mouse.jpg',
}

test('shows retry action on load failure and recovers after retry', async () => {
  getAllProducts.mockRejectedValueOnce({ message: 'Catalog unavailable' }).mockResolvedValueOnce([productFixture])

  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  )

  expect(await screen.findByText('Catalog unavailable')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: /Try again/i }))

  expect(await screen.findByText('Wireless Mouse')).toBeInTheDocument()
})
