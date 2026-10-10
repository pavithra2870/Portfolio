import { useTilt } from '../hooks/useTilt'
import './ProjectCard.css'

export default function ProjectCard({ project, onOpen }) {
  const tiltRef = useTilt(5)
  const { github, live, demo } = project.links ?? {}
  const external = [
    github && { href: github, label: 'github' },
    live && { href: live, label: 'live' },
    demo && { href: demo, label: 'demo' },
  ].filter(Boolean)

  return (
    <article className="project-card" ref={tiltRef}>
      <h3 className="project-card__name">{project.name}</h3>
      <p className="project-card__line">{project.oneLiner}</p>
      <ul className="project-card__tags">
        {project.tags.slice(0, 4).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <div className="project-card__links">
        <button
          type="button"
          className="project-card__link project-card__expand"
          onClick={() => onOpen(project)}
          aria-haspopup="dialog"
          aria-label={`Show details for ${project.name}`}
        >
          details <span aria-hidden="true">+</span>
        </button>
        {external.map(({ href, label }) => (
          <a
            key={label}
            className="project-card__link"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.name} ${label} (opens in a new tab)`}
          >
            {label} <span aria-hidden="true">&#8599;</span>
          </a>
        ))}
      </div>
    </article>
  )
}
