import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToTop } from '../lib/smoothScroll'

/**
 * Always land at the top when the route changes
 * (fixes Lenis keeping the previous page's scroll offset).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    scrollToTop({ immediate: true })

    const timers = [
      window.setTimeout(() => {
        scrollToTop({ immediate: true })
        ScrollTrigger.refresh()
      }, 50),
      window.setTimeout(() => {
        scrollToTop({ immediate: true })
        ScrollTrigger.refresh()
      }, 300),
    ]

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [pathname])

  return null
}
