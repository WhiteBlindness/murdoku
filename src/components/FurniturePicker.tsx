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
      className="rounded-xl border bg-bg-panel p-3 flex flex-col gap-2.5"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-paper-muted">
          Decoração
        </span>
        <button
          onClick={() => onSelect(null)}
          title="Desselecionar peça"
          className="focus-ring flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-sans transition-colors"
          style={{
            borderColor: !selected ? 'var(--color-accent)' : 'var(--color-border-subtle)',
            color: !selected ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
            background: !selected
              ? 'color-mix(in srgb, var(--color-accent) 14%, var(--color-bg-surface))'
              : 'var(--color-bg-surface)',
          }}
        >
          <Eraser size={11} /> Nenhuma
        </button>
      </div>

      {/* piece buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        {PIECES.map(type => {
          const Icon = FURNITURE_ICON[type]
          const active = selected === type
          return (
            <button
              key={type}
              onClick={() => onSelect(active ? null : type)}
              title={LABELS[type]}
              className="focus-ring flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg border transition-colors"
              style={{
                borderColor: active ? 'var(--color-accent)' : 'var(--color-border-subtle)',
                background: active
                  ? 'color-mix(in srgb, var(--color-accent) 18%, var(--color-bg-surface))'
                  : 'var(--color-bg-surface)',
                color: active ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
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
              <span className="text-[9px] font-sans leading-none tracking-tight text-center">
                {LABELS[type]}
              </span>
            </button>
          )
        })}
      </div>

      {/* rotation */}
      <button
        onClick={onRotate}
        disabled={!selected}
        className="focus-ring flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[12px] font-sans transition-colors disabled:opacity-30"
        style={{
          borderColor: 'var(--color-border-subtle)',
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <RotateCw size={13} />
        Rodar 90°
        <span
          className="tabular-nums text-[10px] rounded px-1"
          style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}
        >
          {rotation}°
        </span>
      </button>
    </div>
  )
}
