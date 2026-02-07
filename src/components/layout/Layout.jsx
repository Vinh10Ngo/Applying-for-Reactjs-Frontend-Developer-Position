import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout().then(() => navigate('/'))
  }

  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/">Trang chủ</Link>
        </div>
        <div className="nav-links">
          <Link to="/">Bài viết</Link>
          {user ? (
            <>
              <Link to="/profile">Cá nhân</Link>
              <Link to="/profile/articles">Bài của tôi</Link>
              <Link to="/articles/new">Viết bài</Link>
              {isAdmin && (
                <Link to="/admin">Admin</Link>
              )}
              <span className="nav-user">{user.email}</span>
              <button type="button" className="btn btn-outline" onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Đăng nhập</Link>
              <Link to="/register" className="nav-link nav-cta">Đăng ký</Link>
            </>
          )}
        </div>
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
