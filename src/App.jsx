import { useState } from 'react'
import Intro, { shouldPlayIntro } from './components/Intro'
import Nav from './components/Nav'
import Footer from './components/Footer'
import TechMarquee from './components/TechMarquee'
import AnimatedDivider from './components/AnimatedDivider'
import Hero from './sections/Hero'
import About from './sections/About'
import Timeline from './sections/Timeline'
import Experience from './sections/Experience'
import Apprenticeship from './sections/Apprenticeship'
import Projects from './sections/Projects'
import CaseStudies from './sections/CaseStudies'
import Research from './sections/Research'
import Skills from './sections/Skills'
import Contact from './sections/Contact'

export default function App() {
  // The hero's entrance waits for the intro (if it plays) to finish.
  const [introDone, setIntroDone] = useState(() => !shouldPlayIntro())

  // Clicking the name in the nav jumps to the top and replays the intro.
  const replayIntro = () => {
    window.scrollTo(0, 0)
    setIntroDone(false)
  }

  return (
    <>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav onMarkClick={replayIntro} />
      <main id="main">
        <Hero ready={introDone} />
        <TechMarquee />
        <About />
        <AnimatedDivider />
        <Timeline />
        <Experience />
        <AnimatedDivider />
        <Apprenticeship />
        <AnimatedDivider />
        <Projects />
        <AnimatedDivider />
        <CaseStudies />
        <AnimatedDivider />
        <Research />
        <AnimatedDivider />
        <Skills />
        <AnimatedDivider />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
