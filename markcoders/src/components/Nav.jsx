import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { usePageTransition } from './TransitionProvider'
import BackButton from './BackButton'
import { rafThrottle } from '../lib/schedule'
import './Nav.css'

const NavLogo3D = lazy(() => import('./NavLogo3D'))

const rand = (min, max) => Math.random() * (max - min) + min

const playNavBurst = (originX, originY) => {
  const ring = document.createElement('div')
  ring.className = 'shockwave'
  ring.style.left = `${originX}px`
  ring.style.top = `${originY}px`
  document.body.appendChild(ring)

  gsap.fromTo(
    ring,
    {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0.8,
    },
    {
      scale: 3,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      onComplete: () => ring.remove(),
    },
  )

  const count = Math.floor(rand(10, 21))

  for (let i = 0; i < count; i += 1) {
    const size = Math.round(rand(22, 44))
    const m = document.createElement('img')
    m.className = 'nav-burst-m'
    m.src = '/logo.png'
    m.alt = ''
    m.width = size
    m.height = size
    m.draggable = false
    m.style.left = `${originX}px`
    m.style.top = `${originY}px`
    m.style.width = `${size}px`
    m.style.height = `${size}px`
    document.body.appendChild(m)

    const angle = rand(0, Math.PI * 2)
    const distance = rand(80, 260)
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    const rotation = rand(-540, 540)
    const duration = rand(0.55, 1.05)

    gsap.fromTo(
      m,
      {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        rotation: 0,
        scale: rand(0.7, 1.15),
        opacity: 1,
      },
      {
        x,
        y,
        rotation,
        scale: rand(0.35, 0.85),
        opacity: 0,
        duration,
        ease: 'power2.out',
        onComplete: () => m.remove(),
      },
    )
  }
}

const LIGHT_BACK_PATHS = new Set(['/projects', '/contact'])

const Nav = () => {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const location = useLocation()
  const { navigateWithTransition } = usePageTransition()
  const backTone = LIGHT_BACK_PATHS.has(location.pathname) ? 'light' : 'dark'

  useEffect(() => {
    const onScroll = rafThrottle(() => {
      const y = window.scrollY || document.documentElement.scrollTop
      const delta = y - lastY.current

      if (y <= 16) {
        setHidden(false)
      } else if (delta > 6) {
        setHidden(true)
      } else if (delta < -6) {
        setHidden(false)
      }

      lastY.current = y
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      onScroll.cancel()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleBrandClick = (event) => {
    event.preventDefault()

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playNavBurst(event.clientX, event.clientY)
    }

    if (location.pathname !== '/') {
      window.setTimeout(() => {
        navigateWithTransition('HOME', '/', { index: '03' })
      }, 180)
    }
  }

  return (
    <header className={`nav${hidden ? ' nav--hidden' : ''}`}>
      <div
        className="nav__brand"
        role="link"
        tabIndex={0}
        aria-label="Markcoders home"
        onClick={handleBrandClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleBrandClick(event)
          }
        }}
      >
        <Suspense
          fallback={
            <img
              className="nav__logo nav__logo-fallback"
              src="/logo.png"
              alt=""
              width={68}
              height={68}
              decoding="async"
            />
          }
        >
          <NavLogo3D />
        </Suspense>
      </div>

      {location.pathname !== '/' && location.pathname !== '/projects' && (
        <BackButton className="back-btn--floating" tone={backTone} />
      )}
    </header>
  )
}

export default Nav
