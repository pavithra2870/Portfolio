import { useTilt } from '../hooks/useTilt'
import './ProjectCard.css'

export default function ProjectCard({ project, onOpen }) {
  const tiltRef = useTilt(5)

  return (
    <button className="project-card" ref={tiltRef} onClick={() => onOpen(project)}>
      <div className="project-card__top">
        <span className="project-card__complexity">{project.complexity}</span>
        <span className="project-card__arrow" aria-hidden="true">
          &#8599;
        </span>
      </div>
      <h3 className="project-card__name">{project.name}</h3>
      <p className="project-card__line">{project.oneLiner}</p>
      <ul className="project-card__tags">
        {project.tags.slice(0, 4).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </button>
  )
}
