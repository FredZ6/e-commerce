import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../../pages/Home'

test('featured collection images should not rely on external hosts', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const collectionNames = ['Desk Essentials', 'Living Upgrades', 'Travel Kits']

  collectionNames.forEach((name) => {
    const image = screen.getByAltText(name)
    expect(image).toBeInTheDocument()
    expect(image.getAttribute('src')).not.toMatch(/images\.unsplash\.com|images\.pexels\.com/)
    expect(image.getAttribute('src')).toMatch(/^\/featured-collections\/.+\.jpg$/)
  })
})
