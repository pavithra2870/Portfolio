import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import MagneticButton from '../components/MagneticButton'
import CountUp from '../components/CountUp'
import HeroGraphic from '../components/HeroGraphic'
import { useScrollDepth } from '../hooks/useScrollDepth'
import './Hero.css'

// Headline is revealed word by word from a mask; each word's delay is set via --i.
const TITLE_WORDS = [
  { text: 'hi' },
  { text: 'I', em: true },
  { text: 'am', em: true },
  { text: 'Pavithra', em: true },
]

function TitleWord({ text, index }) {
  return (
    <span className="hero__word">
      <span className="hero__word-inner" style={{ '--i': index }}>
        {text}
      </span>
    </span>
  )
}

function ProofItem({ to, suffix, label }) {
  return (
    <div className="hero__proof-item">
      <p className="hero__proof-number">
        <CountUp to={to} suffix={suffix} />
      </p>
      <p className="hero__proof-label">{label}</p>
    </div>
  )
}

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [graphActive, setGraphActive] = useState(false)
  const depthRef = useScrollDepth(680)

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 60)
    // The graph starts drawing once the headline has landed.
    const t2 = setTimeout(() => setGraphActive(true), 650)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
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
              </p>
              <h1 className="hero__title">
                {TITLE_WORDS.map((w, i) => (
                  <span key={w.text}>
                    {w.em ? (
                      <em>
                        <TitleWord text={w.text} index={i} />
                      </em>
                    ) : (
                      <TitleWord text={w.text} index={i} />
                    )}{' '}
                  </span>
                ))}
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
                  <dd>AI/ML, Product &amp; SWE</dd>
                </div>
                
                <div>
                  <dt>based in</dt>
                  <dd>{profile.location}</dd>
                </div>
              </dl>
              <div className="hero__proof">
                <ProofItem to={10} suffix="+" label="Projects" />
                <ProofItem to={800} suffix="+" label="DSA problems" />
              </div>
            </div>

            <div className="hero__visual">
              <HeroGraphic active={graphActive} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
