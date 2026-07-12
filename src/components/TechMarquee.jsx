import './TechMarquee.css'

const ITEMS = [
  'Python',
  'React',
  'FastAPI',
  'PyTorch',
  'LLM Agents',
  'RAG',
  'FAISS',
  'SHAP',
  'Firebase',
  'Node.js',
  'Ollama',
  'scikit-learn',
  'Docker',
  'n8n',
  'AWS Lambda',
]

export default function TechMarquee() {
  const loop = [...ITEMS, ...ITEMS]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loop.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
