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
import Loader from './components/MLoader'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

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

    const onTick = () => {
      ScrollTrigger.update()
    }

    gsap.ticker.add(onTick)

    const lockScroll = () => {
      scroll.stop?.()
      scroll.lenisInstance?.stop?.()
    }

    const unlockScroll = () => {
      scroll.start?.()
      scroll.lenisInstance?.start?.()
    }

    window.addEventListener('markcoders:scroll-lock', lockScroll)
    window.addEventListener('markcoders:scroll-unlock', unlockScroll)

    const refreshTimers = [
      window.setTimeout(() => ScrollTrigger.refresh(), 100),
      window.setTimeout(() => ScrollTrigger.refresh(), 600),
      window.setTimeout(() => ScrollTrigger.refresh(), 1200),
    ]

    return () => {
      refreshTimers.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('markcoders:scroll-lock', lockScroll)
      window.removeEventListener('markcoders:scroll-unlock', unlockScroll)
      gsap.ticker.remove(onTick)
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
