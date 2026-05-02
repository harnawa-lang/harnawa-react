import { useTheme } from '../lib/ThemeContext'

interface Stats {
  total: number
  inTransit: number
  arriving: number
  attention: number
  delivered: number
  cancelled: number
  totalValue: number
}

interface Props {
  stats: Stats
  activeFilter: string
  onFilterChange: (f: string) => void
}

interface StatItem {
  label: string
  value: number | string
  sub: string
  tone: 'neutral' | 'info' | 'warn' | 'bad' | 'good' | 'mute'
  filter: string
}

export function StatStrip({ stats, activeFilter, onFilterChange }: Props) {
  const { t } = useTheme()

  const items: StatItem[] = [
    { label: 'Active shipments',   value: stats.total,        sub: 'across all countries', tone: 'neutral', filter: 'all' },
    { label: 'In transit',         value: stats.inTransit,    sub: 'moving now',            tone: 'info',    filter: 'in_transit' },
    { label: 'Arriving in 7 days', value: stats.arriving,     sub: 'prepare clearance',     tone: 'warn',    filter: 'arriving' },
    { label: 'Need attention',     value: stats.attention,    sub: 'docs · customs · ETA',  tone: stats.attention ? 'bad' : 'mute', filter: 'attention' },
    { label: 'Delivered',          value: stats.delivered,    sub: 'completed',             tone: 'good',    filter: 'delivered' },
    { label: 'Cancelled',          value: stats.cancelled,    sub: 'voided shipments',       tone: stats.cancelled ? 'bad' : 'mute', filter: 'cancelled' },
    { label: 'Value in transit',   value: '$' + (stats.totalValue / 1000).toFixed(0) + 'K', sub: 'USD equiv.', tone: 'neutral', filter: '' },
  ]

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 1, background: t.border,
      margin: '16px 28px 0', borderRadius: 10, overflow: 'hidden',
      border: `1px solid ${t.border}`,
      flexShrink: 0,
    }}>
      {items.map(({ label, value, sub, tone, filter }) => {
        const isActive = filter && activeFilter === filter
        const fg =
          tone === 'info' ? t.info :
          tone === 'warn' ? t.warn :
          tone === 'bad'  ? t.bad  :
          tone === 'good' ? '#3a8a4a' :
          tone === 'mute' ? t.inkMid :
          t.ink

        return (
          <button
            key={label}
            onClick={() => filter && onFilterChange(filter)}
            style={{
              background: isActive ? t.primaryWash : t.panel,
              padding: '14px 18px', textAlign: 'left',
              border: 'none', cursor: filter ? 'pointer' : 'default', fontFamily: 'inherit',
              borderTop: isActive ? `2px solid ${t.primary}` : '2px solid transparent',
              transition: 'background 0.12s',
              display: 'block', width: '100%',
            }}
            onMouseEnter={e => { if (filter && !isActive) e.currentTarget.style.background = t.bgSoft }}
            onMouseLeave={e => { if (filter && !isActive) e.currentTarget.style.background = t.panel }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 600, color: t.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', textAlign: 'left' }}>
              {label}
            </div>
            <div style={{
              fontSize: 28, fontWeight: 700, color: fg,
              marginTop: 4, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5,
              textAlign: 'left',
            }}>
              {value}
            </div>
            <div style={{ fontSize: 11, color: t.inkSoft, marginTop: 2, textAlign: 'left' }}>{sub}</div>
          </button>
        )
      })}
    </div>
  )
}
