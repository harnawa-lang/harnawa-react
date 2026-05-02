import { useTheme } from '../lib/ThemeContext'
import { useShipments } from '../lib/store'
import { DOC_TYPES, docsScore } from '../lib/data'
import { CountryFlag, DocsRing } from './atoms'

export function DocumentsView() {
  const { t } = useTheme()
  const { shipments } = useShipments()

  return (
    <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto', background: t.bg }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: t.ink }}>Documents</h2>
        <p style={{ fontSize: 13, color: t.inkSoft, marginTop: 4 }}>Document checklist across all active shipments</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden', background: t.border }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 36px 36px 36px 36px 36px 36px 80px',
          padding: '10px 16px', gap: 12,
          background: t.bgSoft,
          fontSize: 10.5, fontWeight: 600, color: t.inkSoft,
          textTransform: 'uppercase', letterSpacing: 0.6,
          alignItems: 'center',
        }}>
          <span>Shipment</span>
          <span>Supplier</span>
          {DOC_TYPES.map(d => (
            <span key={d.key} style={{ textAlign: 'center' }} title={d.label}>{d.key}</span>
          ))}
          <span style={{ textAlign: 'center' }}>Score</span>
        </div>

        {shipments.filter(s => s.stage < 6).map((s, i) => {
          const score = docsScore(s.docs)
          const total = DOC_TYPES.length
          return (
            <div key={s.id} style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 36px 36px 36px 36px 36px 36px 80px',
              padding: '12px 16px', gap: 12,
              background: t.panel,
              alignItems: 'center',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', color: t.ink }}>{s.id}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', minWidth: 0 }}>
                <CountryFlag cc={s.supplier_country} size={12} />
                <span style={{ fontSize: 13, color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.supplier}</span>
              </div>
              {DOC_TYPES.map(d => {
                const have = s.docs[d.key as keyof typeof s.docs]
                return (
                  <div key={d.key} style={{ display: 'flex', justifyContent: 'center' }}>
                    {have ? (
                      <span style={{ width: 20, height: 20, borderRadius: 4, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6.5 L4.5 9 L10 3" stroke={t.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    ) : (
                      <span style={{ width: 20, height: 20, borderRadius: 4, border: `1.5px dashed ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ width: 4, height: 4, borderRadius: 2, background: t.inkFaint }} />
                      </span>
                    )}
                  </div>
                )
              })}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DocsRing shipment={s} size={36} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
