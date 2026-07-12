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
import Research from './sections/Research'
import Skills from './sections/Skills'
import Contact from './sections/Contact'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
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
