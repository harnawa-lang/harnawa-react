import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/ThemeContext'
import { useShipments } from '../lib/store'
import { DOC_TYPES, stageColor, fmtMoney, docOk, docUrl, docName, docSize } from '../lib/data'
import { fmtBytes } from '../lib/compress'
import { StatusPill, ModeChip, CountryFlag, ETAChip } from './atoms'
import { ExtraDocsSection } from './ExtraDocsSection'
import type { Shipment, DocSet, DocValue } from '../lib/types'

type Tab = 'all' | 'active' | 'delivered' | 'cancelled'

// ── Document tile — Windows "large icon" style ─────────────────────────
function DocTile({ docKey, value }: { docKey: string; value: DocValue | undefined }) {
  const { t, mode } = useTheme()
  const have  = docOk(value)
  const url   = docUrl(value)
  const fname = docName(value)
  const fsize = docSize(value)
  const label = DOC_TYPES.find(d => d.key === docKey)?.label ?? docKey

  const greenBg  = mode === 'dark' ? '#052e16' : '#f0fdf4'
  const greenBdr = mode === 'dark' ? '#166534' : '#86efac'

  return (
    <div
      onClick={have && url ? () => window.open(url, '_blank', 'noopener') : undefined}
      title={have && fname ? `${fname}${fsize !== undefined ? ` · ${fmtBytes(fsize)}` : ''}` : label}
      style={{
        flex: '1 1 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 8px 12px',
        borderRadius: 12,
        background: have ? greenBg : t.bgSoft,
        border: `1.5px solid ${have ? greenBdr : t.border}`,
        cursor: have ? 'pointer' : 'default',
        gap: 10,
        transition: 'all 0.15s',
        minWidth: 0,
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (have) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Document icon */}
      <div style={{ position: 'relative', width: 44, height: 54, flexShrink: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '6px 10px 6px 6px',
          background: have ? '#16a34a' : (mode === 'dark' ? '#2a2a2a' : '#e5e0d8'),
          border: `1.5px solid ${have ? '#15803d' : (mode === 'dark' ? '#3a3a3a' : '#d1ccc4')}`,
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 14, height: 14,
          background: have ? '#15803d' : (mode === 'dark' ? '#222' : '#f5f2ec'),
          borderRadius: '0 0 0 6px',
          borderBottom: `1.5px solid ${have ? '#16a34a' : (mode === 'dark' ? '#3a3a3a' : '#d1ccc4')}`,
          borderLeft: `1.5px solid ${have ? '#16a34a' : (mode === 'dark' ? '#3a3a3a' : '#d1ccc4')}`,
        }} />
        {have ? (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10.5 L8 15.5 L17 5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ) : (
          <div style={{
            position: 'absolute', bottom: 10, left: 8, right: 8,
            display: 'flex', flexDirection: 'column', gap: 3,
          }}>
            {[100, 80, 60].map((w, i) => (
              <div key={i} style={{
                height: 2, borderRadius: 1,
                width: `${w}%`,
                background: mode === 'dark' ? '#444' : '#c8c2b8',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{
          fontSize: 11, fontWeight: 800,
          fontFamily: '"JetBrains Mono", monospace',
          color: have ? '#16a34a' : t.inkFaint,
          marginBottom: 2, letterSpacing: 0.3,
        }}>{docKey}</div>
        <div style={{
          fontSize: 10.5, fontWeight: 500,
          color: have ? t.ink : t.inkMid,
          lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box' as React.CSSProperties['display'],
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as React.CSSProperties['WebkitBoxOrient'],
        }}>{label}</div>
        {have && fname && (
          <div style={{
            marginTop: 3, fontSize: 9, color: t.inkFaint,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {fsize !== undefined ? fmtBytes(fsize) : 'Uploaded'}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shipment card — rich 2-row design ────────────────────────────────
function ShipmentCard({ s, index }: { s: Shipment; index: number }) {
  const { t, mode } = useTheme()
  const [open, setOpen] = useState(false)

  const isCancelled = !!s.cancelled
  const stageC      = stageColor(s.stage)
  const docs        = s.docs ?? {}
  const docsCount   = DOC_TYPES.filter(d => docOk(docs[d.key as keyof DocSet])).length
  const accent      = isCancelled ? '#94a3b8' : stageC
  const allDocs     = docsCount === DOC_TYPES.length

  // Format a date string nicely: "2026-04-30" → "Apr 30"
  function fmtDate(d?: string) {
    if (!d) return null
    const dt = new Date(d)
    if (isNaN(dt.getTime())) return d
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{
      borderRadius: 0,
      background: t.panel,
      border: `1px solid ${open ? accent + '60' : t.border}`,
      borderLeft: `4px solid ${accent}`,
      overflow: 'hidden',
      boxShadow: open
        ? `0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)`
        : `0 1px 3px rgba(0,0,0,0.04)`,
      opacity: isCancelled ? 0.72 : 1,
      transition: 'box-shadow 0.2s, border-color 0.2s, opacity 0.15s',
    }}>

      {/* ── Clickable summary area (2 rows) ── */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          cursor: 'pointer',
          background: open ? (mode === 'dark' ? '#161616' : '#fafaf8') : 'transparent',
          transition: 'background 0.15s',
          userSelect: 'none',
        }}
        onMouseEnter={e => {
          if (!open) e.currentTarget.style.background = mode === 'dark' ? '#1a1a1a' : '#f9f8f6'
        }}
        onMouseLeave={e => {
          if (!open) e.currentTarget.style.background = 'transparent'
        }}
      >
        {/* ── Row 1: index + status + mode + BL + chevron ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px 8px',
        }}>
          {/* Number badge */}
          <div style={{
            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: open
              ? accent
              : (mode === 'dark' ? '#1e293b' : `${accent}18`),
            border: `1.5px solid ${open ? accent : `${accent}50`}`,
            fontSize: 11, fontWeight: 800,
            color: open ? '#fff' : accent,
            fontVariantNumeric: 'tabular-nums',
            fontFamily: '"JetBrains Mono", monospace',
            transition: 'all 0.2s',
          }}>
            {index + 1}
          </div>

          {/* Status + mode chips */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
            {isCancelled ? (
              <span style={{
                fontSize: 10.5, fontWeight: 700, color: '#ef4444',
                padding: '2px 8px', borderRadius: 999,
                background: mode === 'dark' ? '#450a0a' : '#fef2f2',
                border: `1px solid ${mode === 'dark' ? '#7f1d1d' : '#fecaca'}`,
              }}>Cancelled</span>
            ) : (
              <StatusPill stage={s.stage} size="xs" />
            )}
            <ModeChip mode={s.mode} size="xs" />
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 16, background: t.border, flexShrink: 0 }} />

          {/* BL number — hero element */}
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
            color: s.bol
              ? (mode === 'dark' ? '#93c5fd' : '#1d4ed8')
              : t.inkFaint,
            fontStyle: s.bol ? 'normal' : 'italic',
            flexShrink: 0,
            maxWidth: 180,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {s.bol || '— No BL —'}
          </div>

          {/* Container if exists */}
          {s.container && (
            <>
              <div style={{ width: 1, height: 14, background: t.border, flexShrink: 0 }} />
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11, fontWeight: 600, color: t.inkMid,
                maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {s.container}
              </div>
            </>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Material tag */}
          {s.material && (
            <span style={{
              fontSize: 10.5, fontWeight: 600,
              padding: '3px 10px', borderRadius: 5,
              background: mode === 'dark' ? '#2d1b69' : '#ede9fe',
              color: mode === 'dark' ? '#c4b5fd' : '#6d28d9',
              border: `1px solid ${mode === 'dark' ? '#4c1d95' : '#ddd6fe'}`,
              flexShrink: 0, maxWidth: 140,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {s.material}
            </span>
          )}

          {/* Chevron */}
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{
            color: t.inkFaint, flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* ── Row 2: route · dates · value · docs ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          padding: '0 18px 14px 54px',
          flexWrap: 'wrap', rowGap: 6,
        }}>
          {/* Route */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 }}>
            <CountryFlag cc={s.pol_code?.slice(0, 2) ?? s.supplier_country} size={13} />
            <span style={{
              fontSize: 12.5, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap',
              maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{s.pol || '—'}</span>
            {s.pol_code && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                fontFamily: '"JetBrains Mono", monospace',
                color: mode === 'dark' ? '#60a5fa' : '#3b82f6',
                background: mode === 'dark' ? '#172554' : '#eff6ff',
                padding: '1px 5px', borderRadius: 4,
              }}>{s.pol_code}</span>
            )}
            {/* Arrow */}
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" style={{ flexShrink: 0, color: t.inkFaint, margin: '0 2px' }}>
              <path d="M0 4 H16 M12.5 1.5 L16 4 L12.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <CountryFlag cc={s.pod_code?.slice(0, 2) ?? 'IN'} size={13} />
            <span style={{
              fontSize: 12.5, fontWeight: 600, color: t.ink,
              maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{s.pod || '—'}</span>
            {s.pod_code && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                fontFamily: '"JetBrains Mono", monospace',
                color: mode === 'dark' ? '#fb923c' : '#b45309',
                background: mode === 'dark' ? '#431407' : '#fff7ed',
                padding: '1px 5px', borderRadius: 4,
              }}>{s.pod_code}</span>
            )}
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 16, background: t.border, flexShrink: 0, margin: '0 14px' }} />

          {/* ETD → ETA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {s.etd && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: t.inkFaint, marginBottom: 1 }}>ETD</div>
                  <div style={{
                    fontSize: 12, fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                    color: mode === 'dark' ? '#5eead4' : '#0f766e',
                  }}>{fmtDate(s.etd)}</div>
                </div>
                <svg width="16" height="6" viewBox="0 0 16 6" fill="none" style={{ color: t.inkFaint, flexShrink: 0 }}>
                  <path d="M0 3 H12 M10 1 L12.5 3 L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: t.inkFaint, marginBottom: 1 }}>ETA</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>
                <ETAChip shipment={s} />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 16, background: t.border, flexShrink: 0, margin: '0 14px' }} />

          {/* Value */}
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{
              fontSize: 15, fontWeight: 800, color: t.ink,
              fontVariantNumeric: 'tabular-nums', lineHeight: 1,
            }}>
              {fmtMoney(s.value, s.currency)}
            </div>
            <div style={{
              fontSize: 9, color: t.inkFaint, fontWeight: 700,
              fontFamily: '"JetBrains Mono", monospace', marginTop: 2, letterSpacing: 0.5,
            }}>{s.currency}</div>
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 16, background: t.border, flexShrink: 0, margin: '0 14px' }} />

          {/* Docs pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            padding: '4px 10px', borderRadius: 8,
            background: allDocs
              ? (mode === 'dark' ? '#052e16' : '#f0fdf4')
              : docsCount > 0
                ? t.bgSoft
                : t.bgSoft,
            border: `1px solid ${allDocs
              ? (mode === 'dark' ? '#166534' : '#86efac')
              : t.border}`,
          }}>
            {/* Mini doc progress bar */}
            <div style={{ width: 28, height: 3, borderRadius: 2, background: t.bgDeep, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${(docsCount / DOC_TYPES.length) * 100}%`,
                background: allDocs ? '#16a34a' : docsCount > 0 ? t.primary : t.border,
                transition: 'width 0.3s',
              }} />
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: allDocs ? '#16a34a' : docsCount > 0 ? t.primary : t.inkFaint,
              fontVariantNumeric: 'tabular-nums',
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              {docsCount}<span style={{ color: t.inkFaint, fontWeight: 500 }}>/{DOC_TYPES.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {open && (
        <div style={{
          borderTop: `1px solid ${t.border}`,
          padding: '18px 22px 22px',
          background: mode === 'dark' ? '#0f0f0f' : '#fafaf8',
          animation: 'fadeIn 0.15s ease',
          borderRadius: 0,
        }}>
          {/* BL + Container info box */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            marginBottom: 16,
            padding: '14px 18px', borderRadius: 12,
            background: mode === 'dark' ? '#0f1f3a' : '#eff6ff',
            border: `1.5px solid ${mode === 'dark' ? '#1e3a5f' : '#bfdbfe'}`,
          }}>
            <div>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
                marginBottom: 6, color: mode === 'dark' ? '#60a5fa' : '#2563eb',
              }}>
                {s.mode === 'AIR' ? 'AWB No.' : s.mode === 'COURIER' ? 'Tracking No.' : 'Bill of Lading'}
              </div>
              <div style={{
                fontSize: s.bol && s.bol.length > 14 ? 14 : 20,
                fontWeight: 700, fontFamily: '"JetBrains Mono", monospace',
                color: s.bol ? t.ink : t.inkFaint, fontStyle: s.bol ? 'normal' : 'italic',
                lineHeight: 1.2, wordBreak: 'break-all',
              }}>{s.bol || 'Not entered'}</div>
            </div>
            <div>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
                marginBottom: 6, color: t.inkSoft,
              }}>
                {s.mode === 'SEA_FCL' || s.mode === 'SEA_LCL' ? 'Container No.' : 'Reference No.'}
              </div>
              <div style={{
                fontSize: s.container && s.container.length > 14 ? 14 : 20,
                fontWeight: 700, fontFamily: '"JetBrains Mono", monospace',
                color: s.container ? t.inkMid : t.inkFaint, fontStyle: s.container ? 'normal' : 'italic',
                lineHeight: 1.2, wordBreak: 'break-all',
              }}>{s.container || '—'}</div>
            </div>
          </div>

          {/* Tags strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {s.etd && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                fontFamily: '"JetBrains Mono", monospace',
                background: mode === 'dark' ? '#134e4a' : '#ccfbf1',
                color: mode === 'dark' ? '#5eead4' : '#0f766e',
              }}>ETD {s.etd}</span>
            )}
            {s.eta && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                fontFamily: '"JetBrains Mono", monospace',
                background: mode === 'dark' ? '#431407' : '#fef3c7',
                color: mode === 'dark' ? '#fdba74' : '#92400e',
              }}>ETA {s.eta}</span>
            )}
            {s.incoterm && (
              <span style={{
                fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 5,
                background: t.bgSoft, color: t.inkMid, border: `1px solid ${t.border}`,
                fontFamily: '"JetBrains Mono", monospace',
              }}>{s.incoterm}</span>
            )}
            {s.carrier && (
              <span style={{
                fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 6,
                background: t.bgSoft, color: t.inkSoft, border: `1px solid ${t.border}`,
              }}>✈ {s.carrier}</span>
            )}
            {s.material && (
              <span style={{
                fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 6,
                background: mode === 'dark' ? '#2d1b69' : '#ede9fe',
                color: mode === 'dark' ? '#c4b5fd' : '#6d28d9',
                border: `1px solid ${mode === 'dark' ? '#4c1d95' : '#ddd6fe'}`,
              }}>📦 {s.material}</span>
            )}
          </div>

          {/* Documents section */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
                textTransform: 'uppercase', color: t.inkFaint,
              }}>Documents</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 70, height: 4, borderRadius: 2, background: t.bgDeep, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${(docsCount / DOC_TYPES.length) * 100}%`,
                    background: allDocs ? '#16a34a' : t.primary,
                    transition: 'width 0.35s',
                  }} />
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: allDocs ? '#16a34a' : docsCount > 0 ? t.primary : t.inkFaint,
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: '"JetBrains Mono", monospace',
                }}>
                  {docsCount}<span style={{ color: t.inkFaint, fontWeight: 400 }}>/{DOC_TYPES.length}</span>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {DOC_TYPES.map(d => (
                <DocTile
                  key={d.key}
                  docKey={d.key}
                  value={docs[d.key as keyof DocSet] as DocValue | undefined}
                />
              ))}
            </div>
          </div>

          {/* Additional documents */}
          <ExtraDocsSection
            shipmentId={s.id}
            extraDocs={s.extra_docs ?? []}
          />
        </div>
      )}
    </div>
  )
}

// ── Full-screen supplier page ─────────────────────────────────────────
export function SupplierPage() {
  const { supplierName: rawName } = useParams<{ supplierName: string }>()
  const navigate = useNavigate()
  const supplierName = rawName ? decodeURIComponent(rawName) : ''

  const { t, mode } = useTheme()
  const { shipments } = useShipments()
  const [tab, setTab]       = useState<Tab>('all')
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

  if (!supplierName) {
    navigate('/suppliers')
    return null
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', flex: 1,
      background: t.bg, animation: 'slideInLeft 0.22s cubic-bezier(0.22,1,0.36,1)',
      minHeight: 0,
    }}>

      {/* ── Sticky header ── */}
      <div style={{
        background: t.panel, borderBottom: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>
        {/* Supplier identity + stats */}
        <div style={{
          padding: '16px 28px 14px',
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          {/* Flag avatar */}
          <div style={{
            width: 48, height: 48, borderRadius: 13, flexShrink: 0,
            background: t.bgDeep, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1.5px solid ${t.border}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <CountryFlag cc={supplierCountry} size={48} />
          </div>

          {/* Name + country */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 20, fontWeight: 800, color: t.ink, lineHeight: 1.15,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{supplierName}</div>
            <div style={{
              fontSize: 12, color: t.inkSoft, marginTop: 3,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>{supplierCountry}</span>
              <span style={{ color: t.border }}>·</span>
              <span>{all.length} shipment{all.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{
            display: 'flex', flexShrink: 0,
            border: `1px solid ${t.border}`, borderRadius: 12, overflow: 'hidden',
          }}>
            {([
              { label: 'Total',     value: all.length,       color: t.ink,      bg: t.bgSoft },
              { label: 'Active',    value: active.length,    color: active.length    ? t.primary : t.inkMid, bg: t.bgSoft },
              { label: 'Delivered', value: delivered.length, color: delivered.length ? '#16a34a' : t.inkMid, bg: t.bgSoft },
              { label: 'Cancelled', value: cancelled.length, color: cancelled.length ? '#ef4444' : t.inkMid, bg: t.bgSoft },
              { label: 'Value',     value: `$${(totalValueUsd / 1000).toFixed(1)}K`, color: t.ink, bg: t.bgSoft },
            ] as { label: string; value: string | number; color: string; bg: string }[]).map((stat, i, arr) => (
              <div key={stat.label} style={{
                padding: '10px 20px', textAlign: 'center',
                background: stat.bg,
                borderRight: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <div style={{
                  fontSize: 18, fontWeight: 800, color: stat.color,
                  fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>{stat.value}</div>
                <div style={{
                  fontSize: 9, color: t.inkFaint, fontWeight: 700,
                  letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 5,
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs + search */}
        <div style={{
          padding: '0 28px 14px',
          display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(tb => (
              <button key={tb.key} onClick={() => setTab(tb.key)} style={{
                border: `1px solid ${tab === tb.key ? t.primary : t.border}`,
                background: tab === tb.key ? t.primarySoft : 'transparent',
                color: tab === tb.key ? t.primary : t.inkMid,
                padding: '5px 14px', borderRadius: 8, cursor: 'pointer',
                fontSize: 12.5, fontWeight: tab === tb.key ? 700 : 500,
                fontFamily: 'inherit',
                display: 'inline-flex', gap: 6, alignItems: 'center',
                transition: 'all 0.15s',
              }}>
                {tb.label}
                <span style={{
                  fontSize: 10.5, fontWeight: 700, padding: '0 5px', borderRadius: 8,
                  background: tab === tb.key ? t.primary : t.bgDeep,
                  color: tab === tb.key ? '#fff' : t.inkFaint,
                  minWidth: 18, textAlign: 'center',
                }}>{tb.count}</span>
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: t.inkFaint, pointerEvents: 'none',
            }}>
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 10 L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search BL, container, material, port…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '7px 30px 7px 30px',
                border: `1px solid ${search ? t.primary : t.border}`,
                borderRadius: 8, background: t.bg,
                color: t.ink, fontSize: 12.5, width: 260,
                outline: 'none', fontFamily: 'inherit',
                boxShadow: search ? `0 0 0 3px ${t.primary}18` : 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                border: 'none', background: 'none', cursor: 'pointer',
                color: t.inkFaint, padding: 2, display: 'flex',
              }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Shipment cards ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 48px' }}>
        {q && (
          <div style={{ fontSize: 12, color: t.inkSoft, marginBottom: 14 }}>
            {displayed.length === 0
              ? `No results for "${search}"`
              : `${displayed.length} of ${tabList.length} shipments match`}
          </div>
        )}
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: t.inkSoft, fontSize: 14 }}>
            {q
              ? <>No shipments match <strong style={{ color: t.inkMid }}>"{search}"</strong></>
              : 'No shipments in this category.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayed.map((s, i) => (
              <ShipmentCard key={s.id} s={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
