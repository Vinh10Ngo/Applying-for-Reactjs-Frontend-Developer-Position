import { useState, useEffect } from 'react'
import { getAuditLogs } from '../../api/audit'
import '../../components/layout/Layout.css'

const LIMIT = 20
const RESOURCE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'article', label: 'Bài viết' },
  { value: 'auth', label: 'Đăng nhập' },
]
const ACTION_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'create', label: 'Tạo' },
  { value: 'update', label: 'Cập nhật' },
  { value: 'soft_delete', label: 'Xóa' },
  { value: 'restore', label: 'Khôi phục' },
  { value: 'login', label: 'Đăng nhập' },
]

export default function AdminAuditPage() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, totalPages: 1 })
  const [resource, setResource] = useState('')
  const [action, setAction] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAuditLogs({
      page: data.page,
      limit: LIMIT,
      resource: resource || undefined,
      action: action || undefined,
    })
      .then((res) => setData({
        items: res?.items ?? [],
        total: res?.total ?? 0,
        page: res?.page ?? 1,
        totalPages: res?.totalPages ?? 1,
      }))
      .catch(() => setData((d) => ({ ...d, items: [] })))
      .finally(() => setLoading(false))
  }, [data.page, resource, action])

  const totalPages = data.totalPages || Math.ceil((data.total || 0) / LIMIT) || 1

  return (
    <div>
      <h1>Nhật ký hoạt động (Audit)</h1>
      <p className="meta">Xem lịch sử thao tác: tạo/sửa/xóa bài, đăng nhập.</p>

      <div className="admin-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label>
          <span style={{ marginRight: '0.5rem' }}>Tài nguyên:</span>
          <select value={resource} onChange={(e) => { setResource(e.target.value); setData((d) => ({ ...d, page: 1 })) }} aria-label="Lọc theo tài nguyên">
            {RESOURCE_OPTIONS.map((o) => <option key={o.value || 'all'} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <label>
          <span style={{ marginRight: '0.5rem' }}>Hành động:</span>
          <select value={action} onChange={(e) => { setAction(e.target.value); setData((d) => ({ ...d, page: 1 })) }} aria-label="Lọc theo hành động">
            {ACTION_OPTIONS.map((o) => <option key={o.value || 'all'} value={o.value}>{o.label}</option>)}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : data.items.length === 0 ? (
        <p>Chưa có bản ghi nào.</p>
      ) : (
        <>
          <div className="card-list">
            {data.items.map((log, idx) => {
              const user = log.userId
              const userName = user?.fullName ?? user?.email ?? log.userId ?? '-'
              const time = log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : '-'
              return (
                <div key={log._id || idx} className="card-item" style={{ fontSize: '0.9rem' }}>
                  <div className="meta" style={{ marginBottom: '0.25rem' }}>
                    <strong>{log.action}</strong> · {log.resource}
                    {log.resourceId && ` · ${log.resourceId}`}
                  </div>
                  <div>User: {userName} · {time}</div>
                  {log.ip && <div style={{ color: 'var(--muted, #666)' }}>IP: {log.ip}</div>}
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div style={{ color: 'var(--muted, #666)', marginTop: '0.25rem' }}>
                      {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>
              )
            })}
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
              <span className="page-info">Trang {data.page} / {totalPages} ({data.total} bản ghi)</span>
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
