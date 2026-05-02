import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'

type Screen = 'login' | 'reset' | 'reset_sent'

export function LoginPage() {
  const { t, mode, toggle } = useTheme()
  const { signInWithEmail, resetPassword } = useAuth()

  const [screen, setScreen]     = useState<Screen>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const warm = '#c97a34'

  function inputStyle(focused: boolean = false) {
    return {
      width: '100%', boxSizing: 'border-box' as const,
      padding: '11px 14px', borderRadius: 9,
      border: `1.5px solid ${focused ? warm : t.border}`,
      background: t.bg, color: t.ink,
      fontSize: 14, fontFamily: 'inherit', outline: 'none',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signInWithEmail(email, password)
    setLoading(false)
    if (err) setError('Invalid email or password. Contact admin if you need access.')
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await resetPassword(email)
    setLoading(false)
    if (err) setError(err)
    else setScreen('reset_sent')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: mode === 'dark' ? '#0e0e0e' : '#faf8f4',
      fontFamily: '"Inter", -apple-system, sans-serif',
      padding: '24px', position: 'relative',
    }}>

      {/* Dark mode toggle */}
      <button onClick={toggle} style={{
        position: 'absolute', top: 20, right: 20,
        border: `1px solid ${t.border}`, background: t.bgSoft,
        borderRadius: 8, cursor: 'pointer', width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.inkMid,
      }}>
        {mode === 'light' ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </button>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 400,
        background: t.panel, border: `1px solid ${t.border}`,
        borderRadius: 20,
        boxShadow: mode === 'dark' ? '0 24px 64px rgba(0,0,0,0.5)' : '0 24px 64px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          padding: '32px 36px 24px',
          background: mode === 'dark' ? '#161616' : '#fffbf7',
          borderBottom: `1px solid ${t.border}`,
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <img
              src="/logo.png"
              alt="Harnawa Insulations"
              style={{ height: 56, width: 'auto', objectFit: 'contain' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: t.ink, marginBottom: 4 }}>
            {screen === 'login'      ? 'Welcome back'
           : screen === 'reset'      ? 'Reset password'
           :                           'Check your email'}
          </div>
          <div style={{ fontSize: 13, color: t.inkSoft }}>
            {screen === 'login'      ? 'Sign in to Harnawa Shipment Tracker'
           : screen === 'reset'      ? 'Enter your email to get a reset link'
           :                           `Reset link sent to ${email}`}
          </div>
        </div>

        <div style={{ padding: '28px 36px 32px' }}>

          {/* ── Login form ── */}
          {screen === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.inkMid, marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" required autoFocus
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@harnawainc.com"
                  style={inputStyle()}
                  onFocus={e => { e.target.style.borderColor = warm; e.target.style.boxShadow = `0 0 0 3px ${warm}20` }}
                  onBlur={e  => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: t.inkMid }}>Password</label>
                  <button type="button"
                    onClick={() => { setScreen('reset'); setError(null) }}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 11.5, color: warm, fontWeight: 600, fontFamily: 'inherit', padding: 0 }}
                  >Forgot password?</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle(), paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = warm; e.target.style.boxShadow = `0 0 0 3px ${warm}20` }}
                    onBlur={e  => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: t.inkFaint, padding: 4 }}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8, fontSize: 13,
                  background: mode === 'dark' ? '#450a0a' : '#fef2f2',
                  border: `1px solid ${mode === 'dark' ? '#7f1d1d' : '#fecaca'}`,
                  color: mode === 'dark' ? '#fca5a5' : '#dc2626',
                }}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px',
                background: loading ? t.bgDeep : warm,
                color: loading ? t.inkMid : '#fff',
                border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 4px 14px ${warm}50`,
                transition: 'all 0.15s',
              }}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          {/* ── Reset form ── */}
          {screen === 'reset' && (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.inkMid, marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email" required autoFocus
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@harnawainc.com"
                  style={inputStyle()}
                  onFocus={e => { e.target.style.borderColor = warm; e.target.style.boxShadow = `0 0 0 3px ${warm}20` }}
                  onBlur={e  => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8, fontSize: 13,
                  background: mode === 'dark' ? '#450a0a' : '#fef2f2',
                  border: `1px solid ${mode === 'dark' ? '#7f1d1d' : '#fecaca'}`,
                  color: mode === 'dark' ? '#fca5a5' : '#dc2626',
                }}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px',
                background: loading ? t.bgDeep : warm,
                color: loading ? t.inkMid : '#fff',
                border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 4px 14px ${warm}50`,
                transition: 'all 0.15s',
              }}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>

              <button type="button" onClick={() => { setScreen('login'); setError(null) }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: warm, fontWeight: 600, fontFamily: 'inherit' }}
              >← Back to sign in</button>
            </form>
          )}

          {/* ── Reset sent confirmation ── */}
          {screen === 'reset_sent' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 26,
                background: mode === 'dark' ? '#052e16' : '#f0fdf4',
                border: `1.5px solid ${mode === 'dark' ? '#166534' : '#86efac'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7"/>
                  <path d="M12 17l-5 4h10l-5-4z"/>
                  <path d="M2 10l10 7 10-7"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.ink, marginBottom: 4 }}>Email sent!</div>
                <div style={{ fontSize: 13, color: t.inkSoft }}>Check your inbox at <strong>{email}</strong> for the reset link.</div>
              </div>
              <button onClick={() => { setScreen('login'); setError(null) }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: warm, fontWeight: 600, fontFamily: 'inherit' }}
              >← Back to sign in</button>
            </div>
          )}

        </div>
      </div>

      {/* Access notice */}
      <div style={{
        marginTop: 20, padding: '10px 18px', borderRadius: 10,
        background: mode === 'dark' ? '#1a1208' : '#fffbf0',
        border: `1px solid ${mode === 'dark' ? '#7c3a10' : '#fed7aa'}`,
        fontSize: 12, color: mode === 'dark' ? '#fdba74' : '#92400e',
        textAlign: 'center', maxWidth: 400,
      }}>
        🔒 Access is restricted to <strong>@harnawainc.com</strong> accounts.<br/>
        Contact admin to get access.
      </div>

      <div style={{ marginTop: 12, fontSize: 11.5, color: t.inkFaint, textAlign: 'center' }}>
        Harnawa Insulations Pvt. Ltd. · Internal Tool · Since 1972
      </div>
    </div>
  )
}
