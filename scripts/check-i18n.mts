// Checks every src/i18n/<lang>.json against the reference language (fr) and src/data/structure.ts.
// Missing text in an enabled language fails the build; in a disabled one it is only a warning.
// Run: npm run check:i18n (also runs before every build).
import { readdirSync, readFileSync } from 'node:fs'
import { structure } from '../src/data/structure.ts'

const DIR = new URL('../src/i18n/', import.meta.url)
const REF = 'fr'
const load = (code: string) => JSON.parse(readFileSync(new URL(`${code}.json`, DIR), 'utf8'))
const codes = readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
const ref = load(REF)

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const get = (o: any, path: string[]) => path.reduce((x, k) => (x == null ? undefined : x[k]), o)

// Keys the structure needs in every language file.
const required: string[][] = []
for (const e of structure.experiences) {
  required.push(['experiences', e.id, 'location'])
  for (const p of e.positions) required.push(['experiences', e.id, 'positions', p.id, 'role'], ['experiences', e.id, 'positions', p.id, 'highlights'])
}
for (const p of structure.projects) for (const k of ['name', 'context', 'description']) required.push(['projects', p.id, k])
for (const g of structure.projectGroups) {
  required.push(['projectGroups', g.id, 'title'], ['projectGroups', g.id, 'intro'])
  for (const p of g.projects) for (const k of ['name', 'context', 'description']) required.push(['projectGroups', g.id, 'projects', p.id, k])
}
for (const e of structure.education) required.push(['education', e.id, 'degree'], ['education', e.id, 'school'])
for (const s of structure.skills) required.push(['skills', s.id])
for (const l of structure.languages) required.push(['languages', l, 'name'], ['languages', l, 'level'])
for (const t of new Set(JSON.stringify(structure).match(/"@[\w-]+"/g) ?? [])) required.push(['tags', t.slice(2, -1)])

// Every key of a file, recursively (arrays and strings are leaves).
function keys(o: unknown, prefix: string[] = []): string[][] {
  if (!isObj(o)) return [prefix]
  return Object.entries(o).flatMap(([k, v]) => keys(v, [...prefix, k]))
}

let errors = 0
for (const code of [REF, ...codes.filter((c) => c !== REF)]) {
  const m = load(code)
  const enabled = m?.meta?.enabled !== false
  const missing = [...new Set([...required, ...(code === REF ? [] : keys(ref))].filter((p) => get(m, p) == null).map((p) => p.join('.')))]
  const extra = code === REF ? [] : keys(m).filter((p) => get(ref, p) === undefined).map((p) => p.join('.'))
  if (enabled) errors += missing.length
  console.log(`${code}${enabled ? '' : ' (disabled)'}: ${missing.length ? `${missing.length} missing` : 'complete'}${extra.length ? `, ${extra.length} unknown` : ''}`)
  for (const k of missing) console.log(`  ${enabled ? 'ERROR' : 'warn'} missing: ${k}`)
  for (const k of extra) console.log(`  warn unknown key (not in ${REF}.json): ${k}`)
}
if (errors) {
  console.error(`\n${errors} missing translation(s) in enabled languages.`)
  process.exit(1)
}
