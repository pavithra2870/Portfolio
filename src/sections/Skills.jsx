import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { skillCategories } from '../data/skills'
import { techStack } from '../data/techstack'
import './Skills.css'

export default function Skills() {
  return (
    <section id="skills" className="skills section">
      <div className="container">
        <SectionHeading
          index="06"
          eyebrow="Skills"
          title="skills and tech stack"
        />

        <div className="skills__grid">
          {skillCategories.map((cat) => (
            <Reveal as="div" className="skills__category" key={cat.title}>
              <h3 className="skills__category-title">{cat.title}</h3>
              <p className="skills__category-desc">{cat.description}</p>
              <ul className="skills__capabilities">
                {cat.capabilities.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="skills__stack">
          <h3 className="skills__stack-heading">Built with</h3>
          <div className="skills__stack-grid">
            {techStack.map((group) => (
              <div className="skills__stack-group" key={group.category}>
                <p className="skills__stack-category">{group.category}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
