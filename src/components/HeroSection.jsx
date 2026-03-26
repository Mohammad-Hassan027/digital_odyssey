import { useEffect, useRef, useState, useCallback } from 'react'
import ScrambleText from './ScrambleText';
import HoloButton from './HoloButton';
import gsap from 'gsap'

// ─────────────────────────────────────────────────────────────
// SCRIPT: each entry is one "command" the hero types out
// type: 'cmd'    → prefixed with  $  prompt, green
// type: 'output' → plain output line, dimmer green
// type: 'title'  → large ASCII art / highlight line
// glitch: true   → fire glitch burst after this line resolves
// ─────────────────────────────────────────────────────────────
const SCRIPT = [
  { type: 'cmd',    text: 'ssh root@digital-odyssey.net',          delay: 0,    glitch: false },
  { type: 'output', text: 'Connected to digital-odyssey.net (v6)', delay: 300,  glitch: false },
  { type: 'output', text: 'Last login: Oct 29 1969 — ARPANET/IMP', delay: 0,    glitch: false },
  { type: 'cmd',    text: 'sudo ./launch_odyssey --era=all',        delay: 400,  glitch: true  },
  { type: 'output', text: 'Mounting timeline ... [████████] 100%',  delay: 200,  glitch: false },
  { type: 'output', text: 'Loading 60 years of internet history …', delay: 0,    glitch: false },
  { type: 'title',  text: 'THE DIGITAL ODYSSEY',                    delay: 500,  glitch: true  },
  { type: 'output', text: 'Evolution of the Internet  //  1969 → ∞',delay: 300,  glitch: false },
  { type: 'cmd',    text: 'scroll --direction=down  # begin journey',delay: 600,  glitch: false },
]

// Chars/ms typing speed
const CHAR_SPEED = 38   // ms between characters  (lower = faster)
const DOT_CYCLES = 3    // how many • • • pulses after a line
const DOT_INTERVAL = 380 // ms per dot-cycle step

export default function HeroSection({ onReady }) {
  const sectionRef   = useRef(null)
  const screenRef    = useRef(null)       // the inner CRT screen div
  const linesRef     = useRef([])         // rendered line DOM nodes
  const cursorRef    = useRef(null)
  const processingRef= useRef(null)
  const glitchRef    = useRef(null)

  const [lines, setLines]             = useState([])   // completed lines
  const [typingText, setTypingText]   = useState('')   // current in-progress chars
  const [typingType, setTypingType]   = useState('cmd')
  const [showDots, setShowDots]       = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [showCta, setShowCta]         = useState(false)

  // ── Random screen flicker ──────────────────────────────────
  // Fires independently of typing via GSAP repeating timeline
  useEffect(() => {
    const screen = screenRef.current
    if (!screen) return

    // Stochastic flicker: random opacity dip every 2-6 s
    let raf
    const flicker = () => {
      const wait = 2000 + Math.random() * 4000
      raf = setTimeout(() => {
        const intensity = 0.82 + Math.random() * 0.12  // 0.82–0.94
        gsap.to(screen, {
          opacity: intensity,
          duration: 0.04,
          yoyo: true,
          repeat: 1 + Math.floor(Math.random() * 2),  // 1–3 flickers
          ease: 'none',
          onComplete: () => {
            gsap.set(screen, { opacity: 1 })
            flicker()
          },
        })
      }, wait)
    }
    flicker()
    return () => clearTimeout(raf)
  }, [])

  // ── Main typewriter sequencer ──────────────────────────────
  const runScript = useCallback(async () => {
    for (let i = 0; i < SCRIPT.length; i++) {
      const entry = SCRIPT[i]

      // Optional inter-line pause
      if (entry.delay > 0) {
        await pause(entry.delay)
      }

      // Set which type is being typed (controls colour)
      setTypingType(entry.type)

      // Type each character
      const text = entry.text
      for (let c = 0; c < text.length; c++) {
        setTypingText(text.slice(0, c + 1))
        await pause(CHAR_SPEED + (Math.random() < 0.1 ? 80 : 0)) // occasional stutter
      }

      // ── Processing dots ────────────────────────────────────
      if (entry.type === 'cmd' || entry.type === 'title') {
        setShowDots(true)
        for (let d = 0; d < DOT_CYCLES; d++) {
          await pause(DOT_INTERVAL)
        }
        setShowDots(false)
      } else {
        await pause(120)
      }

      // ── Glitch burst before committing the line ────────────
      if (entry.glitch) {
        setGlitchActive(true)
        await pause(320)
        setGlitchActive(false)
        await pause(80)
      }

      // Commit line to history, clear typing buffer
      setLines(prev => [...prev, { type: entry.type, text: entry.text }])
      setTypingText('')
      await pause(60)
    }

    // All done — show CTA
    setShowCta(true)
  }, [])

  useEffect(() => {
    // Brief boot pause then start
    const t = setTimeout(runScript, 600)
    return () => clearTimeout(t)
  }, [runScript])

  // Scroll completed lines into view
  useEffect(() => {
    const last = linesRef.current[linesRef.current.length - 1]
    if (last) last.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [lines, typingText])

  // Notify parent when hero is ready to show CTA (optional)
  useEffect(() => {
    if (showCta && onReady) onReady()
  }, [showCta, onReady])

  // Scroll to next section
  const handleBegin = () => {
    const target = document.getElementById('spark')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero-section"
      aria-label="Hero: Digital Odyssey terminal intro"
    >
      {/* ── Scanline overlay ─────────────────────────────── */}
      <div className="scanlines" aria-hidden="true" />

      {/* ── Vignette ─────────────────────────────────────── */}
      <div className="crt-vignette" aria-hidden="true" />

      {/* ── Glitch layer ─────────────────────────────────── */}
      <div
        ref={glitchRef}
        className={`hero-glitch-layer ${glitchActive ? 'hero-glitch-active' : ''}`}
        aria-hidden="true"
      />

      {/* ── CRT screen ───────────────────────────────────── */}
      <div ref={screenRef} className="hero-crt-screen">

        {/* Title bar */}
        <div className="hero-titlebar">
          <div className="flex gap-2">
            <span className="tb-dot" style={{ background: '#ff5f57' }} />
            <span className="tb-dot" style={{ background: '#ffbd2e' }} />
            <span className="tb-dot" style={{ background: '#28c840' }} />
          </div>
          <span className="hero-titlebar-label">digital-odyssey — bash — 80×24</span>
          <span className="hero-uptime">UPTIME: 56Y 2M 27D</span>
        </div>

        {/* Terminal output */}
        <div className="hero-terminal-body" role="log" aria-live="polite" aria-label="Terminal output">

          {/* Boot header */}
          <p className="hero-line hero-line--system">
            DIGITAL ODYSSEY OS v6.9  ·  Kernel 1969.10.29-arpanet  ·  tty0
          </p>
          <p className="hero-line hero-line--dim">──────────────────────────────────────────────────────</p>

          {/* Committed lines */}
          {lines.map((ln, i) => (
            <p
              key={i}
              ref={el => linesRef.current[i] = el}
              className={`hero-line ${lineClass(ln.type)}`}
            >
              {ln.type === 'cmd'   && <span className="hero-prompt">{'$ '}</span>}
              {ln.type === 'title' ? (
                <span className="hero-title-text">{ln.text}</span>
              ) : (
                ln.text
              )}
            </p>
          ))}

          {/* Currently-typing line */}
          {typingText !== '' && (
            <p className={`hero-line ${lineClass(typingType)}`}>
              {typingType === 'cmd' && <span className="hero-prompt">{'$ '}</span>}
              {typingType === 'title' ? (
                <span className="hero-title-text">{typingText}</span>
              ) : (
                typingText
              )}
              {/* Blinking underscore cursor */}
              {!showDots && (
                <span ref={cursorRef} className="hero-cursor" aria-hidden="true">_</span>
              )}
            </p>
          )}

          {/* Processing dots */}
          {showDots && (
            <p
              ref={processingRef}
              className="hero-line hero-line--processing"
              aria-label="Processing"
            >
              <ProcessingDots />
            </p>
          )}

          {/* Idle cursor when nothing is typing */}
          {typingText === '' && !showDots && !showCta && (
            <p className="hero-line hero-line--cmd">
              <span className="hero-prompt">{'$ '}</span>
              <span className="hero-cursor" aria-hidden="true">_</span>
            </p>
          )}

          {/* CTA after sequence ends */}
          {showCta && (
            <div className="hero-cta-wrapper">
              <p className="hero-line hero-line--dim">──────────────────────────────────────────────────────</p>
              <div className="hero-cta-row">
                <ScrambleText className="hero-line hero-line--output" threshold="top 99%">
                  Journey initialised. Press any key or click below to begin.
                </ScrambleText>
              </div>
              <HoloButton
                id="hero-begin-btn"
                onClick={handleBegin}
                aria-label="Begin the Digital Odyssey"
                className="hero-begin-btn"
              >
                [ BEGIN ODYSSEY ]
              </HoloButton>
              <p className="hero-line hero-line--system mt-2">
                <span className="hero-prompt">$ </span>
                <span className="hero-cursor" aria-hidden="true">_</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll hint */}
      {showCta && (
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>SCROLL</span>
          <div className="hero-scroll-arrow" />
        </div>
      )}
    </section>
  )
}

// ── small helpers ────────────────────────────────────────────

function pause(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function lineClass(type) {
  switch (type) {
    case 'cmd':    return 'hero-line--cmd'
    case 'output': return 'hero-line--output'
    case 'title':  return 'hero-line--title'
    default:       return 'hero-line--output'
  }
}

// Three pulsing dots — pure CSS animation via steps()
function ProcessingDots() {
  return (
    <span className="processing-dots" aria-hidden="true">
      <span className="dot" style={{ animationDelay: '0ms' }}>•</span>
      <span className="dot" style={{ animationDelay: '200ms' }}>•</span>
      <span className="dot" style={{ animationDelay: '400ms' }}>•</span>
    </span>
  )
}
