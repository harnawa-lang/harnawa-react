import { useRef, useState } from 'react'
import { useTheme } from '../lib/ThemeContext'
import { useShipment, uploadDoc, deleteDoc, cancelShipment, uncancelShipment, deleteShipment } from '../lib/store'
import { useAuth } from '../lib/AuthContext'
import { STAGES, DOC_TYPES, stageColor, fmtMoney, docOk, docUrl, docName, docSize } from '../lib/data'
import { fmtBytes } from '../lib/compress'
import { StatusPill, ModeChip, FlagChip, ETAChip, CountryFlag, SectionLabel } from './atoms'
import { ExtraDocsSection } from './ExtraDocsSection'
import type { DocSet, DocValue, HistoryEntry, Shipment } from '../lib/types'

interface Props {
  shipmentId: string
  onClose: () => void
  onOpenUpdate: (id: string) => void
}

// ── Document card ─────────────────────────────────────────────────────
function DocRow({ docKey, label, value, shipmentId }: {
  docKey: string; label: string; value: DocValue | undefined; shipmentId: string
}) {
  const { t, mode } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<'idle' | 'compressing' | 'uploading' | 'error'>('idle')

  const have = docOk(value)
  const url  = docUrl(value)
  const name = docName(value)
  const size = docSize(value)
  const busy = phase === 'compressing' || phase === 'uploading'

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    e.target.value = ''
    await uploadDoc(
      shipmentId,
      docKey as keyof DocSet,
      file,
      (p) => setPhase(p === 'done' || p === 'error' ? 'idle' : p as 'compressing' | 'uploading'),
    )
  }

  const greenBg  = mode === 'dark' ? '#052e16' : '#f0fdf4'
  const greenBdr = mode === 'dark' ? '#166534' : '#86efac'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px', borderRadius: 10,
      background: have ? greenBg : t.bgSoft,
      border: `1.5px solid ${have ? greenBdr : busy ? t.primary + '60' : t.border}`,
      transition: 'all 0.15s',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Busy progress stripe */}
      {busy && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${t.primary}, ${t.primary}60, ${t.primary})`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.2s linear infinite',
        }} />
      )}

      {/* Status icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: busy ? t.bgDeep
          : have ? '#16a34a'
          : t.bgDeep,
        border: busy ? `1.5px dashed ${t.primary}` : have ? 'none' : `1.5px dashed ${t.border}`,
      }}>
        {busy ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite', color: t.primary }}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="14 42"/>
          </svg>
        ) : have ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7.5 L5.5 10.5 L11.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ color: t.inkFaint }}>
            <path d="M8 3 V10 M5 6 L8 3 L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 13 H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{
            fontSize: 10.5, fontWeight: 800, fontFamily: '"JetBrains Mono", monospace',
            color: have ? '#16a34a' : t.inkFaint,
            letterSpacing: 0.4,
          }}>{docKey}</span>
          <span style={{
            fontSize: 13, fontWeight: have ? 600 : 500,
            color: have ? t.ink : t.inkMid,
          }}>{label}</span>
        </div>
        {have && name ? (
          <div style={{
            fontSize: 11, color: t.inkSoft,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}{size !== undefined ? ` · ${fmtBytes(size)}` : ''}
          </div>
        ) : busy ? (
          <div style={{ fontSize: 11, color: t.primary, fontWeight: 500 }}>
            {phase === 'compressing' ? 'Compressing…' : 'Uploading…'}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: t.inkFaint, fontStyle: 'italic' }}>
            Not uploaded · click to add
          </div>
        )}
        {phase === 'error' && (
          <div style={{ fontSize: 11, color: t.bad, marginTop: 2, fontWeight: 500 }}>
            Upload failed — try again
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {have && url && (
          <button
            onClick={() => window.open(url, '_blank', 'noopener')}
            title="View document"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${greenBdr}`,
              background: mode === 'dark' ? '#14532d' : '#dcfce7',
              color: '#16a34a', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 10 L10 2 M5.5 2 H10 V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View
          </button>
        )}
        {have && (
          <button
            onClick={async () => {
              setPhase('uploading')
              try { await deleteDoc(shipmentId, docKey as keyof DocSet); setPhase('idle') }
              catch { setPhase('error') }
            }}
            disabled={busy}
            title="Delete"
            style={{
              width: 30, height: 30, borderRadius: 6, cursor: 'pointer',
              border: `1px solid #fca5a5`,
              background: mode === 'dark' ? '#450a0a' : '#fee2e2',
              color: '#dc2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 3.5 H10 M4.5 3.5 V2 H7.5 V3.5 M4 3.5 V10 H8 V3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          title={have ? 'Replace' : 'Upload'}
          style={{
            width: 30, height: 30, borderRadius: 6, cursor: 'pointer',
            border: `1px solid ${t.border}`,
            background: t.bgDeep,
            color: t.inkMid,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 2 V9 M4 5 L7 2 L10 5 M2 12 H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf,.xlsx,.xls,.doc,.docx,.csv"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  )
}

// ── Rich colorful tracking timeline ──────────────────────────────────
function TrackingTimeline({ shipment: s }: { shipment: Shipment }) {
  const { t, mode } = useTheme()
  const history: HistoryEntry[] = s.history ?? []

  // Find best history entry for each stage
  const entryFor = (i: number): HistoryEntry | undefined => {
    const all = history.filter(h => h.stage === i)
    return all[all.length - 1]  // latest entry for that stage
  }

  return (
    <div>
      {/* ── POL / POD header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CountryFlag cc={s.pol_code?.slice(0, 2) ?? s.supplier_country} size={18} />
            <span style={{ fontSize: 16, fontWeight: 700, color: t.ink }}>{s.pol || '—'}</span>
          </div>
          <div style={{ fontSize: 10.5, fontFamily: '"JetBrains Mono", monospace', color: t.inkSoft, marginTop: 2 }}>{s.pol_code}</div>
          <div style={{ fontSize: 11, color: t.inkMid, marginTop: 5 }}>
            ETD <span style={{ fontWeight: 700, color: t.ink }}>{s.etd}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 6 }}>
          <ModeChip mode={s.mode} />
          <div style={{ fontSize: 11, color: t.inkSoft }}>
            <ETAChip shipment={s} />
          </div>
        </div>

        <div style={{ textAlign: 'right' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: t.ink }}>{s.pod || '—'}</span>
            {s.pod_code && <CountryFlag cc={s.pod_code.slice(0, 2)} size={18} />}
          </div>
          <div style={{ fontSize: 10.5, fontFamily: '"JetBrains Mono", monospace', color: t.inkSoft, marginTop: 2 }}>{s.pod_code}</div>
          <div style={{ fontSize: 11, color: t.inkMid, marginTop: 5 }}>
            ETA <span style={{ fontWeight: 700, color: t.ink }}>{s.eta}</span>
          </div>
        </div>
      </div>

      {/* ── Vertical stage-by-stage timeline ── */}
      <div style={{ position: 'relative' }}>
        {STAGES.map((stageName, i) => {
          const done   = i < s.stage
          const curr   = i === s.stage
          const future = i > s.stage
          const c      = stageColor(i)
          const entry  = entryFor(i)
          const isLast = i === STAGES.length - 1

          return (
            <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
              {/* Left: dot + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 22, flexShrink: 0 }}>
                {/* Dot */}
                <div style={{
                  width:  curr ? 22 : done ? 18 : 14,
                  height: curr ? 22 : done ? 18 : 14,
                  borderRadius: '50%',
                  background: future ? t.bgDeep : c,
                  border: curr ? `3px solid ${t.panel}` : done ? 'none' : `2px solid ${t.bgDeep}`,
                  outline: curr ? `2.5px solid ${c}` : 'none',
                  boxShadow: curr ? `0 0 0 4px ${c}22` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, zIndex: 1,
                  animation: curr ? 'pulse 2s ease-in-out infinite' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {done && (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5 L4 7.5 L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div style={{
                    flex: 1, width: 2, minHeight: 12,
                    background: done
                      ? `linear-gradient(to bottom, ${c}, ${stageColor(i + 1)})`
                      : t.bgDeep,
                    borderRadius: 1,
                    margin: '2px 0',
                    opacity: future ? 0.4 : 1,
                  }} />
                )}
              </div>

              {/* Right: content */}
              <div style={{
                flex: 1, paddingBottom: isLast ? 0 : 12,
                paddingTop: curr ? 1 : 2,
              }}>
                {/* Stage header row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: curr ? '6px 10px' : '0',
                  borderRadius: curr ? 7 : 0,
                  background: curr ? c + (mode === 'dark' ? '22' : '12') : 'transparent',
                  border: curr ? `1px solid ${c}30` : '1px solid transparent',
                  marginLeft: curr ? -2 : 0,
                  marginRight: curr ? -4 : 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: curr ? 13 : done ? 12.5 : 11.5,
                      fontWeight: curr ? 700 : done ? 600 : 400,
                      color: future ? t.inkFaint : curr ? c : t.ink,
                      letterSpacing: curr ? 0.1 : 0,
                    }}>{stageName}</span>
                    {curr && (
                      <span style={{
                        fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6,
                        textTransform: 'uppercase',
                        background: c, color: '#fff',
                        padding: '1px 6px', borderRadius: 3,
                      }}>NOW</span>
                    )}
                  </div>
                  {entry && (
                    <span style={{
                      fontSize: 10, color: done || curr ? t.inkSoft : t.inkFaint,
                      fontFamily: '"JetBrains Mono", monospace', flexShrink: 0,
                    }}>
                      {(entry.at ?? '').slice(0, 16).replace('T', '  ')}
                    </span>
                  )}
                  {!entry && i === STAGES.length - 1 && s.eta && (
                    <span style={{ fontSize: 10, color: t.inkFaint, fontFamily: '"JetBrains Mono", monospace' }}>
                      ETA {s.eta}
                    </span>
                  )}
                </div>

                {/* Note + who */}
                {(entry || (curr && s.status_note)) && (
                  <div style={{ marginTop: 3, paddingLeft: curr ? 10 : 0 }}>
                    {entry?.note && entry.note !== stageName && (
                      <div style={{ fontSize: 11, color: curr ? t.inkMid : t.inkSoft }}>{entry.note}</div>
                    )}
                    {curr && s.status_note && s.status_note !== stageName && s.status_note !== entry?.note && (
                      <div style={{ fontSize: 11, color: t.inkMid }}>{s.status_note}</div>
                    )}
                    {entry?.who && (
                      <div style={{ fontSize: 10, color: t.inkFaint, marginTop: 1 }}>by {entry.who}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main drawer ───────────────────────────────────────────────────────
export function DetailDrawer({ shipmentId, onClose, onOpenUpdate }: Props) {
  const { t, mode } = useTheme()
  const { isAdmin } = useAuth()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const shipment = useShipment(shipmentId)
  if (!shipment) return null
  const s = shipment
  const isCancelled = !!s.cancelled
  const docsUploaded = DOC_TYPES.filter(d => docOk(s.docs[d.key as keyof DocSet])).length

  return (
    <>
      {/* Backdrop: dark + blur */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: mode === 'dark' ? 'rgba(0,0,0,0.65)' : 'rgba(20,12,4,0.50)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 600,
        background: t.panel, borderLeft: `1px solid ${t.border}`,
        boxShadow: mode === 'dark' ? '-20px 0 60px rgba(0,0,0,0.75)' : '-20px 0 60px rgba(30,18,6,0.22)',
        display: 'flex', flexDirection: 'column',
        zIndex: 41,
        animation: 'slideIn 0.22s cubic-bezier(0.22,1,0.36,1)',
        overflowY: 'auto',
      }}>

        {/* ── HEADER (sticky) ── */}
        <div style={{
          padding: '16px 20px 14px', borderBottom: `1px solid ${t.border}`,
          background: t.panelAlt, flexShrink: 0,
          position: 'sticky', top: 0, zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9.5, color: t.inkFaint, fontFamily: '"JetBrains Mono", monospace', letterSpacing: 0.8, marginBottom: 4 }}>
                SHIPMENT · {s.id}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, display: 'flex', gap: 7, alignItems: 'center', marginBottom: 8 }}>
                <CountryFlag cc={s.supplier_country} size={15} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.supplier}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, alignItems: 'center' }}>
                {isCancelled ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                    background: t.badSoft, color: t.bad,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 3, background: t.bad }} />
                    Cancelled
                  </span>
                ) : (
                  <>
                    <StatusPill stage={s.stage} />
                    <FlagChip flag={s.flag} delayed={s.delayed} />
                  </>
                )}
              </div>
            </div>
            <button onClick={onClose} style={{
              border: 'none', background: t.bgSoft, cursor: 'pointer',
              color: t.inkMid, width: 30, height: 30, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Action button */}
          {!isCancelled && (
            <button onClick={() => onOpenUpdate(s.id)} style={{
              marginTop: 12, width: '100%', border: 'none', cursor: 'pointer',
              background: t.primary, color: '#fff', padding: '9px 14px', borderRadius: 7,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 10px ${t.primary}50`,
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 11 L2 9 L9 2 L11 4 L4 11 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <path d="M8 3 L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Update shipment
            </button>
          )}
          {isCancelled && (
            <button onClick={() => uncancelShipment(s.id)} style={{
              marginTop: 12, width: '100%', cursor: 'pointer',
              border: `1px solid ${t.primary}60`, background: t.primaryWash,
              color: t.primaryDeep, padding: '9px 14px', borderRadius: 7,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'center',
            }}>
              Reactivate shipment
            </button>
          )}
        </div>

        {/* ── BODY ── */}
        <div style={{ flex: 1, padding: '18px 20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ① TRACKING TIMELINE (replaces old Route + Timeline sections) */}
          <div style={{
            background: t.bgSoft, borderRadius: 10,
            border: `1px solid ${t.border}`, padding: '16px 16px',
          }}>
            <SectionLabel>Route &amp; Tracking</SectionLabel>
            <TrackingTimeline shipment={s} />
          </div>

          {/* ② SHIPMENT DETAILS */}
          <div>
            <SectionLabel>Details</SectionLabel>

            {/* BOL + Container — highlighted tracking row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
              background: t.primarySoft, border: `1.5px solid ${t.primary}30`,
              borderRadius: 8, padding: '12px 14px', marginBottom: 12,
            }}>
              {[
                { label: s.mode === 'AIR' ? 'Master AWB No.' : s.mode === 'COURIER' ? 'Tracking No.' : s.mode === 'ROAD' ? 'LR / Docket No.' : 'Bill of Lading (BL)', val: s.bol },
                { label: s.mode === 'AIR' ? 'House AWB No.' : s.mode === 'SEA_FCL' || s.mode === 'SEA_LCL' ? 'Container No.' : 'Ref No.', val: s.container },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' as const, color: t.primary, marginBottom: 4 }}>{label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontFamily: '"JetBrains Mono", monospace', color: t.ink, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                      {val || <span style={{ color: t.inkFaint, fontStyle: 'italic', fontWeight: 400, fontSize: 11 }}>Not entered</span>}
                    </span>
                    {val && (
                      <button onClick={() => navigator.clipboard.writeText(val)} title="Copy" style={{
                        border: 'none', background: 'none', cursor: 'pointer', color: t.inkFaint,
                        padding: '1px 2px', flexShrink: 0,
                      }}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M2 8 H1.5 A1.5 1.5 0 0 1 0 6.5 V1.5 A1.5 1.5 0 0 1 1.5 0 H6.5 A1.5 1.5 0 0 1 8 1.5 V2" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 18px' }}>
              {[
                { label: 'Material / Goods', val: s.material,  mono: false },
                { label: 'Carrier',          val: s.carrier,   mono: false },
                { label: 'Vessel/Flight',    val: s.vessel,    mono: false },
                { label: 'Incoterm',         val: s.incoterm,  mono: true  },
                { label: 'Value',         val: fmtMoney(s.value, s.currency) + ' ' + s.currency, mono: false },
                { label: 'ETA status',    val: null,        mono: false },
              ].map(({ label, val, mono }, i) => (
                <div key={i}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' as const, color: t.inkFaint, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12.5, fontFamily: mono ? '"JetBrains Mono", monospace' : 'inherit', color: t.ink, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {label === 'ETA status' ? <ETAChip shipment={s} /> : (val || <span style={{ color: t.inkFaint }}>—</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ③ DOCUMENTS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <SectionLabel>Documents</SectionLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Progress bar */}
                <div style={{
                  width: 80, height: 5, borderRadius: 3,
                  background: t.bgDeep, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${(docsUploaded / DOC_TYPES.length) * 100}%`,
                    background: docsUploaded === DOC_TYPES.length ? '#16a34a' : t.primary,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                  color: docsUploaded === DOC_TYPES.length ? '#16a34a' : docsUploaded > 0 ? t.primary : t.inkSoft,
                }}>
                  {docsUploaded}<span style={{ color: t.inkFaint, fontWeight: 400 }}>/{DOC_TYPES.length}</span>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {DOC_TYPES.map(d => (
                <DocRow key={d.key} docKey={d.key} label={d.label}
                  value={s.docs[d.key as keyof DocSet]} shipmentId={s.id} />
              ))}
            </div>
          </div>

          {/* ④ ADDITIONAL DOCUMENTS */}
          <ExtraDocsSection
            shipmentId={s.id}
            extraDocs={s.extra_docs ?? []}
          />

          {/* ⑤ DANGER ZONE — cancel / delete shipment */}
          <div style={{
            borderTop: `1px dashed ${t.border}`,
            paddingTop: 16, marginTop: 4,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>

            {/* ── Cancel (hide if already cancelled) ── */}
            {!isCancelled && (
              <>
                {!confirmCancel ? (
                  <button
                    onClick={() => { setConfirmCancel(true); setConfirmDelete(false) }}
                    style={{
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: 12, color: t.inkFaint, fontFamily: 'inherit',
                      padding: '4px 8px', borderRadius: 5,
                      textDecoration: 'underline', textDecorationStyle: 'dotted',
                      textUnderlineOffset: 3,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = t.bad }}
                    onMouseLeave={e => { e.currentTarget.style.color = t.inkFaint }}
                  >
                    Cancel this shipment
                  </button>
                ) : (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    background: t.badSoft, borderRadius: 8, padding: '12px 16px',
                    border: `1px solid ${t.bad}30`, width: '100%',
                  }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: t.bad }}>Cancel this shipment?</div>
                    <div style={{ fontSize: 11.5, color: t.inkMid, textAlign: 'center' }}>
                      This will mark the shipment as cancelled. You can reactivate it later.
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                      <button
                        onClick={() => setConfirmCancel(false)}
                        style={{
                          border: `1px solid ${t.border}`, background: t.panel, cursor: 'pointer',
                          color: t.inkMid, padding: '6px 16px', borderRadius: 6,
                          fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit',
                        }}
                      >
                        Keep shipment
                      </button>
                      <button
                        onClick={() => { cancelShipment(s.id); setConfirmCancel(false); onClose() }}
                        style={{
                          border: 'none', background: t.bad, cursor: 'pointer',
                          color: '#fff', padding: '6px 16px', borderRadius: 6,
                          fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
                        }}
                      >
                        Yes, cancel it
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Permanent delete ── */}
            <>
              {!confirmDelete ? (
                  <button
                    onClick={() => { setConfirmDelete(true); setConfirmCancel(false) }}
                    style={{
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: 12, color: t.inkFaint, fontFamily: 'inherit',
                      padding: '4px 8px', borderRadius: 5,
                      textDecoration: 'underline', textDecorationStyle: 'dotted',
                      textUnderlineOffset: 3,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#dc2626' }}
                    onMouseLeave={e => { e.currentTarget.style.color = t.inkFaint }}
                  >
                    🗑 Permanently delete shipment
                  </button>
                ) : (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    background: mode === 'dark' ? '#2d0a0a' : '#fff1f2',
                    borderRadius: 8, padding: '14px 16px',
                    border: `1.5px solid #dc2626`, width: '100%',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
                      ⚠️ Delete {s.id}?
                    </div>
                    <div style={{ fontSize: 11.5, color: t.inkMid, textAlign: 'center', lineHeight: 1.5 }}>
                      This <strong>permanently removes</strong> the shipment and all its data.
                      <br />This action <strong>cannot be undone.</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        style={{
                          border: `1px solid ${t.border}`, background: t.panel, cursor: 'pointer',
                          color: t.inkMid, padding: '7px 18px', borderRadius: 6,
                          fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit',
                        }}
                      >
                        Keep it
                      </button>
                      <button
                        disabled={deleting}
                        onClick={async () => {
                          setDeleting(true)
                          await deleteShipment(s.id)
                          setDeleting(false)
                          setConfirmDelete(false)
                          onClose()
                        }}
                        style={{
                          border: 'none', background: deleting ? '#9ca3af' : '#dc2626', cursor: deleting ? 'not-allowed' : 'pointer',
                          color: '#fff', padding: '7px 18px', borderRadius: 6,
                          fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: 6,
                          transition: 'background 0.15s',
                        }}
                      >
                        {deleting ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                              style={{ animation: 'spin 1s linear infinite' }}>
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                            </svg>
                            Deleting…
                          </>
                        ) : 'Yes, delete forever'}
                      </button>
                    </div>
                  </div>
                )}
            </>

          </div>

        </div>
      </div>
    </>
  )
}
