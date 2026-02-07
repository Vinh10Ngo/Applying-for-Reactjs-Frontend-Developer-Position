import { Link } from 'react-router-dom'
import '../../components/layout/Layout.css'

export default function AdminPage() {
  return (
    <div className="admin-dashboard">
      <h1>Quản trị</h1>
      <p className="meta">Chọn chức năng quản lý bên dưới.</p>
      <div className="admin-cards">
        <Link to="/admin/users" className="admin-card">
          <span className="admin-card-icon">👥</span>
          <h2>Quản lý người dùng</h2>
          <p>Xem danh sách user, email, tên, vai trò.</p>
        </Link>
        <Link to="/admin/articles" className="admin-card">
          <span className="admin-card-icon">📝</span>
          <h2>Quản lý bài viết</h2>
          <p>Xem tất cả bài (kể cả nháp, đã xóa), sửa/xóa/khôi phục.</p>
        </Link>
      </div>
    </div>
  )
}
