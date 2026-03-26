import { useEffect, useRef, useCallback } from 'react';
import useMobileDetection from '../hooks/useMobileDetection';

/**
 * StarField Background - Expert Refactor
 * - 5-layer parallax
 * - Mobile throttling (30fps)
 * - 50% particle reduction on mobile
 */
const LAYERS_BASE = [
  { count: 180, minR: 0.3, maxR: 0.7, speedFactor: 0.05, alpha: 0.4, twinkleSp: 0.008 },
  { count: 110, minR: 0.6, maxR: 1.0, speedFactor: 0.12, alpha: 0.5, twinkleSp: 0.012 },
  { count:  60, minR: 0.9, maxR: 1.5, speedFactor: 0.25, alpha: 0.7, twinkleSp: 0.018 },
  { count:  35, minR: 1.4, maxR: 2.2, speedFactor: 0.40, alpha: 0.8, twinkleSp: 0.024 },
  { count:  15, minR: 2.0, maxR: 3.0, speedFactor: 0.50, alpha: 1.0, twinkleSp: 0.030 },
];

const NEBULA_COLORS = [
  ['rgba(88,28,135,0.18)', 'transparent'],
  ['rgba(37,99,235,0.14)', 'transparent'],
];

const MAX_SHOOTERS  = 6;
const WARP_VELOCITY = 6.0;   // Threshold to enter warp mode

function rand(min, max) { return min + Math.random() * (max - min); }

function createStar(layer, W, H) {
  return {
    x: rand(0, W),
    y: rand(0, H),
    r: rand(layer.minR, layer.maxR),
    speed: layer.speedFactor,
    alpha: rand(0.4, 1) * layer.alpha,
    twinkle: rand(0, Math.PI * 2),
    twinkleSp: layer.twinkleSp + rand(-0.004, 0.004),
  };
}

function createShooter(W, H) {
  const angle = rand(-0.3, 0.3);
  return {
    x:    rand(0, W),
    y:    rand(0, H * 0.6),
    vx:   Math.cos(angle) * rand(12, 22),
    vy:   Math.sin(angle) * rand(2, 6) + 1,
    len:  rand(100, 250),
    life: 1.0,
    decay:rand(0.02, 0.04),
  };
}

export default function StarField() {
  const { isMobile, targetFPS } = useMobileDetection();
  const canvasRef = useRef(null);
  const stateRef = useRef({
    stars: [],
    shooters: [],
    scrollY: 0,
    velocity: 0,
    warp: false,
    warpFade: 0,
    raf: null,
    t: 0,
    lastTime: 0,
  });

  const initStars = useCallback((W, H) => {
    const stars = [];
    LAYERS_BASE.forEach((layer) => {
      const count = isMobile ? Math.floor(layer.count * 0.4) : layer.count;
      for (let i = 0; i < count; i++) stars.push(createStar(layer, W, H));
    });
    stateRef.current.stars = stars;
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    const nebulaCanvas = document.createElement('canvas');
    const nCtx = nebulaCanvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
      nebulaCanvas.width  = canvas.width;
      nebulaCanvas.height = canvas.height;
      drawNebula(nCtx, canvas.width, canvas.height);
    };

    const drawNebula = (ctx, W, H) => {
      ctx.clearRect(0, 0, W, H);
      NEBULA_COLORS.forEach(([c]) => {
        const x = rand(0.1, 0.9) * W;
        const y = rand(0.1, 0.9) * H;
        const r = rand(W * 0.4, W * 0.7);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, c);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });
    };

    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const v = Math.abs(window.scrollY - s.scrollY);
      s.velocity = v;
      s.scrollY = window.scrollY;
      if (v > WARP_VELOCITY && !s.warp) {
        s.warp = true;
        s.warpFade = 1.0;
        if (s.shooters.length < MAX_SHOOTERS) s.shooters.push(createShooter(canvas.width, canvas.height));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const draw = (time) => {
      const deltaTime = time - s.lastTime;
      const interval = 1000 / targetFPS;
      if (deltaTime < interval) {
        s.raf = requestAnimationFrame(draw);
        return;
      }
      s.lastTime = time - (deltaTime % interval);

      const W = canvas.width;
      const H = canvas.height;
      s.t++;

      ctx.fillStyle = '#000005';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(nebulaCanvas, 0, 0);

      if (s.warpFade > 0) {
        s.warpFade = Math.max(0, s.warpFade - 0.03);
        if (s.warpFade === 0) s.warp = false;
      }

      s.stars.forEach((star) => {
        star.twinkle += star.twinkleSp;
        const op = star.alpha * (0.6 + 0.4 * Math.sin(star.twinkle));
        const stretch = s.warp ? Math.min(s.warpFade * (s.velocity / WARP_VELOCITY) * 15, 25) : 0;

        if (stretch > 2) {
          ctx.strokeStyle = `rgba(255,255,255,${op * 0.5})`;
          ctx.lineWidth = star.r;
          ctx.beginPath();
          ctx.moveTo(star.x - stretch, star.y);
          ctx.lineTo(star.x + stretch, star.y);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255,255,255,${op})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Simple parallax
        star.x -= star.speed * (s.velocity * 0.1);
        if (star.x < -10) star.x = W + 10;
      });

      s.shooters.forEach((sh, idx) => {
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= sh.decay;
        if (sh.life <= 0) s.shooters.splice(idx, 1);
        else {
          ctx.strokeStyle = `rgba(255,255,255,${sh.life})`;
          ctx.lineWidth = 2 * sh.life;
          ctx.beginPath();
          ctx.moveTo(sh.x - sh.len * sh.life, sh.y);
          ctx.lineTo(sh.x, sh.y);
          ctx.stroke();
        }
      });

      s.raf = requestAnimationFrame(draw);
    };

    s.raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [initStars, targetFPS]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', willChange: 'transform' }} aria-hidden="true" />;
}
