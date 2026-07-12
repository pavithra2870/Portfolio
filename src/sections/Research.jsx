import { useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import Modal from '../components/Modal'
import ResearchCard from '../components/ResearchCard'
import { research } from '../data/research'
import './Research.css'

export default function Research() {
  const [active, setActive] = useState(null)

  return (
    <section id="research" className="research section section--subtle">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="Research"
          title="Ongoing research"
        />

        <Reveal as="div" className="research__list">
          {research.map((item) => (
            <ResearchCard item={item} onOpen={setActive} key={item.id} />
          ))}
        </Reveal>
      </div>

      {active && (
        <Modal onClose={() => setActive(null)} labelledBy="research-modal-title">
          <h3 id="research-modal-title" className="research-detail__title">
            {active.name}
          </h3>
          <p className="research-detail__line">{active.oneLiner}</p>

          <div className="research-detail__block">
            <h4>Research question</h4>
            <p>{active.question}</p>
          </div>

          <div className="research-detail__block">
            <h4>Methodology</h4>
            <p>{active.methodology}</p>
          </div>

          <div className="research-detail__block">
            <h4>Technical depth</h4>
            <p>{active.depth}</p>
          </div>

          <div className="research-detail__block">
            <h4>Tools &amp; methods</h4>
            <ul className="research-detail__tech">
              {active.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </section>
  )
}
