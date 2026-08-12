import { useRef } from 'react'
import './MarkcodersText.css'

export default function MarkcodersText() {
  const textRef = useRef(null)

  const handleMouseMove = (e) => {
    const el = textRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    el.style.setProperty('--mouse-x', `${x}px`)
    el.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleMouseLeave = () => {
    const el = textRef.current
    if (!el) return

    el.style.setProperty('--mouse-x', '-9999px')
    el.style.setProperty('--mouse-y', '-9999px')
  }

  return (
    <section
      ref={textRef}
      className="markcoders-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Markcoders"
    >
      <div className="markcoders-text markcoders-outline" aria-hidden="true">
        MARKCODERS
      </div>

      <div className="markcoders-reveal" aria-hidden="true">
        <div className="markcoders-text markcoders-blue">MARKCODERS</div>
      </div>
    </section>
  )
}
