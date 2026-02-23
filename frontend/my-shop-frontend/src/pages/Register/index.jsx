import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

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
        phone: formData.phone,
      })

      navigate('/login', {
        state: { message: 'Registration successful, please login' },
      })
    } catch (err) {
      setError(err.message || 'Registration failed, please try again later')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <aside className={styles.heroPanel}>
        <div>
          <span className="chip">New Member</span>
          <h1 className={styles.heroTitle}>Create an account and unlock faster checkout.</h1>
          <p className={styles.heroSubtitle}>
            Keep your purchases, shipping details, and favorite finds in one secure account.
          </p>
        </div>

        <div className={styles.heroMeta}>
          <p className="font-semibold text-[color:var(--brand-ink)]">Membership Benefits</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Order history timeline</li>
            <li>Quick re-order for essentials</li>
            <li>Exclusive seasonal releases</li>
          </ul>
        </div>
      </aside>

      <section className={styles.cardWrap}>
        <div className={styles.card}>
          <img className={styles.logo} src="/logo.svg" alt="E-Shop Logo" />
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>Complete the form below to join the store.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

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
                  value={formData.username}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Choose a username"
                  disabled={loading}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="email" className={styles.label}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={styles.label}>
                    First name
                  </label>
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
                  <label htmlFor="lastName" className={styles.label}>
                    Last name
                  </label>
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
                <label htmlFor="phone" className={styles.label}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Optional"
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
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Include letters and numbers"
                  disabled={loading}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Repeat your password"
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>or</span>
            </div>

            <p className="text-center text-sm text-[color:var(--brand-muted)]">
              Already registered?
              <Link to="/login" className={styles.link}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
