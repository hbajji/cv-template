import type { Project, ProjectGroup } from '../types'
import { Text } from './Text'
import { track } from '../analytics'

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-grid">
      {projects.map((p) => (
        <li className="project-card" key={p.name}>
          <div className="project-head">
            <h3>
              <Text>{p.name}</Text>
            </h3>
            <span className="period">
              <Text>{p.period}</Text>
            </span>
          </div>
          <p className="project-context">
            <Text>{p.context}</Text>
          </p>
          {p.role && (
            <p className="project-role">
              <Text>{p.role}</Text>
            </p>
          )}
          <p className="project-desc">
            <Text>{p.description}</Text>
          </p>
          <ul className="stack">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {p.links.length > 0 && (
            <ul className="project-links">
              {p.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track('project_link_click', { project: p.name, link: l.label })}
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

interface Props {
  title: string
  intro: string
  projects: Project[]
  groups: ProjectGroup[]
}

// Web-only sections: hidden in the printed PDF (see .screen-only in index.css).
export function Projects({ title, intro, projects, groups }: Props) {
  return (
    <>
      <section className="panel screen-only" id="projects">
        <h2>{title}</h2>
        <p className="panel-intro">{intro}</p>
        <ProjectGrid projects={projects} />
      </section>

      {groups.map((g) => (
        <section className="panel screen-only" id={g.id} key={g.id}>
          <h2>{g.title}</h2>
          <p className="panel-intro">{g.intro}</p>
          <ProjectGrid projects={g.projects} />
        </section>
      ))}
    </>
  )
}
