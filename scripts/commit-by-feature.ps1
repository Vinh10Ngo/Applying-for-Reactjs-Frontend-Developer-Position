# Tach commit theo tung chuc nang (moi file chi nam trong 1 commit)
# Chay trong thu muc goc: .\scripts\commit-by-feature.ps1
# Neu da co 1 commit gop: git reset --soft HEAD~1 ; git reset HEAD

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path .git)) {
    Write-Host "Chua co git. Chay: git init" -ForegroundColor Red
    exit 1
}

function DoCommit {
    param([string]$msg, [string[]]$files)
    foreach ($f in $files) {
        if (Test-Path $f) { git add $f }
    }
    $count = (git diff --cached --name-only 2>$null | Measure-Object -Line).Lines
    if ($count -gt 0) {
        git commit -m $msg
        Write-Host "OK: $msg" -ForegroundColor Green
    } else {
        Write-Host "Skip (no changes): $msg" -ForegroundColor Yellow
    }
}

# 1. UI: theme, font, navbar, form, home (bao gom empty state, link Admin)
DoCommit "feat(ui): theme toi, font Plus Jakarta Sans, navbar, form, home" @(
    "index.html", "src/styles/index.css", "src/components/layout/Layout.css", "src/components/layout/Layout.jsx",
    "src/pages/home/HomePage.css", "src/pages/home/HomePage.jsx", "src/pages/auth/LoginPage.jsx", "src/pages/auth/RegisterPage.jsx"
)

# 2. Admin dashboard
DoCommit "feat(admin): trang Quan tri /admin, link Admin (chi admin)" @(
    "src/App.jsx", "src/pages/admin/AdminPage.jsx"
)

# 3. Fix vao trang sua bai bi redirect
DoCommit "fix(article): so sanh authorId/userId de vao trang sua bai dung" @(
    "src/pages/article/ArticleEditPage.jsx"
)

# 4. Bai cua toi + mock
DoCommit "fix(profile): getMyArticles chuan id, thong bao chua co bai, mock re-seed" @(
    "src/api/articles.js", "src/api/mock.js", "src/pages/profile/ProfileArticlesPage.jsx"
)

# 5. Admin quan ly user
DoCommit "feat(admin): Quan ly user, dat/bo admin, phan trang, tim kiem" @(
    "src/api/users.js", "src/pages/admin/AdminUsersPage.jsx"
)

# 6. Muc luc tu dong + ReadingProgressBar + fix bai (parse, useMemo, layout)
DoCommit "feat(article): muc luc tu dong, ReadingProgressBar, fix parse/useMemo/layout" @(
    "src/utils/articleContent.js", "src/components/TableOfContents.jsx", "src/components/TableOfContents.css",
    "src/components/ReadingProgressBar.jsx", "src/components/ReadingProgressBar.css",
    "src/pages/article/ArticleDetailPage.jsx", "src/components/layout/Layout.css"
)

# 7. Admin quan ly bai viet
DoCommit "feat(admin): Quan ly bai viet, phan trang, tim kiem, xoa/khoi phuc" @(
    "src/pages/admin/AdminArticlesPage.jsx"
)

# 8. Trang ca nhan + AuthContext (moi file chi 1 commit)
DoCommit "fix(profile): trang ca nhan, user id, AuthContext" @(
    "src/pages/profile/ProfilePage.jsx", "src/contexts/AuthContext.jsx"
)

# 9. Tai lieu
DoCommit "docs: API backend, kiem tra chuc nang, huong dan commit theo feature" @(
    "docs/API-BACKEND.md", "docs/KIEM_TRA_CHUC_NANG.md", "docs/COMMITS_BY_FEATURE.md"
)

Write-Host "`nXong. Kiem tra: git log --oneline" -ForegroundColor Cyan
git log --oneline -15
