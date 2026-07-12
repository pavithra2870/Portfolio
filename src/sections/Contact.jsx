import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import MagneticButton from '../components/MagneticButton'
import { profile } from '../data/profile'
import './Contact.css'

export default function Contact() {
  return (
    <section id="contact" className="contact section">
      <div className="container container--narrow">
        <SectionHeading
          align="center"
          index="07"
          eyebrow="Contact"
          title="open to the next hard problem"
          intro="Open but not limited to product management, AI engineering, and full-stack roles — and always happy to talk about a project in more depth."
        />

        <Reveal className="contact__actions">
          <MagneticButton className="btn btn--primary" href={`mailto:${profile.email}`} strength={8}>
            {profile.email}
          </MagneticButton>
        </Reveal>

        <Reveal className="contact__links">
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            github
          </a>
          <a href={profile.links.leetcode} target="_blank" rel="noreferrer">
            leetcode
          </a>
          <a href={profile.links.codolio} target="_blank" rel="noreferrer">
            codolio
          </a>
        </Reveal>
      </div>
    </section>
  )
}
