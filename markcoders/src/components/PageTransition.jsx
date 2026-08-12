import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './PageTransition.css'

export default function PageTransition({
  isActive,
  title,
  index,
  rect,
  onNavigate,
  onComplete,
}) {
  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const titleRef = useRef(null)
  const metaRef = useRef(null)
  const onNavigateRef = useRef(onNavigate)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onNavigateRef.current = onNavigate
    onCompleteRef.current = onComplete
  }, [onNavigate, onComplete])

  useEffect(() => {
    if (!isActive) return undefined

    const overlay = overlayRef.current
    const panel = panelRef.current
    const titleEl = titleRef.current
    const meta = metaRef.current

    const start = rect || {
      top: window.innerHeight * 0.3,
      left: window.innerWidth * 0.2,
      width: window.innerWidth * 0.6,
      height: window.innerHeight * 0.4,
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onCompleteRef.current?.()
      },
    })

    gsap.set(overlay, {
      visibility: 'visible',
      pointerEvents: 'auto',
      opacity: 1,
    })

    gsap.set(panel, {
      top: start.top,
      left: start.left,
      width: start.width,
      height: start.height,
      opacity: 1,
    })

    gsap.set([titleEl, meta], {
      opacity: 1,
      y: 0,
    })

    // 1. Expand the clicked card to full screen
    tl.to(panel, {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      duration: 0.85,
      ease: 'power4.inOut',
    })

    // 2. Hold briefly while expanded
    tl.to({}, { duration: 0.2 })

    // 3. Fade title + meta slowly (acts as loader)
    tl.to(
      [titleEl, meta],
      {
        opacity: 0,
        y: -12,
        duration: 0.9,
        ease: 'power2.inOut',
      },
      '-=0.05',
    )

    // 4. Route change while still covered
    tl.add(() => {
      onNavigateRef.current?.()
    })

    // 5. Reveal destination page
    tl.to(panel, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.inOut',
    })

    tl.set(overlay, {
      visibility: 'hidden',
      pointerEvents: 'none',
    })

    return () => {
      tl.kill()
    }
  }, [isActive, rect, title, index])

  return (
    <div ref={overlayRef} className="page-transition" aria-hidden={!isActive}>
      <div ref={panelRef} className="page-transition-panel">
        <div ref={metaRef} className="page-transition-meta">
          <span className="page-transition-index">{index || '00'}</span>
          <span className="page-transition-arrow" aria-hidden="true">
            ↗
          </span>
        </div>

        <h2 ref={titleRef} className="page-transition-title">
          {title}
        </h2>
      </div>
    </div>
  )
}
