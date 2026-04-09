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
      <div className="min-h-screen flex items-center justify-center bg-[#04060b] relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)', filter: 'blur(70px)' }} />

        <div className="relative flex flex-col items-center gap-5">
          {/* Spinner ring */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-white/6" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-400 animate-spin" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-md" />
          </div>
          <div className="text-center">
            <p className="text-white/70 text-sm font-semibold">Verifying access…</p>
            <p className="text-white/30 text-xs mt-1">Please wait</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}
