import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Spiral particle data (generated once) ────────────────────
const PARTICLE_COUNT = 120

function makeParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    angle: (i / PARTICLE_COUNT) * Math.PI * 2 * 6, // 6 spiral arms
    radius: 20 + Math.random() * 280,
    size: 1 + Math.random() * 2.5,
    speed: 0.003 + Math.random() * 0.006,
    opacity: 0.3 + Math.random() * 0.7,
    color: ['#00ff41', '#00cc33', '#33ff66', '#00ff88'][i % 4],
  }))
}

const BASE_PARTICLES = makeParticles()

export default function PortalSection() {
  const sectionRef  = useRef(null)
  const canvasRef   = useRef(null)
  const portalRef   = useRef(null)
  const glowRef     = useRef(null)
  const flashRef    = useRef(null)
  const warpRef     = useRef(null)
  const animIdRef   = useRef(null)
  const particlesRef = useRef(BASE_PARTICLES.map(p => ({ ...p })))
  const glowIntRef   = useRef(0)   // 0–1, driven by scroll
  const [warping, setWarping] = useState(false)
  const [warpDone, setWarpDone] = useState(false)

  // ── Spiral canvas animation ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let inView = false
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    }, { threshold: 0.1 })
    observer.observe(sectionRef.current)

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const cx = () => canvas.width  / 2
    const cy = () => canvas.height / 2

    const draw = () => {
      if (!inView) {
        animIdRef.current = requestAnimationFrame(draw)
        return
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const glow = glowIntRef.current   // 0–1

      particlesRef.current.forEach(p => {
        // Spiral inward: reduce radius each frame
        p.radius -= p.speed * (1 + glow * 1.5)
        p.angle  += 0.008 * (1 + glow * 0.5)

        // Respawn when reaching center
        if (p.radius < 8) {
          p.radius = 240 + Math.random() * 100
          p.angle  = Math.random() * Math.PI * 2
          p.opacity= 0.2 + Math.random() * 0.6
        }

        const x = cx() + Math.cos(p.angle) * p.radius
        const y = cy() + Math.sin(p.angle) * p.radius * 0.38  // squash for 3D feel

        const alpha = p.opacity * (p.radius / 300)
        ctx.beginPath()
        ctx.arc(x, y, p.size * (1 + glow * 0.4), 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.shadowBlur = 6 + glow * 10
        ctx.shadowColor = p.color
        ctx.fill()
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur  = 0
      animIdRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animIdRef.current)
      window.removeEventListener('resize', resize)
      observer.disconnect()
    }
  }, [])

  // ── Scroll-driven glow intensity ────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'center center',
        scrub: true,
        onUpdate: self => {
          glowIntRef.current = self.progress
          // Drive the CSS glow var live
          if (glowRef.current) {
            const g = self.progress
            glowRef.current.style.setProperty('--glow', g)
            glowRef.current.style.boxShadow = `
              0 0 ${30 + g * 80}px  ${4  + g * 12}px rgba(0,255,65,${0.25 + g * 0.45}),
              0 0 ${80 + g * 160}px ${20 + g * 40}px rgba(0,255,65,${0.08 + g * 0.18}),
              inset 0 0 ${40 + g * 80}px rgba(0,255,65,${0.06 + g * 0.1})
            `
          }
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ── Warp speed click handler ────────────────────────────────
  const handlePortalClick = () => {
    if (warping || warpDone) return
    setWarping(true)

    // 1. Streaking warp lines burst out
    spawnWarpStreaks()

    // 2. Portal rings spin up wildly
    const rings = Array.from(portalRef.current.querySelectorAll('.portal-ring'))
    gsap.to(rings, {
      rotationY: (i) => (i % 2 === 0 ? '+=1080' : '-=1080'),
      rotationX: (i) => 50 + i * 10,
      scale: 1.5,
      duration: 0.9,
      ease: 'power4.in',
      stagger: 0.06,
    })

    // 3. Portal core implodes
    gsap.to('.portal-core', { scale: 0, opacity: 0, duration: 0.5, delay: 0.4 })

    // 4. White flash
    gsap.timeline({ delay: 0.75 })
      .to(flashRef.current, { opacity: 1, duration: 0.15, ease: 'power2.in' })
      .to(flashRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out',
          onComplete: () => {
            setWarpDone(true)
            // Scroll to The Spark
            document.getElementById('spark')?.scrollIntoView({ behavior: 'smooth' })
          }
        })
  }

  // Generate canvas warp streaks on click
  const spawnWarpStreaks = () => {
    const canvas = warpRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    canvas.style.display = 'block'

    const cx = canvas.width  / 2
    const cy = canvas.height / 2
    const streaks = Array.from({ length: 140 }, () => ({
      angle : Math.random() * Math.PI * 2,
      length: 0,
      maxLen: 120 + Math.random() * 300,
      speed : 18 + Math.random() * 40,
      width : 0.8 + Math.random() * 1.6,
      opacity: 0.6 + Math.random() * 0.4,
    }))

    let frame = 0
    const MAX = 30
    const run = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      streaks.forEach(s => {
        if (s.length < s.maxLen) {
          alive = true
          s.length += s.speed
        }
        const startX = cx + Math.cos(s.angle) * 30
        const startY = cy + Math.sin(s.angle) * 30
        const endX   = cx + Math.cos(s.angle) * Math.min(s.length, s.maxLen)
        const endY   = cy + Math.sin(s.angle) * Math.min(s.length, s.maxLen)
        const alpha  = s.opacity * (1 - frame / MAX)
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = `rgba(0,255,65,${alpha})`
        ctx.lineWidth   = s.width
        ctx.shadowBlur  = 8
        ctx.shadowColor = '#00ff41'
        ctx.stroke()
      })
      frame++
      if (frame < MAX && alive) requestAnimationFrame(run)
      else canvas.style.display = 'none'
    }
    run()
  }

  return (
    <section
      id="portal"
      ref={sectionRef}
      className="portal-section snap-section"
      aria-label="Time Machine Portal — enter the Digital Odyssey"
    >
      {/* White flash overlay */}
      <div ref={flashRef} className="warp-flash" aria-hidden="true" />

      {/* Warp streak canvas */}
      <canvas ref={warpRef} className="warp-canvas" aria-hidden="true" />

      {/* Background ambient canvas (spiraling particles) */}
      <canvas ref={canvasRef} className="portal-particle-canvas" aria-hidden="true" />

      {/* Radial ambient glow */}
      <div className="portal-bg-glow" aria-hidden="true" />

      {/* Content */}
      <div className="portal-content">

        {/* Label above */}
        <p className="portal-label-top">
          <span className="portal-label-dot" /> TEMPORAL GATEWAY ONLINE
        </p>

        {/* 3D Portal assembly */}
        <div
          ref={glowRef}
          className={`portal-scene ${warping ? 'portal-warping' : ''}`}
          onClick={handlePortalClick}
          role="button"
          tabIndex={0}
          aria-label="Click to enter the time machine portal"
          onKeyDown={e => e.key === 'Enter' && handlePortalClick()}
        >
          <div ref={portalRef} className="portal-3d">

            {/* ── Rings (outer → inner) ── */}
            {/* Ring 0 — outermost, tilted, clockwise slow */}
            <div className="portal-ring portal-ring-0">
              <div className="portal-ring-face" />
            </div>

            {/* Ring 1 — tilted different axis, counter-clockwise */}
            <div className="portal-ring portal-ring-1">
              <div className="portal-ring-face" />
            </div>

            {/* Ring 2 — medium, clockwise medium */}
            <div className="portal-ring portal-ring-2">
              <div className="portal-ring-face" />
            </div>

            {/* Ring 3 — inner, counter-clockwise fast */}
            <div className="portal-ring portal-ring-3">
              <div className="portal-ring-face" />
            </div>

            {/* Ring 4 — innermost, clockwise fastest */}
            <div className="portal-ring portal-ring-4">
              <div className="portal-ring-face" />
            </div>

            {/* ── Core ── */}
            <div className="portal-core" aria-hidden="true">
              <div className="portal-core-inner" />
              <div className="portal-core-pulse" />
              <div className="portal-core-text">ENTER</div>
            </div>

          </div>
        </div>

        {/* Label below */}
        <div className="portal-label-bottom">
          <ScrambleText className="portal-hint">
            Click the portal to initiate time travel
          </ScrambleText>
          <ScrambleText className="portal-era-hint">
            Destination: <span>1969 — ARPANET</span>
          </ScrambleText>
        </div>

      </div>
    </section>
  )
}
