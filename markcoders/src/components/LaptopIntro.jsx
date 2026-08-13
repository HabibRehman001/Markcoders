import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MenuGrid from './MenuGrid'
import './LaptopIntro.css'

gsap.registerPlugin(ScrollTrigger)

const IMAGE = {
  width: 1672,
  height: 941,
  // Content frame on the dark wall area of the updated room background
  screen: {
    left: 0.3,
    top: 0.12,
    width: 0.45,
    height: 0.5,
  },
}

function getCoverLayout(containerWidth, containerHeight) {
  const scale = Math.max(
    containerWidth / IMAGE.width,
    containerHeight / IMAGE.height,
  )
  const displayWidth = IMAGE.width * scale
  const displayHeight = IMAGE.height * scale
  const offsetX = (containerWidth - displayWidth) / 2
  const offsetY = (containerHeight - displayHeight) / 2
  const { screen } = IMAGE

  return {
    left: offsetX + screen.left * displayWidth,
    top: offsetY + screen.top * displayHeight,
    width: screen.width * displayWidth,
    height: screen.height * displayHeight,
    originX: offsetX + (screen.left + screen.width / 2) * displayWidth,
    originY: offsetY + (screen.top + screen.height / 2) * displayHeight,
  }
}

export default function LaptopIntro() {
  const wrapRef = useRef(null)
  const imageRef = useRef(null)
  const screenRef = useRef(null)
  const hintRef = useRef(null)
  const veilRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const image = imageRef.current
    const screen = screenRef.current
    if (!wrap || !image || !screen) return undefined

    let layout = getCoverLayout(wrap.clientWidth, wrap.clientHeight)

    const syncLayout = () => {
      layout = getCoverLayout(wrap.clientWidth, wrap.clientHeight)
      gsap.set(screen, {
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
      })
      gsap.set(image, {
        transformOrigin: `${layout.originX}px ${layout.originY}px`,
      })
    }

    syncLayout()
    gsap.set(screen, { pointerEvents: 'none' })

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: '+=190%',
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: syncLayout,
            onUpdate: (self) => {
              screen.style.pointerEvents = self.progress > 0.88 ? 'auto' : 'none'
              wrap.classList.toggle('is-deep', self.progress > 0.72)
            },
            onLeave: () => {
              ScrollTrigger.refresh()
            },
          },
        })
        .fromTo(
          image,
          { scale: 1, opacity: 1 },
          {
            scale: () =>
              Math.max(
                wrap.clientWidth / layout.width,
                wrap.clientHeight / layout.height,
              ) * 1.03,
            ease: 'none',
            transformOrigin: () => `${layout.originX}px ${layout.originY}px`,
          },
          0,
        )
        .fromTo(
          screen,
          {
            left: () => layout.left,
            top: () => layout.top,
            width: () => layout.width,
            height: () => layout.height,
            borderRadius: 4,
          },
          {
            left: 0,
            top: 0,
            width: () => wrap.clientWidth,
            height: () => wrap.clientHeight,
            borderRadius: 0,
            ease: 'none',
          },
          0,
        )
        .to(veilRef.current, { opacity: 0.45, ease: 'none' }, 0)
        .to(hintRef.current, { opacity: 0, y: -16, ease: 'none' }, 0)
        .to(image, { opacity: 0, ease: 'power1.in' }, 0.62)
        .to(veilRef.current, { opacity: 0, ease: 'none' }, 0.7)
    }, wrap)

    const onResize = () => {
      syncLayout()
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', onResize)

    const refreshId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      window.cancelAnimationFrame(refreshId)
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [])

  return (
    <section className="laptop-intro" ref={wrapRef} aria-label="Enter Markcoders">
      <img
        ref={imageRef}
        className="laptop-intro__image"
        src="/laptop-hero.png?v=2"
        alt="Sunlit desk workspace"
        draggable={false}
      />

      <div className="laptop-intro__veil" ref={veilRef} aria-hidden="true" />

      <div className="laptop-intro__screen" ref={screenRef}>
        <div className="laptop-intro__screen-inner">
          <MenuGrid />
        </div>
      </div>

      <p className="laptop-intro__hint" ref={hintRef}>
        Scroll to enter
      </p>
    </section>
  )
}
