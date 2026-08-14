import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageTransition } from './TransitionProvider'
import { LANDING_VIDEO_SRC, useLazyVideoSrc } from '../hooks/useLazyVideoSrc'
import { isLoaderVisible, onHeroIntro } from '../lib/heroIntro'
import LiquidChromeBackground from './LiquidChromeBackground'
import './StudioHero.css'

gsap.registerPlugin(ScrollTrigger)

const MODEL_PATH = '/company_logo_3d.glb'
const TARGET_SIZE = 2.35
const CAMERA_REST = { x: 0, y: 0.15, z: 5.2 }
const CAMERA_INTRO = { x: 3.4, y: 0.35, z: 2.35 }

function prepareLogo(scene) {
  const source = scene.clone(true)
  source.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(source)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z, 0.001)

  source.position.sub(center)

  source.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = false
    child.receiveShadow = false
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => {
      if (!material) return
      material.side = THREE.DoubleSide
      material.needsUpdate = true
    })
  })

  const wrapper = new THREE.Group()
  wrapper.add(source)
  wrapper.scale.setScalar(TARGET_SIZE / maxDim)
  return wrapper
}

function LogoModel() {
  const spinRef = useRef(null)
  const scaleRef = useRef(null)
  const { scene } = useGLTF(MODEL_PATH)
  const model = useMemo(() => prepareLogo(scene), [scene])

  useLayoutEffect(() => {
    if (!scaleRef.current) return
    scaleRef.current.scale.setScalar(isLoaderVisible() ? 1.55 : 1)
  }, [])

  useEffect(() => {
    return onHeroIntro(() => {
      if (!scaleRef.current) return
      if (!isLoaderVisible() && scaleRef.current.scale.x <= 1.01) {
        scaleRef.current.scale.setScalar(1)
        return
      }
      gsap.to(scaleRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.7,
        ease: 'power3.out',
      })
    })
  }, [])

  useFrame((_, delta) => {
    if (!spinRef.current) return
    spinRef.current.rotation.y += delta * 0.35
  })

  return (
    <group ref={scaleRef}>
      <Float
        speed={1.35}
        rotationIntensity={0.35}
        floatIntensity={1.15}
        floatingRange={[-0.18, 0.22]}
      >
        <group ref={spinRef}>
          <primitive object={model} />
        </group>
      </Float>
    </group>
  )
}

function IntroCamera() {
  const { camera } = useThree()

  useLayoutEffect(() => {
    const pos = isLoaderVisible() ? CAMERA_INTRO : CAMERA_REST
    camera.position.set(pos.x, pos.y, pos.z)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  useEffect(() => {
    return onHeroIntro(() => {
      const alreadyResting =
        !isLoaderVisible() && Math.abs(camera.position.z - CAMERA_REST.z) < 0.2

      if (alreadyResting) {
        camera.position.set(CAMERA_REST.x, CAMERA_REST.y, CAMERA_REST.z)
        camera.lookAt(0, 0, 0)
        return
      }

      gsap.to(camera.position, {
        ...CAMERA_REST,
        duration: 1.75,
        ease: 'power3.out',
        onUpdate: () => {
          camera.lookAt(0, 0, 0)
        },
      })
    })
  }, [camera])

  return null
}

function HeroLogoCanvas() {
  return (
    <Canvas
      className="studio-hero__canvas"
      dpr={[1, 1.5]}
      camera={{
        position: [CAMERA_REST.x, CAMERA_REST.y, CAMERA_REST.z],
        fov: 38,
        near: 0.1,
        far: 60,
      }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <IntroCamera />
      <ambientLight intensity={0.85} />
      <directionalLight intensity={1.7} position={[3, 4, 5]} />
      <directionalLight intensity={0.7} position={[-4, 1.5, 2]} />
      <directionalLight intensity={1.1} position={[0, -2, 2]} color="#009cff" />
      <spotLight
        intensity={2.2}
        position={[0, -1.5, 3]}
        angle={0.55}
        penumbra={0.7}
        color="#4db8ff"
      />
      <Suspense fallback={null}>
        <LogoModel />
        <Environment preset="city" environmentIntensity={0.35} />
      </Suspense>
    </Canvas>
  )
}

export default function StudioHero() {
  const sectionRef = useRef(null)
  const mediaRef = useRef(null)
  const jellyPlayedRef = useRef(false)
  const videoHoldActiveRef = useRef(false)
  const videoHoldDoneRef = useRef(false)
  const { navigateWithTransition } = usePageTransition()
  const [videoRef] = useLazyVideoSrc(LANDING_VIDEO_SRC, '15% 0px')

  useLayoutEffect(() => {
    const section = sectionRef.current
    const wrapper = mediaRef.current
    const video = videoRef.current
    if (!section || !wrapper) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const VIDEO_HOLD_MS = 10000
    let playToken = 0
    let jellyTween = null
    let holdTimer = null
    let lockedY = 0

    const playVideo = () => {
      if (!video) return
      const token = ++playToken
      const tryPlay = () => {
        if (token !== playToken) return
        video.muted = true
        const p = video.play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      }
      if (video.readyState >= 2) tryPlay()
      else video.addEventListener('loadeddata', tryPlay, { once: true })
    }

    const pauseVideo = () => {
      playToken += 1
      if (video && !video.paused) {
        video.pause()
        video.currentTime = 0
      }
    }

    const freezeScrollPosition = () => {
      if (!videoHoldActiveRef.current) return
      window.scrollTo(0, lockedY)
    }

    const onWheelLock = (event) => {
      if (!videoHoldActiveRef.current) return
      event.preventDefault()
      freezeScrollPosition()
    }

    const onTouchLock = (event) => {
      if (!videoHoldActiveRef.current) return
      event.preventDefault()
      freezeScrollPosition()
    }

    const onKeyLock = (event) => {
      if (!videoHoldActiveRef.current) return
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End']
      if (keys.includes(event.key)) {
        event.preventDefault()
        freezeScrollPosition()
      }
    }

    const endVideoHold = () => {
      if (!videoHoldActiveRef.current) return
      videoHoldActiveRef.current = false
      if (holdTimer) {
        window.clearTimeout(holdTimer)
        holdTimer = null
      }
      window.removeEventListener('wheel', onWheelLock)
      window.removeEventListener('touchmove', onTouchLock)
      window.removeEventListener('keydown', onKeyLock)
      window.removeEventListener('scroll', freezeScrollPosition)
      document.documentElement.classList.remove('is-video-hold')
      window.dispatchEvent(new CustomEvent('markcoders:scroll-unlock'))
    }

    const startVideoHold = () => {
      if (videoHoldActiveRef.current || videoHoldDoneRef.current || reduceMotion) return

      videoHoldActiveRef.current = true
      videoHoldDoneRef.current = true
      lockedY = window.scrollY || window.pageYOffset || 0

      document.documentElement.classList.add('is-video-hold')
      window.dispatchEvent(new CustomEvent('markcoders:scroll-lock'))

      window.addEventListener('wheel', onWheelLock, { passive: false })
      window.addEventListener('touchmove', onTouchLock, { passive: false })
      window.addEventListener('keydown', onKeyLock, { passive: false })
      window.addEventListener('scroll', freezeScrollPosition, { passive: true })

      holdTimer = window.setTimeout(() => {
        endVideoHold()
      }, VIDEO_HOLD_MS)
    }

    const playJelly = () => {
      if (jellyPlayedRef.current || reduceMotion) return
      jellyPlayedRef.current = true

      jellyTween?.kill()
      jellyTween = gsap
        .timeline()
        .to(wrapper, {
          scaleX: 1.045,
          scaleY: 0.955,
          rotation: -0.8,
          duration: 0.12,
          ease: 'power2.inOut',
        })
        .to(wrapper, {
          scaleX: 0.96,
          scaleY: 1.04,
          rotation: 0.9,
          duration: 0.12,
          ease: 'power2.inOut',
        })
        .to(wrapper, {
          scaleX: 1.02,
          scaleY: 0.985,
          rotation: -0.35,
          duration: 0.12,
          ease: 'power2.inOut',
        })
        .to(wrapper, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.35,
          ease: 'elastic.out(1, 0.45)',
        })
    }

    const ctx = gsap.context(() => {
      const wordmark = section.querySelector('.studio-hero__wordmark')
      const logo = section.querySelector('.studio-hero__logo')
      const intro = section.querySelector('.studio-hero__intro')

      gsap.set([wordmark, logo, intro], { opacity: 1, y: 0, scale: 1 })
      gsap.set(wrapper, {
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        xPercent: 0,
        yPercent: 0,
        clearProps: 'left,top,right,bottom,width,borderRadius',
      })

      if (!reduceMotion) {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo(wordmark, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.95 })
          .fromTo(
            logo,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.95 },
            0.1,
          )
          .fromTo(
            [intro, wrapper],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
            0.22,
          )
      }

      if (reduceMotion) {
        gsap.set(wrapper, {
          width: '80vw',
          left: '50%',
          top: '50%',
          xPercent: -50,
          yPercent: -50,
          right: 'auto',
          bottom: 'auto',
        })
        playVideo()
        return
      }

      const growTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress >= 0.88) {
              playJelly()
              playVideo()
              startVideoHold()
            } else if (self.progress < 0.72) {
              jellyPlayedRef.current = false
              videoHoldDoneRef.current = false
              pauseVideo()
              endVideoHold()
            }
          },
          onLeave: () => {
            playVideo()
            // Keep hold if user somehow leaves while locked; timer still releases
          },
          onLeaveBack: () => {
            pauseVideo()
            jellyPlayedRef.current = false
            videoHoldDoneRef.current = false
            endVideoHold()
            gsap.set(wrapper, { scaleX: 1, scaleY: 1, rotation: 0 })
            gsap.set([wordmark, logo, intro], { opacity: 1 })
          },
        },
      })

      growTimeline
        .fromTo(
          [wordmark, logo, intro],
          { opacity: 1 },
          { opacity: 0, duration: 0.35, ease: 'none' },
          0.28,
        )
        .to(
          wrapper,
          {
            width: '80vw',
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            right: 'auto',
            bottom: 'auto',
            borderRadius: 22,
            ease: 'none',
            duration: 1,
          },
          0,
        )
    }, section)

    const refreshIds = [
      window.setTimeout(() => ScrollTrigger.refresh(), 120),
      window.setTimeout(() => ScrollTrigger.refresh(), 600),
    ]

    return () => {
      refreshIds.forEach((id) => window.clearTimeout(id))
      playToken += 1
      jellyTween?.kill()
      pauseVideo()
      endVideoHold()
      ctx.revert()
    }
  }, [videoRef])

  const handleCta = () => {
    navigateWithTransition('CONTACT', '/contact', { index: '04' })
  }

  return (
    <section className="studio-hero" ref={sectionRef} aria-label="Markcoders intro">
      <div className="studio-hero__sticky">
        <LiquidChromeBackground />
        <div className="studio-hero__grid" aria-hidden="true" />

        <h1 className="studio-hero__wordmark">
          Markcoders<span className="studio-hero__tm">™</span>
        </h1>

        <div className="studio-hero__logo" aria-hidden="true">
          <HeroLogoCanvas />
        </div>

        <div className="studio-hero__bottom">
          <div className="studio-hero__intro">
            <p className="studio-hero__copy">
              We turn ambitious ideas into brands, products and digital experiences
              people believe in.
            </p>
            <button type="button" className="studio-hero__cta" onClick={handleCta}>
              Build with us
            </button>
          </div>
        </div>

        <div ref={mediaRef} className="studio-hero__media">
          <video
            ref={videoRef}
            className="studio-hero__video"
            muted
            loop
            playsInline
            preload="none"
            controls={false}
            disablePictureInPicture
            aria-label="Markcoders showreel"
          />
        </div>
      </div>
    </section>
  )
}

useGLTF.preload(MODEL_PATH)
