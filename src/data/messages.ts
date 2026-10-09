import type { About, CV } from '../types'

// Shape of a language file (src/i18n/<lang>.json): only translatable text, keyed by the ids of structure.ts.
export interface Messages {
  meta: {
    label: string // button text, e.g. "FR"
    order?: number // position in the language switch
    enabled: boolean // false = shown greyed out while the translation is in progress
    dir: 'ltr' | 'rtl'
    documentTitle: string // browser tab and search-result title
    description: string // search-result / link-preview description
    pdfFileName: string
    present: string // end of an ongoing period, e.g. "aujourd’hui"
    months: string // unit for durations, e.g. "mois"
  }
  labels: CV['labels']
  identity: { title: string; subtitle: string; location: string }
  summary: string
  about: About
  experiences: Record<
    string,
    { location: string; highlights?: string[]; positions: Record<string, { role: string; context?: string; highlights: string[] }> }
  >
  earlier: string
  projects: Record<string, { name: string; context: string; role?: string; description: string }>
  projectGroups: Record<string, { title: string; intro: string; projects: Record<string, { name: string; context: string; role?: string; description: string }> }>
  education: Record<string, { degree: string; school: string }>
  skills: Record<string, string>
  tags: Record<string, string>
  certifications: string[]
  languages: Record<string, { name: string; level: string }>
  interests: string[]
}

// Every src/i18n/<code>.json file is a language: adding one needs no code change.
const files = import.meta.glob<Messages>('../i18n/*.json', { eager: true, import: 'default' })

export const LANGUAGES = Object.entries(files)
  .map(([path, messages]) => ({ code: path.match(/([\w-]+)\.json$/)![1], messages }))
  .sort((a, b) => (a.messages.meta.order ?? 99) - (b.messages.meta.order ?? 99))

export const DEFAULT_LANG = 'fr'
