import { useEffect, useRef, useState } from 'react'
import introSound from '../assets/audio/intro.mp3'
import './Intro.css'

const NAME = 'Pavithra K R'

// Rolls through the disciplines the work spans, then settles on the last line.
const TICKER = ['machine learning', 'agentic ai', 'product management and strategy', "analyst", 'AI/ML, Product & Data']

// Plays on every load (and on nav-name click), except with reduced motion.
export function shouldPlayIntro() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Intro({ onDone }) {
  const [skipping, setSkipping] = useState(false)
  const audioRef = useRef(null)
  const finishedRef = useRef(false)

  // Sound: browsers only allow it after a user gesture (e.g. clicking the nav name).
  // On a cold page load playback is usually blocked, so the intro stays silent.
  useEffect(() => {
    const audio = new Audio(introSound)
    audio.volume = 0.8
    audioRef.current = audio
    audio.play().catch(() => {})
    return () => {
      // Let the tail ring out after a normal finish; stop on any other teardown.
      if (!finishedRef.current) audio.pause()
    }
  }, [])

  // Skipping fades the sound out instead of cutting it.
  useEffect(() => {
    const audio = audioRef.current
    if (!skipping || !audio) return
    const fade = setInterval(() => {
      audio.volume = Math.max(0, audio.volume - 0.1)
      if (audio.volume === 0) {
        audio.pause()
        clearInterval(fade)
      }
    }, 35)
    return () => clearInterval(fade)
  }, [skipping])

  useEffect(() => {
    const skip = () => setSkipping(true)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [])

  const handleEnd = (e) => {
    if (e.target !== e.currentTarget) return
    finishedRef.current = true
    onDone()
  }

  return (
    <div
      className={`intro ${skipping ? 'intro--skip' : ''}`}
      onAnimationEnd={handleEnd}
      aria-hidden="true"
    >
      <div className="intro__stage">
        <p className="intro__name">
          {NAME.split('').map((ch, i) => (
            <span
              key={i}
              className="intro__letter"
              style={{ '--i': i }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </p>
        <span className="intro__rule" />
        <div className="intro__ticker">
          <ul className="intro__ticker-list">
            {TICKER.map((word, i) => (
              <li
                key={word}
                className={i === TICKER.length - 1 ? 'is-final' : undefined}
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="intro__hint">
        <span className="intro__hint-key">press any key to skip</span>
        <span className="intro__hint-tap">tap to skip</span>
      </p>
    </div>
  )
}
