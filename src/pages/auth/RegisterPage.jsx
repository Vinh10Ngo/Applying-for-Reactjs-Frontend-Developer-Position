import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../components/layout/Layout.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, name)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-card">
      <h1>Đăng ký</h1>
      <p className="meta">Tạo tài khoản để viết bài và quản lý nội dung.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Họ tên</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nguyễn Văn A" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={6} placeholder="Tối thiểu 6 ký tự" />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
        </div>
      </form>
      <p className="form-footer">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </div>
  )
}
