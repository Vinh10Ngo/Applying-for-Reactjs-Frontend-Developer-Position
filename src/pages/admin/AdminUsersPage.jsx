import { useState, useEffect } from 'react'
import { getUsers, updateUserRole } from '../../api/users'
import { useAuth } from '../../contexts/AuthContext'
import '../../components/layout/Layout.css'

const LIMIT = 10

export default function AdminUsersPage() {
  const { user: currentUser, loadUser } = useAuth()
  const [data, setData] = useState({ items: [], total: 0, page: 1 })
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchUsers = (page, searchTerm) => {
    setLoading(true)
    getUsers({ page, limit: LIMIT, search: (searchTerm && String(searchTerm).trim()) || undefined })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.items ?? [])
        setData({
          items: list,
          total: res?.total ?? list.length,
          page: res?.page ?? page,
          limit: res?.limit ?? LIMIT,
        })
      })
      .catch(() => setData((d) => ({ ...d, items: [] })))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers(data.page, search)
  }, [data.page, search])

  const handleSearch = () => {
    const q = (typeof searchInput === 'string' ? searchInput : '').trim()
    setSearch(q)
    setData((d) => ({ ...d, page: 1 }))
  }

  const handleSetRole = async (u, newRole) => {
    const id = u.id ?? u._id
    if (!id) return
    if (!window.confirm(`${newRole === 'admin' ? 'Đặt' : 'Bỏ'} quyền admin cho "${u.email}"?`)) return
    setUpdating(id)
    try {
      await updateUserRole(id, newRole)
      fetchUsers(data.page, search)
      if (currentUser && String(currentUser.id ?? currentUser._id) === String(id)) {
        await loadUser()
      }
    } catch (e) {
      alert(e?.message || 'Thất bại')
    } finally {
      setUpdating(null)
    }
  }

  const totalPages = Math.ceil((data.total || 0) / LIMIT) || 1
  const users = data.items || []

  return (
    <div>
      <h1>Danh sách user (Admin)</h1>
      <p className="meta">Bảng user: email, tên, vai trò. Dùng nút bên dưới để đặt hoặc bỏ quyền admin.</p>

      <form className="admin-search" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <input
          type="search"
          placeholder="Tìm theo email, tên..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="admin-search-input"
          aria-label="Tìm user"
        />
        <button type="button" className="btn btn-primary" onClick={handleSearch}>
          Tìm
        </button>
      </form>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Tên</th>
                  <th>Vai trò</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Không có user nào.</td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const id = u.id ?? u._id
                    const isAdmin = u.role === 'admin'
                    return (
                      <tr key={id}>
                        <td>{u.email}</td>
                        <td>{u.name ?? u.fullName ?? '—'}</td>
                        <td>{isAdmin ? 'Admin' : 'User'}</td>
                        <td>
                          {isAdmin ? (
                            <button
                              type="button"
                              className="btn btn-outline"
                              disabled={updating === id}
                              onClick={() => handleSetRole(u, 'user')}
                            >
                              {updating === id ? '...' : 'Bỏ admin'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary"
                              disabled={updating === id}
                              onClick={() => handleSetRole(u, 'admin')}
                            >
                              {updating === id ? '...' : 'Đặt làm admin'}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination admin-pagination">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setData((d) => ({ ...d, page: d.page - 1 }))}
              >
                Trước
              </button>
              <span className="page-info">Trang {data.page} / {totalPages} ({data.total} user)</span>
              <button
                type="button"
                disabled={data.page >= totalPages}
                onClick={() => setData((d) => ({ ...d, page: d.page + 1 }))}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
