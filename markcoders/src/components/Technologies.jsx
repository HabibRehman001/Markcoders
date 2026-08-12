import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, useTexture } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import './Technologies.css'

const technologies = [
  { name: 'React', icon: '/react.png' },
  { name: 'Vue', icon: '/vue.png' },
  { name: 'Angular', icon: '/angular.png' },
  { name: 'Flutter', icon: '/flutter.png' },
  { name: 'JavaScript', icon: '/js.png' },
  { name: 'Python', icon: '/python.png' },
  { name: 'Ruby', icon: '/ruby.png' },
  { name: 'MySQL', icon: '/mysql.png' },
  { name: 'Sass', icon: '/sass.png' },
  { name: 'Spring Boot', icon: '/springboot.png' },
  { name: 'Docker', icon: '/dokcer.png' },
]

function TechIcon({ data, mouse, bounds }) {
  const spriteRef = useRef(null)
  const texture = useTexture(data.icon)

  texture.colorSpace = THREE.SRGBColorSpace
  texture.premultiplyAlpha = false
  texture.needsUpdate = true

  const state = useMemo(() => {
    const angle = Math.random() * Math.PI * 2

    return {
      position: new THREE.Vector3(
        THREE.MathUtils.randFloat(bounds.left, bounds.right),
        THREE.MathUtils.randFloat(bounds.bottom, bounds.top),
        0,
      ),
      velocity: new THREE.Vector2(
        Math.cos(angle) * THREE.MathUtils.randFloat(0.1, 0.35),
        Math.sin(angle) * THREE.MathUtils.randFloat(0.1, 0.35),
      ),
      rotation: THREE.MathUtils.randFloat(-0.15, 0.15),
      rotationVelocity: THREE.MathUtils.randFloat(-0.15, 0.15),
      mass: THREE.MathUtils.randFloat(0.8, 1.2),
      size: THREE.MathUtils.randFloat(1.05, 1.45),
      seed: Math.random() * 100,
    }
  }, [bounds])

  useFrame((frame, delta) => {
    const sprite = spriteRef.current
    if (!sprite) return

    const time = frame.clock.elapsedTime
    const dt = Math.min(delta, 0.033)

    state.velocity.x += Math.sin(time * 0.65 + state.seed) * 0.0008
    state.velocity.y += Math.cos(time * 0.75 + state.seed * 1.3) * 0.0008

    const dx = state.position.x - mouse.current.x
    const dy = state.position.y - mouse.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const REPULSION_RADIUS = 1.35

    if (mouse.current.active && distance < REPULSION_RADIUS) {
      const safeDistance = Math.max(distance, 0.08)
      const force = Math.pow(1 - safeDistance / REPULSION_RADIUS, 2) * 0.18
      const directionX = dx / safeDistance
      const directionY = dy / safeDistance

      state.velocity.x += (directionX * force) / state.mass
      state.velocity.y += (directionY * force) / state.mass
    }

    // Panic impulse when mouse traps them tightly
    if (mouse.current.active && distance < 0.65) {
      const safeDistance = Math.max(distance, 0.05)
      const panicForce = 0.22 / safeDistance

      state.velocity.x += (dx / safeDistance) * panicForce * dt
      state.velocity.y += (dy / safeDistance) * panicForce * dt
    }

    state.position.x += state.velocity.x * dt * 3
    state.position.y += state.velocity.y * dt * 3
    state.velocity.multiplyScalar(Math.pow(0.985, dt * 60))

    const padding = state.size * 0.45

    if (state.position.x < bounds.left + padding) {
      state.position.x = bounds.left + padding
      if (state.velocity.x < 0) {
        state.velocity.x *= -0.9
        state.velocity.y += THREE.MathUtils.randFloat(-0.04, 0.04)
      }
    }

    if (state.position.x > bounds.right - padding) {
      state.position.x = bounds.right - padding
      if (state.velocity.x > 0) {
        state.velocity.x *= -0.9
        state.velocity.y += THREE.MathUtils.randFloat(-0.04, 0.04)
      }
    }

    if (state.position.y > bounds.top - padding) {
      state.position.y = bounds.top - padding
      if (state.velocity.y > 0) {
        state.velocity.y *= -0.9
        state.velocity.x += THREE.MathUtils.randFloat(-0.04, 0.04)
      }
    }

    if (state.position.y < bounds.bottom + padding) {
      state.position.y = bounds.bottom + padding
      if (state.velocity.y < 0) {
        state.velocity.y *= -0.9
        state.velocity.x += THREE.MathUtils.randFloat(-0.04, 0.04)
      }
    }

    state.rotation += state.rotationVelocity * dt
    sprite.position.copy(state.position)
    sprite.rotation.z = state.rotation

    const pulse = 1 + Math.sin(time * 1.2 + state.seed) * 0.025
    sprite.scale.set(state.size * pulse, state.size * pulse, 1)
  })

  return (
    <sprite ref={spriteRef} position={state.position}>
      <spriteMaterial
        map={texture}
        color="#ffffff"
        transparent
        alphaTest={0.05}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  )
}

function TechWorld() {
  const mouse = useRef({
    x: 100,
    y: 100,
    active: false,
  })

  const { size } = useThree()

  const bounds = useMemo(
    () => ({
      left: -3.2,
      right: 3.2,
      bottom: -2.2,
      top: 2.2,
    }),
    [],
  )

  const handlePointerMove = (event) => {
    // Map NDC (-1..1) into world bounds for ortho camera
    mouse.current.x = event.pointer.x * bounds.right
    mouse.current.y = event.pointer.y * bounds.top
    mouse.current.active = true
  }

  const handlePointerLeave = () => {
    mouse.current.active = false
  }

  return (
    <group>
      {/* Invisible hit plane so mouse events work across the canvas */}
      <mesh
        position={[0, 0, -1]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerLeave}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[size.width / 35, size.height / 35]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {technologies.map((technology) => (
        <TechIcon
          key={technology.name}
          data={technology}
          mouse={mouse}
          bounds={bounds}
        />
      ))}
    </group>
  )
}

export default function Technologies() {
  return (
    <section className="technologies">
      <div className="technologies-content">
        <div className="technologies-copy">
          <div className="technologies-line" />
          <div className="technologies-eyebrow">/ OUR STACK</div>
          <h2>Technologies</h2>
          <p>

            Software development being our specialization, we stay up-to-date with the latest technologies to provide the best solutions to our clients. We are proficient in using front-end technologies such as React, Vue.js, and Angular, as well as back-end technologies like Node.js, PHP, and Python. Additionally, We have experience in deploying and managing applications using cloud technologies like AWS, Azure, and Google Cloud. Our knowledge of the latest development technologies enables us to create modern and innovative solutions for our clients.
          </p>
        </div>

        <div className="technologies-canvas">
          <Canvas
            flat
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
          >
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={88} />
            <Suspense fallback={null}>
              <TechWorld />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  )
}
