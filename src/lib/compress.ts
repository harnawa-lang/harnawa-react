/**
 * File compression before upload.
 *
 * Images → WebP at 0.85 quality (60–85 % smaller than PNG/JPEG).
 *          Large scans capped at 3000 px on the longest side.
 *
 * PDFs   → pdf-lib lossless optimisation (useObjectStreams).
 *          Packs objects into DEFLATE-compressed cross-reference streams.
 *          Typical savings: 20–50 % on business documents, zero quality loss.
 *          Falls back to passthrough if the library fails for any reason.
 *
 * Others → stored as-is.
 */

import { PDFDocument } from 'pdf-lib'

export interface CompressResult {
  blob: Blob
  ext: string
  mimeType: string
  originalSize: number
  compressedSize: number
  method: 'webp' | 'pdf-lib' | 'passthrough'
}

export async function compressFile(file: File): Promise<CompressResult> {
  const originalSize = file.size

  // ── Images ────────────────────────────────────────────────────────────
  if (file.type.startsWith('image/')) {
    try {
      const { blob } = await imageToWebP(file)
      return {
        blob, ext: 'webp', mimeType: 'image/webp',
        originalSize, compressedSize: blob.size, method: 'webp',
      }
    } catch (err) {
      console.warn('[compress] WebP failed, passthrough:', err)
    }
  }

  // ── PDFs ─────────────────────────────────────────────────────────────
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    try {
      const compressed = await compressPDF(file)
      // Only use compressed version if it's actually smaller
      const best = compressed.size < originalSize ? compressed : file
      return {
        blob: best, ext: 'pdf', mimeType: 'application/pdf',
        originalSize, compressedSize: best.size,
        method: best === compressed ? 'pdf-lib' : 'passthrough',
      }
    } catch (err) {
      console.warn('[compress] pdf-lib failed, passthrough:', err)
    }
  }

  // ── Passthrough ───────────────────────────────────────────────────────
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  return {
    blob: file, ext, mimeType: file.type || 'application/octet-stream',
    originalSize, compressedSize: file.size, method: 'passthrough',
  }
}

// ── PDF lossless compression ──────────────────────────────────────────
async function compressPDF(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(buffer, {
    // Don't throw on encrypted PDFs — try to load anyway
    ignoreEncryption: true,
  })

  const bytes = await pdfDoc.save({
    // Pack multiple objects into a single compressed stream (xref streams).
    // This is the main lever for lossless PDF size reduction.
    useObjectStreams: true,
    addDefaultPage: false,
  })

  return new Blob([bytes], { type: 'application/pdf' })
}

// ── Image → WebP ──────────────────────────────────────────────────────
async function imageToWebP(file: File): Promise<{ blob: Blob; ext: 'webp' }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const MAX = 3000
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w > MAX || h > MAX) {
        const scale = MAX / Math.max(w, h)
        w = Math.round(w * scale)
        h = Math.round(h * scale)
      }

      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('No 2D context'))
      ctx.drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        blob => blob ? resolve({ blob, ext: 'webp' }) : reject(new Error('toBlob returned null')),
        'image/webp',
        0.85,
      )
    }

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Image load failed')) }
    img.src = objectUrl
  })
}

/** Human-readable bytes: "1.2 MB" */
export function fmtBytes(n: number): string {
  if (n < 1024)        return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}
