import { useEffect, useRef, useState, useCallback } from 'react';

const GLITCH_CHARS = '0123456789#@!%&$?/\\|<>[]{}~^*+=';
const FRAME_COUNT  = 4;            // number of glitch decode frames
const FRAME_MS     = 90;           // ms per frame
const GLITCH_MS    = FRAME_COUNT * FRAME_MS + 120;

function scramble(text, intensity) {
  return text
    .split('')
    .map((c) => (c !== ' ' && Math.random() < intensity
      ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      : c))
    .join('');
}

/**
 * GlitchReveal — scroll-triggered glitch decode effect.
 *
 * - Detects 20 % viewport entry via IntersectionObserver
 * - Shows 3-4 rapid glitch frames (numbers / symbols replace letters)
 * - Applies layered CSS: red/cyan offset text-shadows, clip-path noise,
 *   horizontal scanline wipe (::after pseudo-element)
 * - Fires once per mount (observer disconnects after first trigger)
 */
export default function GlitchReveal({ children, className = '', as: Tag = 'span' }) {
  const wrapRef      = useRef(null);
  const textRef      = useRef(null);   // inner text-only span
  const originalRef  = useRef('');
  const firedRef     = useRef(false);
  const [phase, setPhase] = useState('hidden'); // hidden | glitch | clear

  // Build scanline + glitch animation
  const runGlitch = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const el = textRef.current;
    if (!el) return;
    const original = originalRef.current;

    // intensities descend frame-by-frame
    const intensities = [1.0, 0.7, 0.4, 0.15];
    let frame = 0;

    setPhase('glitch');

    const tick = () => {
      if (frame >= FRAME_COUNT) {
        el.textContent = original;
        setPhase('clear');
        return;
      }
      el.textContent = scramble(original, intensities[frame]);
      frame++;
      setTimeout(tick, FRAME_MS);
    };

    tick();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const textEl = textRef.current;
    if (!wrap || !textEl) return;

    // Capture original text AFTER react renders
    originalRef.current = textEl.textContent;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          // Small rAF delay so CSS transition doesn't fight render
          requestAnimationFrame(runGlitch);
        }
      },
      {
        rootMargin: '0px 0px -20% 0px', // trigger at 20 % viewport
        threshold:  0.1,
      }
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [runGlitch]);

  return (
    <Tag
      ref={wrapRef}
      className={[
        'glitch-reveal-wrap',
        phase === 'glitch' ? 'gr-glitch' : '',
        phase === 'clear'  ? 'gr-clear'  : '',
        className,
      ].join(' ')}
    >
      {/* scanline element */}
      <span className="gr-scanline" aria-hidden="true" />

      {/* text layer — we mutate textContent here */}
      <span ref={textRef} className="gr-text">
        {children}
      </span>
    </Tag>
  );
}
