import type { TransportMode, DocSet, DocValue, DocEntry } from './types'

export const MODES: Record<TransportMode, { key: TransportMode; label: string; short: string }> = {
  SEA_FCL: { key: 'SEA_FCL', label: 'Sea · FCL', short: 'FCL' },
  SEA_LCL: { key: 'SEA_LCL', label: 'Sea · LCL', short: 'LCL' },
  AIR:     { key: 'AIR',     label: 'Air',        short: 'AIR' },
  ROAD:    { key: 'ROAD',    label: 'Road',       short: 'RD'  },
  RAIL:    { key: 'RAIL',    label: 'Rail',       short: 'RL'  },
  COURIER: { key: 'COURIER', label: 'Courier',    short: 'CR'  },
}

export const STAGES = [
  'Booked', 'Picked up', 'At POL', 'In transit', 'At POD', 'Customs', 'Delivered',
]

export const DOC_TYPES = [
  { key: 'PI',  label: 'Proforma Invoice' },
  { key: 'CI',  label: 'Commercial Invoice' },
  { key: 'PL',  label: 'Packing List' },
  { key: 'BL',  label: 'BL / AWB' },
  { key: 'SB',  label: 'Shipping Bill' },
  { key: 'BOE', label: 'Bill of Entry' },
] as const

export const INCTERMS = ['FOB', 'CIF', 'CFR', 'EXW', 'DAP', 'DDP', 'FCA', 'CIP', 'CPT']
export const CURRENCIES = ['USD', 'EUR', 'INR', 'CNY', 'JPY']
export const FLAG_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'customs_hold', label: 'Customs hold' },
  { value: 'docs_missing', label: 'Docs missing' },
  { value: 'eta_slipped',  label: 'ETA slipped' },
]

export const TODAY = new Date().toISOString().slice(0, 10)

export function flagEmoji(cc: string): string {
  if (!cc || cc.length !== 2) return ''
  const A = 0x1F1E6
  const a = 'A'.charCodeAt(0)
  return String.fromCodePoint(A + cc.charCodeAt(0) - a, A + cc.charCodeAt(1) - a)
}

// ── Doc helpers (handles legacy boolean + new DocEntry) ───────────────
export function docOk(v: DocValue | undefined): boolean {
  if (v === undefined || v === null) return false
  if (typeof v === 'boolean') return v
  return !!v.ok
}
export function docUrl(v: DocValue | undefined): string | undefined {
  if (!v || typeof v === 'boolean') return undefined
  return (v as DocEntry).url
}
export function docName(v: DocValue | undefined): string | undefined {
  if (!v || typeof v === 'boolean') return undefined
  return (v as DocEntry).name
}
export function docSize(v: DocValue | undefined): number | undefined {
  if (!v || typeof v === 'boolean') return undefined
  return (v as DocEntry).size
}

export function docsScore(docs: Partial<DocSet>): number {
  return Object.values(docs).filter(v => docOk(v as DocValue)).length
}

export function fmtMoney(v: number, c: string): string {
  const sym = c === 'USD' ? '$' : c === 'EUR' ? '€' : c === 'INR' ? '₹' : ''
  return sym + v.toLocaleString('en-US')
}

export function daysBetween(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000)
}

export function daysToETA(eta: string): number {
  return daysBetween(TODAY, eta)
}

export function stageColor(stage: number): string {
  if (stage === 6) return '#3a8a4a'
  if (stage === 5) return '#c97a1f'
  if (stage === 4) return '#5a8fb3'
  if (stage === 3) return '#7a6ba0'
  if (stage === 2) return '#a3905f'
  if (stage === 1) return '#8b7d6b'
  return '#9a9087'
}
