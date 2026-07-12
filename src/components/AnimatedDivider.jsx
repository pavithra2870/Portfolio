import { useReveal } from '../hooks/useReveal'
import './AnimatedDivider.css'

export default function AnimatedDivider() {
  const ref = useReveal({ threshold: 0.6 })

  return (
    <div className="connector" ref={ref} aria-hidden="true">
      <span className="connector__line connector__line--left" />
      <span className="connector__node" />
      <span className="connector__line connector__line--right" />
    </div>
  )
}
