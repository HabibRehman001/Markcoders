import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { usePageTransition } from '../components/TransitionProvider'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    num: '01',
    name: 'WEB DESIGN',
    tag: 'UI / UX / BRAND',
    desc: 'Interfaces engineered around one composition per viewport. Black, white, #009cff. Type that carries the brand before any illustration does.',
    tools: ['Figma', 'Design Systems', 'Prototyping'],
  },
  {
    num: '02',
    name: 'DEVELOPMENT',
    tag: 'REACT / FRONTEND',
    desc: 'React 19, Vite, and component systems you can ship. Fast by default, built as products — not demos that die in a CodePen.',
    tools: ['React', 'Vite', 'TypeScript'],
  },
  {
    num: '03',
    name: 'WEBGL & 3D',
    tag: 'THREE.JS / SHADERS',
    desc: 'Liquid chrome, spatial menus, and cinematic scenes. Three.js and shaders that make the brand physical without tanking the frame rate.',
    tools: ['Three.js', 'GLSL', 'Blender'],
  },
  {
    num: '04',
    name: 'MOTION',
    tag: 'GSAP / SCROLL',
    desc: 'GSAP, ScrollTrigger, Lenis. Movement that explains hierarchy, not a loop that asks for applause.',
    tools: ['GSAP', 'Lenis', 'ScrollTrigger'],
  },
]

const process = [
  { num: '01', title: 'DISCOVER', desc: 'We map the brand, the audience, and the job the site has to do.' },
  { num: '02', title: 'DESIGN', desc: 'Composition, type, and motion systems designed in the browser.' },
  { num: '03', title: 'DEVELOP', desc: 'React, Three, GSAP — built as components, shipped as a product.' },
  { num: '04', title: 'LAUNCH', desc: 'Performance, accessibility, and the little details that make it feel alive.' },
]

const Services = () => {
  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const listRef = useRef(null)
  const processRef = useRef(null)
  const closingRef = useRef(null)
  const { navigateWithTransition } = usePageTransition()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      gsap.from('.services-hero__line', {
        y: 80,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
      })

      gsap.from('.services-list__row', {
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 75%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      })

      gsap.from('.services-process__step', {
        scrollTrigger: {
          trigger: processRef.current,
          start: 'top 70%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      })

      gsap.from('.services-closing__inner > *', {
        scrollTrigger: {
          trigger: closingRef.current,
          start: 'top 75%',
        },
        y: 36,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const go = (title, path, index) => (event) => {
    event.preventDefault()
    navigateWithTransition(title, path, { index })
  }

  return (
    <div ref={rootRef} className="services">
      <Nav />

      <main>
        <section ref={heroRef} className="services-hero">
          <p className="services-hero__top">/ SERVICES · WHAT WE DO</p>
          <div className="services-hero__content">
            <h1 className="services-hero__line">WE BUILD</h1>
            <h1 className="services-hero__line services-hero__line--shifted">
              EXPERIENCES
            </h1>
            <h1 className="services-hero__line services-hero__line--blue">
              THAT MOVE.
            </h1>
          </div>
        </section>

        <section ref={listRef} className="services-list">
          <div className="services-list__head">
            <p className="services-list__index">/ 01</p>
            <h2 className="services-list__title">
              WHAT WE <span className="services-list__title-accent">SHIP</span>
            </h2>
          </div>

          <div className="services-list__rows">
            {services.map((service) => (
              <article key={service.num} className="services-list__row">
                <div className="services-list__row-top">
                  <span className="services-list__num">{service.num}</span>
                  <h3 className="services-list__name">{service.name}</h3>
                  <span className="services-list__tag">{service.tag}</span>
                </div>
                <p className="services-list__desc">{service.desc}</p>
                <div className="services-list__tools">
                  {service.tools.map((tool) => (
                    <span key={tool} className="services-list__tool">
                      {tool}
                    </span>
                  ))}
                </div>
                <span className="services-list__divider" />
              </article>
            ))}
          </div>
        </section>

        <section ref={processRef} className="services-process">
          <div className="services-process__inner">
            <div className="services-process__head">
              <p className="services-process__index">/ 02</p>
              <h2 className="services-process__title">
                HOW WE <span className="services-process__title-accent">WORK</span>
              </h2>
            </div>

            <div className="services-process__steps">
              {process.map((step) => (
                <div key={step.num} className="services-process__step">
                  <p className="services-process__num">{step.num}</p>
                  <h3 className="services-process__name">{step.title}</h3>
                  <p className="services-process__desc">{step.desc}</p>
                  <span className="services-process__divider" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={closingRef} className="services-closing">
          <div className="services-closing__inner">
            <p className="services-closing__so">READY WHEN YOU ARE</p>
            <h2 className="services-closing__question">
              HAVE A PROJECT <span className="services-closing__question-accent">IN MIND?</span>
            </h2>
            <p className="services-closing__statement">
              Tell us what you&apos;re building and we&apos;ll help you{' '}
              <span className="services-closing__statement-accent">ship it with intent.</span>
            </p>
            <button
              type="button"
              className="services-closing__cta"
              onClick={go('CONTACT', '/contact', '04')}
            >
              <span>Start a build</span>
              <span className="services-closing__cta-arrow">→</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Services
