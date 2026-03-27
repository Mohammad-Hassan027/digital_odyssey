import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LoadingOverlay from './components/LoadingOverlay'
import SectionNav from './components/SectionNav'
import HeroSection from './components/HeroSection'
import PortalSection from './components/PortalSection'
import TimelineScroll from './components/TimelineScroll'
import StarField from './components/StarField'
import MobileEraNav from './components/MobileEraNav'

gsap.registerPlugin(ScrollTrigger)

// Sections tracked by IntersectionObserver
const FIXED_IDS = ['hero', 'portal']
// Era IDs tracked via the timeline's onActiveEra callback
const ERA_IDS = ['spark', 'boom', 'social', 'mobile', 'future']

export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')

  const handleLoadComplete = useCallback(() => {
    setLoading(false)
    setTimeout(() => ScrollTrigger.refresh(), 150)
  }, [])

  // Track hero + portal via IntersectionObserver
  useEffect(() => {
    if (loading) return

    const observers = FIXED_IDS.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            setActiveSection(id)
          }
        },
        { threshold: 0.45 },
      )
      obs.observe(el)
      return obs
    }).filter(Boolean)

    // Also watch the timeline outer to know we're in the timeline
    const tlEl = document.getElementById('timeline')
    if (tlEl) {
      const tlObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // activeSection within timeline set by onActiveEra callback
          }
        },
        { threshold: 0.5 },
      )
      tlObs.observe(tlEl)
      observers.push(tlObs)
    }

    return () => observers.forEach(o => o.disconnect())
  }, [loading])

  // Called by TimelineScroll as the user scrolls through eras
  const handleActiveEra = useCallback((eraId) => {
    setActiveSection(eraId)
  }, [])

  const ALL_NAV_IDS = [...FIXED_IDS, ...ERA_IDS]

  const scrollTo = (id) => {
    // For era cards inside the pinned timeline, scroll to #timeline then
    // let GSAP handle horizontal position; a direct scrollIntoView on the card
    // won't work because the card is off-screen horizontally.
    if (ERA_IDS.includes(id)) {
      document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {loading && <LoadingOverlay onComplete={handleLoadComplete} />}

      {!loading && (
        <>
          <StarField />
          <div className="noise-overlay" />
          <div className="scanlines" />
          <div className="crt-vignette" />

          <MobileEraNav />
          <SectionNav activeSection={activeSection} />

          {/* ── Brutalist Header ────────────────────────────── */}
          <header
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3"
            style={{
              background: 'rgba(5, 5, 5, 0.85)',
              borderBottom: '1px solid rgba(0, 255, 65, 0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-none border-2 border-spark flex items-center justify-center bg-black">
                <div className="w-1.5 h-1.5 bg-spark" />
              </div>
              <span className="font-mono text-spark text-xs md:text-sm tracking-[0.3em] font-bold uppercase">
                Digital_Odyssey
              </span>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
              {ALL_NAV_IDS.map(id => (
                <button
                  key={id}
                  id={`header-nav-${id}`}
                  onClick={() => scrollTo(id)}
                  className={`text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-all duration-100 ${activeSection === id
                    ? 'text-spark scale-110'
                    : 'text-white/30 hover:text-white/70'
                    }`}
                  aria-current={activeSection === id ? 'page' : undefined}
                >
                  {id === 'hero' ? '0.Intro' :
                    id === 'portal' ? 'P.Gateway' :
                      id === 'spark' ? '01.Spark' :
                        id === 'boom' ? '02.Boom' :
                          id === 'social' ? '03.Social' :
                            id === 'mobile' ? '04.Shift' :
                              '05.Future'}
                </button>
              ))}
            </nav>
          </header>

          {/* ── Main content ────────────────────────────────── */}
          <main className='py-1'>
            <HeroSection />
            <PortalSection />
            <TimelineScroll onActiveEra={handleActiveEra} />
          </main>
        </>
      )}
    </>
  )
}
