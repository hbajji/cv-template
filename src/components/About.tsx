import type { About as AboutData } from '../types'

// Web-only introduction (hidden in the PDF), same wording as the LinkedIn "About" section.
export function About({ about }: { about: AboutData }) {
  return (
    <section className="panel about screen-only" id="about">
      <h2>{about.title}</h2>
      <p>{about.intro}</p>

      <h3>{about.dailyTitle}</h3>
      <ul className="about-list">
        {about.daily.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>

      <h3>{about.projectsTitle}</h3>
      <ul className="about-list">
        {about.projects.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <p className="about-outro">{about.outro}</p>
    </section>
  )
}
