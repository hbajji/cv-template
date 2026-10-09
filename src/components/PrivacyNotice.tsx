import { useRef } from 'react'
import type { CV } from '../types'

type Labels = CV['labels']['privacy']

// "{email}" in a paragraph becomes a mailto link to the site owner.
function withEmail(text: string, email: string) {
  const [before, after] = text.split('{email}')
  if (after === undefined) return text
  return (
    <>
      {before}
      <a href={`mailto:${email}`}>{email}</a>
      {after}
    </>
  )
}

export function PrivacyNotice({ labels, email }: { labels: Labels; email: string }) {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button className="footer-link" onClick={() => dialog.current?.showModal()}>
        {labels.link}
      </button>
      <dialog
        ref={dialog}
        className="privacy"
        aria-labelledby="privacy-title"
        // A click on the backdrop lands on the <dialog> itself: close it.
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        <div className="privacy-body">
          <h2 id="privacy-title">{labels.title}</h2>
          <p className="privacy-updated">{labels.updated}</p>
          {labels.sections.map((s) => (
            <section key={s.heading}>
              <h3>{s.heading}</h3>
              {s.paragraphs.map((p) => (
                <p key={p}>{withEmail(p, email)}</p>
              ))}
            </section>
          ))}
          <button className="privacy-close" onClick={() => dialog.current?.close()}>
            {labels.close}
          </button>
        </div>
      </dialog>
    </>
  )
}
