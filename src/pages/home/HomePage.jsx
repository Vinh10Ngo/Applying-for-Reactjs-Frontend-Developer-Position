import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getArticles } from '../../api/articles'
import { useAuth } from '../../contexts/AuthContext'
import './HomePage.css'

const LIMIT = 10

export default function HomePage() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState({ items: [], total: 0, page: 1 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getArticles({ publishedOnly: true, search, page: data.page, limit: LIMIT })
      .then((res) => {
        if (!cancelled) setData({ ...res, page: res.page || 1 })
      })
      .catch(() => { if (!cancelled) setData((d) => ({ ...d, items: [] })) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [data.page, search])

  const totalPages = Math.ceil((data.total || 0) / LIMIT) || 1

  return (
    <div className="home">
      <header className="home-hero">
        <h1>Bài viết mới nhất</h1>
        <p>Tìm đọc và khám phá các bài viết đã xuất bản</p>
        {isAdmin && (
          <Link to="/admin" className="home-admin-link">Quản trị →</Link>
        )}
      </header>

      <div className="home-search-wrap">
        <input
          type="search"
          className="home-search"
          placeholder="Tìm bài viết theo tiêu đề, nội dung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Tìm kiếm bài viết"
        />
      </div>

      {loading ? (
        <p className="home-loading">Đang tải...</p>
      ) : data.items.length === 0 ? (
        <div className="home-empty">
          <p>Chưa có bài viết nào.</p>
          <p className="home-empty-hint">
            <Link to="/articles/new">Viết bài mới</Link> và bật &quot;Đã xuất bản&quot; để bài hiện ở đây.
          </p>
        </div>
      ) : (
        <>
          <div className="home-list">
            {data.items.map((a) => {
              const id = a?.id ?? a?._id
              if (!id) return null
              return (
              <Link key={id} to={`/articles/${id}`} className="home-card">
                <h2>{a.title}</h2>
                <div className="home-meta">
                  <span>{a.authorName}</span>
                  {' · '}
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString('vi-VN') : ''}
                </div>
                <p className="home-excerpt">
                  {(a.content || '').trim().slice(0, 140) || 'Không có nội dung tóm tắt.'}
                  {(a.content || '').length > 140 ? '…' : ''}
                </p>
              </Link>
              )
            })}
          </div>
          <div className="home-pagination">
            <button
              type="button"
              disabled={data.page <= 1}
              onClick={() => setData((d) => ({ ...d, page: d.page - 1 }))}
            >
              Trước
            </button>
            <span className="page-info">Trang {data.page} / {totalPages}</span>
            <button
              type="button"
              disabled={data.page >= totalPages}
              onClick={() => setData((d) => ({ ...d, page: d.page + 1 }))}
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  )
}
