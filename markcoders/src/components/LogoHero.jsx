import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import './LogoHero.css'

const MODEL_PATH = '/company_logo_3d.glb'
const TARGET_SIZE = 2.4
const START_DISTANCE = 5.5
const CROSS_TRIGGER = 1.35
const ZOOM_SENSITIVITY = 0.00135

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
    child.castShadow = true
    child.receiveShadow = true
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
  const { scene } = useGLTF(MODEL_PATH)
  const model = useMemo(() => prepareLogo(scene), [scene])
  return <primitive object={model} />
}

function InvertedZoom() {
  const { camera, controls, gl } = useThree()
  const offset = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (!controls) return undefined

    controls.enableZoom = false

    const onWheel = (event) => {
      if (!controls.enabled) return

      event.preventDefault()
      event.stopPropagation()

      // Reversed from Orbit defaults:
      // scroll down (deltaY > 0) → zoom in
      // scroll up   (deltaY < 0) → zoom out (clamped at start distance)
      const distance = camera.position.distanceTo(controls.target)
      const modeScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 800 : 1
      const next = THREE.MathUtils.clamp(
        distance * Math.exp(-event.deltaY * modeScale * ZOOM_SENSITIVITY),
        0.05,
        START_DISTANCE,
      )

      offset.subVectors(camera.position, controls.target).setLength(next)
      camera.position.copy(controls.target).add(offset)
      controls.update()
    }

    const element = gl.domElement
    element.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      element.removeEventListener('wheel', onWheel)
    }
  }, [camera, controls, gl, offset])

  return null
}

function ZoomThroughController({ onCrossStart, onCrossComplete }) {
  const { camera, controls } = useThree()
  const triggered = useRef(false)
  const direction = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (triggered.current || !controls) return

    const distance = camera.position.distanceTo(controls.target)

    if (distance > START_DISTANCE + 0.001) {
      direction.subVectors(camera.position, controls.target).normalize()
      camera.position.copy(controls.target).addScaledVector(direction, START_DISTANCE)
      controls.update()
    }

    if (distance > CROSS_TRIGGER) return

    triggered.current = true
    controls.enabled = false
    onCrossStart?.()

    direction.subVectors(controls.target, camera.position).normalize()
    const end = camera.position.clone().addScaledVector(direction, 10)

    const proxy = {
      fov: camera.fov,
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    }

    gsap.to(proxy, {
      x: end.x,
      y: end.y,
      z: end.z,
      fov: 95,
      duration: 1.15,
      ease: 'power3.in',
      onUpdate: () => {
        camera.position.set(proxy.x, proxy.y, proxy.z)
        camera.fov = proxy.fov
        camera.updateProjectionMatrix()
        camera.lookAt(controls.target)
      },
      onComplete: () => {
        onCrossComplete?.()
      },
    })
  })

  return null
}

function Scene({ onCrossStart, onCrossComplete }) {
  return (
    <>
      <color attach="background" args={['#050505']} />

      <ambientLight intensity={0.45} />
      <directionalLight
        castShadow
        intensity={1.7}
        position={[4, 6, 4]}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      />
      <directionalLight intensity={0.55} position={[-4, 2, -2]} />
      <directionalLight intensity={0.5} position={[0, 3, -5]} color="#009cff" />

      <Suspense fallback={null}>
        <LogoModel />
      </Suspense>

      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.55}
        scale={14}
        blur={2.6}
        far={6}
        color="#000000"
      />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom={false}
        minDistance={0.05}
        maxDistance={START_DISTANCE}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.65}
        target={[0, 0, 0]}
      />

      <InvertedZoom />

      <ZoomThroughController
        onCrossStart={onCrossStart}
        onCrossComplete={onCrossComplete}
      />
    </>
  )
}

export default function LogoHero({ onEnterMenu }) {
  const sectionRef = useRef(null)
  const hintRef = useRef(null)
  const exiting = useRef(false)

  const handleCrossStart = () => {
    if (hintRef.current) {
      gsap.to(hintRef.current, { opacity: 0, duration: 0.25 })
    }
  }

  const handleCrossComplete = () => {
    if (exiting.current) return
    exiting.current = true

    const section = sectionRef.current
    if (!section) {
      onEnterMenu?.()
      return
    }

    gsap.to(section, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      onComplete: () => onEnterMenu?.(),
    })
  }

  return (
    <section
      ref={sectionRef}
      className="logo-hero"
      aria-label="Markcoders 3D logo"
    >
      <Canvas
        className="logo-hero__canvas"
        shadows
        dpr={[1, 1.75]}
        camera={{
          position: [0, 0.2, START_DISTANCE],
          fov: 40,
          near: 0.05,
          far: 80,
        }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050505', 1)
        }}
        onWheel={(event) => event.stopPropagation()}
      >
        <Scene
          onCrossStart={handleCrossStart}
          onCrossComplete={handleCrossComplete}
        />
      </Canvas>
      <p ref={hintRef} className="logo-hero__hint">
        Drag to rotate · Scroll down to zoom in
      </p>
    </section>
  )
}

useGLTF.preload(MODEL_PATH)
