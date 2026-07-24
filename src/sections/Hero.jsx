import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import MagneticButton from '../components/MagneticButton'
import CountUp from '../components/CountUp'
import HeroGraphic from '../components/HeroGraphic'
import { useScrollDepth } from '../hooks/useScrollDepth'
import { useTilt } from '../hooks/useTilt'
import './Hero.css'

function ProofItem({ to, suffix, label }) {
  const tiltRef = useTilt(6)
  return (
    <div className="hero__proof-item" ref={tiltRef}>
      <p className="hero__proof-number">
        <CountUp to={to} suffix={suffix} />
      </p>
      <p className="hero__proof-label">{label}</p>
    </div>
  )
}

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const depthRef = useScrollDepth(680)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <section id="top" className="hero">
      <div className="hero__field" aria-hidden="true" />
      <div className="hero__stage" ref={depthRef}>
        <div className={`container hero__inner ${mounted ? 'is-mounted' : ''}`}>
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="hero__eyebrow">
                <span className="text-acronym">AI</span> engineer &amp; product builder
                <span className="hero__caret">_</span>
              </p>
              <h1 className="hero__title">
                i turn <span className="text-acronym">AI</span> research into{' '}
                <em>agents, pipelines and products</em>
              </h1>
              <p className="hero__subtitle">
                B.Tech Computer Science (AI &amp; ML) student at VIT Chennai.
              </p>
              <div className="hero__actions">
                <MagneticButton href="#projects" className="btn btn--primary">
                  see the work
                </MagneticButton>
                <MagneticButton href="#contact" className="btn btn--ghost">
                  get in touch
                </MagneticButton>
              </div>

              <dl className="hero__stats">
                <div>
                  <dt>focus</dt>
                  <dd>AI/ML &amp; SWE</dd>
                </div>
                <div>
                  <dt>
                    <span className="hero__live-dot" aria-hidden="true" />
                    currently
                  </dt>
                  <dd>Morph Systems</dd>
                </div>
                <div>
                  <dt>based in</dt>
                  <dd>{profile.location}</dd>
                </div>
              </dl>

              <div className="hero__proof">
                <ProofItem to={10} suffix="+" label="Products shipped" />
                <ProofItem to={4} label="Research projects" />
                <ProofItem to={800} suffix="+" label="DSA problems solved" />
              </div>
            </div>

            <div className="hero__visual">
              <HeroGraphic />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
