import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../services/auth'
import { useAuth } from '../../contexts/AuthContext'
import { authStyles as styles } from '../../styles/Auth.styles'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!username || !password) {
      setError('Please enter username and password')
      return
    }

    try {
      setLoading(true)
      const data = await login(username, password)
      setUser(data)

      if (data.roles && data.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/products')
      } else {
        const from = location.state?.from?.pathname || '/products'
        navigate(from)
      }
    } catch (err) {
      setError(err.message || 'Login failed, please check your username and password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <aside className={styles.heroPanel}>
        <div>
          <span className="chip">Members Edition</span>
          <h1 className={styles.heroTitle}>Sign in and continue your curated shopping journey.</h1>
          <p className={styles.heroSubtitle}>
            Access orders, saved products, and faster checkout. Your account keeps every purchase organized.
          </p>
        </div>

        <div className={styles.heroMeta}>
          <p className="font-semibold text-[color:var(--brand-ink)]">E-Shop Notes</p>
          <p className="mt-2">Use the same credentials for storefront and order tracking.</p>
        </div>
      </aside>

      <section className={styles.cardWrap}>
        <div className={styles.card}>
          <img className={styles.logo} src="/logo.svg" alt="E-Shop Logo" />
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Sign in to browse products and manage orders.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            <div className={styles.inputGroup}>
              <div className={styles.formField}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>or</span>
            </div>

            <p className="text-center text-sm text-[color:var(--brand-muted)]">
              New to E-Shop?
              <Link to="/register" className={styles.link}>
                Create account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
