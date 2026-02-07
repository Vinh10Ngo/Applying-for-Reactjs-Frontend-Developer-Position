import { mockApi } from './mock'
import { request } from './client'

const useMock = !import.meta.env.VITE_API_URL

/** GET /users – danh sách user (admin). Backend có thể trả mảng trực tiếp hoặc { items, total }. */
function usersQuery(params = {}) {
  const q = new URLSearchParams()
  if (params.page != null) q.set('page', params.page)
  if (params.limit != null) q.set('limit', params.limit)
  const searchVal = params.search != null && params.search !== '' ? String(params.search).trim() : ''
  if (searchVal) {
    q.set('search_term', searchVal)
    q.set('search', searchVal)
  }
  return q.toString()
}

export async function getUsers(params = {}) {
  if (useMock) return mockApi.getUsers(params)
  const query = usersQuery(params)
  const url = query ? `/users?${query}` : '/users'
  const res = await request(url)
  const list = Array.isArray(res) ? res : (res?.users ?? res?.items ?? [])
  const total = res?.total ?? list.length
  return { items: list, total, page: params.page ?? 1, limit: params.limit ?? 10 }
}

export async function updateUserRole(userId, role) {
  if (useMock) return mockApi.setUserRole(userId, role)
  await request(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
  return { id: userId, role }
}
