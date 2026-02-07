const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '')

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

function getToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

function setTokens(accessToken, refreshToken = null) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  else localStorage.removeItem(ACCESS_TOKEN_KEY)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  else localStorage.removeItem(REFRESH_TOKEN_KEY)
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function getAuthHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function doRefresh() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!res.ok) return null
  const data = await res.json().catch(() => ({}))
  const newAccess = data.access_token
  if (newAccess) {
    setTokens(newAccess, data.refresh_token || refreshToken)
    return newAccess
  }
  return null
}

const isPublicAuthPath = (p) => /^\/auth\/(login|register)$/.test((p || '').split('?')[0])

export async function request(path, options = {}, retried = false) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`
  const noAuth = isPublicAuthPath(path)
  const headers = noAuth
    ? { 'Content-Type': 'application/json', ...options.headers }
    : { ...getAuthHeaders(), ...options.headers }
  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (res.status === 401 && !retried) {
    const refreshed = await doRefresh()
    if (refreshed) return request(path, options, true)
    clearTokens()
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || data.error || 'Phiên đăng nhập hết hạn')
  }

  if (res.status === 401) {
    clearTokens()
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || data.error || 'Phiên đăng nhập hết hạn')
  }

  const contentType = res.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => ({})) : null

  if (!res.ok) {
    throw new Error(data?.message || data?.error || res.statusText)
  }

  return data
}

export async function logoutApi() {
  const refreshToken = getRefreshToken()
  try {
    if (refreshToken) {
      await fetch(`${BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
    }
  } catch {
    // ignore
  } finally {
    clearTokens()
  }
}

export { getToken, getRefreshToken, setTokens, clearTokens }
