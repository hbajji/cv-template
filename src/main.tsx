import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Inter is bundled with the site (no request to Google Fonts, so no visitor IP sent before consent).
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
