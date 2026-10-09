import type { CV, Link } from '../types'
import type { Period, StructureLink, StructureProject, Tag } from './schema'
import { structure } from './structure.ts'
import type { Messages } from './messages'

// Any text missing from a language file is shown as "[key]", which the UI highlights.
function text(value: unknown, key: string): string {
  return typeof value === 'string' ? value : `[${key}]`
}
function list(value: unknown, key: string): string[] {
  return Array.isArray(value) ? value.map((v, i) => text(v, `${key}.${i}`)) : [`[${key}]`]
}

function formatPeriod(p: Period, lang: string, m: Messages): string {
  const parse = (d: string) => {
    const [y, mo] = d.split('-').map(Number)
    return { year: y, month: mo }
  }
  const monthName = (year: number, month: number) => {
    const name = new Intl.DateTimeFormat(lang, { month: 'short' }).format(new Date(year, month - 1, 1))
    return name.charAt(0).toLocaleUpperCase(lang) + name.slice(1)
  }
  const full = (d: { year: number; month?: number }) => (d.month ? `${monthName(d.year, d.month)} ${d.year}` : `${d.year}`)

  const start = parse(p.start)
  if (p.durationMonths) return `${start.year} · ${p.durationMonths} ${m.meta.months}`
  if (!p.end) return `${full(start)} — ${m.meta.present}`
  const end = parse(p.end)
  if (start.year === end.year && start.month && end.month) return `${monthName(start.year, start.month)} — ${full(end)}`
  return `${full(start)} — ${full(end)}`
}

export function buildCV(lang: string, m: Messages): CV {
  const tag = (t: Tag) => (t.startsWith('@') ? text(m.tags?.[t.slice(1)], `tags.${t.slice(1)}`) : t)
  const link = (l: StructureLink): Link => ({ label: tag(l.label), url: l.url })
  const project = (p: StructureProject, c: Messages['projects'][string] | undefined, key: string) => ({
    name: text(c?.name, `${key}.name`),
    period: formatPeriod(p.period, lang, m),
    context: text(c?.context, `${key}.context`),
    ...(c?.role ? { role: c.role } : {}),
    description: text(c?.description, `${key}.description`),
    tags: p.tags.map(tag),
    links: p.links.map(link),
  })
  const s = structure

  return {
    meta: {
      documentTitle: text(m.meta.documentTitle, 'meta.documentTitle'),
      description: text(m.meta.description, 'meta.description'),
      pdfFileName: text(m.meta.pdfFileName, 'meta.pdfFileName'),
    },
    labels: m.labels,
    identity: {
      ...s.identity,
      title: text(m.identity.title, 'identity.title'),
      subtitle: text(m.identity.subtitle, 'identity.subtitle'),
      location: text(m.identity.location, 'identity.location'),
      links: s.identity.links.map(link),
    },
    summary: text(m.summary, 'summary'),
    about: m.about,
    experiences: s.experiences.map((e) => {
      const c = m.experiences[e.id]
      const key = `experiences.${e.id}`
      return {
        company: e.company,
        location: text(c?.location, `${key}.location`),
        ...(e.period ? { period: formatPeriod(e.period, lang, m) } : {}),
        ...(c?.highlights ? { highlights: list(c.highlights, `${key}.highlights`) } : {}),
        positions: e.positions.map((p) => {
          const pc = c?.positions?.[p.id]
          const pkey = `${key}.positions.${p.id}`
          return {
            role: text(pc?.role, `${pkey}.role`),
            period: formatPeriod(p.period, lang, m),
            ...(pc?.context ? { context: pc.context } : {}),
            highlights: list(pc?.highlights, `${pkey}.highlights`),
            stack: p.stack.map(tag),
          }
        }),
      }
    }),
    earlier: text(m.earlier, 'earlier'),
    projects: s.projects.map((p) => project(p, m.projects[p.id], `projects.${p.id}`)),
    projectGroups: s.projectGroups.map((g) => {
      const c = m.projectGroups[g.id]
      const key = `projectGroups.${g.id}`
      return {
        id: g.id,
        title: text(c?.title, `${key}.title`),
        intro: text(c?.intro, `${key}.intro`),
        projects: g.projects.map((p) => project(p, c?.projects?.[p.id], `${key}.projects.${p.id}`)),
      }
    }),
    education: s.education.map((e) => ({
      degree: text(m.education[e.id]?.degree, `education.${e.id}.degree`),
      school: text(m.education[e.id]?.school, `education.${e.id}.school`),
      period: formatPeriod(e.period, lang, m),
    })),
    skills: s.skills.map((g) => ({ name: text(m.skills[g.id], `skills.${g.id}`), items: g.items.map(tag) })),
    certifications: list(m.certifications, 'certifications'),
    languages: s.languages.map((id) => ({
      name: text(m.languages[id]?.name, `languages.${id}.name`),
      level: text(m.languages[id]?.level, `languages.${id}.level`),
    })),
    interests: list(m.interests, 'interests'),
  }
}
