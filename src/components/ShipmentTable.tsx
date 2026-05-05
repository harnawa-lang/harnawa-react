import { useState } from 'react'
import { useTheme } from '../lib/ThemeContext'
import { useShipments, getStats, filterShipments, loadShipments } from '../lib/store'
import { fmtMoney, STAGES } from '../lib/data'
import { StatusPill, ModeChip, FlagChip, ETAChip, CountryFlag, DocsRing, RouteBar, fmtShortDate } from './atoms'
import { StatStrip } from './StatStrip'
import { DetailDrawer } from './DetailDrawer'
import { UpdateModal } from './UpdateModal'
import { CreateShipmentModal } from './CreateShipmentModal'
import type { TransportMode } from '../lib/types'

function trackingLabel(mode: TransportMode) {
  if (mode === 'AIR') return 'AWB'
  if (mode === 'COURIER') return 'TRK'
  if (mode === 'ROAD') return 'LR'
  if (mode === 'RAIL') return 'RAIL'
  return 'CTR'
}

function CopyBtn({ value }: { value: string }) {
  const { t, mode } = useTheme()
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      }}
      title="Copy"
      style={{
        border: `1px solid ${copied ? '#16a34a40' : t.border}`,
        background: copied
          ? (mode === 'dark' ? '#14532d' : '#dcfce7')
          : t.bgSoft,
        cursor: 'pointer',
        padding: '2px 7px', borderRadius: 4, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        transition: 'all 0.15s',
      }}
    >
      {copied ? (
        <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', whiteSpace: 'nowrap', letterSpacing: 0.2 }}>✓ Copied</span>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ color: t.inkSoft }}>
            <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M2 8 H1.5 A1.5 1.5 0 0 1 0 6.5 V1.5 A1.5 1.5 0 0 1 1.5 0 H6.5 A1.5 1.5 0 0 1 8 1.5 V2" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, color: t.inkSoft }}>Copy</span>
        </>
      )}
    </button>
  )
}

interface ShipmentTableProps {
  search: string
  onSearchChange: (s: string) => void
  showCreate: boolean
  onCloseCreate: () => void
  onNewShipment?: () => void
}

export function ShipmentTable({ search, showCreate, onCloseCreate, onNewShipment }: ShipmentTableProps) {
  const { t, mode } = useTheme()
  const { shipments, loading, error } = useShipments()
  const stats = getStats(shipments)

  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [updateId, setUpdateId] = useState<string | null>(null)

  const filtered = filterShipments(shipments, filter, search)

  function handleFilterChange(f: string) {
    setFilter(f)
    setSelectedId(null)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: t.bg, position: 'relative',
    }}>
      {/* Connection error banner */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          margin: '12px 28px 0', padding: '10px 16px', borderRadius: 8,
          background: t.badSoft, border: `1px solid ${t.bad}30`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5"/>
              <path d="M8 4.5 V8.5 M8 10.5 V11" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 12.5, color: t.bad, fontWeight: 500 }}>
              Connection failed — can't reach server. Retrying automatically…
            </span>
          </div>
          <button
            onClick={() => { loadShipments() }}
            style={{
              border: `1px solid ${t.bad}50`, background: 'transparent', cursor: 'pointer',
              color: t.bad, padding: '4px 12px', borderRadius: 5,
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit', flexShrink: 0,
            }}
          >
            Retry now
          </button>
        </div>
      )}

      {/* Stat strip — clicking a card sets the filter */}
      <StatStrip stats={stats} activeFilter={filter} onFilterChange={handleFilterChange} />


      {/* Table */}
      <div style={{ padding: '0 28px 28px', flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <div style={{
          background: t.panel, border: `1px solid ${t.border}`,
          borderRadius: 10, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '220px 140px 115px 115px 56px minmax(175px,1fr) 110px 82px 52px minmax(150px,1fr) 20px',
            padding: '10px 24px',
            background: t.bgSoft, borderBottom: `2px solid ${t.border}`,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
            textTransform: 'uppercase', color: t.inkSoft,
            alignItems: 'center', gap: 20,
          }}>
            <span>BOL / AWB</span>
            <span>Supplier</span>
            <span>Origin Port</span>
            <span>Dest Port</span>
            <span>Mode</span>
            <span>Progress</span>
            <span>Material</span>
            <span style={{ textAlign: 'right' }}>Value</span>
            <span style={{ textAlign: 'center' }}>Docs</span>
            <span>Latest Update</span>
            <span />
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ padding: '56px 24px', textAlign: 'center', color: t.inkSoft, fontSize: 13 }}>
              Loading shipments…
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              {shipments.length === 0 ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.ink, marginBottom: 6 }}>No shipments yet</div>
                  <div style={{ fontSize: 13, color: t.inkSoft, marginBottom: 20 }}>Create your first shipment to start tracking.</div>
                  <button onClick={() => onNewShipment?.()} style={{
                    border: 'none', cursor: 'pointer',
                    background: t.primary, color: '#fff',
                    padding: '9px 20px', borderRadius: 7,
                    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  }}>+ New shipment</button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: t.inkSoft, marginBottom: 12 }}>No shipments match this filter.</div>
                  <button onClick={() => { setFilter('all'); }} style={{
                    border: `1px solid ${t.border}`, cursor: 'pointer', background: 'transparent',
                    color: t.inkMid, padding: '6px 14px', borderRadius: 6,
                    fontSize: 12.5, fontFamily: 'inherit',
                  }}>Clear filter</button>
                </>
              )}
            </div>
          )}

          {/* Rows */}
          {!loading && filtered.map((s, i) => {
            const isSel = selectedId === s.id
            const isCancelled = !!s.cancelled
            const latest = s.history?.length ? s.history[s.history.length - 1] : null
            const latestNote = latest?.note || s.status_note || ''
            const latestWhen = latest?.at ? latest.at.slice(0, 10) : ''
            const latestWho  = latest?.who || ''
            const GRID = '190px 145px 118px 118px 58px minmax(180px,1fr) 115px 84px 54px minmax(155px,1fr) 20px'
            return (
              <div key={s.id}
                onClick={() => setSelectedId(isSel ? null : s.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: GRID,
                  padding: '16px 24px',
                  alignItems: 'start',
                  gap: 20,
                  borderBottom: i < filtered.length - 1 ? `1px solid ${t.border}` : 'none',
                  cursor: 'pointer',
                  background: isSel ? t.primaryWash : isCancelled ? t.bgSoft : 'transparent',
                  opacity: isCancelled ? 0.6 : 1,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = t.bgSoft }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = isCancelled ? t.bgSoft : 'transparent' }}
              >

                {/* ── COL 1: BOL + Container ── */}
                <div style={{ minWidth: 0, paddingTop: 1 }}>

                  {/* BL No. */}
                  <div style={{ marginBottom: 2 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' as const,
                      color: mode === 'dark' ? '#60a5fa' : '#2563eb', marginBottom: 3 }}>
                      {s.mode === 'AIR' ? 'AWB No.' : s.mode === 'COURIER' ? 'Tracking No.' : s.mode === 'ROAD' ? 'LR No.' : s.mode === 'RAIL' ? 'Rail Docket' : 'BL No.'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: 15, fontWeight: 800, letterSpacing: 0.5,
                        fontFamily: '"JetBrains Mono", monospace',
                        color: isCancelled ? t.inkMid : t.ink,
                        textDecoration: isCancelled ? 'line-through' : 'none',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {s.bol || <span style={{ color: t.inkFaint, fontStyle: 'italic', fontSize: 12, fontWeight: 400 }}>—</span>}
                      </span>
                      {s.bol && <CopyBtn value={s.bol} />}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: t.border, margin: '7px 0' }} />

                  {/* Container No. */}
                  <div style={{ marginBottom: 7 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' as const,
                      color: t.inkSoft, marginBottom: 3 }}>
                      {s.mode === 'SEA_FCL' || s.mode === 'SEA_LCL' ? 'Container No.' : s.mode === 'AIR' ? 'House AWB' : 'Ref No.'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, letterSpacing: 0.4,
                        fontFamily: '"JetBrains Mono", monospace', color: t.inkMid,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {s.container || <span style={{ color: t.inkFaint, fontStyle: 'italic', fontWeight: 400, fontSize: 11 }}>—</span>}
                      </span>
                      {s.container && <CopyBtn value={s.container} />}
                    </div>
                  </div>

                  {/* incoterm + carrier */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' as const }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
                      padding: '1px 4px', borderRadius: 3,
                      background: mode === 'dark' ? '#252525' : '#f3f0ec',
                      color: t.inkMid, border: `1px solid ${t.border}`,
                    }}>{s.incoterm}</span>
                    {s.carrier && <span style={{ fontSize: 10, color: t.inkFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {s.carrier}</span>}
                  </div>
                </div>

                {/* ── COL 2: Supplier ── */}
                <div style={{ minWidth: 0, paddingTop: 2 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px', borderRadius: 999, maxWidth: '100%',
                    background: mode === 'dark' ? '#14532d' : '#dcfce7',
                    border: `1px solid ${mode === 'dark' ? '#166534' : '#bbf7d0'}`,
                  }}>
                    <CountryFlag cc={s.supplier_country} size={13} />
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: mode === 'dark' ? '#86efac' : '#15803d',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{s.supplier}</span>
                  </div>
                </div>

                {/* ── COL 3: Origin Port ── */}
                <div style={{ minWidth: 0, paddingTop: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <CountryFlag cc={s.pol_code?.slice(0, 2) ?? ''} size={13} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.ink,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.pol || '—'}
                    </span>
                  </div>
                  {s.pol_code && (
                    <div style={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace',
                      color: mode === 'dark' ? '#93c5fd' : '#2563eb', fontWeight: 700, letterSpacing: 0.3 }}>
                      {s.pol_code}
                    </div>
                  )}
                </div>

                {/* ── COL 4: Dest Port ── */}
                <div style={{ minWidth: 0, paddingTop: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <CountryFlag cc={s.pod_code?.slice(0, 2) ?? ''} size={13} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.ink,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.pod || '—'}
                    </span>
                  </div>
                  {s.pod_code && (
                    <div style={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace',
                      color: mode === 'dark' ? '#fdba74' : '#b45309', fontWeight: 700, letterSpacing: 0.3 }}>
                      {s.pod_code}
                    </div>
                  )}
                </div>

                {/* ── COL 5: Mode ── */}
                <div style={{ paddingTop: 2 }}>
                  <ModeChip mode={s.mode} />
                </div>

                {/* ── COL 6: Progress + ETD/ETA ── */}
                <div style={{ minWidth: 0, paddingTop: 4 }}>
                  <RouteBar shipment={s} width={160} showLabels={false} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 6 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, fontWeight: 600,
                      padding: '3px 6px', borderRadius: 4,
                      background: mode === 'dark' ? '#134e4a' : '#ccfbf1',
                      color: mode === 'dark' ? '#5eead4' : '#0f766e',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      <CountryFlag cc={s.pol_code?.slice(0, 2) ?? ''} size={10} />
                      <span style={{ opacity: 0.7 }}>ETD</span>
                      {fmtShortDate(s.etd)}
                    </span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, fontWeight: 600,
                      padding: '3px 6px', borderRadius: 4,
                      background: mode === 'dark' ? '#431407' : '#fef3c7',
                      color: mode === 'dark' ? '#fdba74' : '#92400e',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      <CountryFlag cc={s.pod_code?.slice(0, 2) ?? ''} size={10} />
                      <span style={{ opacity: 0.7 }}>ETA</span>
                      <ETAChip shipment={s} />
                    </span>
                  </div>
                </div>

                {/* ── COL 7: Material ── */}
                <div style={{ minWidth: 0, paddingTop: 2 }}>
                  {s.material ? (
                    <div style={{
                      fontSize: 12, fontWeight: 500, color: t.ink, lineHeight: 1.45,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                    }}>{s.material}</div>
                  ) : (
                    <span style={{ fontSize: 11, color: t.inkFaint }}>—</span>
                  )}
                </div>

                {/* ── COL 8: Value + Duty/GST ── */}
                <div style={{ textAlign: 'right' as const, paddingTop: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: t.ink }}>
                    {fmtMoney(s.value, s.currency)}
                  </div>
                  <div style={{ fontSize: 10, color: t.inkSoft, fontFamily: '"JetBrains Mono", monospace', marginTop: 2 }}>
                    {s.currency}
                  </div>
                  {(s.custom_duty != null || s.gst != null) && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, marginTop: 6 }}>
                      {s.custom_duty != null && (
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                          background: mode === 'dark' ? '#1e1a10' : '#fefce8',
                          color: mode === 'dark' ? '#fbbf24' : '#b45309',
                          border: `1px solid ${mode === 'dark' ? '#713f12' : '#fde68a'}`,
                          whiteSpace: 'nowrap',
                        }}>
                          Duty {fmtMoney(s.value * s.custom_duty / 100, s.currency)}
                        </span>
                      )}
                      {s.gst != null && (
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                          background: mode === 'dark' ? '#0f1f2e' : '#eff6ff',
                          color: mode === 'dark' ? '#60a5fa' : '#1d4ed8',
                          border: `1px solid ${mode === 'dark' ? '#1e3a5f' : '#bfdbfe'}`,
                          whiteSpace: 'nowrap',
                        }}>
                          GST {fmtMoney(s.value * s.gst / 100, s.currency)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* ── COL 9: Docs ring ── */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
                  <DocsRing shipment={s} size={32} />
                </div>

                {/* ── COL 10: Latest Update ── */}
                <div style={{ minWidth: 0, paddingTop: 2 }}>
                  {isCancelled ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999,
                      background: t.badSoft, color: t.bad,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: 3, background: t.bad, flexShrink: 0 }} />
                      Cancelled
                    </span>
                  ) : (
                    <>
                      {(s.flag || s.delayed) && (
                        <div style={{ marginBottom: 5 }}>
                          <FlagChip flag={s.flag} delayed={s.delayed} />
                        </div>
                      )}
                      {latestNote ? (
                        <div style={{
                          fontSize: 12, color: t.ink, fontWeight: 500, lineHeight: 1.45,
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                        }}>{latestNote}</div>
                      ) : (
                        <span style={{ fontSize: 11, color: t.inkFaint, fontStyle: 'italic' }}>No comments yet</span>
                      )}
                      {(latestWho || latestWhen) && (
                        <div style={{ fontSize: 10, color: t.inkFaint, marginTop: 5, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3"/>
                            <path d="M6 3.5 V6 L7.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          </svg>
                          {latestWho && <span>{latestWho}</span>}
                          {latestWho && latestWhen && <span>·</span>}
                          {latestWhen && <span>{latestWhen}</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ── Chevron ── */}
                <div style={{ color: t.inkFaint, paddingTop: 3 }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3 L9 7 L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

              </div>
            )
          })}
        </div>
      </div>

      {/* Detail drawer */}
      {selectedId && (
        <DetailDrawer
          shipmentId={selectedId}
          onClose={() => setSelectedId(null)}
          onOpenUpdate={id => { setUpdateId(id); setSelectedId(null) }}
        />
      )}

      {/* Update modal */}
      {updateId && <UpdateModal shipmentId={updateId} onClose={() => setUpdateId(null)} />}

      {/* Create modal */}
      {showCreate && (
        <CreateShipmentModal
          onClose={onCloseCreate}
          existingIds={shipments.map(s => s.id)}
          existingSuppliers={[...new Map(
            shipments.map(s => [s.supplier, { name: s.supplier, country: s.supplier_country }])
          ).values()]}
        />
      )}
    </div>
  )
}
