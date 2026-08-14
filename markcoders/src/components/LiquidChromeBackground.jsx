import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './LiquidChromeBackground.css'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  uniform float uEnergy;

  varying vec2 vUv;

  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++){
      value += amp * snoise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  // Markcoders blue foil — centered on #009cff over pale gray
  vec3 palette(float t){
    vec3 a = vec3(0.78, 0.86, 0.94);
    vec3 b = vec3(0.22, 0.18, 0.16);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.55, 0.38, 0.12);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main(){
    float aspect = uResolution.x / uResolution.y;
    vec2 st  = vec2(vUv.x * aspect, vUv.y);
    vec2 mst = vec2(uMouse.x * aspect, uMouse.y);

    float dist = distance(st, mst);
    float mouseGlow = smoothstep(0.9, 0.0, dist) * (0.35 + uEnergy);

    vec2 dir = (st - mst) / (dist + 0.0001);
    vec2 ripple = dir * sin(dist * 10.0 - uTime * 1.5) * mouseGlow * 0.06;

    vec2 flowUv = st * 2.2 + vec2(uTime * 0.03, -uTime * 0.02);
    vec2 warp = vec2(fbm(flowUv + 1.7), fbm(flowUv - 3.1)) * 0.4;
    vec2 warpedUv = flowUv + warp + ripple * 3.0;

    float n  = fbm(warpedUv + mouseGlow * 1.5);
    float n2 = fbm(warpedUv * 1.6 + 5.2 - uTime * 0.05);

    float aberr = 0.015 + mouseGlow * 0.03;
    float nR = fbm(warpedUv + vec2(aberr, 0.0));
    float nB = fbm(warpedUv - vec2(aberr, 0.0));

    vec3 rainbow = palette(n * 0.5 + n2 * 0.3 + uTime * 0.015);
    rainbow.r = mix(rainbow.r, palette(nR * 0.5).r, 0.5);
    rainbow.b = mix(rainbow.b, palette(nB * 0.5).b, 0.5);

    vec3 base = vec3(0.925, 0.925, 0.918);

    float mask = smoothstep(0.05, 0.85, abs(n)) * 0.75 + mouseGlow * 0.5;
    mask = clamp(mask, 0.0, 1.0);

    vec3 color = mix(base, rainbow, mask);

    float shine = smoothstep(0.55, 0.95, abs(n2)) * (0.5 + mouseGlow);
    color += shine * 0.22;

    gl_FragColor = vec4(color, 1.0);
  }
`

export default function LiquidChromeBackground({ className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.domElement.className = 'liquid-chrome__canvas'
    mount.appendChild(renderer.domElement)

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uEnergy: { value: 0 },
    }

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })
    scene.add(new THREE.Mesh(geometry, material))

    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      uniforms.uResolution.value.set(w, h)
    }
    resize()

    const rawMouse = { x: 0.5, y: 0.5 }
    const smoothMouse = { x: 0.5, y: 0.5 }
    const lastMouse = { x: 0.5, y: 0.5 }
    let energy = 0
    let rafId = 0
    let running = true

    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      rawMouse.x = (event.clientX - rect.left) / rect.width
      rawMouse.y = 1 - (event.clientY - rect.top) / rect.height
    }

    const clock = new THREE.Clock()

    const animate = () => {
      if (!running) return
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const dx = rawMouse.x - lastMouse.x
      const dy = rawMouse.y - lastMouse.y
      const speed = Math.sqrt(dx * dx + dy * dy)
      lastMouse.x = rawMouse.x
      lastMouse.y = rawMouse.y

      energy += speed * 12.0
      energy *= 0.88
      energy = Math.min(energy, 1.4)

      smoothMouse.x += (rawMouse.x - smoothMouse.x) * 0.22
      smoothMouse.y += (rawMouse.y - smoothMouse.y) * 0.22

      uniforms.uTime.value = t
      uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y)
      uniforms.uEnergy.value = energy

      renderer.render(scene, camera)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        running = Boolean(entry?.isIntersecting)
        if (running) animate()
        else cancelAnimationFrame(rafId)
      },
      { rootMargin: '12% 0px' },
    )
    io.observe(mount)

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    animate()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
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
