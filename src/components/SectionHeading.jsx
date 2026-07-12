import Reveal from './Reveal'
import './SectionHeading.css'

export default function SectionHeading({ eyebrow, title, intro, align = 'left', index }) {
  return (
    <Reveal className={`section-heading section-heading--${align}`}>
      {eyebrow && (
        <p className="section-heading__eyebrow">
          {index && <span className="section-heading__index">{index}</span>}
          {eyebrow}
        </p>
      )}
      <h2 className="section-heading__title">{title}</h2>
      {intro && <p className="section-heading__intro">{intro}</p>}
    </Reveal>
  )
}
