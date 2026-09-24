import { useEffect, useMemo, useRef, useState } from 'react'
import { createLabScene, type LabSceneMode, type MaterialMode } from './labScene'
import { formatDimensions, formatUnits, hasTextureMap, manifest } from './manifest'
import type { LabAsset, LabPackage, LabPrototype } from './types'
import './kenney-lab.css'

type CanvasState = 'loading' | 'ready' | 'unsupported' | 'error'

const MODE_LABELS: Array<{ id: LabSceneMode; label: string }> = [
  { id: 'comparison', label: 'Comparador' },
  { id: 'references', label: 'Referências' },
  { id: 'prototype', label: 'Dioramas' },
]

function initialSample(pack: LabPackage): LabAsset | undefined {
  return manifest.assets.find((asset) => asset.packageId === pack.id && asset.selectedForPrototype)
    ?? manifest.assets.find((asset) => asset.packageId === pack.id)
}

export default function KenneyLab() {
  const initialPack = manifest.packages.find((pack) => pack.id === 'food-kit') ?? manifest.packages[0]
  const [activePackageId, setActivePackageId] = useState(initialPack.id)
  const [selectedAssetId, setSelectedAssetId] = useState(initialSample(initialPack)?.id ?? '')
  const [mode, setMode] = useState<LabSceneMode>('comparison')
  const [materialMode, setMaterialMode] = useState<MaterialMode>('lambert')
  const [prototypeId, setPrototypeId] = useState('cafe')
  const [showBounds, setShowBounds] = useState(false)
  const [showOccupantMarker, setShowOccupantMarker] = useState(false)
  const [adaptedScale, setAdaptedScale] = useState(1)
  const [canvasState, setCanvasState] = useState<CanvasState>('loading')
  const [canvasError, setCanvasError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const activePackage = manifest.packages.find((pack) => pack.id === activePackageId) ?? manifest.packages[0]
  const measuredCount = manifest.packages.reduce((total, pack) => total + Number(pack.stats.measuredModelCount ?? 0), 0)
  const packageAssets = useMemo(
    () => manifest.assets.filter((asset) => asset.packageId === activePackageId),
    [activePackageId],
  )
  const sample = manifest.assets.find((asset) => asset.id === selectedAssetId) ?? packageAssets[0] ?? null
  const prototype = manifest.prototypes.find((item) => item.id === prototypeId) ?? manifest.prototypes[0]
  const renderOptions = useMemo(() => ({
    mode,
    sample,
    assets: manifest.assets,
    prototype,
    showBounds,
    showOccupantMarker,
    materialMode,
    adaptedScale,
    activePackageId,
  }), [mode, sample, prototype, showBounds, showOccupantMarker, materialMode, adaptedScale, activePackageId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let current = true
    setCanvasState('loading')
    setCanvasError('')
    const controller = createLabScene(canvas, renderOptions)
    if (!controller) {
      setCanvasState('unsupported')
      return
    }
    void controller.ready.then(() => {
      if (current) setCanvasState('ready')
    }).catch((error: unknown) => {
      if (!current) return
      setCanvasState('error')
      setCanvasError(error instanceof Error ? error.message : 'Não foi possível carregar os modelos.')
    })
    return () => {
      current = false
      controller.dispose()
    }
  }, [renderOptions])

  function selectPackage(pack: LabPackage) {
    const nextSample = initialSample(pack)
    setActivePackageId(pack.id)
    setSelectedAssetId(nextSample?.id ?? '')
    setAdaptedScale(1)
  }

  function selectPrototype(item: LabPrototype) {
    setPrototypeId(item.id)
    const firstIncluded = item.assetIds.map((id) => manifest.assets.find((asset) => asset.id === id)).find(Boolean)
    if (firstIncluded) {
      const nextPackage = manifest.packages.find((pack) => pack.id === firstIncluded.packageId)
      setActivePackageId(firstIncluded.packageId)
      setSelectedAssetId(firstIncluded.id)
      setAdaptedScale(1)
      if (nextPackage) setActivePackageId(nextPackage.id)
    }
    setMode('prototype')
  }

  return (
    <main className="kenney-lab" data-testid="kenney-lab">
      <header className="kenney-lab__header">
        <div>
          <p className="kenney-lab__eyebrow">Alibi · ambiente de desenvolvimento</p>
          <h1>Laboratório de ambientes Kenney</h1>
          <p className="kenney-lab__intro">Compara pivôs, escala e materiais e testa combinações de modelos reais antes de os integrares numa cena.</p>
        </div>
        <div className="kenney-lab__stats" aria-label="Dimensão do inventário">
          <span><strong>{manifest.packages.length}</strong> pacotes</span>
          <span><strong>{measuredCount.toLocaleString('pt-PT')}</strong> modelos medidos</span>
          <span><strong>{manifest.assets.length}</strong> amostras locais</span>
          <span><strong>{manifest.prototypes.length}</strong> protótipos</span>
        </div>
      </header>

      <nav className="kenney-lab__packages" aria-label="Pacotes Kenney">
        {manifest.packages.map((pack) => (
          <button
            key={pack.id}
            type="button"
            className={pack.id === activePackageId ? 'is-active' : ''}
            aria-pressed={pack.id === activePackageId}
            onClick={() => selectPackage(pack)}
          >
            {pack.displayName}
          </button>
        ))}
      </nav>

      <section className="kenney-lab__workspace" aria-label="Área de ensaio">
        <div className="kenney-lab__viewer-column">
          <nav className="kenney-lab__modes" aria-label="Vistas do laboratório">
            {MODE_LABELS.map((item) => (
              <button key={item.id} type="button" className={mode === item.id ? 'is-active' : ''} aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>

          {mode === 'prototype' && (
            <nav className="kenney-lab__prototypes" aria-label="Protótipos">
              {manifest.prototypes.map((item) => (
                <button key={item.id} type="button" className={prototype.id === item.id ? 'is-active' : ''} aria-pressed={prototype.id === item.id} onClick={() => selectPrototype(item)}>
                  {item.title}
                </button>
              ))}
            </nav>
          )}

          <div className="kenney-lab__canvas-wrap">
            <canvas ref={canvasRef} aria-label="Pré-visualização tridimensional do laboratório Kenney" />
            {canvasState !== 'ready' && (
              <div className="kenney-lab__canvas-status" role="status" aria-live="polite">
                {canvasState === 'loading' && 'A carregar modelos Kenney…'}
                {canvasState === 'unsupported' && 'Este navegador não disponibiliza WebGL.'}
                {canvasState === 'error' && `Falha ao carregar a cena: ${canvasError}`}
              </div>
            )}
            <div className="kenney-lab__legend" aria-live="polite">
              {mode === 'comparison' && <><span className="kenney-lab__dot kenney-lab__dot--native" /> Nativo: pivô original <span className="kenney-lab__dot kenney-lab__dot--adapted" /> Adaptado: centrado e assente</>}
              {mode === 'references' && 'Referências canónicas e amostra selecionada à mesma escala'}
              {mode === 'prototype' && 'Composição manual · escala nativa por predefinição'}
            </div>
          </div>

          <div className="kenney-lab__controls">
            {(mode === 'comparison' || mode === 'references') && (
              <label className="kenney-lab__field kenney-lab__field--asset">
                <span>Amostra do pacote</span>
                <select value={sample?.id ?? ''} onChange={(event) => setSelectedAssetId(event.target.value)}>
                  {packageAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.name.replace(/\.glb$/i, '')}</option>)}
                </select>
              </label>
            )}
            <label className="kenney-lab__field">
              <span>Materiais</span>
              <select value={materialMode} onChange={(event) => setMaterialMode(event.target.value as MaterialMode)}>
                <option value="lambert">Murdoku: Lambert com mapas</option>
                <option value="source">Material original GLB</option>
              </select>
            </label>
            <label className="kenney-lab__check">
              <input type="checkbox" checked={showBounds} onChange={(event) => setShowBounds(event.target.checked)} />
              <span>Limites medidos</span>
            </label>
            {mode === 'prototype' && (
              <label className="kenney-lab__check">
                <input type="checkbox" checked={showOccupantMarker} onChange={(event) => setShowOccupantMarker(event.target.checked)} />
                <span>Marcador de ocupação</span>
              </label>
            )}
          </div>
        </div>

        <aside className="kenney-lab__inspector" aria-label="Medições e controlos">
          <div className="kenney-lab__inspector-heading">
            <span className="kenney-lab__eyebrow">Inventário ativo</span>
            <h2>{activePackage.displayName}</h2>
            <p>{activePackage.modelCount} modelos no pacote · {packageAssets.length} amostras locais</p>
          </div>

          {sample && mode !== 'prototype' && (
            <div className="kenney-lab__asset-card">
              <p className="kenney-lab__eyebrow">Modelo selecionado</p>
              <h3>{sample.name.replace(/\.glb$/i, '')}</h3>
              <dl>
                <div><dt>Dimensões</dt><dd>{formatDimensions(sample.bounds.size)}</dd></div>
                <div><dt>Centro do limite</dt><dd>{formatDimensions(sample.bounds.center ?? [0, 0, 0])}</dd></div>
                <div><dt>Mapas de cor</dt><dd>{hasTextureMap(sample) ? 'Presentes no GLB' : 'Sem textura'}</dd></div>
                <div><dt>Triângulos</dt><dd>{sample.triangleCount?.toLocaleString('pt-PT') ?? 'Sem dados'}</dd></div>
              </dl>
            </div>
          )}

          <div className="kenney-lab__scale-control">
            <div className="kenney-lab__scale-title"><label htmlFor="kenney-scale">Fator experimental</label><output htmlFor="kenney-scale">{formatUnits(adaptedScale, 2)}×</output></div>
            <input id="kenney-scale" type="range" min="0.25" max="2" step="0.05" value={adaptedScale} onChange={(event) => setAdaptedScale(Number(event.target.value))} />
            <p>Afeta apenas modelos do pacote ativo. O modo nativo mantém sempre a escala original.</p>
          </div>

          <div className="kenney-lab__reference-card">
            <p className="kenney-lab__eyebrow">Referências canónicas</p>
            <div className="kenney-lab__reference-grid">
              <span>Cadeira <strong>0,47 u</strong></span>
              <span>Porta <strong>1,01 u</strong></span>
              <span>Parede <strong>1,29 u</strong></span>
              <span>Espessura <strong>0,05 u</strong></span>
              <span>Bancada <strong>0,33 u</strong></span>
              <span>Árvore <strong>1,71 u</strong></span>
              <span>Base <strong>1,00 u</strong></span>
              <span>Figura humana <strong>≈ 0,95 u</strong></span>
            </div>
            <p>Unidades Kenney, sem conversão métrica validada.</p>
          </div>

          {mode === 'prototype' && (
            <div className="kenney-lab__prototype-card">
              <p className="kenney-lab__eyebrow">Composição selecionada</p>
              <h3>{prototype.title}</h3>
              <p>{prototype.assetIds.length} modelos reais · escala {formatUnits(adaptedScale, 2)}× no pacote {activePackage.displayName} · apoios definidos por arquétipo</p>
              <div className="kenney-lab__prototype-packs">{prototype.packIds.map((id) => manifest.packages.find((pack) => pack.id === id)?.displayName).filter(Boolean).join(' · ')}</div>
            </div>
          )}
        </aside>
      </section>
      <footer className="kenney-lab__footer">Ferramenta de diagnóstico · disponível apenas em desenvolvimento com <code>?kenneyLab=1</code></footer>
    </main>
  )
}
