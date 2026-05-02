import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, useTheme } from './lib/ThemeContext'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { TopBar } from './components/TopBar'
import { ShipmentTable } from './components/ShipmentTable'
import { SupplierList } from './components/SupplierList'
import { SupplierPage } from './components/SupplierPage'
import { LoginPage } from './components/LoginPage'

function AppInner() {
  const { t } = useTheme()
  const { user, loading } = useAuth()
  const [search, setSearch]         = useState('')
  const [showCreate, setShowCreate] = useState(false)

  // Full-screen loading spinner while session is being restored
  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.bg, flexDirection: 'column', gap: 16,
      }}>
        <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <defs><clipPath id="lc"><rect x="0" y="0" width="64" height="38"/></clipPath></defs>
          <g clipPath="url(#lc)">
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
        <div style={{ fontSize: 13, color: t.inkSoft }}>Loading…</div>
      </div>
    )
  }

  // Not logged in → show login page
  if (!user) return <LoginPage />

  // Logged in → full app
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: t.bg,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      color: t.ink,
    }}>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onNewShipment={() => setShowCreate(true)}
      />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/shipments" replace />} />
          <Route
            path="/shipments"
            element={
              <ShipmentTable
                search={search}
                onSearchChange={setSearch}
                showCreate={showCreate}
                onCloseCreate={() => setShowCreate(false)}
                onNewShipment={() => setShowCreate(true)}
              />
            }
          />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/:supplierName" element={<SupplierPage />} />
          <Route path="*" element={<Navigate to="/shipments" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  )
}
