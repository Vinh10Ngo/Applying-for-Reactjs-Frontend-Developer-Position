import { mockApi } from './mock'
import { request } from './client'

const useMock = !import.meta.env.VITE_API_URL

const USERS_FETCH_LIMIT = 200

/** Query string cho GET /users – gửi limit lớn để lấy hết rồi phân trang phía client (tránh backend trả sai page). */
function usersQuery(params = {}) {
  const q = new URLSearchParams()
  q.set('page', 1)
  q.set('limit', USERS_FETCH_LIMIT)
  const searchVal = params.search != null && params.search !== '' ? String(params.search).trim() : ''
  if (searchVal) {
    q.set('search_term', searchVal)
    q.set('search', searchVal)
  }
  return q.toString()
}

/** Lọc user theo search (email, name, fullName) – khi backend không hỗ trợ search_term */
function filterUsersBySearch(list, searchVal) {
  if (!list?.length || !searchVal || !String(searchVal).trim()) return list
  const q = String(searchVal).trim().toLowerCase()
  return list.filter(
    (u) =>
      (u.email || '').toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.fullName || '').toLowerCase().includes(q)
  )
}

export async function getUsers(params = {}) {
  if (useMock) return mockApi.getUsers(params)
  const query = usersQuery(params)
  const url = query ? `/users?${query}` : '/users'
  const res = await request(url)
  let list = Array.isArray(res) ? res : (res?.users ?? res?.items ?? [])
  const searchVal = params.search != null && params.search !== '' ? String(params.search).trim() : ''
  if (searchVal) list = filterUsersBySearch(list, searchVal)
  const total = list.length
  const page = Math.max(1, parseInt(params.page, 10) || 1)
  const limit = Math.max(1, parseInt(params.limit, 10) || 10)
  const start = (page - 1) * limit
  const items = list.slice(start, start + limit)
  return { items, total, page, limit }
}

export async function updateUserRole(userId, role) {
  if (useMock) return mockApi.setUserRole(userId, role)
  await request(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
  return { id: userId, role }
}
