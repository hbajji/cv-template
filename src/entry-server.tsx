import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { LANGUAGES, DEFAULT_LANG } from './data/messages'

// Build-time entry used by scripts/prerender.mjs to write the CV as static HTML,
// so search engines and link previews see the full text without running JavaScript.
export function render(lang: string) {
  return renderToString(
    <StrictMode>
      <App lang={lang} />
    </StrictMode>,
  )
}

export const languages = LANGUAGES.map((l) => ({
  code: l.code,
  enabled: l.messages.meta.enabled,
  dir: l.messages.meta.dir,
  title: l.messages.meta.documentTitle,
  description: l.messages.meta.description,
}))

export const defaultLang = DEFAULT_LANG
