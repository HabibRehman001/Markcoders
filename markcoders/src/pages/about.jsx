import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { usePageTransition } from '../components/TransitionProvider'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const heroLines = [
  { text: 'WE SHIP', accent: false, shifted: false },
  { text: 'THE FEEL', accent: false, shifted: true },
  { text: 'OF A BRAND.', accent: false, shifted: false },
  { text: 'IN CODE.', accent: true, shifted: false },
]

const beliefLines = [
  { text: 'IF IT DOESN\'T LOAD FAST,', accent: false, shift: false },
  { text: 'IT ISN\'T DESIGN.', accent: true, shift: true },
  { text: 'IF MOTION HAS NO JOB,', accent: false, shift: false },
  { text: 'IT\'S DECORATION.', accent: true, shift: true },
  { text: 'THE SITE SHOULD FEEL', accent: false, shift: false },
  { text: 'LIKE THE PRODUCT.', accent: true, shift: false },
]

const dna = [
  {
    name: 'DESIGN',
    num: '01',
    desc: 'One composition per viewport. Black, white, #009cff. Type that carries the brand before any illustration does.',
  },
  {
    name: 'ENGINEERING',
    num: '02',
    desc: 'React 19, Vite, Three.js. Interfaces built as components you can ship — not a demo that dies in a CodePen.',
  },
  {
    name: 'MOTION',
    num: '03',
    desc: 'GSAP, ScrollTrigger, Lenis, shaders. Movement that explains hierarchy, not a loop that asks for applause.',
  },
]

const milestones = [
  {
    year: '2024',
    title: 'The itch',
    copy: 'Too many sites looked finished and felt dead. We started sketching interfaces that moved with intent.',
  },
  {
    year: '2025',
    title: 'First ships',
    copy: 'Client work left Karachi as real products: sites, apps, and motion systems — not slide decks.',
  },
  {
    year: '2026',
    title: 'Markcoders',
    copy: 'The studio got a name. This site is the proof: identity, WebGL, and scroll as one piece.',
  },
]

const works = [
  {
    src: '/projects/project1.jpg',
    title: 'Identity engine',
    tag: '3D / BRAND',
    note: 'The Markcoders mark as a live GLB — not a flat PNG in a nav.',
  },
  {
    src: '/projects/project2.jpg',
    title: 'Liquid chrome',
    tag: 'SHADER',
    note: 'A cursor-reactive foil field. Energy builds when you move, decays when you stop.',
  },
  {
    src: '/projects/project3.jpg',
    title: 'Cinematic scroll',
    tag: 'WEB',
    note: 'The corner showreel grows to 80vw on scroll. Same video. No second player.',
  },
  {
    src: '/projects/project4.jpg',
    title: 'Spatial menu',
    tag: 'INTERFACE',
    note: 'Navigation as a grid you enter, not a row of links you scan.',
  },
  {
    src: '/projects/project5.jpg',
    title: 'Type reveal',
    tag: 'MOTION',
    note: 'Outline Future / Tech in white. MARKCODERS/> in blue. Spotlight follows the mouse.',
  },
  {
    src: '/projects/project6.jpg',
    title: 'Motion stack',
    tag: 'GSAP × LENIS',
    note: 'Smooth scroll synced to ScrollTrigger. Pin only where it earns the height.',
  },
]

const techSlider = [
  { name: 'REACT', src: '/react.png' },
  { name: 'THREE.JS', src: '/tech/three.png' },
  { name: 'GSAP', src: '/tech/gsap.png' },
  { name: 'JAVASCRIPT', src: '/js.png' },
  { name: 'NODE', src: '/tech/node.png' },
  { name: 'DOCKER', src: '/dokcer.png' },
  { name: 'GIT', src: '/tech/git.png' },
  { name: 'PYTHON', src: '/python.png' },
  { name: 'VUE', src: '/vue.png' },
]

const About = () => {
  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const studioRef = useRef(null)
  const believeRef = useRef(null)
  const dnaRef = useRef(null)
  const workRef = useRef(null)
  const techRef = useRef(null)
  const storyRef = useRef(null)
  const closingRef = useRef(null)
  const { navigateWithTransition } = usePageTransition()

  useEffect(() => {
    const hoverAbort = new AbortController()
    const { signal } = hoverAbort

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const mm = gsap.matchMedia()

      if (reduce) {
        gsap.set('.about-believe__word', { opacity: 1, y: 0 })
        return
      }

      const heroShift = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      heroShift
        .to('.about-hero__line--shifted', {
          x: 80,
          ease: 'none',
        })
        .to(
          '.about-hero__line',
          {
            letterSpacing: '0.06em',
            ease: 'none',
          },
          0,
        )

      gsap.fromTo(
        '.about-studio__media',
        { yPercent: 6, scale: 1.06 },
        {
          yPercent: -6,
          scale: 1.06,
          scrollTrigger: {
            trigger: studioRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      gsap.from('.about-studio__copy > *', {
        scrollTrigger: {
          trigger: studioRef.current,
          start: 'top 70%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      })

      const words = believeRef.current?.querySelectorAll('.about-believe__word')
      if (words?.length) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: believeRef.current,
              start: 'top 80%',
              end: 'bottom 55%',
              scrub: true,
            },
          })
          .to(
            words,
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              stagger: 0.18,
            },
            0,
          )
      }

      gsap.from('.about-dna__panel', {
        scrollTrigger: {
          trigger: dnaRef.current,
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })

      mm.add('(min-width: 901px)', () => {
        const track = workRef.current?.querySelector('.about-work__track')
        if (!track) return undefined

        const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth)

        const tween = gsap.to(track, {
          x: () => -getAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: workRef.current,
            start: 'top top',
            end: () => `+=${Math.max(getAmount() * 1.15, window.innerHeight)}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            pinType: 'transform',
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 240)

        return () => {
          window.clearTimeout(refreshId)
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(track, { x: 0 })
        }
      })

      const marquee = gsap.fromTo(
        '.about-tech__marquee-track',
        { xPercent: 0 },
        {
          xPercent: -50,
          ease: 'none',
          repeat: -1,
          duration: 28,
        },
      )

      ScrollTrigger.create({
        trigger: techRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => marquee.play(),
        onEnterBack: () => marquee.play(),
        onLeave: () => marquee.pause(),
        onLeaveBack: () => marquee.pause(),
      })

      const marqueeEl = techRef.current?.querySelector('.about-tech__marquee')
      const pauseMarquee = () => marquee.pause()
      const playMarquee = () => marquee.play()
      marqueeEl?.addEventListener('mouseenter', pauseMarquee, { signal })
      marqueeEl?.addEventListener('mouseleave', playMarquee, { signal })
      marqueeEl?.addEventListener('focusin', pauseMarquee, { signal })
      marqueeEl?.addEventListener('focusout', playMarquee, { signal })

      gsap.from('.about-story__lead, .about-story__step', {
        scrollTrigger: {
          trigger: storyRef.current,  
          start: 'top 72%',
        },
        y: 36,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
      })

      gsap.from('.about-closing__inner > *', {
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

      mm.add('(max-width: 900px)', () => {
        ScrollTrigger.refresh()
      })
    }, rootRef)

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      window.clearTimeout(refreshId)
      hoverAbort.abort()
      ctx.revert()
    }
  }, [])

  const go = (title, path, index) => (event) => {
    event.preventDefault()
    navigateWithTransition(title, path, { index })
  }

  return (
    <div ref={rootRef} className="about">
      <Nav />

      <main>
        <section ref={heroRef} className="about-hero">
          <p className="about-hero__top">/ ABOUT · KARACHI</p>
          <div className="about-hero__content">
            {heroLines.map((line) => (
              <span
                key={line.text}
                className={`about-hero__line${line.shifted ? ' about-hero__line--shifted' : ''}${
                  line.accent ? ' about-hero__line--blue' : ''
                }`}
              >
                {line.text}
              </span>
            ))}
          </div>
        </section>

        <section ref={studioRef} className="about-studio">
          <div className="about-studio__inner">
            <div className="about-studio__media">
              <img src="/M-blue.png" alt="" />
              <p className="about-studio__place">Karachi · est. 2024</p>
            </div>

            <div className="about-studio__copy">
              <p className="about-studio__index">/ 01</p>
              <h2 className="about-studio__heading">
                <span className="about-studio__heading-line">WHAT</span>
                <span className="about-studio__heading-line">IS</span>
                <span className="about-studio__heading-line">
                  <span className="about-studio__heading-accent">MARKCODERS?</span>
                </span>
              </h2>
              <p className="about-studio__text">
                A digital studio in Karachi. We design and engineer websites as
                products — React, WebGL, and motion in one system — for brands
                that want the site to feel like the work, not a brochure of it.
              </p>
              <p className="about-studio__mix">DESIGN × CODE × MOTION</p>
            </div>
          </div>
        </section>

        <section ref={workRef} className="about-work">
          <div className="about-work__sticky">
            <div className="about-work__head">
              <p className="about-work__index">/ 02</p>
              <h2 className="about-work__title">
                SELECTED <span className="about-work__title-accent">CRAFT</span>
              </h2>
            </div>

            <div className="about-work__track">
              {works.map((work, index) => (
                <article key={work.title} className="about-work__card">
                  <div className="about-work__img">
                    <img
                      src={work.src}
                      alt={work.title}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                  <div className="about-work__meta">
                    <span className="about-work__tag">{work.tag}</span>
                    <h3 className="about-work__name">{work.title}</h3>
                  </div>
                  <p className="about-work__note">{work.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section ref={believeRef} className="about-believe">
          <div className="about-believe__inner">
            <p className="about-believe__eyebrow">/ 03 · WHAT WE BELIEVE</p>

            {beliefLines.map((line) => {
              const words = line.text.split(' ')

              return (
                <p
                  key={line.text}
                  className={`about-believe__line${line.shift ? ' about-believe__line--shifted' : ''}`}
                >
                  {words.map((word, wordIndex) => (
                    <span
                      key={`${line.text}-${wordIndex}`}
                      className={`about-believe__word${line.accent ? ' about-believe__word--accent' : ''}`}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              )
            })}
          </div>
        </section>

        <section ref={dnaRef} className="about-dna">
          <div className="about-dna__head">
            <p className="about-dna__index">/ 04</p>
            <h2 className="about-dna__title">
              OUR <span className="about-dna__title-accent">DNA</span>
            </h2>
          </div>

          <div className="about-dna__panels">
            {dna.map((item) => (
              <div key={item.num} className="about-dna__panel">
                <h3 className="about-dna__name">{item.name}</h3>
                <p className="about-dna__num">{item.num}</p>
                <p className="about-dna__desc">{item.desc}</p>
                <span className="about-dna__divider" />
              </div>
            ))}
          </div>
        </section>

        <section ref={techRef} className="about-tech">
          <div className="about-tech__inner">
            <div className="about-tech__head">
              <p className="about-tech__index">/ 05</p>
              <h2 className="about-tech__statement">
                WE USE THE STACK
                <br />
                WE ACTUALLY <span className="about-tech__statement-accent">SHIP.</span>
              </h2>
              <p className="about-tech__aside">
                React, Three, GSAP, Vite. No TypeScript in this repo. No Mongo on
                this site. Tools earn a place here by being in production.
              </p>
            </div>

            <div className="about-tech__marquee">
              <div className="about-tech__marquee-track">
                {[...techSlider, ...techSlider].map((tech, index) => (
                  <div key={`${tech.name}-${index}`} className="about-tech__marquee-item">
                    <img src={tech.src} alt="" loading="lazy" decoding="async" />
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section ref={storyRef} className="about-story">
          <div className="about-story__head">
            <p className="about-story__index">/ 06</p>
            <h2 className="about-story__title">
              HOW WE <span className="about-story__title-accent">STARTED</span>
            </h2>
          </div>

          <p className="about-story__lead">
            It started in Karachi with a simple refusal: a website should not
            feel like a PDF that happens to scroll. Markcoders is what we built
            instead.
          </p>

          <div className="about-story__timeline">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="about-story__step">
                <p className="about-story__year">{milestone.year}</p>
                <span className="about-story__dot" />
                <div className="about-story__body">
                  <p className="about-story__milestone">{milestone.title}</p>
                  <p className="about-story__copy">{milestone.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section ref={closingRef} className="about-closing">
          <div className="about-closing__inner">
            <p className="about-closing__so">SO</p>
            <h2 className="about-closing__question">
              WHO IS <span className="about-closing__question-accent">MARKCODERS?</span>
            </h2>
            <p className="about-closing__statement">
              A Karachi studio that builds{' '}
              <span className="about-closing__statement-accent">sites you can feel</span>
              {' '}— in the type, the motion, and the code underneath.
            </p>
            <button
              type="button"
              className="about-closing__cta"
              onClick={go('CONTACT', '/contact', '04')}
            >
              <span>Start a build</span>
              <span className="about-closing__cta-arrow">→</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
