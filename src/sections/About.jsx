import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { useTilt } from '../hooks/useTilt'
import { about } from '../data/about'
import { profile } from '../data/profile'
import './About.css'

export default function About() {
  const eduTilt = useTilt(4)
  const currentTilt = useTilt(4)
  const miscTilt = useTilt(4)

  return (
    <section id="about" className="about section">
      <div className="container about__grid">
        <div className="about__copy">
          <SectionHeading index="01" eyebrow="About" title="product thinking, engineering depth, AI/ML systems." />
          {about.paragraphs.map((p, i) => (
            <Reveal as="p" className="about__paragraph" key={i}>
              {p}
            </Reveal>
          ))}
        </div>

        <Reveal className="about__side">
          <div className="about__card" ref={eduTilt}>
            <p className="about__card-label">Education</p>
            {profile.education.map((ed) => (
              <div className="about__edu" key={ed.school}>
                <p className="about__edu-school">{ed.school}</p>
                <p className="about__edu-degree">{ed.degree}</p>
                {ed.period && <p className="about__edu-period">{ed.period}</p>}
              </div>
            ))}
          </div>

          <div className="about__card" ref={currentTilt}>
            <p className="about__card-label">Currently</p>
            <ul className="about__current">
              {profile.current.map((c) => (
                <li key={c.role}>
                  <span className="about__current-role">{c.role}</span>
                  <span className="about__current-org">{c.org}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="about__card" ref={miscTilt}>
            <p className="about__card-label">Also true</p>
            <p className="about__misc">{about.dsa}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
