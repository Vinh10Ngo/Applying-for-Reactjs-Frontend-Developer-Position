import { mockApi } from './mock'
import { request, getToken } from './client'

const useMock = !import.meta.env.VITE_API_URL

/** Chuẩn hóa bài viết từ API (backend có thể dùng _id, authorId object...) */
function normalizeArticle(a) {
  if (!a) return a
  const id = a.id ?? a._id ?? ''
  const authorName =
    a.authorName ??
    a.author?.fullName ??
    a.author?.name ??
    a.authorId?.fullName ??
    a.authorId?.name ??
    ''
  return {
    ...a,
    id: String(id),
    authorName,
  }
}

/** Build query: frontend gửi page, limit, search_term; backend nhận đúng tên. */
function toQuery(params) {
  const q = { ...params }
  if (q.publishedOnly !== undefined) {
    q.published = q.publishedOnly
    delete q.publishedOnly
  }
  if (q.search !== undefined && q.search_term === undefined) {
    q.search_term = q.search
    delete q.search
  }
  return new URLSearchParams(q).toString()
}

export async function getArticles(params = {}) {
  if (useMock) return mockApi.getArticles(params)
  const query = toQuery(params)
  const res = await request(`/articles?${query}`)
  const items = (res.items ?? res.data ?? []).map(normalizeArticle)
  return { ...res, items }
}

export async function getArticleById(id) {
  if (!id || id === 'undefined') return null
  if (useMock) return mockApi.getArticleById(id)
  const a = await request(`/articles/${id}`)
  return normalizeArticle(a)
}

export async function getMyArticles() {
  const token = getToken()
  if (!token) return []
  if (useMock) {
    const user = await mockApi.getMe(token)
    const userId = user?.id ?? user?._id
    return userId ? mockApi.getArticlesByAuthor(userId) : []
  }
  const res = await request('/articles/me').catch(() => ({ items: [] }))
  const list = Array.isArray(res) ? res : (res?.items ?? [])
  return list.map(normalizeArticle)
}

export async function createArticle(data) {
  if (useMock) {
    const user = await mockApi.getMe(getToken())
    if (!user) throw new Error('Chưa đăng nhập')
    return mockApi.createArticle(data, user.id, user.name)
  }
  const res = await request('/articles', { method: 'POST', body: JSON.stringify(data) })
  return normalizeArticle(res)
}

export async function updateArticle(id, data) {
  if (useMock) {
    const user = await mockApi.getMe(getToken())
    if (!user) throw new Error('Chưa đăng nhập')
    return mockApi.updateArticle(id, data, user.id, user.role === 'admin')
  }
  return request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteArticle(id) {
  if (useMock) {
    const user = await mockApi.getMe(getToken())
    if (!user) throw new Error('Chưa đăng nhập')
    return mockApi.deleteArticle(id, user.id, user.role === 'admin')
  }
  return request(`/articles/${id}`, { method: 'DELETE' })
}

export async function restoreArticle(id) {
  if (useMock) return mockApi.restoreArticle(id)
  return request(`/articles/${id}/restore`, { method: 'PATCH' })
}

/** GET /articles/admin – danh sách tất cả bài (nháp, đã xuất bản, đã xóa). page, limit (tối đa 50), search_term. */
export async function getAdminArticles(params = {}) {
  const opts = {
    publishedOnly: false,
    includeDeleted: true,
    page: params.page ?? 1,
    limit: Math.min(50, params.limit ?? 10),
    search: params.search ?? '',
    ...params,
  }
  opts.limit = Math.min(50, opts.limit)
  if (useMock) return mockApi.getArticles(opts)
  const adminQuery = new URLSearchParams()
  adminQuery.set('page', opts.page)
  adminQuery.set('limit', opts.limit)
  if (opts.search && String(opts.search).trim()) {
    adminQuery.set('search_term', String(opts.search).trim())
  }
  const query = adminQuery.toString()
  const res = await request(`/articles/admin?${query}`).catch(() => ({ items: [], total: 0 }))
  const raw = res?.items ?? res?.data ?? []
  const items = raw.map(normalizeArticle)
  return {
    items,
    total: res?.total ?? items.length,
    page: res?.page ?? opts.page,
    limit: res?.limit ?? opts.limit,
  }
}
