import { useEffect, useRef, useState } from 'react'
import useMobileDetection from '../hooks/useMobileDetection'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Era definitions ──────────────────────────────────────────
const ERAS = [
  {
    id: 'spark',
    num: '01',
    decade: '1969 – 1979',
    title: 'THE SPARK',
    subtitle: 'ARPANET & The First Message',
    accent: '#00ff41',
    dim: 'rgba(0,255,65,0.4)',
    bg: 'radial-gradient(ellipse 80% 80% at 40% 50%, #001a06 0%, #000 70%)',
    border: 'rgba(0,255,65,0.25)',
    fontMono: true,
    facts: [
      { year: '1969', text: '"LO" — only two letters before the system crashed. The internet\'s first word.' },
      { year: '1971', text: 'Ray Tomlinson sends the first email. The @ symbol finds its purpose.' },
      { year: '1973', text: 'Vint Cerf & Bob Kahn draft TCP/IP — the protocol that rules the internet.' },
    ],
    stats: [['4', 'ARPANET Nodes'], ['1969', 'Year Zero'], ['56K', 'Baud Rate']],
    vizLines: [
      '$ ssh root@arpanet-node-1',
      '> Connecting to UCLA IMP…',
      '> PACKET ROUTING ACTIVE',
      '> Received: "LO"',
      '> Connection lost.',
      '$ _',
    ],
    artifacts: ['> NODE_ONLINE', '01001100', 'IMP #1'],
    starColors: ['#00ff41', '#003b10', '#00cc33'],
  },
  {
    id: 'boom',
    num: '02',
    decade: '1990 – 1999',
    title: 'THE BOOM',
    subtitle: 'The Dot-Com Explosion',
    accent: '#ff6b35',
    dim: 'rgba(255,107,53,0.5)',
    bg: 'linear-gradient(135deg, #12003a 0%, #3d006a 40%, #a03000 80%, #cc4400 100%)',
    border: 'rgba(255,107,53,0.3)',
    fontMono: false,
    facts: [
      { year: '1991', text: 'Tim Berners-Lee opens the World Wide Web to the public. Everything changes.' },
      { year: '1998', text: 'Google is founded in a garage. The age of search begins.' },
      { year: '2000', text: 'NASDAQ crashes from 5,048 to 1,114. $5 trillion evaporates overnight.' },
    ],
    stats: [['23M', 'Websites 1999'], ['$5T', 'Peak Cap'], ['248M', 'Users']],
    vizLines: [
      '★★★ WELCOME TO MY HOMEPAGE ★★★',
      '🎆 Under Construction 🎆',
      'BEST VIEWED IN 800×600',
      '[ FREE INTERNET EXPLORER ]',
      'YOU\'VE GOT MAIL! 📧',
    ],
    artifacts: ['.COM', 'IPO!', '1000%↑'],
    starColors: ['#ff6b35', '#4a0080', '#ffcc00'],
  },
  {
    id: 'social',
    num: '03',
    decade: '2003 – 2012',
    title: 'SOCIAL WEB',
    subtitle: 'One Billion Connected Voices',
    accent: '#1877f2',
    dim: 'rgba(24,119,242,0.5)',
    bg: 'linear-gradient(160deg, #d8eeff 0%, #b0d4f7 40%, #8ab8ef 100%)',
    border: 'rgba(24,119,242,0.2)',
    fontMono: false,
    light: true,
    facts: [
      { year: '2004', text: 'Mark Zuckerberg launches "Thefacebook" from his Harvard dorm room.' },
      { year: '2006', text: '"just setting up my twttr" — Jack Dorsey\'s first tweet to nobody.' },
      { year: '2010', text: 'Instagram: 25,000 downloads on day one. The filter era begins.' },
    ],
    stats: [['2.9B', 'Facebook Users'], ['500M', 'Daily Tweets'], ['100B', 'Likes/Day']],
    vizLines: [
      'Mark Z. @zuck · 2004',
      '"Thefacebook is live."',
      '❤️ 1,000,000  💬 42',
      '─────────────────',
      'Jack D. @jack · 2006',
      '"just setting up my twttr"',
    ],
    artifacts: ['❤️', '@', '#'],
    starColors: ['#1877f2', '#42a5f5', '#90caf9'],
  },
  {
    id: 'mobile',
    num: '04',
    decade: '2007 – 2019',
    title: 'MOBILE SHIFT',
    subtitle: 'A Computer in Every Pocket',
    accent: '#a78bfa',
    dim: 'rgba(108,99,255,0.5)',
    bg: 'linear-gradient(155deg, #12122a 0%, #0f3460 50%, #3d1070 100%)',
    border: 'rgba(108,99,255,0.3)',
    fontMono: false,
    facts: [
      { year: '2007', text: '"An iPod, a phone, and an internet communicator." Jobs reveals the iPhone.' },
      { year: '2012', text: 'More smartphones than toothbrushes. 1 billion devices worldwide.' },
      { year: '2016', text: '4G everywhere. Uber, TikTok, Deliveroo — the always-on economy born.' },
    ],
    stats: [['6.8B', 'Smartphones'], ['90%', 'Web = Mobile'], ['218B', 'Apps/Year']],
    vizLines: ['📱', '📷  🗺  💳', '🎵  💬  🎮', '📧  ✈️  🔍', '⌚  🏠  💡'],
    artifacts: ['📱', '⚡', '5G'],
    starColors: ['#a78bfa', '#6c63ff', '#c084fc'],
  },
  {
    id: 'future',
    num: '05',
    decade: 'Web3 & Beyond',
    title: 'THE FUTURE',
    subtitle: 'Decentralised. Intelligent. Yours.',
    accent: '#a78bfa',
    dim: 'rgba(167,139,250,0.45)',
    bg: 'radial-gradient(ellipse 90% 80% at 30% 30%, #1a0a3e 0%, #0f0620 50%, #000 100%)',
    border: 'rgba(167,139,250,0.25)',
    fontMono: false,
    facts: [
      { year: '2009', text: 'Bitcoin: peer-to-peer money. No banks, no borders, no trust required.' },
      { year: '2022', text: 'ChatGPT reaches 100 million users in 60 days. AI becomes a utility.' },
      { year: '∞', text: 'No servers, no gatekeepers. The internet owned by its users, at last.' },
    ],
    stats: [['$3T', 'Crypto Market'], ['100M', 'GPT Users'], ['∞', 'Potential']],
    vizLines: [
      '◈ BLOCKCHAIN VERIFIED',
      '◈ AI MODEL ONLINE',
      '◈ DECENTRALISED: TRUE',
      '◈ OWNER: YOU',
      '◈ STATUS: BUILDING…',
    ],
    artifacts: ['⛓️', '🤖', '◈'],
    starColors: ['#a78bfa', '#6c63ff', '#c084fc'],
  },
]

// ─── Random background star field (generated once) ──────────
const STARS = Array.from({ length: 180 }, () => ({
  x: Math.random() * 500,  // % of total track width (0–500)
  y: Math.random() * 100,
  r: 0.5 + Math.random() * 2,
  o: 0.15 + Math.random() * 0.7,
  c: ['#ffffff', '#aaffcc', '#cceeff', '#ffddaa'][Math.floor(Math.random() * 4)],
}))

export default function TimelineScroll({ onActiveEra }) {
  const { isMobile } = useMobileDetection()
  const outerRef    = useRef(null)   // pinned wrapper
  const trackRef    = useRef(null)   // horizontal flex track
  const starsRef    = useRef(null)   // slow parallax layer
  const artifactsRef = useRef(null)  // fast parallax layer
  const progressRef = useRef(null)   // progress bar fill el
  const cardsRef    = useRef([])     // card DOM nodes

  const [progress, setProgress]   = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const outer = outerRef.current
    const track = trackRef.current
    const cards = cardsRef.current.filter(Boolean)
    if (!outer || !track || cards.length === 0) return

    let raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        const n = ERAS.length
        const getTravel = () => track.scrollWidth - window.innerWidth

        // ── Main horizontal pin ────────────────────────────────
        const hST = ScrollTrigger.create({
          id: 'hscroll',
          trigger: outer,
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          start: 'top top',
          end: () => `+=${getTravel()}`,
          animation: gsap.to(track, {
            x: () => -getTravel(),
            ease: 'none',
          }),
          onUpdate(self) {
            const prog = self.progress          // 0–1 for whole track
            const pct  = Math.round(prog * 100)

            // ── Progress bar ────────────────────────────────
            setProgress(pct)
            if (progressRef.current) {
              gsap.set(progressRef.current, { width: `${pct}%` })
            }

            // ── Active era ─────────────────────────────────
            const idx = Math.min(Math.floor(prog * n), n - 1)
            setActiveIdx(idx)
            onActiveEra?.(ERAS[idx].id)

            // ── Per-card 3D rotation ────────────────────────
            // Each card occupies 1/n of the total travel.
            // cardProg = where this card sits in [0,1] scroll space
            cards.forEach((card, i) => {
              const cardStart = i / n
              const cardEnd   = (i + 1) / n
              const cardMid   = (cardStart + cardEnd) / 2

              const limitIn  = isMobile ? 15 : 45
              const limitOut = isMobile ? -12 : -35

              let rotY = 0

              if (prog < cardStart) {
                rotY = limitIn
              } else if (prog <= cardMid) {
                const t = (prog - cardStart) / (cardMid - cardStart)
                rotY = limitIn * (1 - t)
              } else if (prog <= cardEnd) {
                const t = (prog - cardMid) / (cardEnd - cardMid)
                rotY = limitOut * t
              } else {
                rotY = limitOut
              }

              const sc = rotY === 0 ? 1 : rotY > 0
                ? 0.92 + (1.0 - 0.92) * (1 - rotY / limitIn)
                : 1.0 + (0.95 - 1.0) * (Math.abs(rotY) / Math.abs(limitOut))
              
              const op = rotY === 0 ? 1 : Math.abs(rotY) > (isMobile ? 10 : 30) ? 0.5 : 1 - (Math.abs(rotY) / 30) * 0.5

              gsap.set(card, { rotateY: rotY, scale: sc, opacity: op })
            })
          },
        })

        // ── Stars parallax ─────────────────────────────────────
        if (starsRef.current) {
          gsap.to(starsRef.current, {
            x: () => getTravel() * 0.18,
            ease: 'none',
            scrollTrigger: {
              trigger: outer,
              scrub: 1,
              invalidateOnRefresh: true,
              start: 'top top',
              end: () => `+=${getTravel()}`,
            },
          })
        }

        // ── Artifacts parallax ──────────────────────────────────
        if (artifactsRef.current) {
          gsap.to(artifactsRef.current, {
            x: () => -getTravel() * 0.55,
            ease: 'none',
            scrollTrigger: {
              trigger: outer,
              scrub: 1,
              invalidateOnRefresh: true,
              start: 'top top',
              end: () => `+=${getTravel()}`,
            },
          })
        }

        // Initialise first card at rotateY=0, rest at 45
        cards.forEach((card, i) => {
          gsap.set(card, { rotateY: i === 0 ? 0 : 45, opacity: i === 0 ? 1 : 0.3, scale: i === 0 ? 1 : 0.9 })
        })

        outer._gsapHST = hST
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      outer._gsapHST?.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
      gsap.killTweensOf([track, starsRef.current, artifactsRef.current, ...cards])
    }
  }, [onActiveEra])


  const currentEra = ERAS[activeIdx]

  return (
    <div
      id="timeline"
      ref={outerRef}
      className="tl-outer"
      aria-label="Interactive timeline: Evolution of the Internet"
    >
      {/* ── Star field parallax layer (slowest) ─────────────── */}
      <div ref={starsRef} className="tl-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="tl-star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width:  `${s.r * 2}px`,
              height: `${s.r * 2}px`,
              opacity: s.o,
              background: s.c,
              boxShadow: `0 0 ${s.r * 3}px ${s.c}`,
            }}
          />
        ))}
      </div>

      {/* ── Horizontal scroll track ──────────────────────────── */}
      <div ref={trackRef} className="tl-track" style={{ width: `${ERAS.length * 100}vw` }}>

        {/* ── Floating artifact layer (fastest parallax) ──────── */}
        <div
          ref={artifactsRef}
          className="tl-artifacts"
          style={{ width: `${ERAS.length * 100}vw` }}
          aria-hidden="true"
        >
          {ERAS.map((era, ei) =>
            era.artifacts.map((art, ai) => (
              <div
                key={`${ei}-${ai}`}
                className="tl-artifact-item"
                style={{
                  left:  `${ei * 20 + ai * 6 + 2}%`,
                  top:   `${20 + ai * 30}%`,
                  color: era.accent,
                  opacity: 0.12 + ai * 0.04,
                  fontFamily: era.fontMono ? 'var(--font-mono)' : 'var(--font-outfit)',
                  textShadow: `0 0 30px ${era.accent}`,
                }}
              >
                {art}
              </div>
            ))
          )}
        </div>

        {/* ── Era Cards ─────────────────────────────────────── */}
        {ERAS.map((era, i) => (
          <div key={era.id} className="tl-card-perspective">
            <article
              id={era.id}
              ref={el => cardsRef.current[i] = el}
              className={`tl-card ${era.light ? 'tl-card--light' : ''}`}
              style={{
                background: era.bg,
                '--accent': era.accent,
                '--dim': era.dim,
                '--border': era.border,
              }}
              aria-label={`Era ${era.num}: ${era.title} — ${era.decade}`}
            >
              {/* ── Card inner layout ─────────────────────── */}
              <div className="tl-card-inner">

                {/* ── Left column: metadata + facts ─────── */}
                <div className="tl-card-left">
                  {/* Era badge */}
                  <div className="tl-era-badge">
                    <span
                      className="tl-era-num"
                      style={{ color: era.accent, fontFamily: 'var(--font-mono)' }}
                    >
                      {era.num}
                    </span>
                    <span
                      className="tl-era-decade"
                      style={{ color: era.dim, fontFamily: 'var(--font-mono)' }}
                    >
                      {era.decade}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="tl-card-title"
                    style={{
                      color: era.accent,
                      fontFamily: era.fontMono ? 'var(--font-mono)' : 'var(--font-outfit)',
                      textShadow: `0 0 30px ${era.accent}60, 0 0 60px ${era.accent}25`,
                    }}
                  >
                    {era.title}
                  </h2>
                  <p
                    className="tl-card-subtitle"
                    style={{ color: era.dim }}
                  >
                    {era.subtitle}
                  </p>

                  {/* Divider */}
                  <div className="tl-divider" style={{ background: era.border }} />

                  {/* Facts */}
                  <ul className="tl-facts" aria-label="Key milestones">
                    {era.facts.map((f, fi) => (
                      <li key={fi} className="tl-fact">
                        <span
                          className="tl-fact-year"
                          style={{
                            color: era.accent,
                            fontFamily: 'var(--font-mono)',
                            borderColor: era.border,
                          }}
                        >
                          {f.year}
                        </span>
                        <p
                          className="tl-fact-text"
                          style={{ color: era.light ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.65)' }}
                        >
                          {f.text}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {/* Stats row */}
                  <div className="tl-stats">
                    {era.stats.map(([val, lab]) => (
                      <div key={lab} className="tl-stat" style={{ borderColor: era.border }}>
                        <span
                          className="tl-stat-val"
                          style={{ color: era.accent, fontFamily: 'var(--font-mono)' }}
                        >
                          {val}
                        </span>
                        <span
                          className="tl-stat-lab"
                          style={{ color: era.dim }}
                        >
                          {lab}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Right column: era visual ───────────── */}
                <div className="tl-card-right">
                  <EraVisual era={era} />
                </div>

              </div>

              {/* ── Corner number watermark ────────────── */}
              <div
                className="tl-watermark"
                style={{
                  color: era.accent,
                  fontFamily: 'var(--font-mono)',
                  opacity: 0.04,
                }}
              >
                {era.num}
              </div>

              {/* ── Bottom accent border ───────────────── */}
              <div
                className="tl-card-bottom-border"
                style={{ background: `linear-gradient(90deg, transparent, ${era.accent}60, transparent)` }}
              />
            </article>
          </div>
        ))}

      </div>

      {/* ── Retro Pixel Progress Bar ────────────────────────── */}
      <div className="tl-progress-outer" aria-label={`Timeline progress: ${progress}%`}>
        <div className="tl-progress-header">
          <span className="tl-progress-label">
            {String(progress).padStart(3, '0')}%
          </span>
          <span className="tl-progress-era">
            // {currentEra?.decade ?? ''}
          </span>
          <span className="tl-progress-label">
            ERA {String(activeIdx + 1).padStart(2, '0')} / {String(ERAS.length).padStart(2, '0')}
          </span>
        </div>
        <div className="tl-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div ref={progressRef} className="tl-progress-fill" style={{ '--era-accent': currentEra?.accent ?? '#00ff41' }} />
          {/* Pixel segment guides */}
          {ERAS.map((_, i) => (
            <div
              key={i}
              className="tl-progress-tick"
              style={{ left: `${(i / ERAS.length) * 100}%` }}
            />
          ))}
        </div>
        {/* Era labels below track */}
        <div className="tl-progress-labels">
          {ERAS.map((era, i) => (
            <span
              key={era.id}
              className={`tl-progress-era-label ${i === activeIdx ? 'tl-progress-era-label--active' : ''}`}
              style={{
                left: `${(i / (ERAS.length - 1)) * 100}%`,
                color: i === activeIdx ? era.accent : 'rgba(255,255,255,0.25)',
              }}
            >
              {era.num}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Per-era right-panel visual ──────────────────────────────
function EraVisual({ era }) {
  return (
    <div
      className="era-visual-wrap"
      style={{
        borderColor: era.border,
        background: `linear-gradient(135deg, ${era.accent}08, transparent)`,
      }}
    >
      {/* Decorative corner dots */}
      {[0, 1, 2, 3].map(c => (
        <div
          key={c}
          className={`era-corner era-corner-${c}`}
          style={{ borderColor: era.accent }}
        />
      ))}

      {/* Era-specific content lines */}
      <div className="era-viz-lines">
        {era.vizLines.map((line, li) => (
          <p
            key={li}
            className="era-viz-line"
            style={{
              fontFamily: era.fontMono ? 'var(--font-mono)' : 'inherit',
              color: li === 0
                ? era.accent
                : era.light
                  ? `rgba(0,0,0,${0.7 - li * 0.1})`
                  : `rgba(255,255,255,${0.7 - li * 0.08})`,
              animationDelay: `${li * 0.15}s`,
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Pulsing accent dot */}
      <div
        className="era-pulse-dot"
        style={{
          background: era.accent,
          boxShadow: `0 0 20px ${era.accent}, 0 0 40px ${era.accent}40`,
        }}
      />

      {/* Era number backdrop */}
      <div
        className="era-viz-num"
        style={{ color: era.accent }}
      >
        {era.num}
      </div>
    </div>
  )
}
