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
      aria-label="Future and Tech Markcoders"
    >
      <div className="markcoders-stack" aria-hidden="true">
        <div className="markcoders-hero-copy">
          <span className="markcoders-line markcoders-line--future">Future</span>
          <span className="markcoders-line markcoders-line--amp">&amp;</span>
          <span className="markcoders-line markcoders-line--tech">Tech</span>
        </div>
        <div className="markcoders-brand">MARKCODERS/&gt;</div>
      </div>

      <div className="markcoders-reveal markcoders-reveal--white" aria-hidden="true">
        <div className="markcoders-stack">
          <div className="markcoders-hero-copy">
            <span className="markcoders-line markcoders-line--future markcoders-fill--white">
              Future
            </span>
            <span className="markcoders-line markcoders-line--amp markcoders-fill--white">
              &amp;
            </span>
            <span className="markcoders-line markcoders-line--tech markcoders-fill--white">
              Tech
            </span>
          </div>
          <div className="markcoders-brand markcoders-brand--ghost">MARKCODERS/&gt;</div>
        </div>
      </div>

      <div className="markcoders-reveal markcoders-reveal--blue" aria-hidden="true">
        <div className="markcoders-stack">
          <div className="markcoders-hero-copy markcoders-hero-copy--ghost">
            <span className="markcoders-line markcoders-line--future">Future</span>
            <span className="markcoders-line markcoders-line--amp">&amp;</span>
            <span className="markcoders-line markcoders-line--tech">Tech</span>
          </div>
          <div className="markcoders-brand markcoders-fill--blue">MARKCODERS/&gt;</div>
        </div>
      </div>
    </section>
  )
}
