import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SECTIONS = [
  { id: 'hero',   label: 'Intro' },
  { id: 'portal', label: 'Portal' },
  { id: 'spark',  label: 'The Spark' },
  { id: 'boom',   label: 'The Boom' },
  { id: 'social', label: 'Social Web' },
  { id: 'mobile', label: 'Mobile Shift' },
  { id: 'future', label: 'The Future' },
]

export default function SectionNav({ activeSection }) {
  const navRef = useRef(null)

  useEffect(() => {
    gsap.from(navRef.current, {
      x: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'power3.out',
    })
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav 
      ref={navRef} 
      className="fixed right-5 top-1/2 -translate-y-1/2 z-[1000] hidden md:flex flex-col gap-3"
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          id={`nav-dot-${id}`}
          onClick={() => scrollTo(id)}
          className={`
            w-2 h-2 rounded-none border border-white/40 cursor-pointer 
            transition-all duration-200 
            ${activeSection === id 
              ? 'bg-spark border-spark scale-110 shadow-[4px_4px_0_rgba(0,255,65,0.3)]' 
              : 'bg-transparent'
            }
          `}
          title={label}
          aria-label={`Navigate to ${label}`}
        />
      ))}
    </nav>
  )
}
