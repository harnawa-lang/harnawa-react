import { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from '../../lib/ThemeContext'
import { CountryFlag } from './index'

export interface ComboItem {
  value: string    // stored value (e.g. "CN", "CNNGB")
  label: string    // primary display text
  sub?: string     // secondary text (country name, city, etc)
  badge?: string   // short code chip (port code, etc)
  flagCc?: string  // ISO-2 country code → renders a flag image
}

interface Props {
  inputValue: string
  onInputChange: (v: string) => void
  onSelect: (item: ComboItem) => void
  items: ComboItem[]
  placeholder?: string
  allowCreate?: boolean
  createLabel?: string       // e.g. "New supplier"
  onCreateNew?: (v: string) => void
  mono?: boolean
}

export function Combobox({
  inputValue, onInputChange, onSelect,
  items, placeholder, allowCreate, createLabel = 'Create new', onCreateNew, mono,
}: Props) {
  const { t } = useTheme()
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const showCreate = allowCreate && !!inputValue.trim() && items.length === 0

  const allItems: Array<ComboItem | '__create__'> = showCreate
    ? ['__create__']
    : items

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (!open) { if (e.key === 'ArrowDown') { setOpen(true); setCursor(0) }; return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, allItems.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      const item = allItems[cursor]
      if (item === '__create__') { onCreateNew?.(inputValue.trim()); setOpen(false) }
      else if (item) { onSelect(item); setOpen(false) }
    }
    else if (e.key === 'Escape') setOpen(false)
  }, [open, allItems, cursor, inputValue, onCreateNew, onSelect])

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const itemStyle = (i: number): React.CSSProperties => ({
    padding: '8px 12px', cursor: 'pointer', display: 'flex',
    alignItems: 'center', gap: 8,
    background: cursor === i ? t.primaryWash : 'transparent',
    borderLeft: cursor === i ? `2px solid ${t.primary}` : '2px solid transparent',
    transition: 'background 0.08s',
  })

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: t.bgSoft, border: `1px solid ${open ? t.primary : t.border}`,
        borderRadius: 6, padding: '7px 10px', gap: 6,
        transition: 'border-color 0.15s',
      }}>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ color: t.inkFaint, flexShrink: 0 }}>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M9.5 9.5 L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={e => { onInputChange(e.target.value); setOpen(true); setCursor(0) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, fontFamily: mono ? '"JetBrains Mono", monospace' : 'inherit',
            color: t.ink, width: '100%',
          }}
        />
        {inputValue && (
          <button
            onMouseDown={e => { e.preventDefault(); onInputChange(''); inputRef.current?.focus() }}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: t.inkFaint, padding: 0, fontSize: 15, lineHeight: 1 }}>×</button>
        )}
      </div>

      {open && (allItems.length > 0) && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 999,
          background: t.panel, border: `1px solid ${t.border}`,
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          overflow: 'hidden', maxHeight: 280, overflowY: 'auto',
        }}>
          {allItems.map((item, i) => {
            if (item === '__create__') {
              return (
                <div
                  key="create"
                  style={itemStyle(i)}
                  onMouseEnter={() => setCursor(i)}
                  onMouseDown={e => {
                    e.preventDefault()
                    onCreateNew?.(inputValue.trim())
                    setOpen(false)
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: 5,
                    background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2 V10 M2 6 H10" stroke={t.primary} strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <div>
                    <div style={{ fontSize: 12.5, color: t.inkSoft }}>
                      <span style={{ color: t.ink, fontWeight: 500 }}>{createLabel}:</span> {inputValue.trim()}
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <div
                key={item.value}
                style={itemStyle(i)}
                onMouseEnter={() => setCursor(i)}
                onMouseDown={e => {
                  e.preventDefault()
                  onSelect(item)
                  setOpen(false)
                }}
              >
                {/* Country flag image */}
                {item.flagCc && (
                  <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <CountryFlag cc={item.flagCc} size={18} />
                  </span>
                )}
                {/* Badge chip (port code, country code, etc) */}
                {item.badge && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, fontFamily: '"JetBrains Mono", monospace',
                    color: t.primary, background: t.primarySoft,
                    padding: '2px 5px', borderRadius: 4, flexShrink: 0, minWidth: 32, textAlign: 'center',
                  }}>{item.badge}</span>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: t.ink, fontWeight: 500 }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 11, color: t.inkSoft, marginTop: 1 }}>{item.sub}</div>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
