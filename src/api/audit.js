import { request } from './client'

/**
 * GET /audit – danh sách log (admin).
 * params: page, limit, userId, resource, action
 */
export async function getAuditLogs(params = {}) {
  const q = new URLSearchParams()
  q.set('page', params.page ?? 1)
  q.set('limit', Math.min(100, params.limit ?? 20))
  if (params.userId && String(params.userId).trim()) q.set('userId', String(params.userId).trim())
  if (params.resource && String(params.resource).trim()) q.set('resource', String(params.resource).trim())
  if (params.action && String(params.action).trim()) q.set('action', String(params.action).trim())
  const res = await request(`/audit?${q.toString()}`).catch(() => ({ items: [], total: 0 }))
  return {
    items: res?.items ?? [],
    total: res?.total ?? 0,
    page: res?.page ?? 1,
    limit: res?.limit ?? 20,
    totalPages: res?.totalPages ?? 1,
  }
}
