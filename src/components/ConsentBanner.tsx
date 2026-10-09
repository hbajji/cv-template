import { useState } from 'react'
import { analyticsConfigured, getConsent, setConsent, type Consent } from '../analytics'

interface Labels {
  text: string
  accept: string
  decline: string
  manage: string
}

// Asks whether audience measurement may be enabled; the choice is remembered for 6 months
// and can be changed at any time from the link at the bottom of the page.
export function ConsentBanner({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && getConsent() === null)
  // No analytics configured (see src/analytics.ts): nothing to consent to.
  if (!analyticsConfigured) return null

  const choose = (consent: Consent) => {
    setConsent(consent)
    setOpen(false)
  }

  return (
    <>
      <button className="footer-link" onClick={() => setOpen(true)}>
        {labels.manage}
      </button>
      {open && (
        <div className="consent screen-only" role="dialog" aria-live="polite" aria-label={labels.manage}>
          <p>{labels.text}</p>
          <div className="consent-actions">
            <button className="consent-decline" onClick={() => choose('denied')}>
              {labels.decline}
            </button>
            <button className="consent-accept" onClick={() => choose('granted')}>
              {labels.accept}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
