import { useEffect, useRef, useState } from 'react'
import type { CV, Lang } from './types'
import { LANGUAGES, DEFAULT_LANG } from './data/messages'
import { buildCV } from './data/buildCV'
import { Toolbar, type NavItem } from './components/Toolbar'
import { Resume } from './components/Resume'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { track } from './analytics'
import { ConsentBanner } from './components/ConsentBanner'
import { PrivacyNotice } from './components/PrivacyNotice'
import { NoticeBanner } from './components/NoticeBanner'

const CVS: Record<Lang, CV> = Object.fromEntries(LANGUAGES.map((l) => [l.code, buildCV(l.code, l.messages)]))
const ENABLED = LANGUAGES.filter((l) => l.messages.meta.enabled).map((l) => l.code)
const DIR = Object.fromEntries(LANGUAGES.map((l) => [l.code, l.messages.meta.dir]))
const STORAGE_KEY = 'cv-lang'

// Date of the last deployment, e.g. "8 octobre 2026" / "October 8, 2026".
const BUILD_DATE = __BUILD_DATE__
const formatBuildDate = (lang: Lang) =>
  new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${BUILD_DATE}T00:00:00Z`))

const isEnabled = (l: string | null): l is Lang => l !== null && ENABLED.includes(l)

// Priority: a ?lang= link (shared on purpose) > the visitor's own earlier choice
// > the browser's preferred languages, in order > the default language.
function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isEnabled(fromUrl)) return fromUrl
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isEnabled(stored)) return stored
  } catch {
    // storage unavailable: fall back to browser language
  }
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language]
  const browser = preferred.map((l) => l.split('-')[0].toLowerCase()).find(isEnabled)
  if (browser) return browser
  return isEnabled(DEFAULT_LANG) ? DEFAULT_LANG : ENABLED[0]
}

// `lang` is only passed when pre-rendering at build time (no window/navigator there).
export default function App({ lang: prerenderLang }: { lang?: Lang } = {}) {
  const [lang, setLang] = useState<Lang>(() => prerenderLang ?? initialLang())

  // The app is now rendered in the right language: hide the boot loader.
  useEffect(() => {
    document.documentElement.classList.remove('booting')
  }, [])
  const cv = CVS[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = DIR[lang] ?? 'ltr'
    document.title = cv.meta.documentTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', cv.meta.description)
  }, [lang, cv])

  // Only an explicit click is remembered and put in the URL, so a link copied from
  // the address bar does not force the language on everyone it is shared with.
  const chooseLang = (next: Lang) => {
    setLang(next)
    const url = new URL(window.location.href)
    url.searchParams.set('lang', next)
    window.history.replaceState(null, '', url)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  const sections: NavItem[] = [
    { id: 'about', label: cv.about.title },
    { id: 'cv', label: cv.labels.nav },
    { id: 'projects', label: cv.labels.projects },
    ...cv.projectGroups.map((g) => ({ id: g.id, label: g.title })),
  ]
  const sectionIds = sections.map((s) => s.id).join(',')
  const [activeSection, setActiveSection] = useState('about')

  // Highlight the menu entry of the last section whose top has scrolled past the toolbar.
  useEffect(() => {
    const ids = sectionIds.split(',')
    const update = () => {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) current = id
      }
      // At the very bottom, the last (short) section may never reach the top.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = ids[ids.length - 1]
      setActiveSection(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionIds])

  // Every print (button or Cmd/Ctrl+P) is counted once, and gets the PDF file name:
  // the browser uses document.title as the default file name.
  const printSource = useRef<'button' | 'shortcut'>('shortcut')
  useEffect(() => {
    let previousTitle = document.title
    const before = () => {
      track('download_pdf', { lang, source: printSource.current })
      previousTitle = document.title
      document.title = cv.meta.pdfFileName
    }
    const after = () => {
      document.title = previousTitle
      printSource.current = 'shortcut'
    }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [lang, cv])

  const download = () => {
    printSource.current = 'button'
    window.print()
  }

  return (
    <>
      <NoticeBanner labels={cv.labels.notice} email={cv.identity.email} />
      <Toolbar
        sections={sections}
        activeSection={activeSection}
        lang={lang}
        onLangChange={chooseLang}
        onDownload={download}
        downloadLabel={cv.labels.download}
      />
      <About about={cv.about} />
      <Resume cv={cv} />
      <Projects title={cv.labels.projects} intro={cv.labels.projectsIntro} projects={cv.projects} groups={cv.projectGroups} />
      <footer className="site-footer screen-only">
        <p className="footer-meta">
          {cv.labels.footer.copyright.replace('{year}', BUILD_DATE.slice(0, 4))}
          {' · '}
          {cv.labels.footer.updated.replace('{date}', formatBuildDate(lang))}
        </p>
        <div className="footer-links">
          <PrivacyNotice labels={cv.labels.privacy} email={cv.identity.email} />
          <ConsentBanner labels={cv.labels.consent} />
        </div>
      </footer>
    </>
  )
}
