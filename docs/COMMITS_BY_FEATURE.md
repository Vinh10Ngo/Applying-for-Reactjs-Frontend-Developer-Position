# Tách commit theo từng chức năng

Mỗi file chỉ nằm trong **một** commit. Chạy từng khối trong thư mục gốc (`e:\cursor_frontend`).

Nếu đã có **một commit gộp** tất cả:  
`git reset --soft HEAD~1` rồi `git reset HEAD` (để bỏ stage, giữ nguyên thay đổi).

---

## 1. Giao diện: theme, font, navbar, form, trang chủ

```bash
git add index.html src/styles/index.css src/components/layout/Layout.css src/components/layout/Layout.jsx src/pages/home/HomePage.css src/pages/home/HomePage.jsx src/pages/auth/LoginPage.jsx src/pages/auth/RegisterPage.jsx
git commit -m "feat(ui): theme toi, font Plus Jakarta Sans, navbar, form, home"
```

---

## 2. Trang Admin (dashboard)

```bash
git add src/App.jsx src/pages/admin/AdminPage.jsx
git commit -m "feat(admin): trang Quan tri /admin, link Admin (chi admin)"
```

---

## 3. Fix vào trang sửa bài bị redirect

```bash
git add src/pages/article/ArticleEditPage.jsx
git commit -m "fix(article): so sanh authorId/userId de vao trang sua bai dung"
```

---

## 4. Bài của tôi + mock

```bash
git add src/api/articles.js src/api/mock.js src/pages/profile/ProfileArticlesPage.jsx
git commit -m "fix(profile): getMyArticles chuan id, thong bao chua co bai, mock re-seed"
```

---

## 5. Admin: quản lý user (đặt/bỏ admin)

```bash
git add src/api/users.js src/pages/admin/AdminUsersPage.jsx
git commit -m "feat(admin): Quan ly user, dat/bo admin, phan trang, tim kiem"
```

---

## 6. Bài viết: mục lục, Reading Progress Bar, fix layout/parse/Hooks

```bash
git add src/utils/articleContent.js src/components/TableOfContents.jsx src/components/TableOfContents.css src/components/ReadingProgressBar.jsx src/components/ReadingProgressBar.css src/pages/article/ArticleDetailPage.jsx src/components/layout/Layout.css
git commit -m "feat(article): muc luc tu dong, ReadingProgressBar, fix parse useMemo layout"
```

---

## 7. Admin: quản lý bài viết

```bash
git add src/pages/admin/AdminArticlesPage.jsx
git commit -m "feat(admin): Quan ly bai viet, phan trang, tim kiem, xoa/khôi phuc"
```

---

## 8. Trang cá nhân + AuthContext (nếu có sửa)

```bash
git add src/pages/profile/ProfilePage.jsx src/contexts/AuthContext.jsx
git commit -m "fix(profile): trang ca nhan, user id, AuthContext"
```

*(Các fix nut Tim, fullName, error message da nam trong commit 5, 6, 7.)*

---

## 9. Tài liệu

```bash
git add docs/API-BACKEND.md docs/KIEM_TRA_CHUC_NANG.md docs/COMMITS_BY_FEATURE.md
git commit -m "docs: API backend, kiem tra chuc nang, huong dan commit theo feature"
```

---

## Hoặc chạy script (PowerShell)

```powershell
cd e:\cursor_frontend
.\scripts\commit-by-feature.ps1
```

Script sẽ add + commit lần lượt (có thể có file trùng giữa các bước nếu bạn chỉnh tay). Kiểm tra sau: `git log --oneline`.
