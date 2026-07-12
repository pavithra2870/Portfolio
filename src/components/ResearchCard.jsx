import './ResearchCard.css'

export default function ResearchCard({ item, onOpen }) {
  return (
    <button className="research-card" onClick={() => onOpen(item)}>
      <div className="research-card__row">
        <h3 className="research-card__name">{item.name}</h3>
        <span className="research-card__arrow" aria-hidden="true">
          &#8599;
        </span>
      </div>
      <p className="research-card__line">{item.oneLiner}</p>
    </button>
  )
}
