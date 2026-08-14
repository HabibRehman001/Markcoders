import { ArrowLeft } from 'lucide-react'
import { usePageTransition } from './TransitionProvider'
import './BackButton.css'

/**
 * History-aware back control — same white page transition as MenuGrid.
 */
export default function BackButton({ className = '', tone = 'dark' }) {
  const { goBackWithTransition, isTransitioning } = usePageTransition()

  return (
    <button
      type="button"
      className={`back-btn back-btn--${tone}${className ? ` ${className}` : ''}`}
      onClick={goBackWithTransition}
      disabled={isTransitioning}
      aria-label="Go back to previous page"
    >
      <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
      <span>Back</span>
    </button>
  )
}
