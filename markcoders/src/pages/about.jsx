import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MLogo from '../components/MLogo';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const BELIEFS = [
  { lead: 'GOOD DESIGN', body: 'SHOULD FEEL SIMPLE.' },
  { lead: 'GOOD TECHNOLOGY', body: 'SHOULD FEEL NATURAL.' },
  { lead: 'GREAT EXPERIENCES', body: 'SHOULD BE REMEMBERED.' },
];

const DNA = [
  { n: '01', title: 'DESIGN', copy: 'We care about how things feel, not just how they look.' },
  { n: '02', title: 'CODE', copy: 'We build systems that stay fast, stable and easy to grow.' },
  { n: '03', title: 'MOTION', copy: 'We make interfaces feel alive instead of static.' },
];

const STEPS = [
  { n: '01', title: 'DISCOVER', copy: 'We start by understanding your business, your users and the problem worth solving.' },
  { n: '02', title: 'DESIGN', copy: 'We shape the idea into an experience — structure, interface, tone.' },
  { n: '03', title: 'DEVELOP', copy: 'We build it properly: clean code, fast performance, built to last.' },
  { n: '04', title: 'DEPLOY', copy: 'We ship it, watch how it performs in the real world, and keep improving it.' },
];

const STACK = ['REACT', 'THREE.JS', 'GSAP', 'VITE'];

function Hero() {
  return (
    <section className="mc-about__hero">
      <span className="mc-eyebrow">/ ABOUT</span>
      <h1 className="mc-about__hero-heading">
        <span className="mc-about__hero-line" data-hero-line>
          WE DON'T JUST BUILD
        </span>
        <span className="mc-about__hero-line" data-hero-line>
          WEBSITES.
        </span>
        <span className="mc-about__hero-line" data-hero-line>
          WE BUILD <em>EXPERIENCES.</em>
        </span>
      </h1>
      <span className="mc-about__scroll-cue" aria-hidden="true">
        SCROLL
      </span>
    </section>
  );
}

function Intro() {
  return (
    <section className="mc-about__intro">
      <div className="mc-about__intro-copy" data-reveal>
        <span className="mc-eyebrow">/ 01</span>
        <h2>
          WHAT IS
          <br />
          MARKCODERS?
        </h2>
        <p>
          We're a digital studio that builds modern experiences for brands,
          businesses and products — from the first idea to the code that
          ships it.
        </p>
        <span className="mc-about__tagline">
          DESIGN × DEVELOPMENT × TECHNOLOGY
        </span>
      </div>
      <div className="mc-about__mark" data-reveal data-mark-spin>
        <MLogo />
      </div>
    </section>
  );
}

function Believe() {
  return (
    <section className="mc-about__believe">
      <span className="mc-eyebrow" data-reveal>
        / 02 · WE BELIEVE
      </span>
      <div className="mc-about__believe-lines">
        {BELIEFS.map((b) => (
          <p className="mc-about__believe-line" data-belief-line key={b.lead}>
            <span>{b.lead}</span>
            <br />
            <em>{b.body}</em>
          </p>
        ))}
      </div>
    </section>
  );
}

function Dna() {
  return (
    <section className="mc-about__dna">
      <div className="mc-about__dna-head" data-reveal>
        <span className="mc-eyebrow">/ 03</span>
        <h2>OUR DNA</h2>
        <span className="mc-about__tagline">DESIGN × CODE × MOTION</span>
      </div>
      <div className="mc-about__dna-panels">
        {DNA.map((d) => (
          <div className="mc-about__dna-panel" data-reveal key={d.n}>
            <span className="mc-about__dna-n">{d.n}</span>
            <h3>{d.title}</h3>
            <p>{d.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowWeWork() {
  return (
    <section className="mc-about__how">
      <div className="mc-about__how-head" data-reveal>
        <span className="mc-eyebrow">/ 04</span>
        <h2>HOW WE WORK</h2>
      </div>
      <div className="mc-about__how-viewport">
        <div className="mc-about__how-track" data-hww-track>
          {STEPS.map((s) => (
            <div className="mc-about__how-step" data-hww-step key={s.n}>
              <span className="mc-about__how-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
              <span className="mc-about__how-bar" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechOrbit() {
  return (
    <section className="mc-about__tech">
      <div className="mc-about__tech-head" data-reveal>
        <span className="mc-eyebrow">/ 05</span>
        <h2>
          WE USE TECHNOLOGY
          <br />
          AS A TOOL. <em>NOT A SHOWCASE.</em>
        </h2>
        <p>The tools change. The craft doesn't.</p>
      </div>
      <div className="mc-about__orbit" data-orbit data-reveal>
        <span className="mc-about__orbit-core" data-orbit-core aria-hidden="true">
          M
        </span>
        {STACK.map((t) => (
          <span className="mc-about__orbit-item" data-orbit-item key={t}>
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="mc-about__closing">
      <span className="mc-eyebrow" data-reveal>
        / SO, WHO IS MARKCODERS?
      </span>
      <h2 className="mc-about__closing-heading" data-reveal>
        WE ARE A TEAM THAT BUILDS DIGITAL EXPERIENCES PEOPLE{' '}
        <em>REMEMBER.</em>
      </h2>
      <p data-reveal>
        Have an idea, a product, or a business that needs a digital
        experience? Let's turn it into something people remember.
      </p>
      <Link to="/contact" className="mc-about__cta-btn" data-reveal>
        LET'S BUILD SOMETHING
        <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}

export default function About() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    let mm;

    const ctx = gsap.context(() => {
      mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 900px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (state) => {
          const { isDesktop, reduceMotion } = state.conditions;
          const cleanups = [];

          // Top progress bar — direct feedback tied to the user's own
          // scroll position, so it stays on even under reduced motion.
          const progressFill = document.querySelector('[data-progress-fill]');
          if (progressFill && rootRef.current) {
            gsap.set(progressFill, { scaleX: 0 });
            const progressST = ScrollTrigger.create({
              trigger: rootRef.current,
              start: 'top top',
              end: 'bottom bottom',
              onUpdate: (self) => gsap.set(progressFill, { scaleX: self.progress }),
            });
            cleanups.push(() => progressST.kill());
          }

          if (reduceMotion) {
            gsap.set('[data-reveal], [data-belief-line], [data-hero-line]', {
              opacity: 1,
              x: 0,
              y: 0,
            });
            return () => cleanups.forEach((fn) => fn());
          }

          // Hero — lines drift apart/together as you scroll through it
          gsap.utils.toArray('[data-hero-line]').forEach((line, i) => {
            gsap.to(line, {
              xPercent: i % 2 === 0 ? -5 : 5,
              ease: 'none',
              scrollTrigger: {
                trigger: '.mc-about__hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6,
              },
            });
          });

          // Fade + rise reveal for anything tagged data-reveal
          gsap.utils.toArray('[data-reveal]').forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 36 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' },
              }
            );
          });

          // What We Believe — pinned, lines light up one by one
          const beliefLines = gsap.utils.toArray('[data-belief-line]');
          if (beliefLines.length) {
            gsap.set(beliefLines, { opacity: 0.15 });
            const believeTl = gsap.timeline({
              scrollTrigger: {
                trigger: '.mc-about__believe',
                start: 'top top',
                end: '+=120%',
                scrub: 0.6,
                pin: true,
              },
            });
            beliefLines.forEach((line) => {
              believeTl.to(line, { opacity: 1, duration: 1 }, '+=0.2');
            });
          }

          // 3D M mark — soft sway + scroll-linked tilt on the stage wrapper
          gsap.to('[data-mark-spin]', {
            rotateY: 12,
            duration: 5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
          gsap.to('[data-mark-spin]', {
            rotateZ: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: '.mc-about__intro',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          });

          // How We Work — pinned horizontal scroll on desktop,
          // a simple stacked reveal on mobile (no scroll-jacking there)
          const track = document.querySelector('[data-hww-track]');
          const steps = gsap.utils.toArray('[data-hww-step]');

          if (isDesktop && track && steps.length) {
            gsap.to(track, {
              xPercent: -100 * (steps.length - 1),
              ease: 'none',
              scrollTrigger: {
                trigger: '.mc-about__how',
                start: 'top top',
                end: () => '+=' + track.scrollWidth,
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                  const active = Math.round(self.progress * (steps.length - 1));
                  steps.forEach((step, i) =>
                    step.classList.toggle('is-active', i <= active)
                  );
                },
              },
            });
          } else {
            steps.forEach((step) => {
              gsap.fromTo(
                step,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: 'power3.out',
                  scrollTrigger: { trigger: step, start: 'top 88%' },
                }
              );
            });
          }

          // Tech orbit — a little pop on the core mark, plus items and
          // an ambient glow that drift toward the cursor via gsap.quickTo
          // (quickTo is built for exactly this: cheap, repeated updates)
          gsap.from('[data-orbit-core]', {
            scale: 0.4,
            duration: 0.8,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: '.mc-about__orbit', start: 'top 80%' },
          });

          const orbit = document.querySelector('[data-orbit]');
          if (orbit) {
            const items = gsap.utils.toArray('[data-orbit-item]');
            const xTos = items.map((item) =>
              gsap.quickTo(item, 'x', { duration: 0.6, ease: 'power2.out' })
            );
            const yTos = items.map((item) =>
              gsap.quickTo(item, 'y', { duration: 0.6, ease: 'power2.out' })
            );

            const onOrbitMove = (e) => {
              const rect = orbit.getBoundingClientRect();
              const mx = (e.clientX - rect.left) / rect.width - 0.5;
              const my = (e.clientY - rect.top) / rect.height - 0.5;
              items.forEach((_, i) => {
                xTos[i](mx * (16 + i * 4));
                yTos[i](my * (16 + i * 4));
              });
            };
            const onOrbitLeave = () => {
              items.forEach((_, i) => {
                xTos[i](0);
                yTos[i](0);
              });
            };

            orbit.addEventListener('mousemove', onOrbitMove);
            orbit.addEventListener('mouseleave', onOrbitLeave);
            cleanups.push(() => {
              orbit.removeEventListener('mousemove', onOrbitMove);
              orbit.removeEventListener('mouseleave', onOrbitLeave);
            });
          }

          // Ambient cursor glow across the page (desktop / fine pointer
          // only — purely decorative, so it's skipped under reduced motion too)
          const glow = document.querySelector('[data-cursor-glow]');
          if (glow && isDesktop && rootRef.current) {
            const glowX = gsap.quickTo(glow, 'x', { duration: 0.7, ease: 'power3' });
            const glowY = gsap.quickTo(glow, 'y', { duration: 0.7, ease: 'power3' });
            const onGlowMove = (e) => {
              glowX(e.clientX);
              glowY(e.clientY);
            };
            rootRef.current.addEventListener('mousemove', onGlowMove);
            cleanups.push(() =>
              rootRef.current?.removeEventListener('mousemove', onGlowMove)
            );
          }

          return () => cleanups.forEach((fn) => fn());
        }
      );

      if (document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, rootRef);

    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div className="mc-about" ref={rootRef}>
      <div className="mc-about__progress" aria-hidden="true">
        <span className="mc-about__progress-fill" data-progress-fill />
      </div>
      <div className="mc-about__cursor-glow" data-cursor-glow aria-hidden="true" />
      <Hero />
      <Intro />
      <Believe />
      <Dna />
      <HowWeWork />
      <TechOrbit />
      <ClosingCTA />
    </div>
  );
}