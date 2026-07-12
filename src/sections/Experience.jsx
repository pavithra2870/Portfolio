import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { experience } from '../data/experience'
import './Experience.css'

export default function Experience() {
  return (
    <section id="experience" className="experience section">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title={
            <>
              engineering, <span className="text-acronym">AI</span> and
              product
            </>
          }
        />

        <div className="experience__list">
          {experience.map((role, i) => (
            <Reveal as="article" className="experience__item" key={role.id}>
              <div className="experience__head">
                <div>
                  <h3 className="experience__company">
                    {role.company}
                    {role.current && <span className="experience__badge">Current</span>}
                  </h3>
                  {role.role && <p className="experience__role">{role.role}</p>}
                </div>
                {role.link && (
                  <a className="experience__link" href={role.link.href} target="_blank" rel="noreferrer">
                    {role.link.label} &#8599;
                  </a>
                )}
              </div>

              <p className="experience__summary">{role.summary}</p>

              <ul className="experience__highlights">
                {role.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>

              {role.outcome && <p className="experience__outcome">{role.outcome}</p>}

              <ul className="experience__tech">
                {role.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              {i < experience.length - 1 && <hr className="section-divider experience__divider" />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
