import { useRef, useState } from 'react'
import { useTheme } from '../lib/ThemeContext'
import { uploadExtraDoc, deleteExtraDoc } from '../lib/store'
import { fmtBytes } from '../lib/compress'
import type { ExtraDoc } from '../lib/types'

type Phase = 'compressing' | 'uploading' | 'done' | 'error'

interface UploadState {
  phase: Phase
  label: string
  info?: string
}

interface Props {
  shipmentId: string
  extraDocs: ExtraDoc[]
}

function fileIcon(mime: string) {
  if (mime === 'application/pdf' || mime.includes('pdf')) return '📄'
  if (mime.startsWith('image/')) return '🖼️'
  if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) return '📊'
  if (mime.includes('word') || mime.includes('document')) return '📝'
  if (mime.includes('zip') || mime.includes('rar') || mime.includes('compressed')) return '🗜️'
  return '📎'
}

export function ExtraDocsSection({ shipmentId, extraDocs }: Props) {
  const { t, mode } = useTheme()
  const fileRef  = useRef<HTMLInputElement>(null)
  const [label, setLabel]       = useState('')
  const [uploading, setUploading] = useState<UploadState | null>(null)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [labelErr, setLabelErr]   = useState(false)

  async function handleUpload(file: File) {
    const trimmed = label.trim()
    if (!trimmed) { setLabelErr(true); return }
    setLabelErr(false)
    setShowForm(false)

    setUploading({ phase: 'compressing', label: trimmed })
    await uploadExtraDoc(shipmentId, trimmed, file, (phase, info) => {
      setUploading({ phase, label: trimmed, info })
    })
    setUploading(null)
    setLabel('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(doc: ExtraDoc) {
    if (!confirm(`Delete "${doc.label}"?`)) return
    setDeleting(doc.id)
    await deleteExtraDoc(shipmentId, doc.id)
    setDeleting(null)
  }

  const accent    = '#c97a34'
  const accentSoft = mode === 'dark' ? '#3d2008' : '#fff7ed'
  const accentBdr  = mode === 'dark' ? '#7c3a10' : '#fed7aa'

  return (
    <div style={{ marginTop: 20 }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
            textTransform: 'uppercase', color: t.inkFaint,
          }}>Additional Documents</span>
          {extraDocs.length > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
              background: accentSoft, color: accent, border: `1px solid ${accentBdr}`,
            }}>{extraDocs.length}</span>
          )}
        </div>

        <button
          onClick={() => { setShowForm(f => !f); setLabelErr(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 6,
            border: `1px solid ${showForm ? accent : t.border}`,
            background: showForm ? accentSoft : 'transparent',
            color: showForm ? accent : t.inkMid,
            fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M6 1 V11 M1 6 H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add document
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div style={{
          marginBottom: 12, padding: '14px 16px',
          borderRadius: 10,
          background: accentSoft,
          border: `1.5px dashed ${accentBdr}`,
          display: 'flex', flexDirection: 'column', gap: 10,
          animation: 'fadeIn 0.15s ease',
        }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: t.inkMid, display: 'block', marginBottom: 5 }}>
              Document label <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Quality Certificate, Test Report, COA…"
              value={label}
              onChange={e => { setLabel(e.target.value); setLabelErr(false) }}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '8px 11px', borderRadius: 7,
                border: `1.5px solid ${labelErr ? '#ef4444' : accentBdr}`,
                background: t.bg, color: t.ink,
                fontSize: 13, fontFamily: 'inherit', outline: 'none',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') fileRef.current?.click()
              }}
            />
            {labelErr && (
              <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>
                Please enter a document name first.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                if (!label.trim()) { setLabelErr(true); return }
                fileRef.current?.click()
              }}
              style={{
                flex: 1, padding: '8px',
                background: accent, color: '#fff',
                border: 'none', borderRadius: 7,
                fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: `0 2px 8px ${accent}40`,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Choose file
            </button>
            <button
              onClick={() => { setShowForm(false); setLabel(''); setLabelErr(false) }}
              style={{
                padding: '8px 14px', borderRadius: 7,
                border: `1px solid ${t.border}`, background: t.bg,
                color: t.inkMid, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer',
              }}
            >Cancel</button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept="*/*"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
          />
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div style={{
          marginBottom: 10, padding: '10px 14px',
          borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
          background: accentSoft, border: `1px solid ${accentBdr}`,
          animation: 'fadeIn 0.15s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={accent} strokeWidth="2" strokeLinecap="round"
            style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: accent }}>
              {uploading.phase === 'compressing' ? 'Compressing…'
               : uploading.phase === 'uploading'  ? 'Uploading…'
               : uploading.phase === 'error'       ? '⚠ Upload failed'
               : '✓ Done'}
            </div>
            <div style={{ fontSize: 11, color: t.inkSoft }}>{uploading.label}</div>
          </div>
        </div>
      )}

      {/* Document list */}
      {extraDocs.length === 0 && !showForm && !uploading && (
        <div style={{
          padding: '20px 16px', textAlign: 'center',
          borderRadius: 8, border: `1px dashed ${t.border}`,
          color: t.inkFaint, fontSize: 12,
        }}>
          No additional documents yet — click <strong style={{ color: accent }}>Add document</strong> to upload any file.
        </div>
      )}

      {extraDocs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {extraDocs.map(doc => (
            <div key={doc.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              background: t.bgSoft, border: `1px solid ${t.border}`,
              opacity: deleting === doc.id ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}>
              {/* File icon */}
              <span style={{ fontSize: 18, flexShrink: 0 }}>{fileIcon(doc.mime)}</span>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12.5, fontWeight: 700, color: t.ink,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{doc.label}</div>
                <div style={{ fontSize: 10.5, color: t.inkFaint, marginTop: 1 }}>
                  {doc.fileName} · {fmtBytes(doc.size)} · {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* View */}
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRadius: 6,
                  background: mode === 'dark' ? '#0f2a1a' : '#f0fdf4',
                  border: `1px solid ${mode === 'dark' ? '#166534' : '#86efac'}`,
                  color: '#16a34a', fontSize: 11.5, fontWeight: 600,
                  textDecoration: 'none', flexShrink: 0,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
                View
              </a>

              {/* Delete */}
              <button
                onClick={() => handleDelete(doc)}
                disabled={deleting === doc.id}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '4px 8px', borderRadius: 6,
                  background: mode === 'dark' ? '#450a0a' : '#fef2f2',
                  border: `1px solid ${mode === 'dark' ? '#7f1d1d' : '#fecaca'}`,
                  color: '#ef4444', cursor: 'pointer', flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
