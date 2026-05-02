import { useRef, useState } from 'react'
import { useTheme } from '../../lib/ThemeContext'
import { STAGES, DOC_TYPES, MODES, stageColor, docsScore, daysToETA, flagEmoji, docOk, docUrl, docName, docSize } from '../../lib/data'
import { fmtBytes } from '../../lib/compress'
import { ModeIcon } from './ModeIcon'
import type { Shipment, TransportMode, ShipmentFlag, DocValue } from '../../lib/types'

// ── StatusPill ────────────────────────────────────────────────────────
export function StatusPill({ stage, size = 'sm' }: { stage: number; size?: 'xs' | 'sm' | 'md' }) {
  const label = STAGES[stage]
  const c = stageColor(stage)
  const { mode } = useTheme()
  const fontSize = size === 'xs' ? 10.5 : size === 'sm' ? 11.5 : 13
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize, fontWeight: 500,
      padding: size === 'xs' ? '2px 7px' : '3px 9px',
      borderRadius: 999,
      background: c + (mode === 'dark' ? '30' : '18'),
      color: c, whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 3, background: c, flexShrink: 0,
        animation: stage > 0 && stage < 6 ? 'pulse 2s ease-in-out infinite' : 'none',
      }} />
      {label}
    </span>
  )
}

// ── Mode chip colours ─────────────────────────────────────────────────
const MODE_PALETTE: Record<string, { lbg: string; lfg: string; dbg: string; dfg: string }> = {
  SEA_FCL: { lbg: '#dbeafe', lfg: '#1d4ed8', dbg: '#1e3a5f', dfg: '#93c5fd' },
  SEA_LCL: { lbg: '#ccfbf1', lfg: '#0f766e', dbg: '#134e4a', dfg: '#5eead4' },
  AIR:     { lbg: '#ede9fe', lfg: '#5b21b6', dbg: '#2e1065', dfg: '#c4b5fd' },
  ROAD:    { lbg: '#ffedd5', lfg: '#9a3412', dbg: '#431407', dfg: '#fdba74' },
  RAIL:    { lbg: '#dcfce7', lfg: '#166534', dbg: '#14532d', dfg: '#86efac' },
  COURIER: { lbg: '#fce7f3', lfg: '#9d174d', dbg: '#500724', dfg: '#f9a8d4' },
}

// ── ModeChip ──────────────────────────────────────────────────────────
export function ModeChip({ mode: transportMode, size = 'sm' }: { mode: TransportMode; size?: 'xs' | 'sm' | 'md' }) {
  const { mode: themeMode } = useTheme()
  const m = MODES[transportMode] ?? { short: transportMode ?? '?', label: transportMode ?? '?' }
  const pal = MODE_PALETTE[transportMode]
  const isDark = themeMode === 'dark'
  const bg  = pal ? (isDark ? pal.dbg : pal.lbg) : (isDark ? '#2a241d' : '#ede6d8')
  const fg  = pal ? (isDark ? pal.dfg : pal.lfg) : (isDark ? '#c2b8a6' : '#5a4d3a')
  const fontSize = size === 'xs' ? 10 : size === 'sm' ? 11 : 12
  const pad = size === 'xs' ? '2px 6px' : size === 'sm' ? '3px 8px' : '4px 10px'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize, fontWeight: 600, letterSpacing: 0.2,
      padding: pad, borderRadius: 4,
      background: bg, color: fg,
      fontFamily: '"JetBrains Mono", monospace',
      whiteSpace: 'nowrap',
    }}>
      <ModeIcon mode={transportMode} size={fontSize + 1} color={fg} />
      {m.short}
    </span>
  )
}

// ── FlagChip ──────────────────────────────────────────────────────────
const FLAG_MAP: Record<string, { label: string; tone: 'warn' | 'bad' }> = {
  customs_hold: { label: 'Customs hold', tone: 'warn' },
  docs_missing: { label: 'Docs missing', tone: 'bad' },
  eta_slipped:  { label: 'ETA slipped',  tone: 'bad' },
}

export function FlagChip({ flag, delayed }: { flag: ShipmentFlag; delayed?: boolean }) {
  const { t } = useTheme()
  const items: { label: string; tone: 'warn' | 'bad' }[] = []
  if (flag && FLAG_MAP[flag]) items.push(FLAG_MAP[flag])
  if (delayed && flag !== 'eta_slipped') items.push({ label: 'Delayed', tone: 'bad' })
  if (!items.length) return null
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {items.map((it, i) => {
        const bg = it.tone === 'warn' ? t.warnSoft : t.badSoft
        const fg = it.tone === 'warn' ? t.warn : t.bad
        return (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 10.5, fontWeight: 600,
            padding: '2px 7px', borderRadius: 3,
            background: bg, color: fg, letterSpacing: 0.1,
          }}>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
              <path d="M6 1 L11 10.5 H1 Z" stroke={fg} strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
              <path d="M6 5 V7.5" stroke={fg} strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="6" cy="9" r=".7" fill={fg}/>
            </svg>
            {it.label}
          </span>
        )
      })}
    </span>
  )
}

// ── fmtShortDate ─────────────────────────────────────────────────────
// "2026-04-24" → "24 Apr"
export function fmtShortDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const m = parseInt(parts[1], 10) - 1
  const d = parseInt(parts[2], 10)
  return `${d} ${months[m] ?? ''}`
}

// ── ETAChip ───────────────────────────────────────────────────────────
export function ETAChip({ shipment }: { shipment: Shipment }) {
  const { t } = useTheme()
  if (shipment.stage === 6) return <span style={{ fontSize: 11, color: t.good, fontWeight: 500 }}>Delivered</span>
  if (!shipment.eta) return <span style={{ fontSize: 11, color: t.inkSoft }}>No ETA</span>
  const d = daysToETA(shipment.eta)
  let label: string, color: string
  if (d < 0)       { label = `${Math.abs(d)}d late`;            color = t.bad }
  else if (d === 0) { label = 'Today';                          color = t.warn }
  else if (d === 1) { label = 'Tomorrow';                       color = t.warn }
  else if (d <= 7)  { label = `in ${d} day${d === 1 ? '' : 's'}`;          color = t.warn }
  else              { label = fmtShortDate(shipment.eta);        color = t.inkMid }
  return (
    <span style={{ fontSize: 11, color, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
      {label}
    </span>
  )
}

// ── CountryFlag ───────────────────────────────────────────────────────
// Uses flagcdn.com PNG images (width-based URLs — the only supported format)
// Supported widths: 20, 40, 80, 160, 320, 640
export function CountryFlag({ cc, size = 14 }: { cc: string; size?: number }) {
  if (!cc || cc.length < 2) return null
  // Pick the nearest supported CDN width (always render at 2× for crispness)
  const cdnW = size <= 12 ? 20 : size <= 24 ? 40 : size <= 48 ? 80 : 160
  const h = Math.round(size * 0.75)
  return (
    <img
      src={`https://flagcdn.com/w${cdnW}/${cc.toLowerCase()}.png`}
      width={size}
      height={h}
      alt={cc}
      style={{ borderRadius: 2, display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', objectFit: 'cover' }}
      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}

// ── DocsRing ──────────────────────────────────────────────────────────
export function DocsRing({ shipment, size = 32 }: { shipment: Shipment; size?: number }) {
  const { t } = useTheme()
  const r = size / 2 - 3
  const cx = size / 2
  const cy = size / 2
  const segs = DOC_TYPES.length
  const gap = 0.06
  const segArc = (Math.PI * 2 - gap * segs) / segs
  const score = docsScore(shipment.docs ?? {})
  const allIn = score === segs

  const docs = shipment.docs ?? {}
  const arcs = DOC_TYPES.map((d, i) => {
    const a0 = -Math.PI / 2 + i * (segArc + gap)
    const a1 = a0 + segArc
    const x0 = cx + Math.cos(a0) * r
    const y0 = cy + Math.sin(a0) * r
    const x1 = cx + Math.cos(a1) * r
    const y1 = cy + Math.sin(a1) * r
    const have = docOk(docs[d.key as keyof typeof shipment.docs])
    return (
      <path key={d.key}
        d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`}
        stroke={have ? (allIn ? t.good : t.primary) : t.bgDeep}
        strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
    )
  })

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
         title={`${score} of ${segs} documents uploaded`}>
      <svg width={size} height={size}>{arcs}</svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: size > 30 ? 11 : 9.5, fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        color: allIn ? t.good : t.ink,
      }}>{score}/{segs}</div>
    </div>
  )
}

// ── DocsFraction ──────────────────────────────────────────────────────
export function DocsFraction({ shipment }: { shipment: Shipment }) {
  const { t } = useTheme()
  const score = docsScore(shipment.docs ?? {})
  const total = DOC_TYPES.length
  const allIn = score === total
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
      color: allIn ? t.good : score < 3 ? t.bad : t.ink,
    }}>
      {score}<span style={{ color: t.inkFaint, fontWeight: 400 }}>/{total}</span>
    </span>
  )
}

// ── RouteBar ──────────────────────────────────────────────────────────
export function RouteBar({ shipment: s, width = 280, showLabels = true }: {
  shipment: Shipment; width?: number; showLabels?: boolean
}) {
  const { t } = useTheme()
  const stage = s.stage
  const c = stageColor(stage)

  const PAD    = 10
  const trackW = width - PAD * 2
  const dotX   = (i: number) => PAD + (i / 6) * trackW

  return (
    <div style={{ width }}>
      {/* ── dot track (pure track, no labels inside) ── */}
      <div style={{ position: 'relative', height: 18 }}>

        {/* Background rail */}
        <div style={{
          position: 'absolute', top: '50%', left: PAD, right: PAD,
          transform: 'translateY(-50%)',
          height: 2, background: t.bgDeep, borderRadius: 1,
        }} />

        {/* Filled rail — gradient up to current stage */}
        {stage > 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: PAD,
            width: (stage / 6) * trackW,
            transform: 'translateY(-50%)',
            height: 2,
            background: `linear-gradient(to right, ${stageColor(0)}, ${c})`,
            borderRadius: 1,
            transition: 'width 0.5s ease',
          }} />
        )}

        {/* Stage dots */}
        {STAGES.map((_, i) => {
          const done = i < stage
          const curr = i === stage
          const sc   = stageColor(i)
          const sz   = curr ? 14 : done ? 9 : 7

          return (
            <div key={i} style={{
              position: 'absolute',
              left: dotX(i), top: '50%',
              transform: 'translate(-50%, -50%)',
              width: sz, height: sz, borderRadius: '50%',
              background: done ? sc : curr ? t.panel : t.bgDeep,
              border: curr
                ? `2.5px solid ${sc}`
                : done
                ? 'none'
                : `1.5px solid ${t.bgDeep}`,
              outline: curr ? `2px solid ${sc}40` : 'none',
              boxShadow: curr ? `0 0 0 3px ${sc}20` : 'none',
              zIndex: curr ? 3 : done ? 2 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {done && (
                <svg width="5" height="5" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4 L3 5.5 L6.5 2.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          )
        })}
      </div>

      {/* ── stage name below track, aligned to current dot ── */}
      <div style={{ position: 'relative', height: 13, marginTop: 2 }}>
        <span style={{
          position: 'absolute',
          left: dotX(stage),
          transform: 'translateX(-50%)',
          fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
          color: c, whiteSpace: 'nowrap',
          textTransform: 'uppercase' as const,
        }}>
          {STAGES[stage]}
        </span>
      </div>

      {/* ── optional POL / ETA row ── */}
      {showLabels && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 4,
          fontSize: 10, color: t.inkFaint,
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          <span>{s.pol_code}</span>
          <span>{s.eta && `ETA ${s.eta.slice(5).replace('-', '/')}`}</span>
          <span>{s.pod_code}</span>
        </div>
      )}
    </div>
  )
}

// ── Shared form atoms ─────────────────────────────────────────────────
export function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const { t } = useTheme()
  return (
    <div style={{ marginBottom: 14, flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color: t.inkSoft,
        letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 5,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        {hint && <span style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0, color: t.inkFaint }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export function TextInput({ value, onChange, type = 'text', placeholder, mono }: {
  value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; mono?: boolean
}) {
  const { t } = useTheme()
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '8px 10px',
        border: `1px solid ${t.border}`, borderRadius: 6,
        background: t.bg, color: t.ink,
        fontSize: 13, fontFamily: mono ? '"JetBrains Mono", monospace' : 'inherit',
        outline: 'none', boxSizing: 'border-box' as const,
      }}
      onFocus={e => e.currentTarget.style.borderColor = t.primary}
      onBlur={e => e.currentTarget.style.borderColor = t.border}
    />
  )
}

export function SelectInput({ value, onChange, options }: {
  value: string; onChange: (v: string) => void
  options: (string | { value: string; label: string })[]
}) {
  const { t } = useTheme()
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: '100%', padding: '8px 10px',
      border: `1px solid ${t.border}`, borderRadius: 6,
      background: t.bg, color: t.ink,
      fontSize: 13, fontFamily: 'inherit',
      outline: 'none', boxSizing: 'border-box' as const, cursor: 'pointer',
    }}>
      {options.map(o => {
        const v = typeof o === 'object' ? o.value : o
        const l = typeof o === 'object' ? o.label : o
        return <option key={v} value={v}>{l}</option>
      })}
    </select>
  )
}

export function TextareaInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const { t } = useTheme()
  return (
    <textarea value={value} placeholder={placeholder} rows={2}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '8px 10px',
        border: `1px solid ${t.border}`, borderRadius: 6,
        background: t.bg, color: t.ink,
        fontSize: 13, fontFamily: 'inherit',
        outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const,
      }} />
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  const { t } = useTheme()
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 600, letterSpacing: 0.8,
      textTransform: 'uppercase', color: t.inkSoft, marginBottom: 8,
    }}>{children}</div>
  )
}

export function Divider() {
  const { t } = useTheme()
  return <div style={{ height: 1, background: t.border, margin: '6px 0 14px' }} />
}

// ── DocUploadRow ──────────────────────────────────────────────────────
type UploadPhase = 'idle' | 'compressing' | 'uploading' | 'error'

export function DocUploadRow({
  docKey, label, value, onUpload, allowToggle, onToggle,
}: {
  docKey: string
  label: string
  value: DocValue | undefined
  onUpload: (file: File) => Promise<void>
  allowToggle?: boolean
  onToggle?: () => void
}) {
  const { t } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [errMsg, setErrMsg] = useState('')

  const have   = docOk(value)
  const url    = docUrl(value)
  const name   = docName(value)
  const size   = docSize(value)
  const busy   = phase === 'compressing' || phase === 'uploading'

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setPhase('compressing')
    setErrMsg('')
    try {
      await onUpload(file)
      setPhase('idle')
    } catch (err: unknown) {
      setPhase('error')
      setErrMsg(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 7,
      background: have ? t.primaryWash : t.bgSoft,
      border: `1px solid ${have ? t.primary + '50' : t.border}`,
      transition: 'background 0.12s',
    }}>
      {/* Checkbox / status dot */}
      <div
        onClick={allowToggle ? onToggle : undefined}
        style={{
          width: 22, height: 22, borderRadius: 5, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: have ? t.primary : 'transparent',
          border: have ? 'none' : `1.5px solid ${t.border}`,
          cursor: allowToggle ? 'pointer' : 'default',
          color: '#fff',
        }}>
        {have && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6.5 L4.5 9 L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace',
            color: have ? t.primaryDeep : t.inkSoft,
          }}>{docKey}</span>
          <span style={{ fontSize: 13, color: t.ink }}>{label}</span>
        </div>
        {have && name && (
          <div style={{ fontSize: 10.5, color: t.inkSoft, marginTop: 2, display: 'flex', gap: 6 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{name}</span>
            {size !== undefined && <span style={{ flexShrink: 0, color: t.inkFaint }}>· {fmtBytes(size)}</span>}
          </div>
        )}
        {phase === 'error' && (
          <div style={{ fontSize: 10.5, color: t.bad, marginTop: 2 }}>{errMsg || 'Upload failed'}</div>
        )}
        {busy && (
          <div style={{ fontSize: 10.5, color: t.primary, marginTop: 2 }}>
            {phase === 'compressing' ? '⚙ Compressing…' : '⬆ Uploading…'}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
        {have && url && (
          <button
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            style={{
              border: `1px solid ${t.primary}60`, background: t.primaryWash,
              color: t.primaryDeep, padding: '4px 10px', borderRadius: 5,
              fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', gap: 4, alignItems: 'center',
            }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 10 L10 2 M5 2 H10 V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View
          </button>
        )}
        <button
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1px solid ${t.border}`, background: busy ? t.bgDeep : t.bg,
            color: busy ? t.inkFaint : t.inkMid, padding: '4px 10px', borderRadius: 5,
            fontSize: 11.5, fontWeight: 500, cursor: busy ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}>
          {have ? 'Replace' : 'Upload'}
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

export { Combobox, type ComboItem } from './Combobox'
