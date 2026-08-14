import { useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import Home from './pages/home'
import About from './pages/about'
import Services from './pages/services'
import Contact from './pages/contact'
import ProjectsPage from './pages/projects'
import Loader from './components/MLoader'
import ScrollToTop from './components/ScrollToTop'
import { setSmoothScroll, scrollToTop } from './lib/smoothScroll'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  const [loading, setLoading] = useState(true)

  const handleLoaderComplete = useCallback(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return undefined

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const scroll = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.2,
        syncTouch: true,
      },
      scrollCallback: () => {
        ScrollTrigger.update()
      },
    })

    setSmoothScroll(scroll)
    scrollToTop({ immediate: true })

    const onTick = () => {
      ScrollTrigger.update()
    }

    gsap.ticker.add(onTick)

    const refreshTimers = [
      window.setTimeout(() => ScrollTrigger.refresh(), 100),
      window.setTimeout(() => ScrollTrigger.refresh(), 600),
      window.setTimeout(() => ScrollTrigger.refresh(), 1200),
    ]

    return () => {
      refreshTimers.forEach((id) => window.clearTimeout(id))
      gsap.ticker.remove(onTick)
      setSmoothScroll(null)
      scroll.destroy()
    }
  }, [loading])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {loading && <Loader onComplete={handleLoaderComplete} />}
    </>
  )
}

export default App
