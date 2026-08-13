import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageTransition } from './TransitionProvider'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef(null)
  const { navigateWithTransition } = usePageTransition()

  useEffect(() => {
    const footer = footerRef.current

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 75%',
          once: true,
        },
      })

      tl.from('.footer-eyebrow', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        .from(
          '.footer-title-line',
          {
            y: 70,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.3',
        )
        .from(
          '.footer-description',
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.35',
        )
        .from(
          '.footer-cta',
          {
            y: 25,
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: 'back.out(1.5)',
          },
          '-=0.3',
        )
        .from(
          '.footer-main',
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.2',
        )
        .from(
          '.footer-bottom',
          {
            opacity: 0,
            duration: 0.6,
          },
          '-=0.3',
        )
    }, footer)

    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const go = (title, path, index) => (event) => {
    event.preventDefault()
    navigateWithTransition(title, path, { index })
  }

  return (
    <footer ref={footerRef} className="footer">
      <section className="footer-cta-section">
        <div className="footer-eyebrow">/ HAVE A PROJECT IN MIND?</div>

        <h2 className="footer-title">
          <span className="footer-title-line">LET&apos;S BUILD</span>
          <span className="footer-title-line">SOMETHING</span>
          <span className="footer-title-line footer-title-blue">GREAT.</span>
        </h2>

        <p className="footer-description">
          Have an idea, a product, or a business that needs a digital
          experience? Let&apos;s turn it into something people remember.
        </p>

        <a href="mailto:info@markcoders.com" className="footer-cta">
          <span>START A PROJECT</span>
          <span className="footer-cta-arrow">↗</span>
        </a>
      </section>

      <section className="footer-main">
        <div className="footer-brand-column">
          <div className="footer-logo">
            <img src="./logo.png" alt="Markcoders" />
            <span>
              MARKCODERS
              <strong>/&gt;</strong>
            </span>
          </div>

          <p>
            A digital studio building modern websites, applications and
            immersive experiences.
          </p>

          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>EXPLORE</h3>
          <nav className="footer-links">
            <a href="/" onClick={go('HOME', '/', '03')}>
              Home
            </a>
            <a href="/about" onClick={go('ABOUT', '/about', '01')}>
              About
            </a>
            <a href="/services" onClick={go('SERVICES', '/services', '02')}>
              Services
            </a>
            <a href="/contact" onClick={go('CONTACT', '/contact', '04')}>
              Contact
            </a>
          </nav>
        </div>

        <div className="footer-column">
          <h3>GET IN TOUCH</h3>

          <div className="footer-contact">
            <a href="tel:+923341218085">+92 334 1218085</a>
            <a href="mailto:info@markcoders.com">info@markcoders.com</a>
            <span>Karachi, Pakistan</span>
          </div>

          <a href="mailto:info@markcoders.com" className="footer-message">
            <span>SEND A MESSAGE</span>
            <span>↗</span>
          </a>
        </div>
      </section>

      <section className="footer-bottom">
        <span>© 2026 Markcoders. All rights reserved.</span>

        <button type="button" onClick={scrollToTop}>
          BACK TO TOP
          <span>↑</span>
        </button>
      </section>
    </footer>
  )
}
