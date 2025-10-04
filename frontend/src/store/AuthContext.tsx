import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin } from '../api/auth'
import { me as fetchMe, type Me as CurrentUser, type Role } from '../api/accounts'
import { bootstrapTokensFromStorage, setTokens } from '../api/client'

type AuthState = {
  user: CurrentUser | null
  role: Role | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthCtx = createContext<AuthState>({} as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    bootstrapTokensFromStorage()
    ;(async () => {
      try {
        setLoading(true)
        const me = await fetchMe()
        setUser(me)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const { access, refresh } = await apiLogin(email, password)
      setTokens(access ?? null, refresh ?? null)
      const me = await fetchMe()
      setUser(me)
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Ошибка входа')
      setUser(null)
      throw e
    }
  }

  const logout = () => {
    setTokens(null, null)
    setUser(null)
  }

  const refreshMe = async () => {
    const me = await fetchMe()
    setUser(me)
  }

  const value = useMemo(
    () => ({
      user,
      role: (user?.role ?? null) as Role | null,
      loading,
      error,
      login,
      logout,
      refreshMe,
    }),
    [user, loading, error]
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
