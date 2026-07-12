import { profile } from '../data/profile'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__mark">Pavithra K R</p>
        <nav className="footer__links" aria-label="Footer">
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            github
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
          <a href={profile.links.leetcode} target="_blank" rel="noreferrer">
            leetcode
          </a>
          <a href={`mailto:${profile.email}`}>email</a>
        </nav>
        <p className="footer__note">&copy; {year} Pavithra K R.</p>
      </div>
    </footer>
  )
}
