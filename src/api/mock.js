const STORAGE_KEYS = { users: 'mock_users', articles: 'mock_articles' }

function load(key, defaultVal = []) {
  try {
    const s = localStorage.getItem(STORAGE_KEYS[key])
    return s ? JSON.parse(s) : defaultVal
  } catch {
    return defaultVal
  }
}

function save(key, data) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data))
}

const DEFAULT_ARTICLES = [
  { id: '1', title: 'Bài mẫu 1', content: 'Nội dung bài 1.', authorId: '2', authorName: 'User', published: true, createdAt: new Date().toISOString(), deletedAt: null },
  { id: '2', title: 'Bài mẫu 2', content: 'Nội dung bài 2.', authorId: '2', authorName: 'User', published: true, createdAt: new Date().toISOString(), deletedAt: null },
]

// Init default data
function init() {
  if (!localStorage.getItem(STORAGE_KEYS.users)?.length) {
    const users = [
      { id: '1', email: 'admin@test.com', password: 'admin123', name: 'Admin', role: 'admin' },
      { id: '2', email: 'user@test.com', password: 'user123', name: 'User', role: 'user' },
    ]
    save('users', users)
  }
  const existingArticles = load('articles')
  if (!existingArticles.length) {
    save('articles', [...DEFAULT_ARTICLES])
  }
}
init()

export const mockApi = {
  async login(email, password) {
    const users = load('users')
    const u = users.find((x) => x.email === email && x.password === password)
    if (!u) throw new Error('Email hoặc mật khẩu sai')
    const { password: _, ...user } = u
    return { user, token: 'mock-' + u.id }
  },

  async register(email, password, name) {
    const users = load('users')
    if (users.some((x) => x.email === email)) throw new Error('Email đã tồn tại')
    const user = { id: String(Date.now()), email, password, name, role: 'user' }
    users.push(user)
    save('users', users)
    const { password: __, ...safe } = user
    return { user: safe, token: 'mock-' + user.id }
  },

  async getMe(token) {
    const id = token?.replace('mock-', '')
    const users = load('users')
    const u = users.find((x) => x.id === id)
    if (!u) return null
    const { password: _, ...user } = u
    return user
  },

  getArticles({ publishedOnly = true, includeDeleted = false, search = '', page = 1, limit = 10 } = {}) {
    let list = load('articles')
    if (publishedOnly) list = list.filter((a) => a.published && !a.deletedAt)
    if (!includeDeleted) list = list.filter((a) => !a.deletedAt)
    else list = list.filter(() => true)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((a) => a.title.toLowerCase().includes(q) || (a.content || '').toLowerCase().includes(q))
    }
    const total = list.length
    const start = (page - 1) * limit
    const items = list.slice(start, start + limit)
    return { items, total, page, limit }
  },

  getArticleById(id) {
    const list = load('articles')
    return list.find((a) => a.id === id) || null
  },

  getArticlesByAuthor(authorId) {
    const id = authorId != null ? String(authorId) : ''
    return load('articles').filter((a) => String(a.authorId ?? a.authorId?._id ?? '') === id && !a.deletedAt)
  },

  createArticle({ title, content, published }, authorId, authorName) {
    const list = load('articles')
    const newArt = {
      id: String(Date.now()),
      title,
      content: content || '',
      authorId,
      authorName,
      published: !!published,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      deletedAt: null,
    }
    list.push(newArt)
    save('articles', list)
    return newArt
  },

  updateArticle(id, { title, content, published }, _userId, isAdmin) {
    const list = load('articles')
    const i = list.findIndex((a) => a.id === id)
    if (i === -1) throw new Error('Không tìm thấy bài viết')
    const a = list[i]
    if (!isAdmin && a.authorId !== _userId) throw new Error('Không có quyền sửa')
    list[i] = { ...a, title, content, published: !!published, updatedAt: new Date().toISOString() }
    save('articles', list)
    return list[i]
  },

  deleteArticle(id, userId, isAdmin) {
    const list = load('articles')
    const i = list.findIndex((a) => a.id === id)
    if (i === -1) throw new Error('Không tìm thấy bài viết')
    const a = list[i]
    if (!isAdmin && a.authorId !== userId) throw new Error('Không có quyền xóa')
    list[i] = { ...a, deletedAt: new Date().toISOString() }
    save('articles', list)
    return list[i]
  },

  restoreArticle(id) {
    const list = load('articles')
    const i = list.findIndex((a) => a.id === id)
    if (i === -1) throw new Error('Không tìm thấy bài viết')
    list[i] = { ...list[i], deletedAt: null }
    save('articles', list)
    return list[i]
  },

  getUsers({ page = 1, limit = 10, search = '' } = {}) {
    let list = load('users').map(({ password: _, ...u }) => u)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((u) =>
        (u.email || '').toLowerCase().includes(q) ||
        (u.name || '').toLowerCase().includes(q)
      )
    }
    const total = list.length
    const start = (page - 1) * limit
    const items = list.slice(start, start + limit)
    return { items, total, page, limit }
  },

  setUserRole(userId, role) {
    const users = load('users')
    const i = users.findIndex((u) => u.id === userId)
    if (i === -1) throw new Error('User không tồn tại')
    if (role !== 'admin' && role !== 'user') throw new Error('Vai trò không hợp lệ')
    users[i].role = role
    save('users', users)
    const { password: _, ...u } = users[i]
    return u
  },

  changePassword(userId, currentPassword, newPassword) {
    const users = load('users')
    const i = users.findIndex((u) => u.id === userId)
    if (i === -1) throw new Error('User không tồn tại')
    if (users[i].password !== currentPassword) throw new Error('Mật khẩu hiện tại sai')
    users[i].password = newPassword
    save('users', users)
    return true
  },
}
