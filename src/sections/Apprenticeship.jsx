import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import ApprenticeshipCard from '../components/ApprenticeshipCard'
import { apprenticeships } from '../data/apprenticeship'
import './Apprenticeship.css'

export default function Apprenticeship() {
  return (
    <section id="apprenticeships" className="apprenticeship section section--subtle">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Apprenticeships"
        />

        {apprenticeships.map((item) => (
          <Reveal key={item.id}>
            <ApprenticeshipCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
