import { useEffect, useRef, useState } from 'react';
import GlitchReveal from './GlitchReveal';
import ScrambleText from './ScrambleText';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WEBSITES = [
  {
    id: 'geocities',
    title: '🌐 GeoCities',
    year: '1994',
    url: 'www.geocities.com/~coolsite',
    bg: '#000080',
    content: 'Welcome to MY Homepage!! Sign my GuestBook!!',
    badge: 'BEST VIEWED IN 800x600',
    gifText: '🎆 Under Construction 🎆',
  },
  {
    id: 'yahoo',
    title: '🔍 Yahoo!',
    year: '1995',
    url: 'www.yahoo.com',
    bg: '#400090',
    content: 'Search the Web! Click here for FREE email!',
    badge: 'NEW!',
    gifText: '📧 You\'ve Got Mail',
  },
  {
    id: 'amazon',
    title: '📦 Amazon',
    year: '1995',
    url: 'www.amazon.com',
    bg: '#003366',
    content: 'Earth\'s Biggest Selection of Books. Order Now!',
    badge: 'HOT!',
    gifText: '💳 Secure Checkout',
  },
]

export default function BoomSection({ sectionRef }) {
  const headingRef = useRef(null)
  const cardsRef = useRef([])
  const bgRef = useRef(null)
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax BG
      gsap.to(bgRef.current, {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Heading reveal
      gsap.from(headingRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      // Stagger cards
      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          rotateY: -15,
          duration: 0.7,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section
      id="boom"
      ref={sectionRef}
      className="boom-section odyssey-section snap-section"
      aria-label="Era 2: The Boom — 1990s"
    >
      {/* Era background elements */}

      {/* Decorative BG elements */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Starburst */}
        <div
          className="absolute top-10 right-10 w-40 h-40 opacity-20"
          style={{
            background: 'conic-gradient(#ff0 0deg, transparent 10deg, #f60 20deg, transparent 30deg, #ff0 40deg, transparent 50deg, #f60 60deg, transparent 70deg, #ff0 80deg, transparent 90deg, #f60 100deg, transparent 110deg, #ff0 120deg, transparent 130deg, #f60 140deg, transparent 150deg, #ff0 160deg, transparent 170deg, #f60 180deg, transparent 190deg, #ff0 200deg, transparent 210deg, #f60 220deg, transparent 230deg, #ff0 240deg, transparent 250deg, #f60 260deg, transparent 270deg, #ff0 280deg, transparent 290deg, #f60 300deg, transparent 310deg, #ff0 320deg, transparent 330deg, #f60 340deg, transparent 350deg)',
            borderRadius: '50%',
          }}
        />
        {/* Floating price tags */}
        {['$14.99', 'IPO!', 'DOT-COM!', '.COM', '1000%'].map((tag, i) => (
          <div
            key={tag}
            className="absolute font-bold text-white/10 text-4xl md:text-6xl"
            style={{
              top: `${15 + i * 18}%`,
              left: `${5 + (i % 3) * 33}%`,
              transform: `rotate(${-15 + i * 10}deg)`,
              fontFamily: 'Impact, sans-serif',
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20">
        {/* Era label */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-white/50 font-['Share_Tech_Mono'] text-sm tracking-widest">02 /</span>
          <span className="text-white/50 font-['Share_Tech_Mono'] text-sm tracking-widest uppercase">1990s</span>
        </div>

        <div ref={headingRef} className="mb-4">
          <GlitchReveal as="h2" className="text-5xl md:text-6xl lg:text-8xl font-black text-white leading-none" style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '2px #ff6b35' }}>
            THE BOOM
          </GlitchReveal>
          <div className="marquee-container mt-4">
            <span className="marquee-text">
              ★★★ WELCOME TO THE WORLD WIDE WEB ★★★ FREE INTERNET BROWSER INSIDE ★★★ NASDAQ 5000 ★★★ CLICK HERE TO WIN ★★★ THIS SITE BEST VIEWED IN NETSCAPE ★★★ E-COMMERCE IS THE FUTURE ★★★
            </span>
          </div>
        </div>

        <ScrambleText className="text-white/80 text-base md:text-lg mb-12 max-w-xl font-['Inter']">
          The 90s unleashed the web on the world. Dot-coms soared, GeoCities flourished,
          and everyone had a &quot;Under Construction&quot; GIF on their homepage.
        </ScrambleText>

        {/* Interactive Web 1.0 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--gap-grid)]" role="list" aria-label="Iconic 90s websites">
          {WEBSITES.map((site, i) => (
            <article
              key={site.id}
              ref={el => cardsRef.current[i] = el}
              className="boom-card"
              id={`website-card-${site.id}`}
              role="listitem"
              tabIndex={0}
              aria-label={`${site.title} — ${site.year}`}
            >
              {/* Browser chrome */}
              <div className="boom-browser-frame mb-3">
                <div className="boom-browser-titlebar">
                  <span>{site.title}</span>
                  <span style={{ fontFamily: 'Marlett, sans-serif' }}>r</span>
                </div>
                {/* Address bar */}
                <div className="bg-[#c0c0c0] px-2 py-1 border-b border-[#808080] flex items-center gap-1">
                  <span className="text-[9px] text-[#000080]">Address:</span>
                  <div className="flex-1 bg-white border border-[#808080] px-1 text-[10px] font-mono truncate">
                    {site.url}
                  </div>
                  <button className="text-[9px] bg-[#c0c0c0] border border-[#808080] px-2">Go</button>
                </div>
                <div className="boom-browser-content">
                  <p className="text-[#000080] font-bold text-[11px] mb-1">{site.content}</p>
                  <div className="text-center mt-2 text-xs animate-bounce">{site.gifText}</div>
                </div>
              </div>
              {/* Year badge */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-600">{site.year}</span>
                <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 animate-pulse">
                  {site.badge}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['23M', 'Websites in 1999'],
            ['$5T', 'Market Cap Peak'],
            ['248M', 'Internet Users'],
            ['455', 'Days to $1B'],
          ].map(([num, label]) => (
            <div key={label} className="text-center py-4 px-3 bg-white/10 backdrop-blur rounded-lg border border-white/20">
              <div className="text-3xl font-black text-white" style={{ fontFamily: 'Impact, sans-serif' }}>{num}</div>
              <div className="text-white/70 text-xs mt-1 font-['Inter']">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG wave divider */}
      <div className="wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="M0,20 C480,80 960,0 1440,50 L1440,80 L0,80 Z"
            fill="#e8f4fd"
          />
        </svg>
      </div>
    </section>
  )
}
