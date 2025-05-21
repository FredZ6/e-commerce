import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
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
      // 清除URL参数
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
      
      // 根据用户角色跳转到不同页面
      if (data.roles && data.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/products')
      } else {
        const from = location.state?.from?.pathname || '/products'
        navigate(from)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed, please check your username and password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          className={styles.logo}
          src="/logo.svg"
          alt="E-Shop Logo"
        />
        <h2 className={styles.title}>Sign in to your account</h2>
        <p className={styles.subtitle}>Welcome back! Please sign in to your account</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorMessage}>
              <div className="text-sm">{error}</div>
            </div>
          )}
          
          {successMessage && (
            <div className={styles.successMessage}>
              <div className="text-sm">{successMessage}</div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <div className={styles.formField}>
              <label htmlFor="username" className={styles.label}>Username</label>
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
              <label htmlFor="password" className={styles.label}>Password</label>
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

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Login'}
          </button>
          
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>or</span>
            <div className={styles.dividerLine}></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <Link to="/register" className={styles.link}>
                Sign up now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 