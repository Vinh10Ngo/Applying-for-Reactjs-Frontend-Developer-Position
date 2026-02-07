import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo, useRef } from 'react'
import { getArticleById } from '../../api/articles'
import { useAuth } from '../../contexts/AuthContext'
import { parseArticleContent } from '../../utils/articleContent'
import TableOfContents from '../../components/TableOfContents'
import ReadingProgressBar from '../../components/ReadingProgressBar'
import '../../components/layout/Layout.css'

export default function ArticleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const articleRef = useRef(null)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || id === 'undefined') return
    getArticleById(id)
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [id])

  const rawContent = article?.content != null ? String(article.content) : ''
  const { toc, blocks } = useMemo(() => parseArticleContent(rawContent), [rawContent])
  if (!id || id === 'undefined') {
    navigate('/', { replace: true })
    return null
  }

  if (loading) return <p className="home-loading">Đang tải...</p>
  if (!article) {
    return (
      <div className="page-card">
        <p>Không tìm thấy bài viết hoặc đường dẫn không đúng.</p>
        <p className="form-footer"><Link to="/">← Về trang chủ</Link></p>
      </div>
    )
  }
  if (article.deletedAt) return <div className="page-card"><p>Bài viết đã bị xóa. <Link to="/">← Trang chủ</Link></p></div>

  const authorId = article.authorId?._id ?? article.authorId ?? ''
  const userId = user?.id ?? user?._id ?? ''
  const canEdit = user && (isAdmin || String(authorId) === String(userId))

  if (!article.published && !canEdit) {
    return (
      <div className="page-card">
        <p>Bài viết chưa xuất bản.</p>
        <p className="form-footer"><Link to="/">← Trang chủ</Link></p>
      </div>
    )
  }

  return (
    <div className="article-detail">
      <ReadingProgressBar articleRef={articleRef} articleId={id} />
      <p className="article-back"><Link to="/">← Trang chủ</Link></p>
      {!article.published && canEdit && (
        <div className="page-card" style={{ marginBottom: '1rem', background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.5)' }}>
          <p><strong>Bản nháp</strong> – Chỉ bạn (hoặc admin) mới xem được. Muốn hiển thị cho mọi người thì nhấn <Link to={`/articles/${id}/edit`}>Sửa bài</Link> và bật &quot;Đã xuất bản&quot;.</p>
        </div>
      )}
      <div className="article-layout article-layout--with-toc">
        <aside className="article-toc-wrap">
          <TableOfContents items={toc} />
        </aside>
        <article ref={articleRef} className="card-item article-content">
          <h1>{article.title}</h1>
          <div className="meta">Tác giả: {article.authorName} · {article.createdAt ? new Date(article.createdAt).toLocaleString('vi-VN') : ''}</div>
          <div className="article-body">
            {blocks.length > 0 ? (
              blocks.map((block, i) => {
                if (block.type === 'p') {
                  return <p key={i} className="article-p">{block.text || '\u00A0'}</p>
                }
                const Tag = block.type
                return (
                  <Tag key={i} id={block.id} className="article-heading">
                    {block.text}
                  </Tag>
                )
              })
            ) : (
              <p className="article-p">{rawContent.trim() || '\u00A0'}</p>
            )}
          </div>
        </article>
      </div>
      {canEdit && (
        <p className="form-footer" style={{ marginTop: '1rem' }}>
          <Link to={`/articles/${id}/edit`} className="btn btn-outline">Sửa bài</Link>
        </p>
      )}
    </div>
  )
}
