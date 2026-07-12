import { useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import Modal from '../components/Modal'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import './Projects.css'

export default function Projects() {
  const [active, setActive] = useState(null)

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow="Projects"
          title="Real problems, real products, real impact"
        />

        <Reveal as="div" stagger className="projects__grid">
          {projects.map((project) => (
            <ProjectCard project={project} onOpen={setActive} key={project.id} />
          ))}
        </Reveal>
      </div>

      {active && (
        <Modal onClose={() => setActive(null)} labelledBy="project-modal-title">
          <p className="project-detail__complexity">{active.complexity}</p>
          <h3 id="project-modal-title" className="project-detail__title">
            {active.name}
          </h3>
          <p className="project-detail__line">{active.oneLiner}</p>

          <div className="project-detail__block">
            <h4>Problem</h4>
            <p>{active.problem}</p>
          </div>

          <div className="project-detail__block">
            <h4>Solution</h4>
            <p>{active.solution}</p>
          </div>

          <div className="project-detail__block">
            <h4>Architecture</h4>
            <p>{active.architecture}</p>
          </div>

          <div className="project-detail__block">
            <h4>My contributions</h4>
            <ul>
              {active.contributions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="project-detail__block">
            <h4>The hard part</h4>
            <p>{active.challenge}</p>
          </div>

          <div className="project-detail__block">
            <h4>Technology</h4>
            <ul className="project-detail__tech">
              {active.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          {active.link && (
            <a className="btn btn--primary project-detail__cta" href={active.link} target="_blank" rel="noreferrer">
              view repository &#8599;
            </a>
          )}
        </Modal>
      )}
    </section>
  )
}
