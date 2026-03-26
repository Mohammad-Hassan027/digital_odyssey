import { useEffect, useRef, useState } from 'react';
import GlitchReveal from './GlitchReveal';
import ScrambleText from './ScrambleText';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NODES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: `${5 + (i * 17) % 90}%`,
  y: `${5 + (i * 23) % 85}%`,
  size: 4 + Math.random() * 8,
  color: ['#a78bfa', '#6c63ff', '#c084fc', '#818cf8'][i % 4],
  duration: 4 + Math.random() * 6,
  delay: Math.random() * 4,
}))

const THEMES = {
  web3: {
    label: 'Web3',
    bg: 'radial-gradient(ellipse at 30% 20%, #1a0a3e 0%, #0f0620 40%, #000 100%)',
    accent: '#a78bfa',
    cards: [
      { icon: '⛓️', title: 'Blockchain', desc: 'Immutable records. No central authority. Trust through code, not institutions.' },
      { icon: '🤖', title: 'AI Integration', desc: 'GPT-4, Gemini, and Claude handle millions of requests. Intelligence as a utility.' },
      { icon: '🌐', title: 'Decentralization', desc: 'No single server owns the web. Data lives everywhere, controlled by you.' },
      { icon: '🪙', title: 'Digital Ownership', desc: 'NFTs, tokens, DAOs. Own your identity, assets, and votes on-chain.' },
    ],
  },
  ai: {
    label: 'AI Future',
    bg: 'radial-gradient(ellipse at 70% 80%, #0a1a2e 0%, #001020 40%, #000 100%)',
    accent: '#38bdf8',
    cards: [
      { icon: '🧠', title: 'Neural Networks', desc: 'Transformers power language, vision, and reasoning. AI matches and exceeds human experts.' },
      { icon: '🔮', title: 'Generative Media', desc: 'Text, images, video—generated instantly. Creativity is no longer a bottleneck.' },
      { icon: '🤝', title: 'Human-AI Collaboration', desc: 'AI doesn\'t replace humans. It amplifies what we can do, on a planetary scale.' },
      { icon: '🛸', title: 'Agentic Systems', desc: 'AI agents plan, execute, and self-correct across multi-step tasks autonomously.' },
    ],
  },
}

export default function FutureSection({ sectionRef }) {
  const [activeTheme, setActiveTheme] = useState('web3')
  const headingRef = useRef(null)
  const cardsRef = useRef([])
  const bgRef = useRef(null)
  const canvasRef = useRef(null)
  const theme = THEMES[activeTheme]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          scale: 0.9,
          duration: 0.7,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  // Animated node canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodePositions = NODES.map(n => ({
      x: parseFloat(n.x) / 100 * canvas.width,
      y: parseFloat(n.y) / 100 * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: n.size / 2,
      color: n.color,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.005

      nodePositions.forEach(node => {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > canvas.width)  node.vx *= -1
        if (node.y < 0 || node.y > canvas.height)  node.vy *= -1
      })

      // Draw connections
      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const dx = nodePositions[i].x - nodePositions[j].x
          const dy = nodePositions[i].y - nodePositions[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.25
            ctx.beginPath()
            ctx.moveTo(nodePositions[i].x, nodePositions[i].y)
            ctx.lineTo(nodePositions[j].x, nodePositions[j].y)
            ctx.strokeStyle = `rgba(167,139,250,${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodePositions.forEach(node => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size + Math.sin(time + node.x) * 1, 0, Math.PI * 2)
        ctx.fillStyle = node.color + '80'
        ctx.fill()
        ctx.strokeStyle = node.color
        ctx.lineWidth = 1
        ctx.stroke()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const switchTheme = (key) => {
    gsap.to(cardsRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.05,
      onComplete: () => {
        setActiveTheme(key)
        gsap.to(cardsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        })
      },
    })
  }

  return (
    <section
      id="future"
      ref={sectionRef}
      className="future-section odyssey-section snap-section"
      style={{ background: theme.bg }}
      aria-label="Era 5: The Future — Web3 and AI"
    >
      {/* Animated node network canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
        aria-hidden="true"
      />

      {/* Floating orbs */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
            top: '10%',
            right: '10%',
            animation: 'node-float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-60 h-60 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
            bottom: '15%',
            left: '8%',
            animation: 'node-float 10s ease-in-out 2s infinite',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20">
        {/* Era label */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[#a78bfa]/70 font-['Share_Tech_Mono'] text-sm tracking-widest">05 /</span>
          <span className="text-[#a78bfa]/70 font-['Share_Tech_Mono'] text-sm tracking-widest uppercase">
            Web3 &amp; Beyond
          </span>
        </div>

        <div ref={headingRef} className="mb-8">
          <GlitchReveal as="h2" className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight font-['Outfit'] mb-4 text-glow-purple">
            THE FUTURE
          </GlitchReveal>
          <ScrambleText className="text-white/60 text-base md:text-xl max-w-lg font-['Inter'] leading-relaxed">
            The internet transforms again. Decentralized. Intelligent. Owned by its users.
            We stand at the threshold of something extraordinary.
          </ScrambleText>
        </div>

        {/* Theme Toggle */}
        <div className="mb-10 flex justify-start">
          <div
            className="future-toggle"
            role="group"
            aria-label="View perspective toggle"
          >
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                id={`toggle-${key}`}
                className={`future-toggle-btn ${activeTheme === key ? 'active' : ''}`}
                onClick={() => switchTheme(key)}
                aria-pressed={activeTheme === key}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--gap-grid)]" role="list" aria-label="Future web features">
          {theme.cards.map((card, i) => (
            <div
              key={card.title}
              ref={el => cardsRef.current[i] = el}
              id={`future-card-${i}`}
              className="glass-card"
              role="listitem"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2 font-['Outfit']">{card.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-['Inter']">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Final quote */}
        <div className="mt-16 text-center">
          <div
            className="inline-block py-8 px-12 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(167,139,250,0.15)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p className="text-2xl md:text-3xl font-bold text-white font-['Outfit'] leading-snug max-w-2xl">
              &ldquo;The best way to predict the future is to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-[#6c63ff]">
                invent it.
              </span>&rdquo;
            </p>
            <p className="text-white/40 text-sm mt-4 font-['Inter'] tracking-widest">— Alan Kay, 1971</p>
          </div>
          <p className="text-white/30 text-xs mt-8 font-['Share_Tech_Mono'] tracking-widest">
            END OF ODYSSEY // THE STORY CONTINUES
          </p>
        </div>
      </div>
    </section>
  )
}
