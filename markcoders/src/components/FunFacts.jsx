import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FunFacts.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  {
    value: 28,
    suffix: '+',
    label: 'Clients Across Countries',
  },
  {
    value: 300,
    suffix: '+',
    label: 'Websites Built',
  },
  {
    value: 983,
    suffix: '+',
    label: 'Designs Made',
  },
  {
    value: 74,
    suffix: '+',
    label: 'Applications Developed',
  },
]

export default function FunFacts() {
  const sectionRef = useRef(null)
  const numberRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const counters = stats.map(() => ({ value: 0 }))
    let played = false

    const setNumber = (index, value) => {
      const el = numberRefs.current[index]
      if (!el) return
      el.textContent = `${Math.round(value)}${stats[index].suffix}`
    }

    const play = () => {
      if (played) return
      played = true

      counters.forEach((counter, index) => {
        gsap.to(counter, {
          value: stats[index].value,
          duration: 2.8,
          delay: index * 0.15,
          ease: 'power1.out',
          onUpdate: () => setNumber(index, counter.value),
        })
      })
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: play,
        // If the section is already in view (or pin math is weird), still play
        onRefresh: (self) => {
          if (self.isActive || self.progress > 0) play()
        },
      })
    }, section)

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh()
    }, 120)

    return () => {
      window.clearTimeout(refreshId)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="fun-facts">
      <div className="fun-facts-container">
        <div className="fun-facts-heading">
          <h2>Fun Facts</h2>

          <p>
            Over the years, we have built, designed and developed digital
            experiences that we are proud of. And we&apos;re only getting
            started.
          </p>
        </div>

        <div className="fun-facts-grid">
          {stats.map((stat, index) => (
            <div className="fun-fact" key={stat.label}>
              <div
                ref={(el) => {
                  numberRefs.current[index] = el
                }}
                className="fun-fact-number"
              >
                0{stat.suffix}
              </div>

              <div className="fun-fact-line" />

              <div className="fun-fact-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
