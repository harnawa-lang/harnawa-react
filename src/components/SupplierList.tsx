import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/ThemeContext'
import { useShipments } from '../lib/store'
import { CountryFlag } from './atoms'

export function SupplierList() {
  const { t, mode } = useTheme()
  const { shipments } = useShipments()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const bySupplier = shipments.reduce<Record<string, {
    name: string; country: string; count: number; value: number
    active: number; delivered: number; cancelled: number
    searchBlob: string
  }>>((acc, s) => {
    if (!acc[s.supplier]) {
      acc[s.supplier] = {
        name: s.supplier, country: s.supplier_country,
        count: 0, value: 0, active: 0, delivered: 0, cancelled: 0,
        searchBlob: '',
      }
    }
    acc[s.supplier].count++
    const usd = s.currency === 'USD' ? s.value : s.currency === 'EUR' ? s.value * 1.08 : s.value / 83
    acc[s.supplier].value += usd
    if (s.cancelled)        acc[s.supplier].cancelled++
    else if (s.stage === 6) acc[s.supplier].delivered++
    else                    acc[s.supplier].active++
    acc[s.supplier].searchBlob += ` ${s.bol ?? ''} ${s.container ?? ''} ${s.material ?? ''} ${s.pol ?? ''} ${s.pod ?? ''} ${s.carrier ?? ''} ${s.id}`
    return acc
  }, {})

  const allSuppliers = Object.values(bySupplier).sort((a, b) => b.value - a.value)
  const q = search.trim().toLowerCase()
  const suppliers = q
    ? allSuppliers.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.searchBlob.toLowerCase().includes(q)
      )
    : allSuppliers

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: t.bg }}>

      {/* Header */}
      <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: t.ink, marginBottom: 3 }}>Suppliers</h2>
          <p style={{ fontSize: 13, color: t.inkSoft }}>
            {allSuppliers.length} supplier{allSuppliers.length !== 1 ? 's' : ''} · click any row to view full shipment history &amp; documents
          </p>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: t.inkFaint, pointerEvents: 'none',
          }}>
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10 L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by supplier name, country, product, BL number, container, port…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '12px 44px 12px 42px',
              border: `1.5px solid ${search ? t.primary : t.border}`,
              borderRadius: 10,
              background: t.panel, color: t.ink,
              fontSize: 14, outline: 'none', fontFamily: 'inherit',
              boxShadow: search ? `0 0 0 3px ${t.primary}18` : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
          {search ? (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                border: `1px solid ${t.border}`, background: t.bgSoft, cursor: 'pointer',
                color: t.inkMid, padding: '3px 10px', borderRadius: 6,
                fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Clear
            </button>
          ) : (
            <div style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {['Name', 'BL No.', 'Product', 'Port'].map(tag => (
                <span key={tag} style={{
                  fontSize: 10.5, fontWeight: 500, color: t.inkFaint,
                  padding: '2px 7px', borderRadius: 4,
                  border: `1px solid ${t.border}`, background: t.bgSoft,
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        {q && (
          <div style={{ fontSize: 12, color: t.inkSoft, marginBottom: 12 }}>
            {suppliers.length === 0
              ? `No results for "${search}"`
              : `${suppliers.length} of ${allSuppliers.length} suppliers match`}
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 36px' }}>
        {suppliers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: t.inkSoft, fontSize: 14 }}>
            No suppliers found matching <strong style={{ color: t.inkMid }}>"{search}"</strong>
          </div>
        ) : (
          <div style={{
            border: `1px solid ${t.border}`, borderRadius: 12,
            overflow: 'hidden', background: t.panel,
          }}>
            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 100px 110px 130px 36px',
              padding: '11px 22px',
              background: t.bgSoft,
              borderBottom: `1px solid ${t.border}`,
              gap: 12,
            }}>
              {[
                { label: 'Supplier',    align: 'left'   },
                { label: 'Active',      align: 'center' },
                { label: 'Delivered',   align: 'center' },
                { label: 'Cancelled',   align: 'center' },
                { label: 'Total Value', align: 'center' },
                { label: '',            align: 'right'  },
              ].map(h => (
                <div key={h.label} style={{
                  fontSize: 10.5, fontWeight: 700, color: t.inkFaint,
                  letterSpacing: 0.6, textTransform: 'uppercase',
                  textAlign: h.align as React.CSSProperties['textAlign'],
                }}>{h.label}</div>
              ))}
            </div>

            {suppliers.map((sup, i) => (
              <div
                key={sup.name}
                onClick={() => navigate(`/suppliers/${encodeURIComponent(sup.name)}`)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 100px 110px 130px 36px',
                  padding: '16px 22px',
                  gap: 12,
                  alignItems: 'center',
                  borderBottom: i < suppliers.length - 1 ? `1px solid ${t.border}` : 'none',
                  cursor: 'pointer',
                  background: 'transparent',
                  borderLeft: '3px solid transparent',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = mode === 'dark' ? '#ffffff08' : '#f7f5f0'
                  e.currentTarget.style.borderLeftColor = t.primary
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderLeftColor = 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: t.bgDeep, flexShrink: 0, overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${t.border}`,
                  }}>
                    <CountryFlag cc={sup.country} size={40} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: t.ink,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      marginBottom: 2,
                    }}>{sup.name}</div>
                    <div style={{ fontSize: 11.5, color: t.inkSoft }}>
                      {sup.country} · {sup.count} shipment{sup.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: sup.active ? t.primary : t.inkFaint, fontVariantNumeric: 'tabular-nums' }}>
                    {sup.active}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: sup.delivered ? '#16a34a' : t.inkFaint, fontVariantNumeric: 'tabular-nums' }}>
                    {sup.delivered}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: sup.cancelled ? t.bad : t.inkFaint, fontVariantNumeric: 'tabular-nums' }}>
                    {sup.cancelled}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>
                    ${(sup.value / 1000).toFixed(0)}K
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', color: t.inkFaint }}>
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3 L9 7 L5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
