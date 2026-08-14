import { useEffect, useRef, useState } from 'react'

export const LANDING_VIDEO_SRC = '/Video.mp4'

/**
 * Lazy-attaches video src once the element nears the viewport.
 */
export function useLazyVideoSrc(src, rootMargin = '45% 0px') {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || ready) return undefined

    if (!('IntersectionObserver' in window)) {
      setReady(true)
      return undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setReady(true)
        io.disconnect()
      },
      { rootMargin },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [ready, rootMargin])

  useEffect(() => {
    const el = ref.current
    if (!ready || !el || !src) return
    if (el.dataset.srcAttached === '1') return
    el.src = src
    el.dataset.srcAttached = '1'
    el.load()
  }, [ready, src])

  return [ref, ready]
}


