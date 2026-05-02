import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../lib/ThemeContext'
import { useShipment, updateShipmentField, pushStatusUpdate } from '../lib/store'
import { STAGES, stageColor, CURRENCIES, FLAG_OPTIONS } from '../lib/data'
import { FormField, TextInput, SelectInput, Divider } from './atoms'
import type { DocSet, ShipmentFlag } from '../lib/types'

// ── Per-stage suggested notes ────────────────────────────────────────
const STAGE_SUGGESTIONS: Record<number, string[]> = {
  0: ['Shipment booked and confirmed', 'Order placed with supplier', 'Awaiting cargo ready date'],
  1: ['Cargo picked up from supplier', 'Goods collected from factory', 'Cargo in transit to port'],
  2: ['Cargo arrived at port of loading', 'Container loaded on vessel', 'Vessel departure scheduled'],
  3: ['Vessel departed, cargo in transit', 'En route to destination port', 'No issues reported on voyage'],
  4: ['Vessel arrived at port of discharge', 'Container discharged from vessel', 'Awaiting customs clearance'],
  5: ['Customs clearance in progress', 'Documents submitted to customs', 'Duty paid — awaiting release', 'Customs examination scheduled'],
  6: ['Shipment delivered successfully', 'Cargo received at destination warehouse', 'Delivery confirmed by consignee'],
}

interface Props { shipmentId: string; onClose: () => void }

export function UpdateModal({ shipmentId, onClose }: Props) {
  const { t, mode } = useTheme()
  const s = useShipment(shipmentId)

  const [form, setForm] = useState<null | {
    stage: number
    note: string
    eta: string
    carrier: string
    vessel: string
    container: string
    value: number
    currency: string
    flag: string
    delayed: boolean
  }>(null)

  // Initialise form (keep edits, always re-sync docs from store)
  useEffect(() => {
    if (!s) return
    setForm(prev => ({
      stage:     prev?.stage     ?? s.stage,
      note:      prev?.note      ?? '',   // always blank on first open
      eta:       prev?.eta       ?? s.eta         ?? '',
      carrier:   prev?.carrier   ?? s.carrier     ?? '',
      vessel:    prev?.vessel    ?? s.vessel       ?? '',
      container: prev?.container ?? s.container   ?? '',
      value:     prev?.value     ?? s.value        ?? 0,
      currency:  prev?.currency  ?? s.currency    ?? 'USD',
      flag:      prev?.flag      ?? s.flag         ?? '',
      delayed:   prev?.delayed   ?? !!s.delayed,
    }))
  }, [s])

  if (!s || !form) return null
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => f ? { ...f, [k]: v } : f)

  const submit = async () => {
    if (!form) return
    // Only update mutable fields
    await updateShipmentField(s.id, {
      eta:       form.eta,
      carrier:   form.carrier,
      vessel:    form.vessel,
      container: form.container,
      value:     Number(form.value),
      currency:  form.currency,
    })
    await pushStatusUpdate(s.id, {
      stage:   form.stage,
      note:    form.note || STAGES[form.stage],
      eta:     form.eta,
      flag:    (form.flag || null) as ShipmentFlag,
      delayed: form.delayed,
    })
    onClose()
  }

  const btnPrimary: React.CSSProperties = {
    border: 'none', cursor: 'pointer',
    background: t.primary, color: '#fff',
    padding: '9px 20px', borderRadius: 6,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
    boxShadow: `0 2px 8px ${t.primary}40`,
  }
  const btnGhost: React.CSSProperties = {
    border: `1px solid ${t.border}`, cursor: 'pointer',
    background: 'transparent', color: t.inkMid,
    padding: '9px 16px', borderRadius: 6,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
  }

  const suggestions = STAGE_SUGGESTIONS[form.stage] ?? []

  return createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: t.overlay, backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'inherit', animation: 'fadeIn 0.15s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 680, maxHeight: '92vh', background: t.panel,
        color: t.ink, borderRadius: 12,
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        border: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'modalIn 0.2s ease',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '16px 22px', borderBottom: `1px solid ${t.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          background: t.panelAlt, flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 10, color: t.inkFaint, fontFamily: '"JetBrains Mono", monospace', letterSpacing: 0.8 }}>UPDATE SHIPMENT · {s.id}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{s.supplier}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: t.bgSoft, cursor: 'pointer', color: t.inkMid, width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* ① STAGE */}
          <FormField label="Current stage" hint="Click to change">
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
              {STAGES.map((stg, i) => {
                const sel = i === form.stage
                const c = stageColor(i)
                return (
                  <button key={stg} onClick={() => set('stage', i)} style={{
                    border: `1px solid ${sel ? c : t.border}`,
                    background: sel ? c + (mode === 'dark' ? '30' : '18') : t.bgSoft,
                    color: sel ? c : t.inkMid,
                    padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
                    fontSize: 12, fontWeight: sel ? 700 : 500, fontFamily: 'inherit',
                    display: 'inline-flex', gap: 5, alignItems: 'center',
                    transition: 'all 0.12s',
                  }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.6 }}>{i}</span>
                    {stg}
                  </button>
                )
              })}
            </div>
          </FormField>

          {/* ② SMART NOTE (merged status note + history note) */}
          <FormField label="Update note" hint="Saved as status · appended to timeline">
            {/* Suggestion chips */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const, marginBottom: 8 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => set('note', s)} style={{
                  border: `1px solid ${form.note === s ? t.primary + '80' : t.border}`,
                  background: form.note === s ? t.primaryWash : t.bgSoft,
                  color: form.note === s ? t.primaryDeep : t.inkMid,
                  padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
                  fontSize: 11, fontWeight: form.note === s ? 600 : 400, fontFamily: 'inherit',
                  transition: 'all 0.1s',
                }}>{s}</button>
              ))}
            </div>
            {/* Free-text */}
            <textarea
              value={form.note}
              onChange={e => set('note', e.target.value)}
              placeholder={`e.g. ${suggestions[0] ?? 'Add a note…'}`}
              rows={2}
              style={{
                width: '100%', padding: '8px 10px',
                border: `1px solid ${t.border}`, borderRadius: 6,
                background: t.bg, color: t.ink,
                fontSize: 13, fontFamily: 'inherit', resize: 'vertical' as const,
                outline: 'none', boxSizing: 'border-box' as const,
              }}
            />
          </FormField>

          <Divider />

          {/* ③ LOCKED FIELDS — read-only summary */}
          <div style={{
            background: t.bgSoft, borderRadius: 8,
            border: `1px solid ${t.border}`, padding: '10px 14px',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' as const, color: t.inkFaint, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M4 5 V3.5 A2 2 0 0 1 8 3.5 V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Fixed at creation · cannot be changed
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px 16px' }}>
              {[
                { label: 'Supplier',   val: s.supplier },
                { label: 'Mode',       val: s.mode.replace('_', ' · ') },
                { label: 'Incoterm',   val: s.incoterm },
                { label: 'POL',        val: `${s.pol} (${s.pol_code})` },
                { label: 'POD',        val: `${s.pod} (${s.pod_code})` },
                { label: 'ETD',        val: s.etd },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: 9, color: t.inkFaint, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' as const }}>{label}</div>
                  <div style={{ fontSize: 11.5, color: t.inkMid, marginTop: 1, fontWeight: 500 }}>{val || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ④ EDITABLE FIELDS */}
          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label="ETA · Revised">
              <TextInput type="date" value={form.eta} onChange={v => set('eta', v)} />
            </FormField>
            <FormField label="Value">
              <TextInput type="number" value={form.value} onChange={v => set('value', Number(v))} mono />
            </FormField>
            <FormField label="Currency">
              <SelectInput value={form.currency} onChange={v => set('currency', v)} options={CURRENCIES} />
            </FormField>
          </div>

          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label="Carrier">
              <TextInput value={form.carrier} onChange={v => set('carrier', v)} placeholder="e.g. Maersk" />
            </FormField>
            <FormField label="Vessel / Flight">
              <TextInput value={form.vessel} onChange={v => set('vessel', v)} placeholder="e.g. MV Maersk Altair" />
            </FormField>
          </div>

          <FormField label="Container / AWB #">
            <TextInput value={form.container} onChange={v => set('container', v)} mono placeholder="e.g. MSKU 7384921" />
          </FormField>

          <Divider />

          {/* ⑤ ALERTS */}
          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label="Alert flag">
              <SelectInput value={form.flag} onChange={v => set('flag', v)} options={FLAG_OPTIONS} />
            </FormField>
            <FormField label="Delayed">
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', border: `1px solid ${t.border}`, borderRadius: 6,
                background: t.bg, fontSize: 13, color: t.ink, cursor: 'pointer',
              }}>
                <input type="checkbox" checked={form.delayed} onChange={e => set('delayed', e.target.checked)}
                  style={{ accentColor: t.primary, width: 14, height: 14 }} />
                Mark as delayed
              </label>
            </FormField>
          </div>

        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '14px 22px', borderTop: `1px solid ${t.border}`,
          background: t.panelAlt, flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: 11, color: t.inkFaint }}>
            Note saved as status &amp; appended to timeline
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={btnGhost}>Cancel</button>
            <button onClick={submit} style={btnPrimary}>Save update</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
