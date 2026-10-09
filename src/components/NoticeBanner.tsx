import { useState } from 'react'
import type { CV } from '../types'
import { track } from '../analytics'

type Labels = CV['labels']['notice']

const DISMISS_KEY = 'cv-notice-dismissed'

function isDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

const mailto = (email: string, subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`

// "Work in progress" banner at the top of the site (hidden in the PDF); closing it is remembered.
export function NoticeBanner({ labels, email }: { labels: Labels; email: string }) {
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && !isDismissed())
  if (!open) return null

  const close = () => {
    setOpen(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // storage unavailable: hidden for this visit only
    }
  }

  return (
    <div className="notice screen-only" role="note">
      <p>
        <span className="notice-icon" aria-hidden="true">
          ⚠
        </span>
        {labels.text}{' '}
        <a href={mailto(email, labels.feedbackSubject)} onClick={() => track('notice_click', { action: 'feedback' })}>
          {labels.feedback}
        </a>
        {' · '}
        {labels.sourceText}{' '}
        <a href={mailto(email, labels.sourceSubject)} onClick={() => track('notice_click', { action: 'source_code' })}>
          {labels.source}
        </a>
      </p>
      <button className="notice-close" onClick={close} aria-label={labels.close} title={labels.close}>
        ×
      </button>
    </div>
  )
}
