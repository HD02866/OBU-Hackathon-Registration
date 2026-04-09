import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange } from '../firebase/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // authState: null = logged out, { user, role } = logged in
  const [authState, setAuthState] = useState(undefined) // undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthChange((state) => setAuthState(state))
    return unsubscribe
  }, [])

  const isLoading = authState === undefined
  const isAdmin = authState?.role === 'admin'
  const currentUser = authState?.user ?? null

  return (
    <AuthContext.Provider value={{ authState, isLoading, isAdmin, currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
