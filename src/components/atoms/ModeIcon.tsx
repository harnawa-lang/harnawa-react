import { useTheme } from '../../lib/ThemeContext'
import { MODES } from '../../lib/data'
import type { TransportMode } from '../../lib/types'

export function ModeIcon({ mode, size = 12, color }: { mode: TransportMode; size?: number; color?: string }) {
  const { t } = useTheme()
  const s = size
  const stroke = color || t.inkMid

  if (mode === 'AIR') return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M2 9 L14 5 L11.5 9 L14 13 Z" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5 8 L7 10" stroke={stroke} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
  if (mode === 'SEA_FCL' || mode === 'SEA_LCL') return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="6" width="10" height="4" stroke={stroke} strokeWidth="1.3"/>
      <path d="M2 12 Q4 13.5 6 12 T10 12 T14 12" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      <path d="M8 3 V6" stroke={stroke} strokeWidth="1.3"/>
    </svg>
  )
  if (mode === 'ROAD') return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="6" width="7" height="5" stroke={stroke} strokeWidth="1.3"/>
      <path d="M9 7 L12 7 L14 9 V11 H9" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
      <circle cx="5" cy="12" r="1.2" stroke={stroke} strokeWidth="1.1" fill="none"/>
      <circle cx="11.5" cy="12" r="1.2" stroke={stroke} strokeWidth="1.1" fill="none"/>
    </svg>
  )
  if (mode === 'RAIL') return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="3" width="10" height="8" rx="1.5" stroke={stroke} strokeWidth="1.3"/>
      <path d="M3 8 H13" stroke={stroke} strokeWidth="1.1"/>
      <circle cx="6" cy="13" r=".9" fill={stroke}/>
      <circle cx="10" cy="13" r=".9" fill={stroke}/>
    </svg>
  )
  if (mode === 'COURIER') return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 5 L8 3 L13 5 V11 L8 13 L3 11 Z" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M3 5 L8 7.5 L13 5 M8 7.5 V13" stroke={stroke} strokeWidth="1.1"/>
    </svg>
  )
  return null
}

const MODE_PALETTE: Record<string, { lbg: string; lfg: string; dbg: string; dfg: string }> = {
  SEA_FCL: { lbg: '#dbeafe', lfg: '#1d4ed8', dbg: '#1e3a5f', dfg: '#93c5fd' },
  SEA_LCL: { lbg: '#ccfbf1', lfg: '#0f766e', dbg: '#134e4a', dfg: '#5eead4' },
  AIR:     { lbg: '#ede9fe', lfg: '#5b21b6', dbg: '#2e1065', dfg: '#c4b5fd' },
  ROAD:    { lbg: '#ffedd5', lfg: '#9a3412', dbg: '#431407', dfg: '#fdba74' },
  RAIL:    { lbg: '#dcfce7', lfg: '#166534', dbg: '#14532d', dfg: '#86efac' },
  COURIER: { lbg: '#fce7f3', lfg: '#9d174d', dbg: '#500724', dfg: '#f9a8d4' },
}

export function ModeChip({ mode, size = 'sm' }: { mode: TransportMode; size?: 'xs' | 'sm' | 'md' }) {
  const { mode: themeMode } = useTheme()
  const m = MODES[mode] ?? { short: mode ?? '—', label: mode ?? '—' }
  const pal = MODE_PALETTE[mode]
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
      <ModeIcon mode={mode} size={fontSize + 1} color={fg} />
      {m.short}
    </span>
  )
}
