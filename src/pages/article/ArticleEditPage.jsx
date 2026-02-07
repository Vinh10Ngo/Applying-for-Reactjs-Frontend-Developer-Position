import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getArticleById, updateArticle } from '../../api/articles'
import { useAuth } from '../../contexts/AuthContext'
import '../../components/layout/Layout.css'

export default function ArticleEditPage() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id || id === 'undefined') {
      navigate('/', { replace: true })
      return
    }
    getArticleById(id)
      .then((a) => {
        setArticle(a)
        if (a) {
          setTitle(a.title)
          setContent(a.content || '')
          setPublished(!!a.published)
        }
      })
      .catch(() => setArticle(null))
  }, [id, navigate])

  const authorId = article?.authorId?._id ?? article?.authorId ?? ''
  const userId = user?.id ?? user?._id ?? ''
  const canEdit = article && (isAdmin || String(authorId) === String(userId))
  useEffect(() => {
    if (article && !canEdit) navigate('/', { replace: true })
  }, [article, canEdit, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await updateArticle(id, { title, content, published })
      navigate(`/articles/${id}`, { replace: true })
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!id || id === 'undefined') return null
  if (!article) return <p>Đang tải...</p>
  if (!canEdit) return null

  return (
    <div>
      <h1>Sửa bài của tôi</h1>
      <p className="meta">Form sửa title, content, published.</p>
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
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
      </form>
    </div>
  )
}
