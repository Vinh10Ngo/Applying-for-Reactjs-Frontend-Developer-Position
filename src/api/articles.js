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

/** Build query: frontend gửi page, limit, search_term, sort, order, authorId; backend nhận đúng tên. */
function toQuery(params) {
  const q = { ...params }
  if (q.publishedOnly !== undefined) {
    q.published = q.publishedOnly === true || q.publishedOnly === 'true'
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

/** GET /articles/me – bài của user đăng nhập. params.includeDeleted = true để lấy cả bài đã xóa. */
export async function getMyArticles(params = {}) {
  const token = getToken()
  if (!token) return { items: [] }
  if (useMock) {
    const user = await mockApi.getMe(token)
    const userId = user?.id ?? user?._id
    const list = userId ? mockApi.getArticlesByAuthor(userId) : []
    return { items: list.map(normalizeArticle) }
  }
  const query = params.includeDeleted ? '?includeDeleted=true' : ''
  const res = await request(`/articles/me${query}`).catch(() => ({ items: [] }))
  const list = Array.isArray(res) ? res : (res?.items ?? [])
  return { items: list.map(normalizeArticle) }
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

/** GET /articles/admin – sort: createdAt|updatedAt|title, order: asc|desc, authorId (ObjectId). */
export async function getAdminArticles(params = {}) {
  const opts = {
    page: params.page ?? 1,
    limit: Math.min(50, params.limit ?? 10),
    search: params.search ?? '',
    sort: params.sort ?? 'createdAt',
    order: params.order ?? 'desc',
    authorId: params.authorId ?? '',
    ...params,
  }
  opts.limit = Math.min(50, opts.limit)
  if (useMock) return mockApi.getArticles({ ...opts, includeDeleted: true })
  const adminQuery = new URLSearchParams()
  adminQuery.set('page', opts.page)
  adminQuery.set('limit', opts.limit)
  if (opts.search && String(opts.search).trim()) adminQuery.set('search_term', String(opts.search).trim())
  if (opts.sort) adminQuery.set('sort', opts.sort)
  if (opts.order) adminQuery.set('order', opts.order)
  if (opts.authorId && String(opts.authorId).trim()) adminQuery.set('authorId', String(opts.authorId).trim())
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
