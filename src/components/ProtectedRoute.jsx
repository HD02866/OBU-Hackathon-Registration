import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Wraps a route that requires admin authentication.
 * - While Firebase resolves auth state → show spinner
 * - Not logged in or not admin → redirect to /admin
 * - Admin → render children
 */
export default function ProtectedRoute({ children }) {
  const { isLoading, isAdmin } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/70 text-sm font-medium">Verifying access…</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}
