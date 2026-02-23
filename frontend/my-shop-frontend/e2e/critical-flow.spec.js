import { test, expect } from '@playwright/test'

const apiBase = process.env.E2E_API_URL || 'http://localhost:8080'

test('user can register, login, add to cart, and place an order', async ({ page, request }) => {
  const suffix = Date.now()
  const username = `e2e_user_${suffix}`
  const password = 'User123@'
  const productName = `E2E Product ${suffix}`

  const adminLoginResp = await request.post(`${apiBase}/api/users/login`, {
    data: {
      username: 'admin',
      password: 'Admin123@',
    },
  })
  expect(adminLoginResp.ok()).toBeTruthy()
  const adminToken = (await adminLoginResp.json()).token
  expect(adminToken).toBeTruthy()

  const createProductResp = await request.post(`${apiBase}/api/products/add`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    data: {
      name: productName,
      description: 'E2E seeded product',
      price: 29.99,
      imageUrl: 'https://picsum.photos/seed/e2e/640/480',
      stock: 12,
      details: 'Seeded by Playwright E2E',
    },
  })
  expect(createProductResp.ok()).toBeTruthy()

  const registerResp = await request.post(`${apiBase}/api/users/register`, {
    data: {
      username,
      email: `${username}@example.com`,
      password,
      confirmPassword: password,
      role: 'USER',
    },
  })
  expect(registerResp.ok()).toBeTruthy()

  await page.goto('/login')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL(/\/products$/)
  const productCard = page.locator('article', { hasText: productName }).first()
  await expect(productCard).toBeVisible()
  await productCard.getByRole('button', { name: 'Add to cart' }).click()

  await page.goto('/cart')
  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible()
  await expect(page.getByText(productName)).toBeVisible()

  await page.getByRole('button', { name: 'Proceed to checkout' }).click()
  await expect(page).toHaveURL(/\/orders\/\d+$/)
  await expect(page.getByText(productName)).toBeVisible()
})
