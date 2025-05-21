import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { Fragment } from 'react'

export default function MainLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()

  const isAdmin = user?.roles?.includes('ROLE_ADMIN')

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Cart', href: '/cart', protected: true, badge: totalItems },
    { name: 'Orders', href: '/orders', protected: true },
    // Admin menu
    ...(isAdmin ? [
      { name: 'Product Management', href: '/admin/products', admin: true },
    ] : [])
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Disclosure as="nav" className="bg-white border-b border-gray-100">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex items-center flex-shrink-0">
                    <img
                      className="h-8 w-auto"
                      src="/logo.svg"
                      alt="E-Shop"
                    />
                    <span className="ml-2 text-lg font-medium text-gray-900">E-Shop</span>
                  </Link>
                  <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                    {navigation
                      .filter(item => !item.protected || isAuthenticated)
                      .filter(item => !item.admin || isAdmin)
                      .map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`inline-flex items-center h-16 px-1 pt-1 text-sm font-medium ${
                            location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                              ? 'border-b-2 border-blue-500 text-gray-900'
                              : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                          }`}
                        >
                          {item.name}
                          {item.badge > 0 && (
                            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                  </div>
                </div>
                
                <div className="hidden sm:flex sm:items-center sm:ml-6">
                  {isAuthenticated ? (
                    <Menu as="div" className="relative ml-3">
                      <div className="flex items-center">
                        {totalItems > 0 && (
                          <Link to="/cart" className="relative p-1 mr-3 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100">
                            <span className="sr-only">Shopping Cart</span>
                            <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 text-xs font-bold text-white">
                              {totalItems}
                            </span>
                          </Link>
                        )}
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                            <p>Welcome, {user.username}</p>
                            {isAdmin && (
                              <span className="inline-block mt-1 text-xs bg-red-100 text-red-800 rounded-full px-2 py-0.5">
                                Admin
                              </span>
                            )}
                          </div>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#profile"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link
                        to="/login"
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center sm:hidden">
                  {isAuthenticated && (
                    <Link to="/cart" className="relative p-1 mr-2 rounded-full text-gray-500 hover:text-gray-600">
                      <ShoppingCartIcon className="h-6 w-6" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 text-xs font-bold text-white">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  )}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                    <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {navigation
                  .filter(item => !item.protected || isAuthenticated)
                  .filter(item => !item.admin || isAdmin)
                  .map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                        location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      {item.name}
                      {item.badge > 0 && (
                        <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
              </div>
              
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-4">
                    <div>
                      <div className="text-base font-medium text-gray-800">{user.username}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as="a"
                      href="#profile"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 py-4 px-4 flex space-x-3">
                  <Link
                    to="/login"
                    className="flex-1 px-3 py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-500 border border-gray-200 rounded-md"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 px-3 py-2 text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2023 E-Shop, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
} 