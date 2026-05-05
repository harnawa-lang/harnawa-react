export type TransportMode = 'SEA_FCL' | 'SEA_LCL' | 'AIR' | 'ROAD' | 'RAIL' | 'COURIER'

export type ShipmentFlag = 'customs_hold' | 'docs_missing' | 'eta_slipped' | null

// A doc can be a plain boolean (legacy) or a rich entry with storage URL
export interface DocEntry {
  ok: boolean
  url?: string      // Supabase Storage public URL
  name?: string     // original filename
  size?: number     // compressed size in bytes
  uploadedAt?: string
}
export type DocValue = boolean | DocEntry

export interface DocSet {
  PI:  DocValue
  CI:  DocValue
  PL:  DocValue
  BL:  DocValue
  SB:  DocValue
  BOE: DocValue
}

export interface HistoryEntry {
  at: string
  stage: number
  note: string
  who: string
}

export interface Shipment {
  id: string
  supplier: string
  supplier_country: string
  mode: TransportMode
  bol: string
  container: string
  material: string
  carrier: string
  vessel: string
  pol: string
  pol_code: string
  pod: string
  pod_code: string
  incoterm: string
  etd: string
  eta: string
  value: number
  currency: string
  stage: number
  status_note: string
  delayed: boolean
  flag: ShipmentFlag
  progress: number
  docs: DocSet
  extra_docs?: ExtraDoc[]
  history: HistoryEntry[]
  custom_duty?: number   // percentage e.g. 7.5
  gst?: number           // percentage e.g. 18
  cancelled?: boolean
  created_at?: string
  updated_at?: string
}

export type Theme = 'light' | 'dark'

// ── Additional / custom documents ─────────────────────────────────────
export interface ExtraDoc {
  id: string          // uuid generated client-side
  label: string       // user-provided name e.g. "Quality Certificate"
  url: string         // Supabase Storage public URL
  fileName: string    // original file name
  size: number        // compressed size in bytes
  mime: string        // MIME type
  uploadedAt: string  // ISO timestamp
}
