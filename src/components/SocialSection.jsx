import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const POSTS = [
  {
    id: 'post-1',
    avatar: '👨‍💻',
    name: 'Mark Z.',
    handle: '@zuck2004',
    time: '2004',
    content: 'Just launched a little site from my dorm room. You can rate people... or connect. Thefacebook.',
    likes: 1_000_000,
    comments: 42,
    platform: 'Facebook',
    color: '#1877f2',
  },
  {
    id: 'post-2',
    avatar: '🐦',
    name: 'Jack D.',
    handle: '@jack2006',
    time: '2006',
    content: 'just setting up my twttr',
    likes: 250_000,
    comments: 9000,
    platform: 'Twitter',
    color: '#1da1f2',
  },
  {
    id: 'post-3',
    avatar: '📸',
    name: 'Kevin S.',
    handle: '@instagramCEO',
    time: '2010',
    content: 'Filters. Square photos. 24 hours later — 25,000 users. This changes everything. #Instagram',
    likes: 500_000,
    comments: 12000,
    platform: 'Instagram',
    color: '#e1306c',
  },
]

function formatNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

export default function SocialSection({ sectionRef }) {
  const headingRef = useRef(null)
  const cardsRef = useRef([])
  const bgRef = useRef(null)
  const [likedPosts, setLikedPosts] = useState({})

  const toggleLike = (id) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: '15%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

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

      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          x: i % 2 === 0 ? -60 : 60,
          duration: 0.7,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section
      id="social"
      ref={sectionRef}
      className="social-section odyssey-section snap-section"
      aria-label="Era 3: The Social Web — 2000s"
    >
      {/* Parallax BG decorations */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="#1877f2"
              strokeWidth="1"
              strokeDasharray="4,8"
            />
          ))}
        </svg>
        {/* Floating avatars */}
        {['👤', '👥', '💬', '❤️', '🔗', '🌐'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              top: `${10 + (i * 16)}%`,
              left: `${(i % 2 === 0 ? 85 : 2) + (i * 2)}%`,
              animation: `float-particle ${6 + i * 2}s ease-in-out ${i}s infinite alternate`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20">
        {/* Era label */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[#1877f2]/70 font-['Share_Tech_Mono'] text-sm tracking-widest">03 /</span>
          <span className="text-[#1877f2]/70 font-['Share_Tech_Mono'] text-sm tracking-widest uppercase">2000s</span>
        </div>

        <div ref={headingRef} className="mb-4">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#1c1e21] leading-tight font-['Outfit']">
            THE SOCIAL
            <span className="text-[#1877f2]"> WEB</span>
          </h2>
          <ScrambleText className="text-[#4b5563] text-base md:text-xl mt-4 max-w-xl font-['Inter']">
            One billion people connect. Share. Like. Follow. The internet stops being
            about information — and starts being about <em>people</em>.
          </ScrambleText>
        </div>

        {/* Connection statistic banner */}
        <div className="mb-10 p-4 rounded-xl bg-gradient-to-r from-[#1877f2]/10 to-[#1da1f2]/10 border border-[#1877f2]/20 flex flex-wrap gap-6 items-center">
          {[['2004', 'Facebook Founded'], ['2006', 'Twitter Launches'], ['2008', '100M on Facebook'], ['2010', 'Instagram Born']].map(([year, ev]) => (
            <div key={year} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1877f2]" />
              <span className="text-sm font-bold text-[#1877f2]">{year}</span>
              <span className="text-sm text-[#4b5563]">{ev}</span>
            </div>
          ))}
        </div>

        {/* Social post cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="feed" aria-label="Historic social media posts">
          {POSTS.map((post, i) => (
            <article
              key={post.id}
              ref={el => cardsRef.current[i] = el}
              className="social-card"
              id={post.id}
              aria-label={`Post by ${post.name}`}
            >
              {/* Platform badge */}
              <div
                className="inline-block text-white text-[10px] font-bold px-2 py-1 rounded-full mb-3"
                style={{ background: post.color }}
              >
                {post.platform}
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${post.color}20`, border: `2px solid ${post.color}40` }}
                >
                  {post.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1c1e21]">{post.name}</div>
                  <div className="text-xs text-gray-400">{post.handle} · {post.time}</div>
                </div>
              </div>

              {/* Content */}
              <ScrambleText className="text-sm text-[#333] leading-relaxed mb-4 font-['Inter']">
                {post.content}
              </ScrambleText>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  id={`like-btn-${post.id}`}
                  className={`like-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                  onClick={() => toggleLike(post.id)}
                  aria-pressed={!!likedPosts[post.id]}
                  aria-label={`Like post by ${post.name}`}
                >
                  {likedPosts[post.id] ? '❤️' : '🤍'} {formatNum(post.likes + (likedPosts[post.id] ? 1 : 0))}
                </button>
                <span className="text-sm text-gray-400 font-['Inter']">💬 {formatNum(post.comments)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* SVG wave divider */}
      <div className="wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,30 C200,80 800,0 1440,60 L1440,80 L0,80 Z" fill="#1a1a2e" />
        </svg>
      </div>
    </section>
  )
}
