import { useEffect, useRef } from 'react';

interface Star { x: number; y: number; z: number; r: number; t: number; gold: boolean }

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    let stars: Star[] = [];
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(420, Math.floor((w * h) / 4200));
      stars = Array.from({ length: count }, () => {
        const z = Math.random();
        return { x: Math.random() * w, y: Math.random() * h * 1.6, z, r: 0.3 + z * 1.4, t: Math.random() * Math.PI * 2, gold: Math.random() < 0.07 };
      });
    };

    const draw = (time: number) => {
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
      const sy = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const px = s.x + mx * s.z * 18;
        let py = (s.y - sy * s.z * 0.25 + my * s.z * 18) % (h * 1.6);
        if (py < 0) py += h * 1.6;
        if (py > h + 4) continue;
        const tw = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(time * 0.0012 * (0.5 + s.z) + s.t);
        ctx.globalAlpha = tw * (0.35 + s.z * 0.65);
        ctx.fillStyle = s.gold ? '#ffd56b' : s.z > 0.8 ? '#e8e6ff' : '#a9b4ff';
        ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2); ctx.fill();
        if (s.z > 0.93) {
          ctx.globalAlpha = tw * 0.25;
          ctx.fillRect(px - s.r * 4, py - 0.3, s.r * 8, 0.6);
          ctx.fillRect(px - 0.3, py - s.r * 4, 0.6, s.r * 8);
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => { tmx = e.clientX / w - 0.5; tmy = e.clientY / h - 0.5; };
    const onScroll = () => { if (reduce) draw(0); };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
