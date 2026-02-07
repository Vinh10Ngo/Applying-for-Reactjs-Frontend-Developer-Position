import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyArticles, deleteArticle } from '../../api/articles'
import '../../components/layout/Layout.css'

export default function ProfileArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getMyArticles()
      .then((list) => setArticles(Array.isArray(list) ? list : list?.items || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = (id, title) => {
    if (!window.confirm(`Xóa bài "${title}"? (soft delete)`)) return
    deleteArticle(id).then(() => load()).catch((e) => alert(e?.message || 'Xóa thất bại'))
  }

  return (
    <div>
      <h1>Bài viết của tôi</h1>
      <p className="meta">Danh sách bài do mình tạo, có thể sửa/xóa.</p>
      <p>
        <Link to="/articles/new" className="btn btn-primary">+ Viết bài mới</Link>
      </p>
      {loading ? (
        <p>Đang tải...</p>
      ) : articles.length === 0 ? (
        <p className="profile-empty">Bạn chưa tạo bài nào. Nhấn <Link to="/articles/new">Viết bài mới</Link> hoặc nút cam bên trên để bắt đầu.</p>
      ) : (
        <div className="card-list">
          {articles.map((a) => {
            const id = a?.id ?? a?._id
            if (!id) return null
            return (
            <div key={id} className="card-item">
              <h3><Link to={`/articles/${id}`}>{a.title}</Link></h3>
              <div className="meta">{a.published ? 'Đã xuất bản' : 'Nháp'} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString('vi') : ''}</div>
              <div className="actions" style={{ marginTop: '0.5rem' }}>
                <Link to={`/articles/${id}/edit`} className="btn btn-outline">Sửa</Link>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(id, a.title)}>Xóa</button>
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
