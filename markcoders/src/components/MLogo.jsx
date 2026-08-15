import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, PresentationControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/company_logo_3d.glb'
const TARGET_SIZE = 2.2
const SPIN_DURATION = 14

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
  const { scene } = useGLTF(MODEL_PATH)
  const model = useMemo(() => prepareLogo(scene), [scene])

  useFrame((_, delta) => {
    if (!spinRef.current) return
    spinRef.current.rotation.y += (Math.PI * 2 * delta) / SPIN_DURATION
  })

  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.35}>
      <group ref={spinRef}>
        <primitive object={model} />
      </group>
    </Float>
  )
}

/**
 * Full-size Markcoders 3D mark — same GLB as home / nav,
 * sized for the About intro stage.
 */
export default function MLogo({ className = 'mc-about__mlogo' }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        className="mc-about__mlogo-canvas"
        dpr={[1, 1.75]}
        camera={{
          position: [0, 0.12, 5.4],
          fov: 36,
          near: 0.1,
          far: 60,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight intensity={1.7} position={[3, 4, 5]} />
        <directionalLight intensity={0.7} position={[-4, 1.5, 2]} />
        <directionalLight intensity={1.05} position={[0, -2, 2]} color="#009cff" />
        <spotLight
          intensity={2}
          position={[0, -1.2, 3]}
          angle={0.55}
          penumbra={0.7}
          color="#4db8ff"
        />
        <PresentationControls
          global={false}
          cursor
          snap
          speed={1.15}
          zoom={1}
          rotation={[0, 0.15, 0]}
          polar={[-0.35, 0.45]}
          azimuth={[-0.75, 0.75]}
          config={{ mass: 1, tension: 160, friction: 26 }}
        >
          <Suspense fallback={null}>
            <LogoModel />
            <Environment preset="city" environmentIntensity={0.32} />
          </Suspense>
        </PresentationControls>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)
