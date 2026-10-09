import type { ReactNode } from 'react'
import type { CV, Position } from '../types'
import { Text } from './Text'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function Context({ text, bare }: { text?: string; bare?: boolean }) {
  if (!text) return null
  return (
    <span className="context">
      {bare ? '' : ' — '}
      <Text>{text}</Text>
    </span>
  )
}

function PositionHead({ position }: { position: Position }) {
  return (
    <div className="exp-head">
      <h3>
        <Text>{position.role}</Text>
      </h3>
      <span className="period">
        <Text>{position.period}</Text>
      </span>
    </div>
  )
}

function PositionBody({ position }: { position: Position }) {
  return (
    <>
      <ul className="highlights">
        {position.highlights.map((h) => (
          <li key={h}>
            <Text>{h}</Text>
          </li>
        ))}
      </ul>
      <ul className="stack">
        {position.stack.map((s) => (
          <li key={s}>
            <Text>{s}</Text>
          </li>
        ))}
      </ul>
    </>
  )
}

export function Resume({ cv }: { cv: CV }) {
  const { identity: id, labels } = cv
  const initials = id.firstName[0] + id.lastName[0]

  return (
    <article className="sheet" id="cv">
      <header className="cv-header">
        <div className="avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h1>
            {id.firstName} <span className="last-name">{id.lastName}</span>
          </h1>
          <p className="title">{id.title}</p>
          <p className="subtitle">{id.subtitle}</p>
        </div>
        <ul className="contact">
          <li>
            <Text>{id.location}</Text>
          </li>
          <li>
            <a href={`mailto:${id.email}`}>{id.email}</a>
          </li>
          <li>
            <a href={`tel:${id.phone.replace(/\s/g, '')}`}>{id.phone}</a>
          </li>
          {id.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="columns">
        <main className="main-col">
          <Section title={labels.profile}>
            <p className="summary">
              <Text>{cv.summary}</Text>
            </p>
          </Section>

          <Section title={labels.experience}>
            {cv.experiences.map((exp) =>
              exp.positions.length === 1 ? (
                <div className="experience" key={exp.company}>
                  <PositionHead position={exp.positions[0]} />
                  <p className="company">
                    <Text>{exp.company}</Text> · <Text>{exp.location}</Text>
                    <Context text={exp.positions[0].context} />
                  </p>
                  <PositionBody position={exp.positions[0]} />
                </div>
              ) : (
                <div className="experience multi" key={exp.company}>
                  <div className="exp-head">
                    <h3 className="company-title">
                      <Text>{exp.company}</Text> · <Text>{exp.location}</Text>
                    </h3>
                    {exp.period && (
                      <span className="period">
                        <Text>{exp.period}</Text>
                      </span>
                    )}
                  </div>
                  {exp.highlights && (
                    <div className="transverse">
                      <h4>{labels.transverse}</h4>
                      <ul className="highlights">
                        {exp.highlights.map((h) => (
                          <li key={h}>
                            <Text>{h}</Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="positions">
                    {exp.positions.map((pos) => (
                      <div className="position" key={pos.role + pos.period}>
                        <PositionHead position={pos} />
                        {pos.context && (
                          <p className="company">
                            <Context text={pos.context} bare />
                          </p>
                        )}
                        <PositionBody position={pos} />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
            <p className="earlier">
              <strong>{labels.earlier}.</strong> {cv.earlier}
            </p>
          </Section>
        </main>

        <aside className="side-col">
          <Section title={labels.skills}>
            {cv.skills.map((g) => (
              <div className="skill-group" key={g.name}>
                <h3>{g.name}</h3>
                <ul className="tags">
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section title={labels.education}>
            {cv.education.map((e) => (
              <div className="edu" key={e.degree}>
                <h3>{e.degree}</h3>
                <p>{e.school}</p>
                <p className="period">{e.period}</p>
              </div>
            ))}
          </Section>

          <Section title={labels.certifications}>
            <ul className="plain">
              {cv.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Section>

          <Section title={labels.languages}>
            <ul className="plain">
              {cv.languages.map((l) => (
                <li key={l.name}>
                  <strong>{l.name}</strong> — {l.level}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={labels.interests}>
            <ul className="plain">
              {cv.interests.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </Section>
        </aside>
      </div>
    </article>
  )
}
