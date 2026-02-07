import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminArticles, deleteArticle, restoreArticle } from '../../api/articles'
import '../../components/layout/Layout.css'

const LIMIT = 10

export default function AdminArticlesPage() {
  const [data, setData] = useState({ items: [], total: 0, page: 1 })
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchArticles = (page, searchTerm) => {
    setLoading(true)
    getAdminArticles({
      page,
      limit: LIMIT,
      search: (searchTerm && String(searchTerm).trim()) || undefined,
    })
      .then((res) => setData({
        items: res?.items ?? [],
        total: res?.total ?? 0,
        page: res?.page ?? page,
        limit: res?.limit ?? LIMIT,
      }))
      .catch(() => setData((d) => ({ ...d, items: [] })))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchArticles(data.page, search)
  }, [data.page, search])

  const handleSearch = (e) => {
    e?.preventDefault()
    const q = (typeof searchInput === 'string' ? searchInput : '').trim()
    setSearch(q)
    setData((d) => ({ ...d, page: 1 }))
  }

  const handleDelete = (id, title) => {
    if (!window.confirm(`Xóa bài "${title}"?`)) return
    deleteArticle(id).then(() => fetchArticles(data.page, search)).catch((e) => alert(e?.message || 'Xóa thất bại'))
  }

  const handleRestore = (id) => {
    restoreArticle(id).then(() => fetchArticles(data.page, search)).catch((e) => alert(e?.message || 'Khôi phục thất bại'))
  }

  const totalPages = Math.ceil((data.total || 0) / LIMIT) || 1
  const items = data.items || []

  return (
    <div>
      <h1>Quản lý bài viết (Admin)</h1>
      <p className="meta">Xem tất cả bài (kể cả đã xóa), sửa/xóa bất kỳ. Nút "Khôi phục" cho bài đã soft delete.</p>

      <form className="admin-search" onSubmit={(e) => { e.preventDefault(); handleSearch(e); }}>
        <input
          type="search"
          placeholder="Tìm theo tiêu đề, nội dung..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="admin-search-input"
          aria-label="Tìm bài viết"
        />
        <button type="button" className="btn btn-primary" onClick={() => handleSearch()}>Tìm</button>
      </form>

      {loading ? (
        <p>Đang tải...</p>
      ) : items.length === 0 ? (
        <p>Chưa có bài nào.</p>
      ) : (
        <>
          <div className="card-list">
            {items.map((a) => {
              const id = a?.id ?? a?._id
              if (!id) return null
              return (
                <div key={id} className={`card-item ${a.deletedAt ? 'deleted' : ''}`}>
                  <h3><Link to={`/articles/${id}`}>{a.title}</Link></h3>
                  <div className="meta">
                    {a.authorName} · {a.published ? 'Đã xuất bản' : 'Nháp'}
                    {a.deletedAt && ` · Đã xóa ${new Date(a.deletedAt).toLocaleString('vi')}`}
                  </div>
                  <div className="actions" style={{ marginTop: '0.5rem' }}>
                    {!a.deletedAt && (
                      <>
                        <Link to={`/articles/${id}/edit`} className="btn btn-outline">Sửa</Link>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(id, a.title)}>Xóa</button>
                      </>
                    )}
                    {a.deletedAt && (
                      <button type="button" className="btn btn-primary" onClick={() => handleRestore(id)}>Khôi phục</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {totalPages > 1 && (
            <div className="pagination admin-pagination">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setData((d) => ({ ...d, page: d.page - 1 }))}
              >
                Trước
              </button>
              <span className="page-info">Trang {data.page} / {totalPages} ({data.total} bài)</span>
              <button
                type="button"
                disabled={data.page >= totalPages}
                onClick={() => setData((d) => ({ ...d, page: d.page + 1 }))}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
