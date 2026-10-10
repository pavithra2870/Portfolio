import { useCallback, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import Modal from '../components/Modal'
import CaseStudyRow from '../components/CaseStudyRow'
import { caseStudies } from '../data/caseStudies'
import './CaseStudies.css'

const FACTS = [
  ['Problem', 'problem'],
  ['Approach', 'approach'],
  ['Key decision', 'decision'],
  ['Measured by', 'metric'],
]

export default function CaseStudies() {
  const [active, setActive] = useState(null)
  const close = useCallback(() => setActive(null), [])

  return (
    <section id="case-studies" className="case-studies section">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="Product case studies"
          title="product thinking, written down."
        />

        <Reveal as="div" stagger className="case-studies__grid">
          {caseStudies.map((study) => (
            <CaseStudyRow study={study} onOpen={setActive} key={study.id} />
          ))}
        </Reveal>
      </div>

      {active && (
        <Modal onClose={close} labelledBy="case-modal-title">
          <p className="case-detail__kind">
            {active.kind} · {active.date}
          </p>
          <h3 id="case-modal-title" className="case-detail__title">
            {active.name}
          </h3>
          <p className="case-detail__line">{active.headline}</p>

          {FACTS.map(([label, key]) => (
            <div className="case-detail__block" key={key}>
              <h4>{label}</h4>
              <p>{active[key]}</p>
            </div>
          ))}

          <p className="case-detail__status">{active.status}</p>

          <div className="case-detail__links">
            <a
              className="btn btn--primary"
              href={active.links.caseStudy}
              target="_blank"
              rel="noreferrer"
            >
              read the case study &#8599;
            </a>
            {active.links.figma && (
              <a
                className="btn btn--ghost"
                href={active.links.figma}
                target="_blank"
                rel="noreferrer"
              >
                open in figma &#8599;
              </a>
            )}
          </div>
        </Modal>
      )}
    </section>
  )
}
