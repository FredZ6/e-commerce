import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../services/auth'
import { authStyles as styles } from '../../styles/Auth.styles'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // 验证密码强度
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).*$/
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one letter and one number')
      return
    }

    try {
      setLoading(true)
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      })
      // 注册成功后跳转到登录页
      navigate('/login', { 
        state: { message: 'Registration successful, please login' }
      })
    } catch (err) {
      setError(err.message || 'Registration failed, please try again later')
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
        <h2 className={styles.title}>Create new account</h2>
        <p className={styles.subtitle}>Join us and start shopping</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorMessage}>
              <div className="text-sm">{error}</div>
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
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="email" className={styles.label}>Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className={styles.label}>First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="First name"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="lastName" className={styles.label}>Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Last name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formField}>
              <label htmlFor="phone" className={styles.label}>Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your phone number"
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
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter password (at least 6 characters, including letters and numbers)"
                disabled={loading}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
              I have read and agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
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
                Registering...
              </span>
            ) : 'Register'}
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>or</span>
            <div className={styles.dividerLine}></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
              <Link to="/login" className={styles.link}>
                Sign in now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 