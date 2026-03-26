import { useEffect, useRef } from 'react'
import ScrambleText from './ScrambleText';
import HoloButton from './HoloButton';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PARTICLES_BASE = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animDuration: `${8 + Math.random() * 12}s`,
  animDelay: `${-Math.random() * 20}s`,
  size: `${2 + Math.random() * 3}px`,
}))

const TERMINAL_LINES = [
  { prompt: 'SRI-NIC', text: 'ARPANET node connected. IMP routing active.' },
  { prompt: 'UCLA-NMC', text: 'Packet received: "LO" — transmission complete.' },
  { prompt: 'SYS', text: 'First node-to-node message sent. Oct 29, 1969.' },
  { prompt: 'SRI-NIC', text: 'Network established: 4 nodes online.' },
  { prompt: 'NCP', text: 'Network Control Protocol v1.0 initialized.' },
  { prompt: 'SYS', text: 'The internet has arrived.' },
]

export default function SparkSection({ sectionRef }) {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const particles = isMobile ? PARTICLES_BASE.slice(0, 15) : PARTICLES_BASE;
  const terminalRef = useRef(null)
  const linesRef = useRef([])
  const connectRef = useRef(null)
  const connectedRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(bgRef.current, {
        y: '-30%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Terminal reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: terminalRef.current,
          start: 'top 70%',
          once: true,
        },
      })

      tl.from(terminalRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
      })

      linesRef.current.forEach((el, i) => {
        tl.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        }, `-=0.1`)
      })

      tl.from(connectRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
      }, '+=0.2')
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  const handleConnect = () => {
    const btn = connectRef.current
    const connected = connectedRef.current
    gsap.to(btn, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => {
      btn.style.display = 'none'
      connected.style.display = 'flex'
      gsap.fromTo(connected, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' })
    }})
  }

  return (
    <section
      id="spark"
      ref={sectionRef}
      className="spark-section odyssey-section snap-section"
      aria-label="Era 1: The Spark — 1960s and 70s"
    >
      {/* Floating particles */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="spark-particle"
            style={{
              left: p.left,
              bottom: 0,
              width: p.size,
              height: p.size,
              animationDuration: p.animDuration,
              animationDelay: p.animDelay,
            }}
          />
        ))}
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(#00ff41 1px, transparent 1px),
              linear-gradient(90deg, #00ff41 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20">
        {/* Era label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-[#00ff41]/50 font-['Share_Tech_Mono'] text-sm tracking-widest">01 /</span>
          <span className="text-[#00ff41]/50 font-['Share_Tech_Mono'] text-sm tracking-widest uppercase">1960s – 1970s</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--gap-grid)] items-center">
          {/* Left: Narrative */}
          <div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-['Share_Tech_Mono'] text-[#00ff41] text-glow-green leading-tight mb-6">
              THE<br />SPARK
            </h2>
            <ScrambleText className="text-[#00ff41]/70 font-['Share_Tech_Mono'] text-sm md:text-base leading-loose mb-8 max-w-md">
              October 29, 1969. A computer at UCLA attempts to send the word "LOGIN" to a node at Stanford.
              The system crashes after two letters. "LO" — and so begins the internet.
            </ScrambleText>

            {/* Connect button */}
            <div>
              <HoloButton
                ref={connectRef}
                id="arpanet-connect-btn"
                onClick={handleConnect}
                aria-label="Simulate ARPANET connection"
                className="w-full md:w-auto"
              >
                [ CONNECT ]
              </HoloButton>

              <div
                ref={connectedRef}
                className="hidden items-center gap-3 font-['Share_Tech_Mono'] text-sm"
                aria-live="polite"
              >
                <div className="w-3 h-3 rounded-full bg-[#00ff41] animate-ping" />
                <span className="text-[#00ff41]">NODE CONNECTED — 4 HOPS</span>
              </div>
            </div>
          </div>

          {/* Right: Terminal */}
          <div ref={terminalRef} className="terminal-window">
            <div className="terminal-titlebar">
              <div className="terminal-dot" style={{ background: '#ff5f57' }} />
              <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
              <div className="terminal-dot" style={{ background: '#28c840' }} />
              <span className="ml-3 text-[#00ff41]/60 text-xs font-['Share_Tech_Mono']">
                arpanet_terminal — bash
              </span>
            </div>

            <div className="terminal-body">
              {TERMINAL_LINES.map((line, i) => (
                <div
                  key={i}
                  ref={el => linesRef.current[i] = el}
                  className="terminal-line"
                >
                  <span className="text-[#00ff41]/50">[{line.prompt}]</span>
                  <span className="ml-2">{line.text}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center">
                <span className="text-[#00ff41]/50">{'$'} </span>
                <span className="terminal-cursor ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline nodes */}
        <div className="mt-16 flex flex-wrap gap-6">
          {[
            ['1969', 'ARPANET Born'],
            ['1971', 'First Email'],
            ['1973', 'TCP/IP Draft'],
            ['1974', 'Internet Word Coined'],
            ['1976', '112 Nodes Online'],
          ].map(([year, label]) => (
            <div key={year} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#00ff41]/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#00ff41]" />
              </div>
              <div>
                <div className="text-[#00ff41] font-['Share_Tech_Mono'] text-xs">{year}</div>
                <div className="text-[#00ff41]/50 font-['Share_Tech_Mono'] text-[10px]">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG wave divider */}
      <div className="wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#4a0080"
          />
        </svg>
      </div>
    </section>
  )
}
