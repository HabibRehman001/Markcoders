import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/company_logo_3d.glb'
const SPIN_DURATION = 5
const TARGET_SIZE = 1.05

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
  const groupRef = useRef(null)
  const { scene } = useGLTF(MODEL_PATH)
  const model = useMemo(() => prepareLogo(scene), [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += (Math.PI * 2 * delta) / SPIN_DURATION
  })

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  )
}

export default function NavLogo3D() {
  return (
    <span className="nav__logo" aria-hidden="true">
      <Canvas
        className="nav__logo-canvas"
        dpr={[1, 2]}
        orthographic
        camera={{
          position: [0, 0, 10],
          zoom: 55,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none', background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight intensity={1.6} position={[2.5, 3, 4]} />
        <directionalLight intensity={0.65} position={[-3, 1, 2]} />
        <directionalLight intensity={0.45} position={[0, 2, -3]} color="#009cff" />
        <Suspense fallback={null}>
          <LogoModel />
        </Suspense>
      </Canvas>
    </span>
  )
}

useGLTF.preload(MODEL_PATH)
