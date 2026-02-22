import PropTypes from 'prop-types'
import { Fragment } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

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
    ...(isAdmin
      ? [
          { name: 'Product Management', href: '/admin/products', admin: true },
          { name: 'Order Management', href: '/admin/orders', admin: true },
        ]
      : []),
  ]

  const visibleNavigation = navigation
    .filter((item) => !item.protected || isAuthenticated)
    .filter((item) => !item.admin || isAdmin)

  const isRouteActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="border-b border-[color:var(--brand-line)] bg-[color:var(--brand-paper)]/65 py-2">
        <div className="page-shell flex items-center justify-between text-xs uppercase tracking-[0.15em] text-[color:var(--brand-muted)]">
          <span>Editor&apos;s Choice This Week</span>
          <span className="hidden sm:inline">Worldwide Shipping Available</span>
        </div>
      </div>

      <Disclosure as="nav" className="sticky top-0 z-40 border-b border-[color:var(--brand-line)] bg-white/80 backdrop-blur">
        {({ open }) => (
          <>
            <div className="page-shell">
              <div className="flex h-20 items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                  <Link to="/" className="flex items-center gap-3">
                    <img className="h-10 w-auto" src="/logo.svg" alt="E-Shop" />
                    <div>
                      <p className="text-xl font-semibold leading-none">E-Shop</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--brand-muted)]">
                        Curated Market
                      </p>
                    </div>
                  </Link>

                  <div className="hidden items-center gap-2 md:flex">
                    {visibleNavigation.map((item) => {
                      const active = isRouteActive(item.href)
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                            active
                              ? 'bg-[color:var(--brand-accent-soft)] text-[color:var(--brand-accent)]'
                              : 'text-[color:var(--brand-muted)] hover:bg-[color:var(--brand-paper)] hover:text-[color:var(--brand-ink)]'
                          }`}
                        >
                          {item.name}
                          {item.badge > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--brand-accent)] px-1.5 text-[10px] font-bold text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/cart"
                        className="relative rounded-full border border-[color:var(--brand-line)] bg-white p-2 text-[color:var(--brand-muted)] transition hover:border-[color:var(--brand-accent)] hover:text-[color:var(--brand-accent)]"
                      >
                        <span className="sr-only">Shopping Cart</span>
                        <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                        {totalItems > 0 && (
                          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--brand-accent)] px-1 text-[10px] font-bold text-white">
                            {totalItems}
                          </span>
                        )}
                      </Link>

                      <Menu as="div" className="relative">
                        <Menu.Button className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-line)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--brand-ink)] transition hover:border-[color:var(--brand-accent)]">
                          <UserCircleIcon className="h-5 w-5 text-[color:var(--brand-muted)]" aria-hidden="true" />
                          <span>{user.username}</span>
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-120"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-2xl border border-[color:var(--brand-line)] bg-white p-2 shadow-xl focus:outline-none">
                            <div className="rounded-xl bg-[color:var(--brand-paper)] px-3 py-2 text-sm text-[color:var(--brand-muted)]">
                              Signed in as <span className="font-semibold text-[color:var(--brand-ink)]">{user.username}</span>
                            </div>
                            {isAdmin && (
                              <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--brand-accent)]">
                                Admin account
                              </div>
                            )}
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={`mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                                    active ? 'bg-[#fff1f1] text-[color:var(--brand-danger)]' : 'text-[color:var(--brand-muted)]'
                                  }`}
                                >
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link to="/login" className="button-secondary">
                        Sign in
                      </Link>
                      <Link to="/register" className="button-primary">
                        Join now
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                  {isAuthenticated && (
                    <Link
                      to="/cart"
                      className="relative rounded-full border border-[color:var(--brand-line)] bg-white p-2 text-[color:var(--brand-muted)]"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      {totalItems > 0 && (
                        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--brand-accent)] px-1 text-[10px] font-bold text-white">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  )}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-full border border-[color:var(--brand-line)] bg-white p-2 text-[color:var(--brand-muted)] transition hover:text-[color:var(--brand-accent)]">
                    <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                    {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="border-t border-[color:var(--brand-line)] bg-white/95 md:hidden">
              <div className="page-shell space-y-2 py-4">
                {visibleNavigation.map((item) => {
                  const active = isRouteActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold ${
                        active
                          ? 'bg-[color:var(--brand-accent-soft)] text-[color:var(--brand-accent)]'
                          : 'bg-[color:var(--brand-paper)] text-[color:var(--brand-muted)]'
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.badge > 0 && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--brand-accent)] px-1 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}

                {isAuthenticated ? (
                  <button onClick={handleLogout} className="button-danger mt-1 w-full">
                    Sign out
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link to="/login" className="button-secondary w-full">
                      Sign in
                    </Link>
                    <Link to="/register" className="button-primary w-full">
                      Join now
                    </Link>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="pb-14 pt-8 sm:pt-10">
        <div className="page-shell">{children}</div>
      </main>

      <footer className="border-t border-[color:var(--brand-line)] bg-white/70">
        <div className="page-shell flex flex-col gap-3 py-8 text-sm text-[color:var(--brand-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 E-Shop. Curated for intentional shopping.</p>
          <p>Built with modern commerce workflows and clean inventory operations.</p>
        </div>
      </footer>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
