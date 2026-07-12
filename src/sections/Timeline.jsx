import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { timeline } from '../data/timeline'
import './Timeline.css'

const TYPE_LABEL = {
  education: 'Education',
  apprenticeship: 'Apprenticeship',
  experience: 'Experience',
  current: 'Current',
}

export default function Timeline() {
  return (
    <section id="timeline" className="timeline-section section section--subtle">
      <div className="container">
        <SectionHeading
          eyebrow="Path"
          title="How it fits together"
          intro="Education, apprenticeships, and hands-on work — running in parallel, not in sequence."
        />

        <Reveal as="ol" className="timeline">
          <div className="timeline__line" aria-hidden="true" />
          {timeline.map((item) => (
            <Reveal as="li" className="timeline__item" key={item.id}>
              <div className="timeline__marker" aria-hidden="true" />
              <div className="timeline__content">
                <span className={`timeline__tag timeline__tag--${item.type}`}>
                  {TYPE_LABEL[item.type]}
                </span>
                {item.period && <span className="timeline__period">{item.period}</span>}
                <p className="timeline__title">{item.title}</p>
                <p className="timeline__detail">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
