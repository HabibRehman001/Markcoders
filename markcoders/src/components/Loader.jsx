import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Loader.css'

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const logoRef = useRef(null)
  const fillRef = useRef(null)
  const fillMRef = useRef(null)
  const glowRef = useRef(null)
  const percentRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const loader = loaderRef.current
    const logo = logoRef.current
    const fill = fillRef.current
    const fillM = fillMRef.current
    const glow = glowRef.current
    const percent = percentRef.current

    gsap.set(fill, { height: '0%' })
    gsap.set(fillM, { y: 0 })
    gsap.set(logo, { scale: 1, rotation: 0, opacity: 0 })
    gsap.set(glow, { opacity: 0, scale: 0.8 })

    const progress = { value: 0 }
    const tl = gsap.timeline()

    tl.to(logo, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    })

    tl.to(
      glow,
      {
        opacity: 0.7,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.3',
    )

    tl.to(progress, {
      value: 100,
      duration: 3.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        const value = Math.round(progress.value)
        percent.textContent = `${value}%`
        gsap.set(fill, { height: `${value}%` })
      },
    })

    tl.to({}, { duration: 0.25 })

    tl.to(logo, {
      scale: 1.08,
      duration: 0.18,
      ease: 'power2.out',
    })

    tl.to(logo, {
      scale: 1,
      duration: 0.25,
      ease: 'power2.inOut',
    })

    tl.to(
      glow,
      {
        opacity: 1,
        scale: 1.3,
        duration: 0.35,
        ease: 'power2.out',
      },
      '-=0.25',
    )

    tl.to(logo, {
      scale: 28,
      rotation: 1.5,
      duration: 1.45,
      ease: 'expo.in',
    })

    tl.to(
      loader,
      {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          onCompleteRef.current?.()
        },
      },
      '-=0.35',
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={loaderRef} className="loader">
      <div ref={glowRef} className="loader-glow" />

      <div ref={logoRef} className="loader-logo">
        <img src="/M.png" alt="" className="loader-m loader-m-white" />

        <div ref={fillRef} className="loader-fill">
          <img
            ref={fillMRef}
            src="/M-blue.png"
            alt=""
            className="loader-m loader-m-blue"
          />
        </div>
      </div>

      <div ref={percentRef} className="loader-percent">
        0%
      </div>

    </div>
  )
}
