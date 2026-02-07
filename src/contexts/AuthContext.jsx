import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getToken, setTokens, clearTokens, request, logoutApi } from '../api/client'
import { mockApi } from '../api/mock'

const AuthContext = createContext(null)

const useMock = !import.meta.env.VITE_API_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    if (useMock) {
      try {
        const u = await mockApi.getMe(token)
        setUser(u || null)
        if (!u) clearTokens()
      } catch {
        setUser(null)
        clearTokens()
      }
    } else {
      try {
        const u = await request('/users/me')
        setUser(u)
        try {
          localStorage.setItem('user', JSON.stringify(u))
        } catch {
          // ignore
        }
      } catch {
        setUser(null)
        clearTokens()
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = useCallback(async (email, password) => {
    if (useMock) {
      const { user: u, token } = await mockApi.login(email, password)
      setTokens(token, null)
      setUser(u)
      return u
    }
    try {
      const res = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      const accessToken = res.access_token
      const refreshToken = res.refresh_token ?? null
      setTokens(accessToken, refreshToken)
      setUser(res.user ?? null)
      return res.user
    } catch (e) {
      const msg = e?.message || ''
      if (msg === 'Failed to fetch' || msg.includes('fetch')) {
        throw new Error('Không kết nối được máy chủ. Hãy chạy backend (ví dụ port 3000) hoặc xóa/để trống VITE_API_URL trong file .env rồi chạy lại "npm run dev" để dùng dữ liệu mẫu (đăng nhập: user@test.com / user123).')
      }
      throw e
    }
  }, [])

  const register = useCallback(async (email, password, name) => {
    if (useMock) {
      const { user: u, token } = await mockApi.register(email, password, name)
      setTokens(token, null)
      setUser(u)
      return u
    }
    try {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName: name || undefined }),
      })
      const accessToken = res.access_token
      const refreshToken = res.refresh_token ?? null
      setTokens(accessToken, refreshToken)
      setUser(res.user ?? null)
      return res.user
    } catch (e) {
      const msg = e?.message || ''
      if (msg === 'Failed to fetch' || msg.includes('fetch')) {
        throw new Error('Không kết nối được máy chủ. Hãy chạy backend hoặc xóa/để trống VITE_API_URL trong .env rồi chạy lại "npm run dev" để dùng dữ liệu mẫu.')
      }
      throw e
    }
  }, [])

  const logout = useCallback(async () => {
    if (useMock) {
      clearTokens()
      setUser(null)
      return
    }
    await logoutApi()
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
