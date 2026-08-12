import { useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import Home from './pages/home'
import About from './pages/about'
import Services from './pages/services'
import Contact from './pages/contact'
import Loader from './components/Loader'
import './App.css'

const App = () => {
  const [loading, setLoading] = useState(true)

  const handleLoaderComplete = useCallback(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return undefined

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

    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      scroll.destroy()
    }
  }, [loading])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {loading && <Loader onComplete={handleLoaderComplete} />}
    </>
  )
}

export default App
