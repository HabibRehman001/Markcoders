import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToTop } from '../lib/smoothScroll'
import { debounce } from '../lib/schedule'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    scrollToTop({ immediate: true })

    const refresh = debounce(() => {
      scrollToTop({ immediate: true })
      ScrollTrigger.refresh()
    }, 80)

    const timers = [
      window.setTimeout(refresh, 50),
      window.setTimeout(refresh, 320),
    ]

    return () => {
      refresh.cancel()
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [pathname])

  return null
}
