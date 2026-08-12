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
  const titleRef = useRef(null)
  const numberRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const counters = stats.map(() => ({ value: 0 }))

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: title,
          start: 'top 55%',
          end: 'bottom 20%',
          once: true,
        },
      })

      counters.forEach((counter, index) => {
        tl.to(
          counter,
          {
            value: stats[index].value,
            duration: 5.5,
            ease: 'power1.out',
            onUpdate: () => {
              if (!numberRefs.current[index]) return

              numberRefs.current[index].textContent =
                `${Math.round(counter.value)}${stats[index].suffix}`
            },
          },
          index * 0.25,
        )
      })
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="fun-facts">
      <div className="fun-facts-container">
        <div className="fun-facts-heading">
          <h2 ref={titleRef}>Fun Facts</h2>

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
