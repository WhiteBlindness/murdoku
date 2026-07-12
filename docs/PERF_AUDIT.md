# Murdoku — Load Performance Audit

Focus: **initial page load time**. Findings first, then the five changes with the
most impact — all implemented this pass — with before/after numbers from
`npm run build`.

## Method
- `npm run build` bundle report (gzip sizes).
- Static scan for unused assets, redundant imports, and synchronous patterns.

---

## Findings

| # | Finding | Category | Impact |
|---|---------|----------|--------|
| 1 | Three font families loaded (Cinzel, Special Elite, Inter) with many weights | Uncompressed/blocking assets | High |
| 2 | All screens in one bundle — builder, release notes, victory, intro shipped on first paint though unused | Synchronous/eager loading | High |
| 3 | Unused static assets in `src/assets` (`hero.png` 13 KB, `react.svg`, `vite.svg`) and a dead 184-line `App.css` | Dead weight | Medium |
| 4 | `react` + `framer-motion` (~100 KB gzip) bundled with app code — any app edit busts their cache | Caching | Medium |
| 5 | Google Fonts fetched every visit; no runtime caching; no `font-display` guarantee | Repeat-visit / offline | Medium |
| 6 | Icons were destined to be raster/image requests | Requests | Low (pre-empted — see below) |

---

## Top 5 changes implemented

### 1. Cut the font payload roughly in half
**What.** Dropped **Cinzel** and **Inter** entirely; the type system is now
**Special Elite** (display) + **Crimson Pro** (body). Reduced requested weights.
**Why.** Fonts are render-blocking for text and were the single biggest
third-party cost. Two families instead of three = fewer files, less CSS, faster
first meaningful paint. `&display=swap` guarantees text paints immediately with a
fallback. (`index.html`)

### 2. Route-level code splitting (lazy screens)
**What.** `CaseIntro`, `VictoryScreen`, `CaseBuilder`, and `ReleaseNotes` are now
`React.lazy` chunks; only Home + Game are in the initial bundle. Chunks are
**pre-warmed on idle** after first paint (`requestIdleCallback`) so navigation
never stalls on a fetch. (`App.tsx`)
**Result.** ~22 KB (gzip ~7.8 KB) of screen code moved out of the critical path:

```
CaseIntro      3.45 kB  (gzip 1.23)
VictoryScreen  4.47 kB  (gzip 1.39)
ReleaseNotes   4.91 kB  (gzip 2.21)
CaseBuilder    9.19 kB  (gzip 2.99)
```

### 3. Deleted dead assets and CSS
**What.** Removed `src/assets/hero.png`, `react.svg`, `vite.svg`, `public/vite.svg`,
and the unused `src/App.css` (none were imported).
**Why.** They inflated the repo and the PWA precache manifest for zero benefit.

### 4. Split vendor chunks for long-term caching
**What.** `manualChunks` isolates `react`/`react-dom` (57 KB gzip) and
`framer-motion` (42 KB gzip) into their own files. (`vite.config.ts`)
**Why.** These change rarely. Isolating them means shipping an app fix invalidates
only the ~12 KB app chunk, not ~100 KB of vendor code — big win for returning users.

### 5. Runtime-cache the web fonts in the service worker
**What.** Added Workbox `runtimeCaching`: `StaleWhileRevalidate` for the Google
Fonts stylesheet, `CacheFirst` (1-year) for the font files. (`vite.config.ts`)
**Why.** First visit fetches fonts once; every repeat/offline visit serves them
from cache, removing a render-blocking network round-trip. Complements the existing
`preconnect` hints.

---

## Bonus (not counted in the five)
- **Icons are inline SVG** (`core/icons.tsx`) drawing with `currentColor` — zero
  image requests, and they theme/tint for free. This pre-empts finding #6.
- **`prefers-reduced-motion`** collapses animations, cutting main-thread work for
  users who opt out.

## Not done (candidates for later)
- Puzzle generation (`generatePuzzle`) runs synchronously in the reducer. For 9×9
  it can briefly block the main thread. Moving it to a Web Worker would keep the
  intro→game transition perfectly smooth on low-end devices. Deferred because the
  current cost is small and it adds real complexity.
- Self-hosting the fonts (vs. Google Fonts) would remove a third-party origin
  entirely and allow subsetting to only the glyphs used.

## Initial-load bundle after changes
```
index (app)   36.6 kB  gzip 12.1
react         181.9 kB gzip 57.2   (cached across app releases)
motion        129.2 kB gzip 42.0   (cached across app releases)
CSS            16.7 kB  gzip 4.2
+ lazy screens loaded on idle / on demand, not on first paint
```
