import { useCallback, useEffect, useState, Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/MLoader'
import ScrollToTop from './components/ScrollToTop'
import { setSmoothScroll, scrollToTop } from './lib/smoothScroll'
import { debounce } from './lib/schedule'
import {
  HomePage,
  AboutPage,
  ServicesPage,
  ProjectsPage,
  ContactPage,
} from './lib/routes'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const RouteFallback = () => <div className="route-fallback" aria-hidden="true" />

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

    let scroll
    let cancelled = false

    const boot = async () => {
      const [{ default: LocomotiveScroll }] = await Promise.all([
        import('locomotive-scroll'),
        import('locomotive-scroll/dist/locomotive-scroll.css'),
      ])

      if (cancelled) return

      scroll = new LocomotiveScroll({
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
    }

    boot()

    const onTick = () => {
      ScrollTrigger.update()
    }

    gsap.ticker.add(onTick)

    const refresh = debounce(() => ScrollTrigger.refresh(), 180)
    const refreshTimers = [
      window.setTimeout(refresh, 100),
      window.setTimeout(refresh, 700),
    ]
    window.addEventListener('resize', refresh, { passive: true })

    return () => {
      cancelled = true
      refresh.cancel()
      refreshTimers.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('resize', refresh)
      gsap.ticker.remove(onTick)
      setSmoothScroll(null)
      scroll?.destroy()
    }
  }, [loading])

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Suspense>

      {loading && <Loader onComplete={handleLoaderComplete} />}
    </>
  )
}

export default App
