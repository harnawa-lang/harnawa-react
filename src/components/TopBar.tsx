import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../lib/ThemeContext'
import { useAuth } from '../lib/AuthContext'

// Shows real logo PNG; falls back to SVG sun if file isn't placed yet
function LogoImage({ mode }: { mode: string }) {
  const [broken, setBroken] = useState(false)

  if (!broken) {
    return (
      <img
        src="/logo.png"
        alt="Harnawa Insulations"
        onError={() => setBroken(true)}
        style={{
          height: 44, width: 'auto', objectFit: 'contain', display: 'block',
          filter: mode === 'dark' ? 'brightness(1.1)' : 'none',
        }}
      />
    )
  }

  // Fallback SVG sun + text while logo.png is missing
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <svg width="38" height="38" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="tc">
            <rect x="0" y="0" width="64" height="38"/>
          </clipPath>
        </defs>
        <g clipPath="url(#tc)">
          <ellipse cx="32" cy="24" rx="4"   ry="12"   fill="#f5a623"/>
          <ellipse cx="32" cy="24" rx="3.8" ry="11.5" transform="rotate(-24 32 38)" fill="#f5a623"/>
          <ellipse cx="32" cy="24" rx="3.8" ry="11.5" transform="rotate( 24 32 38)" fill="#f5a623"/>
          <ellipse cx="32" cy="24" rx="3.5" ry="10.5" transform="rotate(-50 32 38)" fill="#e8821e"/>
          <ellipse cx="32" cy="24" rx="3.5" ry="10.5" transform="rotate( 50 32 38)" fill="#e8821e"/>
          <ellipse cx="32" cy="24" rx="3"   ry="9.5"  transform="rotate(-76 32 38)" fill="#c97a34"/>
          <ellipse cx="32" cy="24" rx="3"   ry="9.5"  transform="rotate( 76 32 38)" fill="#c97a34"/>
        </g>
        <path d="M8 38 Q8 58 32 58 Q56 58 56 38 Z" fill="#c97a34"/>
      </svg>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#c97a34', letterSpacing: -0.3, lineHeight: 1.1 }}>HARNAWA</div>
        <div style={{ fontSize: 9, color: '#a0622a', letterSpacing: 1.2, textTransform: 'uppercase', lineHeight: 1.2 }}>Insulations Pvt. Ltd.</div>
      </div>
    </div>
  )
}

interface Props {
  search: string
  onSearchChange: (s: string) => void
  onNewShipment: () => void
}

export function TopBar({ search, onSearchChange, onNewShipment }: Props) {
  const { t, mode, toggle } = useTheme()
  const { user, isAdmin, signOut } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const initials = user?.email
    ? user.user_metadata?.full_name
      ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
      : user.email.slice(0, 2).toUpperCase()
    : 'RH'

  const displayName = user?.user_metadata?.full_name || user?.email || ''
  const avatarUrl   = user?.user_metadata?.avatar_url as string | undefined

  const onShipments = location.pathname.startsWith('/shipments')
  const onSuppliers = location.pathname.startsWith('/suppliers')

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '0 28px', height: 60, gap: 24,
      borderBottom: `1px solid ${t.border}`,
      background: t.bg, flexShrink: 0,
    }}>

      {/* Logo — click to go home */}
      <div
        onClick={() => navigate('/shipments')}
        style={{ flexShrink: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <LogoImage mode={mode} />
      </div>

      {/* Vertical divider */}
      <div style={{ width: 1, height: 28, background: t.border, flexShrink: 0 }} />

      {/* Nav tabs — simple, no breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <button
          onClick={() => navigate('/shipments')}
          style={{
            border: 'none',
            background: onShipments ? t.bgDeep : 'transparent',
            color: onShipments ? t.ink : t.inkMid,
            padding: '6px 16px', borderRadius: 6, cursor: 'pointer',
            fontSize: 13, fontWeight: onShipments ? 600 : 500,
            fontFamily: 'inherit',
            transition: 'background 0.12s, color 0.12s',
          }}
        >Shipments</button>

        <button
          onClick={() => navigate('/suppliers')}
          style={{
            border: 'none',
            background: onSuppliers ? t.bgDeep : 'transparent',
            color: onSuppliers ? t.ink : t.inkMid,
            padding: '6px 16px', borderRadius: 6, cursor: 'pointer',
            fontSize: 13, fontWeight: onSuppliers ? 600 : 500,
            fontFamily: 'inherit',
            transition: 'background 0.12s, color 0.12s',
          }}
        >Suppliers</button>
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search + New shipment (only on shipments) */}
      {onShipments && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', borderRadius: 9,
            border: `1.5px solid ${search ? t.primary : t.border}`,
            background: t.panel, width: 300,
            boxShadow: search ? `0 0 0 3px ${t.primary}15` : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: t.inkSoft }}>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M9.5 9.5 L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search shipment, supplier, BL…"
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13.5, fontFamily: 'inherit', color: t.ink, width: '100%',
              }}
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.inkSoft, padding: 0, fontSize: 18, lineHeight: 1 }}
              >×</button>
            )}
          </div>

          <button onClick={onNewShipment} style={{
            border: 'none', cursor: 'pointer',
            background: t.primary, color: '#fff',
            padding: '8px 20px', borderRadius: 9,
            fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            display: 'inline-flex', gap: 7, alignItems: 'center',
            boxShadow: `0 2px 10px ${t.primary}50`, flexShrink: 0,
            whiteSpace: 'nowrap',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 2 V12 M2 7 H12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            New shipment
          </button>
        </div>
      )}

      {/* Dark mode toggle + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button
          onClick={toggle}
          title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          style={{
            border: `1px solid ${t.border}`, background: t.bgSoft,
            borderRadius: 8, cursor: 'pointer',
            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: t.inkMid,
          }}
        >
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

        {/* User avatar + dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: 34, height: 34, borderRadius: 17, border: `2px solid ${menuOpen ? '#c97a34' : t.border}`,
              background: 'none', cursor: 'pointer', padding: 0, overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%', borderRadius: 17,
                background: '#c97a34', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
              }}>{initials}</div>
            )}
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 230, background: t.panel,
              border: `1px solid ${t.border}`, borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 9999, overflow: 'hidden',
              animation: 'fadeIn 0.1s ease',
            }}>
              {/* User info */}
              <div style={{
                padding: '14px 16px 12px',
                borderBottom: `1px solid ${t.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 18, flexShrink: 0,
                    background: '#c97a34', color: '#fff', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                  }}>
                    {avatarUrl
                      ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    {displayName && (
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: t.ink,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{displayName}</div>
                    )}
                    <div style={{
                      fontSize: 11, color: t.inkSoft,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{user?.email}</div>
                  </div>
                </div>
                {isAdmin && (
                  <div style={{
                    marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                    padding: '2px 8px', borderRadius: 4,
                    background: mode === 'dark' ? '#3d2008' : '#fff7ed',
                    color: '#c97a34',
                    border: `1px solid ${mode === 'dark' ? '#7c3a10' : '#fed7aa'}`,
                  }}>
                    ★ ADMIN
                  </div>
                )}
              </div>

              {/* Menu items */}
              <div style={{ padding: '6px' }}>
                <button
                  onClick={() => { setMenuOpen(false); signOut() }}
                  style={{
                    width: '100%', padding: '9px 12px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    border: 'none', background: 'none', cursor: 'pointer',
                    borderRadius: 7, textAlign: 'left', fontFamily: 'inherit',
                    fontSize: 13, color: '#ef4444',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = mode === 'dark' ? '#450a0a' : '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
