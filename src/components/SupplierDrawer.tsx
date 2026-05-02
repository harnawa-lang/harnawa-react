import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../lib/ThemeContext'
import { useShipments } from '../lib/store'
import { DOC_TYPES, stageColor, fmtMoney, docOk, docUrl, docName, docSize } from '../lib/data'
import { fmtBytes } from '../lib/compress'
import { StatusPill, ModeChip, CountryFlag, ETAChip } from './atoms'
import type { Shipment, DocSet, DocValue } from '../lib/types'

interface Props {
  supplierName: string
  onClose: () => void
}

type Tab = 'all' | 'active' | 'delivered' | 'cancelled'

// ── Doc pill — view only, live from store ─────────────────────────────
function DocPill({ docKey, value }: { docKey: string; value: DocValue | undefined }) {
  const { t, mode } = useTheme()
  const have  = docOk(value)
  const url   = docUrl(value)
  const fname = docName(value)
  const fsize = docSize(value)
  const label = DOC_TYPES.find(d => d.key === docKey)?.label ?? docKey
  const greenBg  = mode === 'dark' ? '#052e16' : '#f0fdf4'
  const greenBdr = mode === 'dark' ? '#166534' : '#86efac'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 8,
      background: have ? greenBg : t.bgSoft,
      border: `1.5px solid ${have ? greenBdr : t.border}`,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 7, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: have ? '#16a34a' : t.bgDeep,
        border: have ? 'none' : `1.5px dashed ${t.border}`,
      }}>
        {have ? (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7.5 L5.5 11 L12 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ color: t.border }}>
            <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M4.5 5 H9.5 M4.5 7.5 H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, fontFamily: '"JetBrains Mono", monospace',
            color: have ? '#16a34a' : t.inkFaint, letterSpacing: 0.3,
          }}>{docKey}</span>
          <span style={{ fontSize: 11.5, fontWeight: have ? 600 : 400, color: have ? t.ink : t.inkMid }}>
            {label}
          </span>
        </div>
        {have && fname ? (
          <div style={{ fontSize: 10, color: t.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fname}{fsize !== undefined ? ` · ${fmtBytes(fsize)}` : ''}
          </div>
        ) : (
          <div style={{ fontSize: 10, color: t.inkFaint, fontStyle: 'italic' }}>Not uploaded</div>
        )}
      </div>
      {have && url && (
        <button
          onClick={() => window.open(url, '_blank', 'noopener')}
          style={{
            border: `1px solid ${greenBdr}`,
            background: mode === 'dark' ? '#14532d' : '#dcfce7',
            color: '#16a34a', cursor: 'pointer',
            padding: '4px 10px', borderRadius: 5,
            fontSize: 10.5, fontWeight: 700, flexShrink: 0, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <path d="M2 10 L10 2 M5.5 2 H10 V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View
        </button>
      )}
    </div>
  )
}

// ── Expandable shipment row ────────────────────────────────────────────
function ShipmentRow({ s }: { s: Shipment }) {
  const { t, mode } = useTheme()
  const [expanded, setExpanded] = useState(false)

  const isCancelled = !!s.cancelled
  const stageC      = stageColor(s.stage)
  const docs        = s.docs ?? {}
  const history     = s.history ?? []
  const docsCount   = DOC_TYPES.filter(d => docOk(docs[d.key as keyof DocSet])).length
  const latest      = history.length > 0 ? history[history.length - 1] : null
  const accent      = isCancelled ? t.border : stageC

  return (
    <div style={{
      border: `1px solid ${t.border}`,
      borderLeft: `3px solid ${expanded ? accent : (isCancelled ? t.border : accent + '80')}`,
      borderRadius: 10, overflow: 'hidden',
      background: t.panel,
      opacity: isCancelled ? 0.75 : 1,
      transition: 'border-left-color 0.15s',
    }}>
      {/* ── Collapsed row — always visible ── */}
      <div
        onClick={() => setExpanded(o => !o)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto auto',
          gap: 12,
          padding: '13px 16px',
          cursor: 'pointer',
          alignItems: 'center',
          background: expanded
            ? (mode === 'dark' ? '#1a1a1a' : '#fafaf8')
            : 'transparent',
        }}
      >
        {/* Left: status + mode + route */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {isCancelled
              ? <span style={{
                  fontSize: 10.5, fontWeight: 700, color: t.bad,
                  padding: '2px 8px', borderRadius: 999, background: t.badSoft,
                }}>Cancelled</span>
              : <StatusPill stage={s.stage} size="xs" />
            }
            <ModeChip mode={s.mode} size="xs" />
          </div>
          {/* Route */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 12.5, fontWeight: 600, color: t.inkMid,
            minWidth: 0, overflow: 'hidden',
          }}>
            <CountryFlag cc={s.pol_code?.slice(0, 2) ?? s.supplier_country} size={13} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: t.ink }}>
              {s.pol || '—'}
            </span>
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none" style={{ flexShrink: 0, color: t.inkFaint }}>
              <path d="M0 4 H12 M10 1.5 L12 4 L10 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <CountryFlag cc={s.pod_code?.slice(0, 2) ?? 'IN'} size={13} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: t.ink }}>
              {s.pod || '—'}
            </span>
          </div>
        </div>

        {/* ETA */}
        <div style={{ fontSize: 11, color: t.inkSoft, flexShrink: 0, whiteSpace: 'nowrap' }}>
          <ETAChip shipment={s} />
        </div>

        {/* Value */}
        <div style={{
          fontSize: 13, fontWeight: 700, color: t.ink,
          fontVariantNumeric: 'tabular-nums', flexShrink: 0, textAlign: 'right',
        }}>
          {fmtMoney(s.value, s.currency)}
          <div style={{ fontSize: 9.5, color: t.inkFaint, fontWeight: 400, fontFamily: '"JetBrains Mono", monospace' }}>
            {s.currency}
          </div>
        </div>

        {/* Docs badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          fontSize: 10.5, fontWeight: 700,
          color: docsCount > 0 ? '#16a34a' : t.inkFaint,
        }}>
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M4.5 5 H9.5 M4.5 7.5 H9.5 M4.5 10 H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {docsCount}/{DOC_TYPES.length}
        </div>

        {/* Expand chevron */}
        <div style={{ color: t.inkFaint, flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" style={{
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.18s',
          }}>
            <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div style={{
          borderTop: `1px solid ${t.border}`,
          padding: '16px 18px 18px',
          background: mode === 'dark' ? '#111' : '#fafaf8',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>

          {/* BL + Container highlight box */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
            padding: '13px 16px', borderRadius: 9,
            background: mode === 'dark' ? '#1a2332' : '#eff6ff',
            border: `1.5px solid ${mode === 'dark' ? '#1e3a5f' : '#bfdbfe'}`,
          }}>
            <div>
              <div style={{
                fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8,
                textTransform: 'uppercase', marginBottom: 5,
                color: mode === 'dark' ? '#60a5fa' : '#2563eb',
              }}>
                {s.mode === 'AIR' ? 'AWB No.' : s.mode === 'COURIER' ? 'Tracking' : 'BL No.'}
              </div>
              <div style={{
                fontSize: 16, fontWeight: 700,
                fontFamily: '"JetBrains Mono", monospace',
                color: s.bol ? t.ink : t.inkFaint,
                fontStyle: s.bol ? 'normal' : 'italic',
                wordBreak: 'break-all', lineHeight: 1.3,
              }}>
                {s.bol || 'Not entered'}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8,
                textTransform: 'uppercase', marginBottom: 5,
                color: t.inkSoft,
              }}>
                {s.mode === 'SEA_FCL' || s.mode === 'SEA_LCL' ? 'Container No.' : 'Ref No.'}
              </div>
              <div style={{
                fontSize: 16, fontWeight: 700,
                fontFamily: '"JetBrains Mono", monospace',
                color: s.container ? t.inkMid : t.inkFaint,
                fontStyle: s.container ? 'normal' : 'italic',
                wordBreak: 'break-all', lineHeight: 1.3,
              }}>
                {s.container || '—'}
              </div>
            </div>
          </div>

          {/* Route + dates + tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 5,
              fontFamily: '"JetBrains Mono", monospace',
              background: mode === 'dark' ? '#134e4a' : '#ccfbf1',
              color: mode === 'dark' ? '#5eead4' : '#0f766e',
            }}>ETD {s.etd || '—'}</span>

            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 5,
              fontFamily: '"JetBrains Mono", monospace',
              background: mode === 'dark' ? '#431407' : '#fef3c7',
              color: mode === 'dark' ? '#fdba74' : '#92400e',
            }}>ETA <ETAChip shipment={s} /></span>

            {s.incoterm && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 4,
                background: t.bgSoft, color: t.inkMid,
                border: `1px solid ${t.border}`,
                fontFamily: '"JetBrains Mono", monospace',
              }}>{s.incoterm}</span>
            )}
            {s.carrier && <span style={{ fontSize: 11, color: t.inkSoft }}>via {s.carrier}</span>}
            {s.material && (
              <span style={{
                fontSize: 11, fontWeight: 500,
                padding: '3px 9px', borderRadius: 5,
                background: mode === 'dark' ? '#2d1b69' : '#ede9fe',
                color: mode === 'dark' ? '#c4b5fd' : '#6d28d9',
                border: `1px solid ${mode === 'dark' ? '#4c1d95' : '#ddd6fe'}`,
              }}>📦 {s.material}</span>
            )}
          </div>

          {/* Latest comment */}
          {latest && latest.note && (
            <div style={{
              padding: '10px 13px', borderRadius: 8,
              background: t.bgSoft, border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontSize: 12.5, color: t.ink, lineHeight: 1.5, marginBottom: 4 }}>
                {latest.note}
              </div>
              <div style={{
                fontSize: 10, color: t.inkFaint,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M6 3.5 V6 L7.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {latest.who} · {(latest.at ?? '').slice(0, 10)}
              </div>
            </div>
          )}

          {/* Documents */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: t.inkSoft }}>
                  <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M4.5 5 H9.5 M4.5 7.5 H9.5 M4.5 10 H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.inkMid, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                  Documents
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {/* mini progress bar */}
                <div style={{ width: 60, height: 4, borderRadius: 2, background: t.bgDeep, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${(docsCount / DOC_TYPES.length) * 100}%`,
                    background: docsCount === DOC_TYPES.length ? '#16a34a' : t.primary,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: docsCount === DOC_TYPES.length ? '#16a34a' : docsCount > 0 ? t.primary : t.inkFaint,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {docsCount}<span style={{ color: t.inkFaint, fontWeight: 400 }}>/{DOC_TYPES.length}</span>
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DOC_TYPES.map(d => (
                <DocPill
                  key={d.key}
                  docKey={d.key}
                  value={docs[d.key as keyof DocSet] as DocValue | undefined}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main drawer ───────────────────────────────────────────────────────
export function SupplierDrawer({ supplierName, onClose }: Props) {
  const { t, mode } = useTheme()
  const { shipments } = useShipments()
  const [tab, setTab] = useState<Tab>('all')
  const [search, setSearch] = useState('')

  const all = shipments
    .filter(s => s.supplier === supplierName)
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())

  const supplierCountry = all[0]?.supplier_country ?? ''
  const active    = all.filter(s => !s.cancelled && s.stage < 6)
  const delivered = all.filter(s => !s.cancelled && s.stage === 6)
  const cancelled = all.filter(s => !!s.cancelled)

  const totalValueUsd = all
    .filter(s => !s.cancelled)
    .reduce((sum, s) => {
      const usd = s.currency === 'USD' ? s.value : s.currency === 'EUR' ? s.value * 1.08 : s.value / 83
      return sum + usd
    }, 0)

  const tabList = tab === 'active' ? active
    : tab === 'delivered' ? delivered
    : tab === 'cancelled' ? cancelled
    : all

  const q = search.trim().toLowerCase()
  const displayed = q
    ? tabList.filter(s =>
        s.id.toLowerCase().includes(q) ||
        (s.bol || '').toLowerCase().includes(q) ||
        (s.container || '').toLowerCase().includes(q) ||
        (s.material || '').toLowerCase().includes(q) ||
        (s.pol || '').toLowerCase().includes(q) ||
        (s.pod || '').toLowerCase().includes(q)
      )
    : tabList

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all',       label: 'All',       count: all.length },
    { key: 'active',    label: 'Active',    count: active.length },
    { key: 'delivered', label: 'Delivered', count: delivered.length },
    { key: 'cancelled', label: 'Cancelled', count: cancelled.length },
  ]

  return createPortal(
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: mode === 'dark' ? 'rgba(0,0,0,0.65)' : 'rgba(20,12,4,0.50)',
        backdropFilter: 'blur(4px)',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 700,
        background: t.bg, borderLeft: `1px solid ${t.border}`,
        boxShadow: '-20px 0 60px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        zIndex: 201,
        animation: 'slideIn 0.22s cubic-bezier(0.22,1,0.36,1)',
        fontFamily: 'inherit',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '20px 24px 16px',
          background: t.panel, borderBottom: `1px solid ${t.border}`,
          flexShrink: 0,
        }}>
          {/* Supplier name + close */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 12,
                background: t.bgDeep, overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${t.border}`,
              }}>
                <CountryFlag cc={supplierCountry} size={50} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: t.ink, lineHeight: 1.2 }}>
                  {supplierName}
                </div>
                <div style={{ fontSize: 12.5, color: t.inkSoft, marginTop: 3 }}>
                  {supplierCountry} · {all.length} shipment{all.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              border: `1px solid ${t.border}`, background: t.bgSoft, cursor: 'pointer',
              color: t.inkMid, width: 32, height: 32, borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            background: t.bgSoft, borderRadius: 10,
            border: `1px solid ${t.border}`, overflow: 'hidden', marginBottom: 16,
          }}>
            {([
              { label: 'Total',     value: all.length,       color: t.ink },
              { label: 'Active',    value: active.length,    color: active.length    ? t.primary  : t.inkMid },
              { label: 'Delivered', value: delivered.length, color: delivered.length ? '#16a34a'  : t.inkMid },
              { label: 'Value',     value: `$${(totalValueUsd / 1000).toFixed(0)}K`, color: t.ink },
            ] as { label: string; value: string | number; color: string }[]).map((stat, i) => (
              <div key={stat.label} style={{
                padding: '13px 0', textAlign: 'center',
                borderRight: i < 3 ? `1px solid ${t.border}` : 'none',
              }}>
                <div style={{
                  fontSize: 21, fontWeight: 800, color: stat.color,
                  fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 9.5, color: t.inkSoft, fontWeight: 600,
                  letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 4,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs + search */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {tabs.map(tb => (
                <button key={tb.key} onClick={() => setTab(tb.key)} style={{
                  border: `1px solid ${tab === tb.key ? t.primary : t.border}`,
                  background: tab === tb.key ? t.primarySoft : 'transparent',
                  color: tab === tb.key ? t.primary : t.inkMid,
                  padding: '5px 13px', borderRadius: 6, cursor: 'pointer',
                  fontSize: 12, fontWeight: tab === tb.key ? 700 : 500,
                  fontFamily: 'inherit',
                  display: 'inline-flex', gap: 5, alignItems: 'center',
                }}>
                  {tb.label}
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '0px 5px', borderRadius: 8,
                    background: tab === tb.key ? t.primary : t.bgDeep,
                    color: tab === tb.key ? '#fff' : t.inkFaint,
                  }}>{tb.count}</span>
                </button>
              ))}
            </div>

            {/* Search within supplier */}
            <div style={{ position: 'relative' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{
                position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
                color: t.inkFaint, pointerEvents: 'none',
              }}>
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 10 L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search shipments…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '6px 10px 6px 28px',
                  border: `1px solid ${t.border}`,
                  borderRadius: 6, background: t.bg,
                  color: t.ink, fontSize: 12, width: 170,
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Shipment list ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '16px 24px 36px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {displayed.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              color: t.inkSoft, fontSize: 13,
            }}>
              {q ? `No shipments match "${search}"` : 'No shipments in this category.'}
            </div>
          ) : (
            displayed.map(s => <ShipmentRow key={s.id} s={s} />)
          )}
        </div>

      </div>
    </>,
    document.body,
  )
}
