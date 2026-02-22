import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import PrivateRoute from '../../components/PrivateRoute'

test('redirects unauthenticated user to login', async () => {
  localStorage.clear()

  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <div>Orders Page</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )

  expect(await screen.findByText('Login Page')).toBeInTheDocument()
})

function RolesProbe() {
  const { roles } = useAuth()
  return <div>{(roles || []).join(',')}</div>
}

test('exposes roles from persisted auth state', async () => {
  localStorage.setItem('token', 'test-token')
  localStorage.setItem('user', JSON.stringify({ roles: ['ROLE_ADMIN'] }))

  render(
    <AuthProvider>
      <RolesProbe />
    </AuthProvider>
  )

  expect(await screen.findByText('ROLE_ADMIN')).toBeInTheDocument()
})
