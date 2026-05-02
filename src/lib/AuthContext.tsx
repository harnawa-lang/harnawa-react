import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

// ── Admin check ───────────────────────────────────────────────────────
// Add comma-separated admin emails in .env: VITE_ADMIN_EMAILS=a@b.com,c@d.com
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean)

// ── Context shape ─────────────────────────────────────────────────────
interface AuthCtx {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail:  (email: string, password: string) => Promise<string | null>
  signUpWithEmail:  (email: string, password: string) => Promise<string | null>
  resetPassword:    (email: string) => Promise<string | null>
  signOut:          () => Promise<void>
}

const Ctx = createContext<AuthCtx>(null!)
export const useAuth = () => useContext(Ctx)

// ── Provider ──────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase() ?? '')

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  const signUpWithEmail = async (email: string, password: string) => {
    // Domain restriction — only @harnawainc.com allowed
    if (!email.toLowerCase().endsWith('@harnawainc.com')) {
      return 'Signups are restricted to @harnawainc.com email addresses. Contact admin for access.'
    }
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin },
    })
    return error?.message ?? null
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    return error?.message ?? null
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <Ctx.Provider value={{
      user, session, loading, isAdmin,
      signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, signOut,
    }}>
      {children}
    </Ctx.Provider>
  )
}
