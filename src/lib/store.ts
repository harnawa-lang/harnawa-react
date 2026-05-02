import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { STAGES, daysToETA } from './data'
import { compressFile } from './compress'
import type { Shipment, DocSet, DocEntry, ExtraDoc, HistoryEntry, ShipmentFlag } from './types'

// ── in-memory cache (synced from Supabase) ───────────────────────────
let __shipments: Shipment[] = []
let __loaded = false
let __error: string | null = null
let __retryTimeout: ReturnType<typeof setTimeout> | null = null
const __listeners = new Set<(s: Shipment[]) => void>()
const __errorListeners = new Set<(e: string | null) => void>()

function notify() {
  __shipments = [...__shipments]
  __listeners.forEach(fn => fn(__shipments))
}

function notifyError(e: string | null) {
  __error = e
  __errorListeners.forEach(fn => fn(e))
}

function scheduleRetry() {
  if (__retryTimeout) return
  __retryTimeout = setTimeout(() => {
    __retryTimeout = null
    loadShipments()
  }, 8000) // retry after 8 seconds
}

function mapRow(row: Record<string, unknown>): Shipment {
  return {
    ...(row as unknown as Shipment),
    bol: (row.bol as string) ?? '',
    material: (row.material as string) ?? '',
    docs: typeof row.docs === 'string' ? JSON.parse(row.docs) : (row.docs ?? { PI: false, CI: false, PL: false, BL: false, SB: false, BOE: false }),
    extra_docs: typeof row.extra_docs === 'string' ? JSON.parse(row.extra_docs) : (row.extra_docs ?? []),
    history: typeof row.history === 'string' ? JSON.parse(row.history) : (row.history ?? []),
  }
}

export async function loadShipments(): Promise<void> {
  notifyError(null)
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[store] loadShipments error:', error.message)
    notifyError(error.message)
    scheduleRetry() // auto-retry — don't set __loaded so it keeps trying
    return
  }

  __shipments = (data ?? []).map(mapRow)
  __loaded = true
  notifyError(null)
  notify()
}

// ── next ID helper ────────────────────────────────────────────────────
export function nextId(existing: Shipment[]): string {
  const nums = existing
    .map(s => parseInt(s.id.replace('HRN-', ''), 10))
    .filter(n => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 2604
  return `HRN-${max + 1}`
}

// ── CRUD ──────────────────────────────────────────────────────────────
export async function createShipment(
  partial: Omit<Shipment, 'id' | 'history' | 'created_at' | 'updated_at'> & { id?: string }
): Promise<void> {
  const id = partial.id || nextId(__shipments)
  const history: HistoryEntry[] = [{
    at: new Date().toISOString().slice(0, 16),
    stage: 0,
    note: 'Booked',
    who: 'You',
  }]
  const full: Shipment = { ...partial, id, history } as Shipment

  // Optimistic update
  __shipments = [full, ...__shipments]
  notify()

  const { error } = await supabase.from('shipments').insert({
    ...full,
    docs: full.docs,
    history: full.history,
  })

  if (error) {
    console.error('[store] createShipment error:', error.message)
    // rollback
    __shipments = __shipments.filter(s => s.id !== id)
    notify()
  }
}

export async function updateShipmentField(id: string, patch: Partial<Shipment>): Promise<void> {
  const idx = __shipments.findIndex(s => s.id === id)
  if (idx < 0) return

  // Optimistic update
  __shipments[idx] = { ...__shipments[idx], ...patch }
  notify()

  const { error } = await supabase.from('shipments').update({
    ...patch,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) console.error('[store] updateShipmentField error:', error.message)
}

export async function deleteShipment(id: string): Promise<void> {
  __shipments = __shipments.filter(s => s.id !== id)
  notify()
  await supabase.from('shipments').delete().eq('id', id)
}

export async function pushStatusUpdate(id: string, opts: {
  stage: number
  note: string
  eta?: string
  flag?: ShipmentFlag
  delayed?: boolean
  who?: string
}): Promise<void> {
  const s = __shipments.find(s => s.id === id)
  if (!s) return

  const entry: HistoryEntry = {
    at: new Date().toISOString().slice(0, 16),
    stage: opts.stage,
    note: opts.note || STAGES[opts.stage],
    who: opts.who || 'You',
  }

  await updateShipmentField(id, {
    stage: opts.stage,
    progress: opts.stage / 6,
    status_note: opts.note || s.status_note,
    eta: opts.eta || s.eta,
    flag: opts.flag === undefined ? s.flag : opts.flag,
    delayed: opts.delayed === undefined ? s.delayed : opts.delayed,
    history: [...s.history, entry],
  })
}

export async function cancelShipment(id: string): Promise<void> {
  const s = __shipments.find(s => s.id === id)
  if (!s) return
  const entry: HistoryEntry = {
    at: new Date().toISOString().slice(0, 16),
    stage: s.stage,
    note: 'Shipment cancelled',
    who: 'You',
  }
  await updateShipmentField(id, {
    cancelled: true,
    status_note: 'Shipment cancelled',
    history: [...(s.history ?? []), entry],
  })
}

export async function uncancelShipment(id: string): Promise<void> {
  const s = __shipments.find(s => s.id === id)
  if (!s) return
  const entry: HistoryEntry = {
    at: new Date().toISOString().slice(0, 16),
    stage: s.stage,
    note: 'Shipment reactivated',
    who: 'You',
  }
  await updateShipmentField(id, {
    cancelled: false,
    status_note: '',
    history: [...(s.history ?? []), entry],
  })
}

export async function toggleDoc(id: string, docKey: keyof DocSet, value: boolean): Promise<void> {
  const s = __shipments.find(s => s.id === id)
  if (!s) return
  await updateShipmentField(id, { docs: { ...s.docs, [docKey]: value } })
}

/**
 * Delete an uploaded document from Supabase Storage and reset the doc entry to false.
 */
export async function deleteDoc(shipmentId: string, docKey: keyof DocSet): Promise<void> {
  const s = __shipments.find(s => s.id === shipmentId)
  if (!s) return

  const docVal = s.docs[docKey]
  if (docVal && typeof docVal === 'object' && docVal.url) {
    // Extract storage path from the public URL
    // URL: ...supabase.co/storage/v1/object/public/shipment-docs/{path}
    const marker = '/shipment-docs/'
    const idx = docVal.url.indexOf(marker)
    if (idx !== -1) {
      const path = decodeURIComponent(docVal.url.slice(idx + marker.length))
      await supabase.storage.from('shipment-docs').remove([path])
    }
  }

  await updateShipmentField(shipmentId, {
    docs: { ...s.docs, [docKey]: false },
  })
}

/**
 * Compress and upload a document file to Supabase Storage,
 * then persist the DocEntry (url, name, size) into the shipment's docs field.
 */
export async function uploadDoc(
  shipmentId: string,
  docKey: keyof DocSet,
  file: File,
  onProgress?: (phase: 'compressing' | 'uploading' | 'done' | 'error', info?: string) => void,
): Promise<void> {
  const s = __shipments.find(s => s.id === shipmentId)
  if (!s) return

  onProgress?.('compressing')
  const { blob, ext, mimeType, compressedSize } = await compressFile(file)

  const path = `${shipmentId}/${docKey}_${Date.now()}.${ext}`

  onProgress?.('uploading')
  const { error: uploadErr } = await supabase.storage
    .from('shipment-docs')
    .upload(path, blob, { upsert: true, contentType: mimeType })

  if (uploadErr) {
    console.error('[store] uploadDoc error:', uploadErr.message)
    onProgress?.('error', uploadErr.message)
    return
  }

  const { data } = supabase.storage.from('shipment-docs').getPublicUrl(path)

  const entry: DocEntry = {
    ok: true,
    url: data.publicUrl,
    name: file.name,
    size: compressedSize,
    uploadedAt: new Date().toISOString(),
  }

  await updateShipmentField(shipmentId, {
    docs: { ...s.docs, [docKey]: entry },
  })
  onProgress?.('done')
}

// ── Extra / additional documents ──────────────────────────────────────
export async function uploadExtraDoc(
  shipmentId: string,
  label: string,
  file: File,
  onProgress?: (phase: 'compressing' | 'uploading' | 'done' | 'error', info?: string) => void,
): Promise<void> {
  const s = __shipments.find(s => s.id === shipmentId)
  if (!s) return

  onProgress?.('compressing')
  const { blob, ext, mimeType, compressedSize } = await compressFile(file)

  const safeLabel = label.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) || 'doc'
  const path = `${shipmentId}/extra_${safeLabel}_${Date.now()}.${ext}`

  onProgress?.('uploading')
  const { error: uploadErr } = await supabase.storage
    .from('shipment-docs')
    .upload(path, blob, { upsert: true, contentType: mimeType })

  if (uploadErr) {
    onProgress?.('error', uploadErr.message)
    return
  }

  const { data } = supabase.storage.from('shipment-docs').getPublicUrl(path)

  const entry: ExtraDoc = {
    id: crypto.randomUUID(),
    label,
    url: data.publicUrl,
    fileName: file.name,
    size: compressedSize,
    mime: mimeType,
    uploadedAt: new Date().toISOString(),
  }

  const updated = [...(s.extra_docs ?? []), entry]
  await updateShipmentField(shipmentId, { extra_docs: updated })
  onProgress?.('done')
}

export async function deleteExtraDoc(shipmentId: string, docId: string): Promise<void> {
  const s = __shipments.find(s => s.id === shipmentId)
  if (!s) return

  const doc = (s.extra_docs ?? []).find(d => d.id === docId)
  if (doc?.url) {
    const marker = '/shipment-docs/'
    const idx = doc.url.indexOf(marker)
    if (idx !== -1) {
      const path = decodeURIComponent(doc.url.slice(idx + marker.length))
      await supabase.storage.from('shipment-docs').remove([path])
    }
  }

  const updated = (s.extra_docs ?? []).filter(d => d.id !== docId)
  await updateShipmentField(shipmentId, { extra_docs: updated })
}

// ── Realtime channel — singleton, created once for the whole app ──────
let __rtStarted = false
function ensureRealtime() {
  if (__rtStarted) return
  __rtStarted = true
  supabase
    .channel('shipments-rt')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, () => {
      loadShipments()
    })
    .subscribe()
}

// ── React hooks ───────────────────────────────────────────────────────
export function useShipments() {
  const [list, setList] = useState<Shipment[]>(__shipments)
  const [loading, setLoading] = useState(!__loaded)
  const [error, setError] = useState<string | null>(__error)

  useEffect(() => {
    __listeners.add(setList)
    __errorListeners.add(setError)

    if (!__loaded) {
      loadShipments().then(() => setLoading(false))
    } else {
      setList(__shipments)
      setLoading(false)
    }

    // Start realtime once across the whole app
    ensureRealtime()

    return () => {
      __listeners.delete(setList)
      __errorListeners.delete(setError)
    }
  }, [])

  return { shipments: list, loading, error }
}

// useShipment reads from the shared listener system — no extra Supabase channel
export function useShipment(id: string): Shipment | undefined {
  const [shipment, setShipment] = useState<Shipment | undefined>(
    () => __shipments.find(s => s.id === id)
  )

  useEffect(() => {
    const sync = (list: Shipment[]) => setShipment(list.find(s => s.id === id))
    __listeners.add(sync)
    sync(__shipments) // immediate sync in case data changed between render and effect
    return () => { __listeners.delete(sync) }
  }, [id])

  return shipment
}

// ── Derived stats ─────────────────────────────────────────────────────
export function getStats(shipments: Shipment[]) {
  const active = shipments.filter(s => !s.cancelled && s.stage < 6)  // active = not cancelled, not delivered
  return {
    total:      active.length,
    inTransit:  active.filter(s => s.stage > 0).length,
    arriving:   active.filter(s => { const d = daysToETA(s.eta); return d >= 0 && d <= 7 }).length,
    attention:  active.filter(s => s.flag || s.delayed).length,
    delivered:  shipments.filter(s => !s.cancelled && s.stage === 6).length,
    cancelled:  shipments.filter(s => s.cancelled).length,
    totalValue: active
      .filter(s => s.stage < 6)
      .reduce((sum, s) => {
        const usd = s.currency === 'USD' ? s.value
          : s.currency === 'EUR' ? s.value * 1.08
          : s.value / 83
        return sum + usd
      }, 0),
  }
}

export function filterShipments(shipments: Shipment[], filter: string, search: string): Shipment[] {
  return shipments.filter(s => {
    // Cancelled: only shown in 'cancelled' tab
    if (filter === 'cancelled') { if (!s.cancelled) return false }
    else if (s.cancelled) return false

    // Delivered: only shown in 'delivered' tab — hidden from 'all' and every other tab
    if (filter === 'delivered') { if (s.stage !== 6) return false }
    else if (filter !== 'delivered' && s.stage === 6) return false

    // Active tab filters
    if (filter === 'in_transit' && !(s.stage > 0 && s.stage < 6)) return false
    if (filter === 'arriving') {
      const d = daysToETA(s.eta)
      if (!(s.stage < 6 && d >= 0 && d <= 7)) return false
    }
    if (filter === 'attention' && !(s.flag || s.delayed)) return false

    // Search
    if (search) {
      const q = search.toLowerCase()
      return (
        s.id.toLowerCase().includes(q) ||
        s.supplier.toLowerCase().includes(q) ||
        (s.container || '').toLowerCase().includes(q) ||
        (s.carrier || '').toLowerCase().includes(q) ||
        (s.pol || '').toLowerCase().includes(q) ||
        (s.pod || '').toLowerCase().includes(q) ||
        (s.pol_code || '').toLowerCase().includes(q) ||
        (s.pod_code || '').toLowerCase().includes(q)
      )
    }
    return true
  })
}
