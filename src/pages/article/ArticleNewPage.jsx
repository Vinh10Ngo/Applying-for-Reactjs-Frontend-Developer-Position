import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createArticle } from '../../api/articles'
import '../../components/layout/Layout.css'

export default function ArticleNewPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const art = await createArticle({ title, content, published })
      const id = art?.id ?? art?._id
      if (id) navigate(`/articles/${id}`, { replace: true })
      else navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Tạo bài thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Viết bài mới</h1>
      <p className="meta">Form tiêu đề, nội dung, trạng thái xuất bản.</p>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div className="form-group">
          <label>Tiêu đề</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Nội dung</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Đã xuất bản
          </label>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Tạo bài'}</button>
      </form>
    </div>
  )
}
