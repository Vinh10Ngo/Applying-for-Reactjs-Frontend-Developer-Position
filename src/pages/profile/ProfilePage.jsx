import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { mockApi } from '../../api/mock'
import '../../components/layout/Layout.css'

const useMock = !import.meta.env.VITE_API_URL

export default function ProfilePage() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)
    try {
      if (useMock) {
        await mockApi.changePassword(user?.id ?? user?._id, currentPassword, newPassword)
      } else {
        const { request } = await import('../../api/client')
        await request('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) })
      }
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công.' })
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Đổi mật khẩu thất bại.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Trang cá nhân / Profile</h1>
      <p className="meta">Hiển thị email, thông tin "tôi".</p>
      <div className="card-item" style={{ marginBottom: '1.5rem' }}>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Tên:</strong> {user?.name}</p>
        <p><strong>Vai trò:</strong> {user?.role === 'admin' ? 'Admin' : 'User'}</p>
      </div>

      <h2>Đổi mật khẩu</h2>
      <p className="meta">Form mật khẩu hiện tại + mật khẩu mới.</p>
      <form onSubmit={handleChangePassword} style={{ maxWidth: 400 }}>
        <div className="form-group">
          <label>Mật khẩu hiện tại</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
        </div>
        {message.text && <p className={message.type === 'success' ? 'success-msg' : 'error-msg'}>{message.text}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</button>
      </form>
    </div>
  )
}
