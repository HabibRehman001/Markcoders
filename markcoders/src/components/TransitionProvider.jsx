import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageTransition from './PageTransition'
import { scrollToTop } from '../lib/smoothScroll'

const TransitionContext = createContext(null)

const ROUTE_META = {
  '/': { title: 'HOME', index: '03' },
  '/about': { title: 'ABOUT', index: '01' },
  '/services': { title: 'SERVICES', index: '02' },
  '/projects': { title: 'PROJECTS', index: '03' },
  '/contact': { title: 'CONTACT', index: '04' },
}

const getRouteMeta = (path) => ROUTE_META[path] || { title: 'MARKCODERS', index: '00' }

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const routeCallbackRef = useRef(null)
  const previousPathRef = useRef('/')

  const [transition, setTransition] = useState({
    active: false,
    title: '',
    index: '',
    rect: null,
  })

  useEffect(() => {
    return () => {
      previousPathRef.current = location.pathname
    }
  }, [location.pathname])

  const navigateWithTransition = useCallback(
    (title, to, options = {}) => {
      if (transition.active) return

      const path = typeof to === 'string' ? to : to?.pathname || '/'

      if (window.location.pathname === path) {
        return
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigate(path)
        scrollToTop({ immediate: true })
        return
      }

      routeCallbackRef.current = () => {
        navigate(path)
        scrollToTop({ immediate: true })
      }

      setTransition({
        active: true,
        title,
        index: options.index || '',
        rect: options.rect || null,
      })
    },
    [navigate, transition.active],
  )

  const goBackWithTransition = useCallback(
    (event) => {
      if (transition.active) return

      const idx = window.history.state?.idx
      const hasHistory = typeof idx === 'number' && idx > 0
      const target = hasHistory ? previousPathRef.current || '/' : '/'
      const meta = getRouteMeta(target)
      const rect = event?.currentTarget?.getBoundingClientRect()

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (hasHistory) navigate(-1)
        else navigate('/')
        scrollToTop({ immediate: true })
        return
      }

      routeCallbackRef.current = () => {
        if (hasHistory) navigate(-1)
        else navigate('/')
        scrollToTop({ immediate: true })
      }

      setTransition({
        active: true,
        title: meta.title,
        index: meta.index,
        rect: rect
          ? {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }
          : null,
      })
    },
    [navigate, transition.active],
  )

  const handleNavigate = useCallback(() => {
    routeCallbackRef.current?.()
    routeCallbackRef.current = null
  }, [])

  const handleComplete = useCallback(() => {
    setTransition({
      active: false,
      title: '',
      index: '',
      rect: null,
    })
  }, [])

  const value = useMemo(
    () => ({
      navigateWithTransition,
      goBackWithTransition,
      isTransitioning: transition.active,
    }),
    [navigateWithTransition, goBackWithTransition, transition.active],
  )

  return (
    <TransitionContext.Provider value={value}>
      {children}

      <PageTransition
        isActive={transition.active}
        title={transition.title}
        index={transition.index}
        rect={transition.rect}
        onNavigate={handleNavigate}
        onComplete={handleComplete}
      />
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(TransitionContext)

  if (!context) {
    throw new Error('usePageTransition must be used within TransitionProvider')
  }

  return context
}
