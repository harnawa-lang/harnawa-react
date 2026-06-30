import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'

export function ResetPasswordPage() {
  const { t, mode } = useTheme()
  const { updatePassword } = useAuth()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const warm = '#c97a34'

  function inputStyle() {
    return {
      width: '100%', boxSizing: 'border-box' as const,
      padding: '11px 14px', borderRadius: 9,
      border: `1.5px solid ${t.border}`,
      background: t.bg, color: t.ink,
      fontSize: 14, fontFamily: 'inherit', outline: 'none',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const err = await updatePassword(password)
    setLoading(false)

    if (err) setError(err)
    else setDone(true)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: mode === 'dark' ? '#0e0e0e' : '#faf8f4',
      fontFamily: '"Inter", -apple-system, sans-serif',
      padding: '24px',
    }}>
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
            {done ? 'Password updated' : 'Set new password'}
          </div>
          <div style={{ fontSize: 13, color: t.inkSoft }}>
            {done ? 'You can now sign in with your new password.' : 'Choose a strong password for your account.'}
          </div>
        </div>

        <div style={{ padding: '28px 36px 32px' }}>
          {done ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 26,
                background: mode === 'dark' ? '#052e16' : '#f0fdf4',
                border: `1.5px solid ${mode === 'dark' ? '#166534' : '#86efac'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ fontSize: 14, color: t.inkSoft }}>
                Redirecting you to sign in…
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.inkMid, marginBottom: 6 }}>
                  New password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required autoFocus
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    style={{ ...inputStyle(), paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = warm; e.target.style.boxShadow = `0 0 0 3px ${warm}20` }}
                    onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }}
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

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: t.inkMid, marginBottom: 6 }}>
                  Confirm password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  style={inputStyle()}
                  onFocus={e => { e.target.style.borderColor = warm; e.target.style.boxShadow = `0 0 0 3px ${warm}20` }}
                  onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }}
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
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 11.5, color: t.inkFaint, textAlign: 'center' }}>
        Harnawa Insulations Pvt. Ltd. · Internal Tool · Since 1972
      </div>
    </div>
  )
}
