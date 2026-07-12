import { useTilt } from '../hooks/useTilt'

export default function ApprenticeshipCard({ item }) {
  const tiltRef = useTilt(4)

  return (
    <div className="apprenticeship__item" ref={tiltRef}>
      <div className="apprenticeship__head">
        <h3 className="apprenticeship__org">{item.org}</h3>
        <p className="apprenticeship__role">{item.role}</p>
      </div>
      <p className="apprenticeship__summary">{item.summary}</p>
      <ul className="apprenticeship__highlights">
        {item.highlights.map((h, idx) => (
          <li key={idx}>{h}</li>
        ))}
      </ul>
      {item.outcome && <p className="apprenticeship__outcome">{item.outcome}</p>}
      <ul className="apprenticeship__tech">
        {item.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}
