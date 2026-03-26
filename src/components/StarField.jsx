import { useEffect, useRef, useCallback } from 'react';

/* ─── Layer configs ────────────────────────────────────────────────────────
   depth 0 = farthest (smallest, dimmest, slowest)
   depth 4 = nearest  (largest, brightest, fastest)
──────────────────────────────────────────────────────────────────────────── */
const LAYERS_BASE = [
  { count: 220, minR: 0.3, maxR: 0.7, speedFactor: 0.05, alpha: 0.45, twinkleSp: 0.008 },
  { count: 140, minR: 0.6, maxR: 1.0, speedFactor: 0.15, alpha: 0.60, twinkleSp: 0.012 },
  { count:  80, minR: 0.9, maxR: 1.5, speedFactor: 0.30, alpha: 0.75, twinkleSp: 0.018 },
  { count:  45, minR: 1.4, maxR: 2.2, speedFactor: 0.45, alpha: 0.85, twinkleSp: 0.024 },
  { count:  20, minR: 2.0, maxR: 3.0, speedFactor: 0.55, alpha: 1.00, twinkleSp: 0.030 },
];

const NEBULA_COLORS = [
  ['rgba(88,28,135,0.18)',  'transparent'],
  ['rgba(37,99,235,0.14)',  'transparent'],
  ['rgba(124,58,237,0.12)', 'transparent'],
  ['rgba(6,182,212,0.08)',  'transparent'],
];

const MAX_SHOOTERS  = 6;
const WARP_VELOCITY = 4.5;   // px/scroll-even threshold to enter warp mode

function rand(min, max) { return min + Math.random() * (max - min); }
function randInt(min, max) { return Math.floor(rand(min, max)); }

function createStar(layer, W, H) {
  return {
    x: rand(0, W),
    y: rand(0, H),
    r: rand(layer.minR, layer.maxR),
    speed: layer.speedFactor,
    alpha: rand(0.4, 1) * layer.alpha,
    twinkle: rand(0, Math.PI * 2),   // phase offset
    twinkleSp: layer.twinkleSp + rand(-0.004, 0.004),
  };
}

function createShooter(W, H) {
  const angle = rand(-0.3, 0.3);    // radians from horizontal-right
  return {
    x:    rand(0, W),
    y:    rand(0, H * 0.6),
    vx:   Math.cos(angle) * rand(9, 18),
    vy:   Math.sin(angle) * rand(2, 5) + 1,
    len:  rand(80, 200),
    life: 1.0,
    decay:rand(0.025, 0.045),
  };
}

export default function StarField() {
  const canvasRef    = useRef(null);
  const stateRef     = useRef({
    stars: [],
    shooters: [],
    scrollY: 0,
    lastScrollY: 0,
    velocity: 0,
    warp: false,
    warpFade: 0,
    raf: null,
    t: 0,
  });

  const initStars = useCallback((W, H) => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const stars = [];
    LAYERS_BASE.forEach((layer) => {
      const count = isMobile ? Math.floor(layer.count / 2) : layer.count;
      for (let i = 0; i < count; i++) stars.push({ ...createStar(layer, W, H), speed: layer.speedFactor });
    });
    stateRef.current.stars = stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;

    /* ── Resize ── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
      drawNebula(canvas.width, canvas.height);
    };

    /* ── Nebula (static offscreen canvas) ── */
    const nebulaCanvas = document.createElement('canvas');
    const nCtx         = nebulaCanvas.getContext('2d');
    const drawNebula = (W, H) => {
      nebulaCanvas.width  = W;
      nebulaCanvas.height = H;
      nCtx.clearRect(0, 0, W, H);
      NEBULA_COLORS.forEach(([color], i) => {
        const x = rand(0.1, 0.9) * W;
        const y = rand(0.1, 0.9) * H;
        const rX = rand(0.25, 0.55) * W;
        const rY = rand(0.20, 0.45) * H;
        const g  = nCtx.createRadialGradient(x, y, 0, x, y, Math.max(rX, rY));
        g.addColorStop(0,   color);
        g.addColorStop(1,   'transparent');
        nCtx.save();
        nCtx.scale(1, rY / rX);
        nCtx.fillStyle = g;
        nCtx.beginPath();
        nCtx.arc(x, y * (rX / rY), rX, 0, Math.PI * 2);
        nCtx.fill();
        nCtx.restore();
      });
    };

    resize();
    window.addEventListener('resize', resize);

    /* ── Scroll tracking ── */
    const onScroll = () => {
      s.lastScrollY = s.scrollY;
      s.scrollY     = window.scrollY;
      s.velocity    = Math.abs(s.scrollY - s.lastScrollY);
      if (s.velocity > WARP_VELOCITY) {
        s.warp     = true;
        s.warpFade = 1.0;
        // spawn a shooting star on fast scroll
        if (s.shooters.length < MAX_SHOOTERS) {
          s.shooters.push(createShooter(canvas.width, canvas.height));
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Draw loop ── */
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      s.t++;

      ctx.clearRect(0, 0, W, H);

      // Deep space background
      ctx.fillStyle = '#000005';
      ctx.fillRect(0, 0, W, H);

      // Nebula overlay
      ctx.drawImage(nebulaCanvas, 0, 0);

      // Warp fade out
      if (s.warpFade > 0) {
        s.warpFade = Math.max(0, s.warpFade - 0.02);
        if (s.warpFade === 0) s.warp = false;
      }

      // Stars
      s.stars.forEach((star) => {
        star.twinkle += star.twinkleSp;
        const twinkleAlpha = star.alpha * (0.55 + 0.45 * Math.sin(star.twinkle));

        ctx.save();

        // Warp: stretch stars into lines proportional to velocity
        const stretchFactor = s.warp ? Math.min(s.warpFade * (s.velocity / WARP_VELOCITY) * 12, 18) : 0;

        if (stretchFactor > 1.5) {
          // Draw as motion-blur line
          const sx = star.x - stretchFactor * 0.5;
          const ex = star.x + stretchFactor * 0.5;
          const grad = ctx.createLinearGradient(sx, star.y, ex, star.y);
          grad.addColorStop(0,   `rgba(255,255,255,0)`);
          grad.addColorStop(0.5, `rgba(255,255,255,${twinkleAlpha})`);
          grad.addColorStop(1,   `rgba(255,255,255,0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = star.r * 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, star.y);
          ctx.lineTo(ex, star.y);
          ctx.stroke();
        } else {
          // Normal round star with glow
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3);
          glow.addColorStop(0,   `rgba(255,255,255,${twinkleAlpha})`);
          glow.addColorStop(0.4, `rgba(200,210,255,${twinkleAlpha * 0.5})`);
          glow.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255,255,255,${twinkleAlpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Parallax shift: move star based on scroll * its speed factor
        star.x -= star.speed * (s.velocity > 0 ? s.velocity * 0.3 : 0);
        if (star.x < -10) star.x = W + 10;

        ctx.restore();
      });

      // Shooting stars
      s.shooters = s.shooters.filter((sh) => sh.life > 0.02);
      s.shooters.forEach((sh) => {
        sh.x    += sh.vx;
        sh.y    += sh.vy;
        sh.life -= sh.decay;

        const tail = sh.len * sh.life;
        const grad = ctx.createLinearGradient(sh.x - tail, sh.y, sh.x, sh.y);
        grad.addColorStop(0,   'rgba(255,255,255,0)');
        grad.addColorStop(0.6, `rgba(180,220,255,${sh.life * 0.6})`);
        grad.addColorStop(1,   `rgba(255,255,255,${sh.life})`);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = sh.life * 2.5;
        ctx.beginPath();
        ctx.moveTo(sh.x - tail, sh.y);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();

        // Sparkle tip
        ctx.fillStyle = `rgba(255,255,255,${sh.life})`;
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, sh.life * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Occasional random shooting star (every ~4s)
      if (s.t % 240 === 0 && s.shooters.length < MAX_SHOOTERS) {
        s.shooters.push(createShooter(canvas.width, canvas.height));
      }

      s.raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [initStars]);

  return (
    <canvas
      ref={canvasRef}
      id="starfield-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  );
}
