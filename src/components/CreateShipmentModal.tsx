import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../lib/ThemeContext'
import { createShipment } from '../lib/store'
import { MODES, STAGES, INCTERMS, CURRENCIES, stageColor } from '../lib/data'
import { searchCountries } from '../lib/countries'
import { searchPorts } from '../lib/ports'
import { FormField, TextInput, SelectInput, Divider, Combobox, type ComboItem } from './atoms'
import type { TransportMode } from '../lib/types'

interface Supplier { name: string; country: string }
interface Props {
  onClose: () => void
  existingIds: string[]
  existingSuppliers: Supplier[]
}

function makeNextId(existingIds: string[]): string {
  const nums = existingIds.map(id => parseInt(id.replace('HRN-', ''), 10)).filter(n => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 2604
  return `HRN-${max + 1}`
}

export function CreateShipmentModal({ onClose, existingIds, existingSuppliers }: Props) {
  const { t } = useTheme()

  const [form, setForm] = useState({
    supplier: '',
    supplierCountry: 'CN',
    mode: 'SEA_FCL' as TransportMode,
    stage: 0,
    statusNote: '',
    bol: '', container: '', material: '', carrier: '', vessel: '',
    pol: '', polCode: '',
    pod: '', podCode: '',
    incoterm: 'FOB', etd: '', eta: '',
    value: '', currency: 'USD',
    custom_duty: '', gst: '',
  })

  const [supplierInput, setSupplierInput] = useState('')
  const [countryInput, setCountryInput] = useState('CN')
  const [polInput, setPolInput] = useState('')
  const [podInput, setPodInput] = useState('')

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  // Supplier autocomplete from existing shipments
  const supplierItems = useMemo((): ComboItem[] => {
    const q = supplierInput.trim()
    if (!q) return []
    const lq = q.toLowerCase()
    return existingSuppliers
      .filter(s => s.name.toLowerCase().includes(lq))
      .map(s => ({
        value: s.name,
        label: s.name,
        sub: s.country,
        flagCc: s.country,
      }))
      .slice(0, 6)
  }, [supplierInput, existingSuppliers])

  // Country autocomplete
  const countryItems = useMemo((): ComboItem[] =>
    searchCountries(countryInput).map(c => ({
      value: c.code,
      label: c.name,
      badge: c.code,
      flagCc: c.code,
    })), [countryInput])

  // Port autocomplete
  const polItems = useMemo((): ComboItem[] =>
    searchPorts(polInput).map(p => ({
      value: p.code,
      label: p.name,
      badge: p.code,
      sub: `${p.city} · ${p.country}`,
      flagCc: p.cc,
    })), [polInput])

  const podItems = useMemo((): ComboItem[] =>
    searchPorts(podInput).map(p => ({
      value: p.code,
      label: p.name,
      badge: p.code,
      sub: `${p.city} · ${p.country}`,
      flagCc: p.cc,
    })), [podInput])

  // ── Mode-driven field config ─────────────────────────────────────────
  const modeConfig = {
    SEA_FCL: { pol: 'POL · Port of Loading', pod: 'POD · Port of Discharge', carrier: 'Shipping Line', vessel: 'Vessel Name', bol: 'Bill of Lading No. (BL)', bolPlaceholder: 'MAEU1234567890', container: 'Container No.', containerPlaceholder: 'MSCU7384921', showVessel: true, showContainer: true },
    SEA_LCL: { pol: 'POL · Port of Loading', pod: 'POD · Port of Discharge', carrier: 'Shipping Line', vessel: 'Vessel Name', bol: 'House BL / MBL No.', bolPlaceholder: 'MAEU1234567890', container: 'Container No.', containerPlaceholder: 'MSCU7384921', showVessel: true, showContainer: true },
    AIR:     { pol: 'Airport of Departure', pod: 'Airport of Arrival', carrier: 'Airline', vessel: 'Flight No.', bol: 'Master AWB No.', bolPlaceholder: '176-12345678', container: 'House AWB No.', containerPlaceholder: '176-87654321', showVessel: true, showContainer: true },
    ROAD:    { pol: 'Origin City / Hub', pod: 'Destination City / Hub', carrier: 'Transporter', vessel: 'Vehicle No.', bol: 'LR / Docket No.', bolPlaceholder: 'LR-2024-00123', container: 'Invoice / PO Ref.', containerPlaceholder: 'PO-2024-456', showVessel: true, showContainer: true },
    RAIL:    { pol: 'Origin Rail Terminal', pod: 'Destination Rail Terminal', carrier: 'Railway Operator', vessel: 'Train / Rake No.', bol: 'Rail Docket No.', bolPlaceholder: 'RLY-2024-00456', container: 'Wagon No.', containerPlaceholder: 'WGN-001', showVessel: true, showContainer: true },
    COURIER: { pol: 'Pickup City', pod: 'Delivery City', carrier: 'Courier Service', vessel: '', bol: 'Tracking No.', bolPlaceholder: '1Z999AA10123456784', container: 'Reference / PO No.', containerPlaceholder: 'PO-2024-789', showVessel: false, showContainer: false },
  } as const

  const mc = modeConfig[form.mode]

  const submit = async () => {
    if (!form.supplier || !form.etd || !form.eta) return
    await createShipment({
      id: makeNextId(existingIds),
      supplier: form.supplier,
      supplier_country: form.supplierCountry,
      mode: form.mode,
      bol: form.bol,
      container: form.container,
      material: form.material,
      carrier: form.carrier,
      vessel: form.vessel || '—',
      pol: form.pol,
      pol_code: form.polCode,
      pod: form.pod,
      pod_code: form.podCode,
      incoterm: form.incoterm,
      etd: form.etd,
      eta: form.eta,
      value: Number(form.value) || 0,
      currency: form.currency,
      custom_duty: form.custom_duty !== '' ? Number(form.custom_duty) : undefined,
      gst: form.gst !== '' ? Number(form.gst) : undefined,
      stage: form.stage,
      status_note: form.statusNote || STAGES[form.stage],
      delayed: false,
      flag: null,
      progress: form.stage / 6,
      docs: { PI: false, CI: false, PL: false, BL: false, SB: false, BOE: false },
    })
    onClose()
  }

  const valid = !!form.supplier && !!form.etd && !!form.eta

  const btnPrimary: React.CSSProperties = {
    border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
    background: valid ? t.primary : t.border, color: valid ? '#fff' : t.inkMid,
    padding: '8px 18px', borderRadius: 6,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
    transition: 'background 0.15s',
  }
  const btnGhost: React.CSSProperties = {
    border: `1px solid ${t.border}`, cursor: 'pointer',
    background: 'transparent', color: t.inkMid,
    padding: '8px 16px', borderRadius: 6,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
  }

  return createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: t.overlay, backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'inherit',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 700, maxHeight: '88vh', background: t.panel,
        color: t.ink, borderRadius: 10,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        border: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px', borderBottom: `1px solid ${t.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: t.panelAlt, flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 10.5, color: t.inkSoft, fontFamily: '"JetBrains Mono", monospace', letterSpacing: 0.5 }}>NEW SHIPMENT</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>Create shipment</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: t.inkSoft, fontSize: 20, padding: 4, lineHeight: 1, borderRadius: 4 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* ── SECTION 1: Supplier + Mode ── */}
          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label="Supplier name *">
              <Combobox
                inputValue={supplierInput}
                onInputChange={v => { setSupplierInput(v); set('supplier', v) }}
                onSelect={item => {
                  setSupplierInput(item.label)
                  set('supplier', item.label)
                  if (item.sub && item.sub.length === 2) {
                    setCountryInput(item.sub)
                    set('supplierCountry', item.sub)
                  }
                }}
                onCreateNew={v => { setSupplierInput(v); set('supplier', v) }}
                items={supplierItems}
                placeholder="e.g. Ningbo Thermotech Co."
                allowCreate
                createLabel="New supplier"
              />
            </FormField>
            <FormField label="Country">
              <Combobox
                inputValue={countryInput}
                onInputChange={v => {
                  setCountryInput(v)
                  set('supplierCountry', v.toUpperCase().slice(0, 2))
                }}
                onSelect={item => {
                  setCountryInput(item.badge || item.value)
                  set('supplierCountry', item.value)
                }}
                items={countryItems}
                placeholder="CN — China"
              />
            </FormField>
          </div>

          <FormField label="Material / Goods description">
            <TextInput
              value={form.material}
              onChange={v => set('material', v)}
              placeholder="e.g. Steel pipes, Solar panels, Cotton yarn…"
            />
          </FormField>

          <FormField label="Transport mode">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {(Object.keys(MODES) as TransportMode[]).map(k => (
                <button key={k} onClick={() => set('mode', k)} style={{
                  border: `1px solid ${form.mode === k ? t.primary : t.border}`,
                  background: form.mode === k ? t.primarySoft : t.bgSoft,
                  color: form.mode === k ? t.primary : t.inkMid,
                  padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                  fontSize: 12, fontWeight: form.mode === k ? 600 : 500, fontFamily: 'inherit',
                }}>{MODES[k].label}</button>
              ))}
            </div>
          </FormField>

          <Divider />

          {/* ── SECTION 2: Tracking Numbers (BOL + Container) — TOP priority ── */}
          <div style={{
            background: t.primarySoft, border: `1.5px solid ${t.primary}30`,
            borderRadius: 8, padding: '14px 16px', marginBottom: 14,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: t.primary, marginBottom: 10 }}>
              Tracking Numbers
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <FormField label={mc.bol}>
                <TextInput
                  value={form.bol}
                  onChange={v => set('bol', v)}
                  placeholder={mc.bolPlaceholder}
                  mono
                />
              </FormField>
              {mc.showContainer && (
                <FormField label={mc.container}>
                  <TextInput value={form.container} onChange={v => set('container', v)} placeholder={mc.containerPlaceholder} mono />
                </FormField>
              )}
            </div>
          </div>

          {/* ── SECTION 3: Route — POL / POD ── */}
          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label={mc.pol}>
              <Combobox
                inputValue={polInput}
                onInputChange={v => { setPolInput(v); set('pol', v); set('polCode', '') }}
                onSelect={item => {
                  setPolInput(item.label)
                  set('pol', item.label)
                  set('polCode', item.value)
                }}
                items={polItems}
                placeholder="Search by name or code…"
              />
              {form.polCode && (
                <div style={{ marginTop: 4, fontSize: 11, color: t.inkSoft, fontFamily: '"JetBrains Mono", monospace' }}>
                  Code: <span style={{ color: t.primary, fontWeight: 600 }}>{form.polCode}</span>
                </div>
              )}
            </FormField>
            <FormField label={mc.pod}>
              <Combobox
                inputValue={podInput}
                onInputChange={v => { setPodInput(v); set('pod', v); set('podCode', '') }}
                onSelect={item => {
                  setPodInput(item.label)
                  set('pod', item.label)
                  set('podCode', item.value)
                }}
                items={podItems}
                placeholder="Search by name or code…"
              />
              {form.podCode && (
                <div style={{ marginTop: 4, fontSize: 11, color: t.inkSoft, fontFamily: '"JetBrains Mono", monospace' }}>
                  Code: <span style={{ color: t.primary, fontWeight: 600 }}>{form.podCode}</span>
                </div>
              )}
            </FormField>
          </div>

          <Divider />

          {/* ── SECTION 4: Carrier / Vessel ── */}
          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label={mc.carrier}>
              <TextInput
                value={form.carrier}
                onChange={v => set('carrier', v)}
                placeholder={
                  form.mode === 'AIR' ? 'Air India, Emirates…'
                  : form.mode === 'COURIER' ? 'DHL, FedEx, UPS…'
                  : form.mode === 'ROAD' ? 'Transport company name'
                  : 'Maersk, MSC, COSCO…'
                }
              />
            </FormField>
            {mc.showVessel && (
              <FormField label={mc.vessel}>
                <TextInput
                  value={form.vessel}
                  onChange={v => set('vessel', v)}
                  placeholder={form.mode === 'AIR' ? 'AI-101, EK-522…' : form.mode === 'ROAD' ? 'MH12AB1234' : 'MV Astrid Maersk'}
                  mono={form.mode === 'AIR' || form.mode === 'ROAD'}
                />
              </FormField>
            )}
          </div>

          <Divider />

          {/* ── SECTION 5: Dates + Value ── */}
          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label="ETD *">
              <TextInput type="date" value={form.etd} onChange={v => set('etd', v)} />
            </FormField>
            <FormField label="ETA *">
              <TextInput type="date" value={form.eta} onChange={v => set('eta', v)} />
            </FormField>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label="Value">
              <TextInput type="number" value={form.value} onChange={v => set('value', v)} placeholder="84200" mono />
            </FormField>
            <FormField label="Currency">
              <SelectInput value={form.currency} onChange={v => set('currency', v)} options={CURRENCIES} />
            </FormField>
            <FormField label="Incoterm">
              <SelectInput value={form.incoterm} onChange={v => set('incoterm', v)} options={INCTERMS} />
            </FormField>
          </div>

          {/* Custom Duty + GST */}
          <div style={{ display: 'flex', gap: 14 }}>
            <FormField label="Custom Duty %">
              <SelectInput
                value={form.custom_duty}
                onChange={v => set('custom_duty', v)}
                options={[
                  { value: '', label: '— Not set' },
                  { value: '0', label: '0% (Exempt)' },
                  { value: '2.5', label: '2.5%' },
                  { value: '5', label: '5%' },
                  { value: '7.5', label: '7.5%' },
                  { value: '10', label: '10%' },
                  { value: '12.5', label: '12.5%' },
                  { value: '15', label: '15%' },
                  { value: '20', label: '20%' },
                  { value: '25', label: '25%' },
                  { value: '30', label: '30%' },
                ]}
              />
            </FormField>
            <FormField label="GST %">
              <SelectInput
                value={form.gst}
                onChange={v => set('gst', v)}
                options={[
                  { value: '', label: '— Not set' },
                  { value: '0', label: '0% (Exempt)' },
                  { value: '5', label: '5%' },
                  { value: '12', label: '12%' },
                  { value: '18', label: '18%' },
                  { value: '28', label: '28%' },
                ]}
              />
            </FormField>
          </div>

          <Divider />

          {/* ── SECTION 6: Status (bottom — usually just "Booked") ── */}
          <FormField label="Shipment status">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {STAGES.map((label, i) => {
                const active = form.stage === i
                const color = stageColor(i)
                return (
                  <button key={i} onClick={() => set('stage', i)} style={{
                    border: `1px solid ${active ? color : t.border}`,
                    background: active ? color + '18' : t.bgSoft,
                    color: active ? color : t.inkMid,
                    padding: '5px 11px', borderRadius: 6, cursor: 'pointer',
                    fontSize: 12, fontWeight: active ? 600 : 500, fontFamily: 'inherit',
                  }}>{label}</button>
                )
              })}
            </div>
          </FormField>
          <FormField label="Status note">
            <TextInput value={form.statusNote} onChange={v => set('statusNote', v)} placeholder={STAGES[form.stage]} />
          </FormField>

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: `1px solid ${t.border}`,
          background: t.panelAlt,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 11.5, color: t.inkSoft }}>
            {!form.supplier && <span>Enter supplier name · </span>}
            {(!form.etd || !form.eta) && <span>ETD &amp; ETA required</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={btnGhost}>Cancel</button>
            <button onClick={submit} disabled={!valid} style={btnPrimary}>Create shipment</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
