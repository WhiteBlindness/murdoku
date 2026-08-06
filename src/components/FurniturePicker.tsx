import { RotateCw, Eraser } from 'lucide-react'
import type { FurnitureType } from '../core/types'
import { FURNITURE_ICON } from '../core/furniture'

const PIECES: FurnitureType[] = ['bookshelf', 'plant', 'table', 'chair']
const LABELS: Partial<Record<FurnitureType, string>> = {
  bookshelf: 'Estante',
  plant: 'Planta',
  table: 'Mesa',
  chair: 'Poltrona',
}

interface Props {
  selected: FurnitureType | null
  rotation: 0 | 90 | 180 | 270
  onSelect: (type: FurnitureType | null) => void
  onRotate: () => void
}

export default function FurniturePicker({ selected, rotation, onSelect, onRotate }: Props) {
  return (
    <div
      className="border border-border-strong bg-bg-panel p-3 flex flex-col gap-2.5"
      style={{ boxShadow: 'var(--shadow-cut)' }}
    >
      {/* Header — evidence-marker tray label */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper-muted">
          SCENE PROPS
        </span>
        <button
          onClick={() => onSelect(null)}
          title="Desselecionar peça"
          className="focus-ring flex items-center gap-1 px-2 py-1 border text-[11px] font-sans transition-colors"
          style={{
            minHeight: 44,
            borderColor: !selected ? 'var(--color-accent-text)' : 'var(--color-border-strong)',
            color: !selected ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
            background: !selected
              ? 'color-mix(in srgb, var(--color-accent) 14%, var(--color-bg-surface))'
              : 'var(--color-bg-surface)',
          }}
        >
          <Eraser size={11} aria-hidden="true" /> Nenhuma
        </button>
      </div>

      {/* Stencil palette — sharp evidence markers, no rounded pills */}
      <div className="grid grid-cols-4 gap-1.5">
        {PIECES.map(type => {
          const Icon = FURNITURE_ICON[type]
          const active = selected === type
          return (
            <button
              key={type}
              onClick={() => onSelect(active ? null : type)}
              title={LABELS[type]}
              className="focus-ring flex flex-col items-center justify-center gap-1 py-2 px-1 border transition-colors"
              style={{
                minHeight: 44,
                borderColor: active ? 'var(--color-accent-text)' : 'var(--color-border-strong)',
                background: active
                  ? 'color-mix(in srgb, var(--color-accent) 18%, var(--color-bg-surface))'
                  : 'var(--color-bg-surface)',
                color: active ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
                boxShadow: active ? 'var(--shadow-cut)' : undefined,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  transform: active && rotation ? `rotate(${rotation}deg)` : undefined,
                  transition: 'transform 0.18s ease',
                }}
              >
                <Icon size={22} />
              </span>
              <span className="font-mono text-[9px] leading-none tracking-tight text-center">
                {LABELS[type]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Rotation control */}
      <button
        onClick={onRotate}
        disabled={!selected}
        className="focus-ring flex items-center justify-center gap-1.5 py-2 border text-[12px] font-sans transition-colors disabled:opacity-30"
        style={{
          minHeight: 44,
          borderColor: 'var(--color-border-strong)',
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <RotateCw size={13} aria-hidden="true" />
        Rodar 90°
        <span
          className="tabular-nums font-mono text-[10px] px-1"
          style={{
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-muted)',
          }}
        >
          {rotation}°
        </span>
      </button>
    </div>
  )
}
