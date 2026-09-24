import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!)
const isKenneyLab = import.meta.env.DEV && new URLSearchParams(window.location.search).get('kenneyLab') === '1'

if (isKenneyLab) {
  void import('./lab/KenneyLab').then(({ default: KenneyLab }) => {
    root.render(
      <StrictMode>
        <KenneyLab />
      </StrictMode>,
    )
  })
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
