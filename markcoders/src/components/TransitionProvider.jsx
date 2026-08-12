import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from './PageTransition'

const TransitionContext = createContext(null)

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const routeCallbackRef = useRef(null)

  const [transition, setTransition] = useState({
    active: false,
    title: '',
    index: '',
    rect: null,
  })

  const navigateWithTransition = useCallback(
    (title, to, options = {}) => {
      if (transition.active) return

      const path = typeof to === 'string' ? to : to?.pathname || '/'

      if (window.location.pathname === path) {
        return
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigate(path)
        return
      }

      routeCallbackRef.current = () => {
        navigate(path)
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
      isTransitioning: transition.active,
    }),
    [navigateWithTransition, transition.active],
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
