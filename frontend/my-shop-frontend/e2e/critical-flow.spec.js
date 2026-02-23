import { test, expect } from '@playwright/test'

const apiBase = process.env.E2E_API_URL || 'http://localhost:8080'

const adminCreds = {
  username: 'admin',
  password: 'Admin123@',
}

async function loginViaUi(page, username, password, expectedUrl) {
  await page.goto('/login')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  if (expectedUrl) {
    await expect(page).toHaveURL(expectedUrl)
  }
}

async function signOutFromMenu(page, username) {
  await page.getByRole('button', { name: username }).click()
  const signOutAction = page
    .getByRole('menuitem', { name: 'Sign out' })
    .or(page.getByRole('button', { name: 'Sign out' }))
    .first()
  await signOutAction.click()
  await expect(page).toHaveURL(/\/login$/)
}

async function createAdminToken(request) {
  const adminLoginResp = await request.post(`${apiBase}/api/users/login`, {
    data: adminCreds,
  })
  expect(adminLoginResp.ok()).toBeTruthy()

  const adminToken = (await adminLoginResp.json()).token
  expect(adminToken).toBeTruthy()
  return adminToken
}

async function createProductAsAdmin(request, token, productName) {
  const createProductResp = await request.post(`${apiBase}/api/products/add`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name: productName,
      description: 'E2E seeded product',
      price: 29.99,
      imageUrl: 'https://images.pexels.com/photos/5077064/pexels-photo-5077064.jpeg?auto=compress&cs=tinysrgb&w=640',
      stock: 12,
      details: 'Seeded by Playwright E2E',
    },
  })
  expect(createProductResp.ok()).toBeTruthy()
}

async function registerUser(request, username, password) {
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
}

async function placeOrderForProduct(page, productName) {
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

  const orderMatch = page.url().match(/\/orders\/(\d+)$/)
  expect(orderMatch).not.toBeNull()
  return Number(orderMatch?.[1])
}

test('user can register, login, add to cart, and place an order', async ({ page, request }) => {
  const suffix = Date.now()
  const username = `e2e_user_${suffix}`
  const password = 'User123@'
  const productName = `E2E Product ${suffix}`

  const adminToken = await createAdminToken(request)
  await createProductAsAdmin(request, adminToken, productName)
  await registerUser(request, username, password)
  await loginViaUi(page, username, password, /\/products$/)
  await placeOrderForProduct(page, productName)
})

test('admin can update order status and user sees updated status', async ({ page, request }) => {
  const suffix = Date.now()
  const username = `e2e_status_user_${suffix}`
  const password = 'User123@'
  const productName = `E2E Status Product ${suffix}`

  const adminToken = await createAdminToken(request)
  await createProductAsAdmin(request, adminToken, productName)
  await registerUser(request, username, password)

  await loginViaUi(page, username, password, /\/products$/)
  const orderId = await placeOrderForProduct(page, productName)

  await signOutFromMenu(page, username)

  await loginViaUi(page, adminCreds.username, adminCreds.password, /\/admin\/products$/)
  await page.goto('/admin/orders')

  const orderCard = page.locator('article', { hasText: `Order #${orderId}` }).first()
  await expect(orderCard).toBeVisible()

  await orderCard.getByLabel(`Order ${orderId} status`).selectOption('PAID')
  await orderCard.getByRole('button', { name: 'Update status' }).click()
  await expect(orderCard).toContainText('Status PAID')

  await signOutFromMenu(page, adminCreds.username)

  await loginViaUi(page, username, password, /\/products$/)
  await page.goto(`/orders/${orderId}`)
  const detailSection = page.locator('section', { has: page.getByRole('heading', { name: 'Order Detail' }) }).first()
  await expect(detailSection.locator('.status-pill')).toHaveText('PAID')
  await expect(page.getByText(productName)).toBeVisible()
})
