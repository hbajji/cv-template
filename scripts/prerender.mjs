// Writes the CV as static HTML into dist/index.html (default language), so search engines,
// ATS link crawlers and link previews get the full text without running JavaScript.
// The browser app then renders on top of it (and switches language if the visitor's differs).
// Run after `vite build` and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'

const dist = new URL('../dist/', import.meta.url)
const ssr = new URL('../dist-ssr/entry-server.js', import.meta.url)
const { render, languages, defaultLang } = await import(ssr.href)

const lang = languages.find((l) => l.code === defaultLang && l.enabled) ?? languages.find((l) => l.enabled)
const enabled = languages.filter((l) => l.enabled).map((l) => l.code)

let html = readFileSync(new URL('index.html', dist), 'utf8')
const replace = (from, to) => {
  if (!html.includes(from)) throw new Error(`prerender: "${from}" not found in dist/index.html`)
  html = html.replace(from, to)
}
replace('<div id="root"></div>', `<div id="root">${render(lang.code)}</div>`)
replace('<html lang="fr">', `<html lang="${lang.code}" dir="${lang.dir}" data-prerendered="${lang.code}" data-langs="${enabled.join(',')}">`)
// Last-modified date for the structured data and link previews: full ISO 8601 date-time
// (Google rejects a bare date such as "2026-10-08").
html = html.replaceAll('__BUILD_DATE__', new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'))
writeFileSync(new URL('index.html', dist), html)
rmSync(new URL('../dist-ssr/', import.meta.url), { recursive: true, force: true })
console.log(`prerendered ${lang.code} (${Math.round(html.length / 1024)} KB), languages: ${enabled.join(', ')}`)
