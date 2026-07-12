import { useEffect, useMemo, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'
import ScrollProgress from './ScrollProgress'
import MagneticButton from './MagneticButton'
import './Nav.css'

const LINKS = [
  { href: '#about', label: 'about' },
  { href: '#experience', label: 'experience' },
  { href: '#apprenticeships', label: 'apprenticeships' },
  { href: '#projects', label: 'projects' },
  { href: '#research', label: 'research' },
  { href: '#skills', label: 'skills' },
  { href: '#contact', label: 'contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const ids = useMemo(() => LINKS.map((l) => l.href.slice(1)), [])
  const active = useActiveSection(ids)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return

    const scrollY = window.scrollY
    const { style } = document.body
    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'

    return () => {
      style.position = ''
      style.top = ''
      style.left = ''
      style.right = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <ScrollProgress />
      <div className="nav__inner container">
        <a href="#top" className="nav__mark">
          Pavithra K R
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href.slice(1) ? 'is-active' : ''}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <MagneticButton href="#contact" className="nav__cta" strength={6}>
          get in touch
        </MagneticButton>

        <button
          className={`nav__toggle ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`nav__mobile ${open ? 'is-open' : ''}`} id="mobile-menu">
        <nav aria-label="Mobile">
          {LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="nav__mobile-cta" onClick={() => setOpen(false)}>
            get in touch
          </a>
        </nav>
      </div>
    </header>
  )
}
