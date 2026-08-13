import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { signalHeroIntro } from '../lib/heroIntro'
import './MLoader.css'

// Traced from the supplied M logo. Two chevrons + two legs + two base
// triangles, combined into one compound path (nonzero fill-rule).
const M_PATH = `M154,0 L79,42 L79,90 L154,47 Z
                 M0,0 L0,47 L75,90 L75,43 Z
                 M154,57 L115,80 L115,156 L154,134 Z
                 M0,57 L0,134 L39,156 L39,80 Z
                 M153,145 L98,176 L153,176 Z
                 M1,144 L1,176 L56,176 Z`;
 
const BOTTOM_Y = 190; // water line at progress = 0 (fully hidden below shape)
const TOP_Y = -18;    // water line at progress = 1 (fully above shape)
const X_START = -40;
const X_END = 200;
const STEP = 6;
const FLOOR_Y = 240;
 
function buildWaveD(levelY, amplitude, phase) {
  let d = `M ${X_START} ${FLOOR_Y} L ${X_START} ${levelY}`;
  for (let x = X_START; x <= X_END; x += STEP) {
    const y = levelY + amplitude * Math.sin(x / 26 + phase);
    d += ` L ${x.toFixed(1)} ${y.toFixed(2)}`;
  }
  d += ` L ${X_END} ${FLOOR_Y} Z`;
  return d;
}
 
/**
 * MLoader — fills the M logo like a jug of water while `progress`
 * (or the internal auto-play timeline) goes from 0 to 1.
 *
 * Usage:
 *   <MLoader duration={3} onComplete={() => console.log('done')} />
 *
 * Or drive it yourself with real progress (e.g. an upload):
 *   <MLoader progress={uploadProgress} auto={false} />
 */
export default function MLoader({
  duration = 3,
  auto = true,
  progress: controlledProgress = null,
  loop = false,
  onComplete,
}) {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const waveRef = useRef(null);
  const levelRectRef = useRef(null);
  const bubbleRefs = useRef([]);
  const state = useRef({ progress: 0, phase: 0, amplitude: 3.2 });
  const finishedRef = useRef(false);
 
  const [pct, setPct] = useState(0);
  const [complete, setComplete] = useState(false);
 
  const render = () => {
    const s = state.current;
    const levelY = BOTTOM_Y - s.progress * (BOTTOM_Y - TOP_Y);
    if (waveRef.current) {
      waveRef.current.setAttribute("d", buildWaveD(levelY, s.amplitude, s.phase));
    }
    if (levelRectRef.current) {
      levelRectRef.current.setAttribute("y", levelY - 2);
    }
    setPct(Math.round(s.progress * 100));
  };
 
  // continuous wave + bubbles (always running)
  useEffect(() => {
    const waveTween = gsap.to(state.current, {
      phase: Math.PI * 2,
      duration: 1.4,
      repeat: -1,
      ease: "none",
      onUpdate: render,
    });
 
    const bubbleTweens = bubbleRefs.current.filter(Boolean).map((el, i) =>
      gsap.fromTo(
        el,
        { attr: { cy: 195 }, opacity: 0 },
        {
          attr: { cy: -30 },
          opacity: 0,
          keyframes: [{ opacity: 0.85, duration: 0.01 }],
          duration: 2.4 + i * 0.35,
          repeat: -1,
          delay: i * 0.5,
          ease: "power1.out",
        }
      )
    );
 
    return () => {
      waveTween.kill();
      bubbleTweens.forEach((t) => t.kill());
    };
  }, []);
 
  const runCompletionFx = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    gsap.to(state.current, {
      amplitude: 0.4,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: render,
    });
    setComplete(true);

    // Kick hero camera intro while loader still covers the page
    signalHeroIntro();

    const stage = stageRef.current;
    const wrap = wrapRef.current;
    const readout = stage?.querySelector('.m-loader-readout');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        onComplete?.();
      },
    });

    if (wrap) {
      tl.to(wrap, { scale: 1.07, duration: 0.22, ease: 'power2.out' }).to(wrap, {
        scale: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      });
    }

    tl.to(
      [wrap, readout].filter(Boolean),
      {
        opacity: 0,
        y: -18,
        duration: 0.55,
        stagger: 0.04,
        ease: 'power2.in',
      },
      '-=0.05',
    );

    if (stage) {
      tl.set(stage, { pointerEvents: 'none' }, '-=0.55')
      tl.to(
        stage,
        {
          opacity: 0,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        '-=0.25',
      );
    }
  };
 
  // auto-play mode: fills 0 -> 1 on mount (and loops if requested)
  useEffect(() => {
    if (!auto) return;
 
    const play = () => {
      setComplete(false);
      state.current.progress = 0;
      state.current.amplitude = 3.2;
      render();
 
      gsap.to(state.current, {
        progress: 1,
        duration,
        ease: "power1.inOut",
        onUpdate: render,
        onComplete: () => {
          runCompletionFx();
          if (loop) setTimeout(play, 900);
        },
      });
    };
 
    play();
  }, [auto, duration, loop]);
 
  // controlled mode: driven by an external `progress` prop (0..1)
  useEffect(() => {
    if (auto || controlledProgress === null) return;
    const clamped = Math.max(0, Math.min(1, controlledProgress));
 
    gsap.to(state.current, {
      progress: clamped,
      duration: 0.4,
      ease: "power1.out",
      onUpdate: render,
      onComplete: () => {
        if (clamped >= 1) runCompletionFx();
      },
    });
  }, [controlledProgress, auto]);
 
  return (
    <div className="m-loader-stage" ref={stageRef}>
      <div className={`m-loader ${complete ? "is-complete" : ""}`} ref={wrapRef}>
        <svg viewBox="-14 -14 182 204" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="mClip">
              <path d={M_PATH} />
            </clipPath>
            <clipPath id="levelClip">
              <rect ref={levelRectRef} x="-40" y="176" width="240" height="260" />
            </clipPath>
            <linearGradient id="waterGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="var(--water-dark)" />
              <stop offset="55%" stopColor="var(--water)" />
              <stop offset="100%" stopColor="var(--water-light)" />
            </linearGradient>
          </defs>
 
          <path className="m-glass" d={M_PATH} />
 
          <g clipPath="url(#mClip)">
            <path ref={waveRef} fill="url(#waterGrad)" d="" />
            <g clipPath="url(#levelClip)">
              {[30, 70, 110, 135, 50].map((cx, i) => (
                <circle
                  key={i}
                  ref={(el) => (bubbleRefs.current[i] = el)}
                  className="bubble"
                  cx={cx}
                  cy="190"
                  r={[2.6, 1.8, 2.2, 1.6, 1.4][i]}
                />
              ))}
            </g>
          </g>
 
          <path className="m-outline" d={M_PATH} />
        </svg>
      </div>
 
      <div className="m-loader-readout">
        <div className="m-loader-pct">{pct}%</div>
        <div className={`m-loader-label ${complete ? "done" : ""}`}>
          {complete ? "Complete" : "Loading"}
        </div>
      </div>
    </div>
  );
}
