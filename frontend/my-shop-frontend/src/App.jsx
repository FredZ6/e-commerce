import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import ProductDetail from './pages/Products/ProductDetail'
import { CartProvider } from './contexts/CartContext'
import OrderDetail from './pages/Orders/OrderDetail'
import { ToastProvider } from './components/common/Toast'
import { ConfirmProvider } from './components/common/ConfirmDialog'
import AdminProducts from './pages/Admin/Products'
import Checkout from './pages/Checkout'
import AdminOrders from './pages/Admin/Orders'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <MainLayout>
                      <Products />
                    </MainLayout>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <MainLayout>
                      <ProductDetail />
                    </MainLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <MainLayout>
                        <Cart />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <MainLayout>
                        <Checkout />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <MainLayout>
                        <Orders />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <PrivateRoute>
                      <MainLayout>
                        <OrderDetail />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <PrivateRoute requiredRole="ADMIN">
                      <MainLayout>
                        <AdminProducts />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <PrivateRoute requiredRole="ADMIN">
                      <MainLayout>
                        <AdminOrders />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Router>
          </CartProvider>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
