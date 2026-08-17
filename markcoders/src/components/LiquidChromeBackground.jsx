import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './LiquidChromeBackground.css'

const vertexShader = /* glsl */ `
  in vec3 position;
  in vec2 uv;
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  uniform float uEnergy;

  in vec2 vUv;
  out vec4 fragColor;

  vec3 permute(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m *= m; m *= m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    return 0.65 * snoise(p) + 0.35 * snoise(p * 2.07);
  }

  void main(){
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 st  = vec2(vUv.x * aspect, vUv.y);
    vec2 mst = vec2(uMouse.x * aspect, uMouse.y);

    float dist = distance(st, mst);
    float mouse = smoothstep(0.95, 0.0, dist);
    float pull = mouse * (0.18 + uEnergy * 0.35);

    vec2 p = st * 1.05 + vec2(uTime * 0.035, -uTime * 0.022);
    p += (mst - st) * pull * 0.22;

    float n = fbm(p);
    float nFine = snoise(p * 2.4 + n * 0.8);

    float h = n * 0.78 + nFine * 0.22;
    float hx = fbm(p + vec2(0.018, 0.0)) - n;
    float hy = fbm(p + vec2(0.0, 0.018)) - n;
    vec3 nor = normalize(vec3(-hx, -hy, 0.28));
    float lit = clamp(dot(nor, normalize(vec3(-0.15, 0.55, 1.0))), 0.0, 1.0);

    vec3 paper = vec3(0.72, 0.72, 0.71);
    vec3 valley = vec3(0.42, 0.425, 0.43);
    vec3 ridge  = vec3(0.86, 0.86, 0.85);

    vec3 color = mix(valley, paper, smoothstep(-0.45, 0.35, h));
    color = mix(color, ridge, lit * 0.55);
    color += mouse * uEnergy * 0.06;

    fragColor = vec4(color, 1.0);
  }
`

export default function LiquidChromeBackground({ className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false,
    })
    renderer.setClearColor(0x6e6e6c, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    renderer.domElement.className = 'liquid-chrome__canvas'
    mount.appendChild(renderer.domElement)

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uEnergy: { value: 0 },
    }

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
    })
    scene.add(new THREE.Mesh(geometry, material))

    const resize = () => {
      const w = Math.max(1, mount.clientWidth)
      const h = Math.max(1, mount.clientHeight)
      renderer.setSize(w, h, false)
      uniforms.uResolution.value.set(w, h)
    }
    resize()

    const rawMouse = { x: 0.5, y: 0.5 }
    const smoothMouse = { x: 0.5, y: 0.5 }
    const lastMouse = { x: 0.5, y: 0.5 }
    let energy = 0
    let rafId = 0
    let inView = true
    let lastFrame = 0
    const frameMs = reduce ? 1000 : 1000 / 30
    const isLive = () => inView && !document.hidden

    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      rawMouse.x = (event.clientX - rect.left) / rect.width
      rawMouse.y = 1 - (event.clientY - rect.top) / rect.height
    }

    const clock = new THREE.Clock()

    const tick = (now) => {
      if (!isLive()) return
      rafId = requestAnimationFrame(tick)
      if (now - lastFrame < frameMs) return
      lastFrame = now

      const t = clock.getElapsedTime()
      const dx = rawMouse.x - lastMouse.x
      const dy = rawMouse.y - lastMouse.y
      lastMouse.x = rawMouse.x
      lastMouse.y = rawMouse.y

      energy += Math.hypot(dx, dy) * 6
      energy *= 0.9
      energy = Math.min(energy, 1)

      smoothMouse.x += (rawMouse.x - smoothMouse.x) * 0.18
      smoothMouse.y += (rawMouse.y - smoothMouse.y) * 0.18

      uniforms.uTime.value = reduce ? 0 : t
      uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y)
      uniforms.uEnergy.value = energy

      renderer.render(scene, camera)
    }

    const start = () => {
      cancelAnimationFrame(rafId)
      lastFrame = 0
      tick(performance.now())
    }

    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting)
        if (isLive()) start()
        else cancelAnimationFrame(rafId)
      },
      { threshold: 0 },
    )
    io.observe(mount)

    const onVisibility = () => {
      if (isLive()) start()
      else cancelAnimationFrame(rafId)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      inView = false
      cancelAnimationFrame(rafId)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={`liquid-chrome ${className}`.trim()}
      aria-hidden="true"
    />
  )
}
