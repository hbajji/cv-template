import type { Lang } from '../types'
import { LANGUAGES } from '../data/messages'
import { track } from '../analytics'

export interface NavItem {
  id: string
  label: string
}

interface Props {
  sections: NavItem[]
  activeSection: string
  lang: Lang
  onLangChange: (lang: Lang) => void
  onDownload: () => void
  downloadLabel: string
}

export function Toolbar({ sections, activeSection, lang, onLangChange, onDownload, downloadLabel }: Props) {
  return (
    <header className="toolbar">
      <nav className="section-nav" aria-label="Sections">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={s.id === activeSection ? 'active' : ''}
            aria-current={s.id === activeSection ? 'true' : undefined}
            onClick={() => track('select_section', { section_id: s.id })}
          >
            {s.label}
          </a>
        ))}
      </nav>
      <div className="lang-switch" role="group" aria-label="Language">
        {LANGUAGES.map(({ code, messages }) => (
          <button
            key={code}
            lang={code}
            className={code === lang ? 'active' : ''}
            aria-pressed={code === lang}
            disabled={!messages.meta.enabled}
            title={messages.meta.enabled ? undefined : 'Bientôt disponible · Coming soon'}
            onClick={() => onLangChange(code)}
          >
            {messages.meta.label}
          </button>
        ))}
      </div>
      <button className="download" onClick={onDownload}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {downloadLabel}
      </button>
    </header>
  )
}
