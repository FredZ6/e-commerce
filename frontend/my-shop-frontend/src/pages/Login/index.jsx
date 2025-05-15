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
      setError('请输入用户名和密码')
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
      setError(err.message || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div>
          <img
            className={styles.logo}
            src="/logo.png"
            alt="Logo"
          />
          <h2 className={styles.title}>
            登录账户
          </h2>
          <p className={styles.subtitle}>
            欢迎回来！请登录您的账户
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorMessage}>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          {successMessage && (
            <div className={styles.successMessage}>
              <div className="text-sm text-green-700">{successMessage}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="请输入密码"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`${styles.button} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>

          <div className="flex items-center justify-center mt-6">
            <div className="text-sm">
              还没有账户？
              <Link to="/register" className={styles.link}>
                立即注册
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 