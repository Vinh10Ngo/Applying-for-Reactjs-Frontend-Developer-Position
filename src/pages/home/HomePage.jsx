import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getArticles } from '../../api/articles'
import { useAuth } from '../../contexts/AuthContext'
import './HomePage.css'

const LIMIT = 10
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Ngày tạo' },
  { value: 'updatedAt', label: 'Ngày cập nhật' },
  { value: 'title', label: 'Tiêu đề' },
]
const ORDER_OPTIONS = [
  { value: 'desc', label: 'Mới nhất / Z→A' },
  { value: 'asc', label: 'Cũ nhất / A→Z' },
]

export default function HomePage() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState({ items: [], total: 0, page: 1 })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getArticles({
      publishedOnly: true,
      search,
      page: data.page,
      limit: LIMIT,
      sort,
      order,
    })
      .then((res) => {
        if (!cancelled) setData({ ...res, page: res.page || 1 })
      })
      .catch(() => { if (!cancelled) setData((d) => ({ ...d, items: [] })) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [data.page, search, sort, order])

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
      <div className="home-sort-wrap" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label>
          <span style={{ marginRight: '0.5rem' }}>Sắp xếp:</span>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setData((d) => ({ ...d, page: 1 })) }}
            aria-label="Sắp xếp theo"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span style={{ marginRight: '0.5rem' }}>Thứ tự:</span>
          <select
            value={order}
            onChange={(e) => { setOrder(e.target.value); setData((d) => ({ ...d, page: 1 })) }}
            aria-label="Thứ tự"
          >
            {ORDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
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
