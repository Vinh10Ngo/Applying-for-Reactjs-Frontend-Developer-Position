import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/routes/ProtectedRoute'
import AdminRoute from './components/routes/AdminRoute'
import HomePage from './pages/home/HomePage'
import ArticleDetailPage from './pages/article/ArticleDetailPage'
import ArticleNewPage from './pages/article/ArticleNewPage'
import ArticleEditPage from './pages/article/ArticleEditPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/profile/ProfilePage'
import ProfileArticlesPage from './pages/profile/ProfileArticlesPage'
import AdminPage from './pages/admin/AdminPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminArticlesPage from './pages/admin/AdminArticlesPage'
import AdminAuditPage from './pages/admin/AdminAuditPage'
import './styles/App.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="articles/new" element={<ProtectedRoute><ArticleNewPage /></ProtectedRoute>} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
            <Route path="articles/:id/edit" element={<ProtectedRoute><ArticleEditPage /></ProtectedRoute>} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="profile/articles" element={<ProtectedRoute><ProfileArticlesPage /></ProtectedRoute>} />
            <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="admin/articles" element={<AdminRoute><AdminArticlesPage /></AdminRoute>} />
            <Route path="admin/audit" element={<AdminRoute><AdminAuditPage /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
