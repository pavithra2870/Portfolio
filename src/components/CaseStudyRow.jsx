import './CaseStudyRow.css'

export default function CaseStudyRow({ study, onOpen }) {
  const { links } = study

  return (
    <article className="case-card">
      <h3 className="case-card__name">{study.name}</h3>
      <p className="case-card__line">{study.headline}</p>

      <ul className="case-card__tags" aria-label="Topics">
        {study.tags.slice(0, 4).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <div className="case-card__links">
        <button
          type="button"
          className="case-card__link case-card__expand"
          onClick={() => onOpen(study)}
          aria-haspopup="dialog"
          aria-label={`Show details for ${study.name}`}
        >
          details <span aria-hidden="true">+</span>
        </button>
        <a
          className="case-card__link case-card__link--primary"
          href={links.caseStudy}
          target="_blank"
          rel="noreferrer"
          aria-label={`Read the ${study.name} case study (opens in a new tab)`}
        >
          case study <span aria-hidden="true">&#8599;</span>
        </a>
        {links.figma && (
          <a
            className="case-card__link"
            href={links.figma}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open the ${study.name} Figma file (opens in a new tab)`}
          >
            figma <span aria-hidden="true">&#8599;</span>
          </a>
        )}
      </div>
    </article>
  )
}
