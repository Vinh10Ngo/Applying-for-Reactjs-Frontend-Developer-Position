import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ProtectedRoute from './ProtectedRoute'

export default function AdminRoute({ children }) {
  const { isAdmin } = useAuth()

  return (
    <ProtectedRoute>
      {isAdmin ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  )
}
