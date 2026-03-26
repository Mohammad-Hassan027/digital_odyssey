import { useEffect, useRef } from 'react'
import ScrambleText from './ScrambleText';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const APPS = [
  { emoji: '📱', name: 'Maps', color: '#34a853' },
  { emoji: '🎵', name: 'Music', color: '#fc3c44' },
  { emoji: '📷', name: 'Camera', color: '#9b59b6' },
  { emoji: '💬', name: 'Messages', color: '#25d366' },
  { emoji: '🌐', name: 'Browser', color: '#2196f3' },
  { emoji: '🛍️', name: 'Shop', color: '#ff9900' },
  { emoji: '🎮', name: 'Games', color: '#e91e63' },
  { emoji: '✈️', name: 'Travel', color: '#00bcd4' },
  { emoji: '💳', name: 'Pay', color: '#1877f2' },
]

const MILESTONES = [
  { year: '2007', icon: '📱', title: 'iPhone Revolution', desc: 'Jobs unveils a phone that changed everything. A computer in every pocket.' },
  { year: '2010', icon: '📱', title: 'App Economy', desc: '10 billion apps downloaded. Developers become the new gold rush.' },
  { year: '2012', icon: '🌍', title: '1 Billion Smartphones', desc: 'More smartphones than toothbrushes. Mobile surpasses desktop web traffic.' },
  { year: '2016', icon: '⚡', title: '4G Everywhere', desc: 'Streaming, ridehailing, instant food delivery — always on, always connected.' },
]

export default function MobileSection({ sectionRef }) {
  const headingRef = useRef(null)
  const phoneRef = useRef(null)
  const cardsRef = useRef([])
  const bgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax
      gsap.to(bgRef.current, {
        y: '-20%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Heading
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      // Phone float
      gsap.from(phoneRef.current, {
        opacity: 0,
        y: 80,
        rotateX: 20,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: phoneRef.current,
          start: 'top 85%',
          once: true,
        },
      })

      gsap.to(phoneRef.current, {
        y: -15,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Milestone cards
      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          x: 60,
          duration: 0.6,
          delay: i * 0.1,
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

  return (
    <section
      id="mobile"
      ref={sectionRef}
      className="mobile-section odyssey-section snap-section"
      aria-label="Era 4: The Mobile Shift — 2010s"
    >
      {/* BG decoration */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Signal waves */}
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute rounded-full border border-[#6c63ff]/20"
            style={{
              width: `${i * 300}px`,
              height: `${i * 300}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `pulse-slow ${2 + i}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20">
        {/* Era label */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[#6c63ff]/70 font-['Share_Tech_Mono'] text-sm tracking-widest">04 /</span>
          <span className="text-[#6c63ff]/70 font-['Share_Tech_Mono'] text-sm tracking-widest uppercase">2010s</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--gap-grid)] items-center">
          {/* Left */}
          <div>
            <div ref={headingRef}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight font-['Outfit'] mb-6">
                THE MOBILE
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#a78bfa]">
                  SHIFT
                </span>
              </h2>
              <ScrambleText className="text-white/70 text-base md:text-lg mb-10 max-w-lg font-['Inter'] leading-relaxed">
                A glass rectangle in your pocket replaced maps, cameras, wallets, TVs,
                and newspapers. The internet went from a destination to a constant companion.
              </ScrambleText>
            </div>

            {/* Milestone cards */}
            <div className="space-y-4" role="list" aria-label="Mobile era milestones">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  ref={el => cardsRef.current[i] = el}
                  id={`milestone-${m.year}`}
                  className="mobile-stat-card flex gap-4 items-start"
                  role="listitem"
                >
                  <div className="text-2xl mt-1">{m.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#6c63ff] font-bold text-sm font-['Share_Tech_Mono']">{m.year}</span>
                      <span className="text-white font-semibold font-['Outfit']">{m.title}</span>
                    </div>
                    <ScrambleText className="text-white/50 text-sm font-['Inter']">{m.desc}</ScrambleText>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone */}
          <div className="flex justify-center">
            <div ref={phoneRef} id="phone-mockup" className="phone-mockup" aria-label="Smartphone mockup">
              <div className="phone-notch" />
              <div className="phone-screen">
                {/* Status bar */}
                <div className="flex justify-between px-4 py-2 text-white/60 text-[9px] font-['Share_Tech_Mono']">
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>
                {/* App grid */}
                <div className="app-icon-grid">
                  {APPS.map((app) => (
                    <button
                      key={app.name}
                      id={`app-icon-${app.name.toLowerCase()}`}
                      className="app-icon"
                      style={{ background: `${app.color}33`, border: `1px solid ${app.color}44` }}
                      title={app.name}
                      aria-label={`${app.name} app`}
                    >
                      {app.emoji}
                    </button>
                  ))}
                </div>
                {/* Dock */}
                <div className="mt-auto border-t border-white/10 mx-2 mb-2 pt-2 grid grid-cols-4 gap-2 px-2">
                  {['📞', '📩', '🎵', '📷'].map((e, i) => (
                    <div
                      key={i}
                      className="app-icon"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['6.8B', 'Smartphone Users'],
            ['90%', 'Mobile Internet Time'],
            ['218B', 'App Downloads/Year'],
            ['$935B', 'App Revenue 2023'],
          ].map(([num, label]) => (
            <div
              key={label}
              className="text-center py-5 rounded-xl"
              style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)' }}
            >
              <div className="text-3xl font-black text-white font-['Outfit']">{num}</div>
              <div className="text-white/50 text-xs mt-1 font-['Inter']">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG wave divider */}
      <div className="wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,50 C400,0 1000,80 1440,20 L1440,80 L0,80 Z" fill="#0f0620" />
        </svg>
      </div>
    </section>
  )
}
