import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Compass, LineChart, Telescope, Route as RouteIcon, Trophy, Gauge } from 'lucide-react';
import { SDGS, type Scenario } from '@/data/careers';
import { setState, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Reveal({ children, delay = 0, className, y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ to, decimals = 0, suffix = '', prefix = '' }: { to: number; decimals?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setV(to); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1800, 1);
      setV(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return <span ref={ref}>{prefix}{v.toLocaleString('en-MY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export function PageHeader({ eyebrow, title, children, right }: { eyebrow: string; title: ReactNode; children?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <Reveal><p className="eyebrow mb-3">{eyebrow}</p></Reveal>
        <Reveal delay={0.05}><h1 className="font-display text-4xl leading-[1.02] text-[hsl(40_40%_96%)] sm:text-5xl md:text-6xl">{title}</h1></Reveal>
        {children && <Reveal delay={0.1}><div className="mt-4 text-base text-muted-foreground md:text-lg">{children}</div></Reveal>}
      </div>
      {right && <Reveal delay={0.15}>{right}</Reveal>}
    </div>
  );
}

export function ScenarioToggle() {
  const scenario = useStore((s) => s.scenario);
  const set = (v: Scenario) => setState((s) => ({ ...s, scenario: v }));
  return (
    <div role="radiogroup" aria-label="AI adoption scenario" className="glass inline-flex rounded-full p-1">
      {(['moderate', 'fast'] as Scenario[]).map((v) => (
        <button
          key={v} role="radio" aria-checked={scenario === v} onClick={() => set(v)} data-testid={`toggle-scenario-${v}`}
          className={cn('relative rounded-full px-4 py-2 text-sm font-medium transition-colors', scenario === v ? 'text-[hsl(232_45%_7%)]' : 'text-muted-foreground hover:text-foreground')}
        >
          {scenario === v && <motion.span layoutId="scn" className="absolute inset-0 rounded-full" style={{ background: v === 'fast' ? 'linear-gradient(180deg,hsl(330 85% 72%),hsl(300 70% 60%))' : 'linear-gradient(180deg,hsl(46 100% 70%),hsl(40 95% 52%))' }} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
          <span className="relative">{v === 'fast' ? 'Fast AI adoption' : 'Moderate AI adoption'}</span>
        </button>
      ))}
    </div>
  );
}

const STEPS = [
  { href: '/compass', label: 'Chart', icon: Compass },
  { href: '/insights', label: 'Signals', icon: LineChart },
  { href: '/careers', label: 'Destinations', icon: Telescope },
  { href: '/plan', label: 'Flight plan', icon: RouteIcon },
  { href: '/progress', label: 'Voyage', icon: Trophy },
];

export function JourneyBar() {
  const [loc] = useLocation();
  const idx = STEPS.findIndex((s) => loc.startsWith(s.href));
  return (
    <nav aria-label="Compass journey" className="no-scrollbar mb-10 -mx-4 overflow-x-auto px-4">
      <ol className="flex min-w-max items-center gap-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = i === idx;
          return (
            <li key={s.href} className="flex items-center gap-1">
              <Link href={s.href} data-testid={`link-journey-${s.label.toLowerCase().replace(' ', '-')}`} className={cn('flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors', active ? 'bg-[hsl(44_96%_58%/.14)] text-[hsl(44_100%_78%)] ring-1 ring-[hsl(44_96%_58%/.5)]' : i < idx ? 'text-[hsl(260_60%_85%)] hover:text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <span className="font-mono text-[10px] opacity-60">0{i + 1}</span><Icon className="h-3.5 w-3.5" />{s.label}
              </Link>
              {i < STEPS.length - 1 && <span className={cn('h-px w-6', i < idx ? 'bg-[hsl(44_96%_58%/.6)]' : 'bg-border')} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SdgPill({ n, small }: { n: number; small?: boolean }) {
  const s = SDGS[n];
  if (!s) return null;
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[.03]', small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs')}>
      <span className="grid place-items-center rounded-sm font-mono font-bold text-white" style={{ background: s.color, width: small ? 16 : 22, height: small ? 16 : 22 }}>{n}</span>
      <span className="text-[hsl(232_25%_85%)]">{s.title}</span>
    </span>
  );
}

export function NeedProfile() {
  return (
    <div className="glass glass-hi mx-auto max-w-xl rounded-3xl p-10 text-center">
      <div className="relative mx-auto mb-6 grid h-24 w-24 place-items-center">
        <div className="anim-spin absolute inset-0 rounded-full border border-dashed border-[hsl(44_96%_58%/.5)]" />
        <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,hsl(44_96%_58%/.35),transparent_70%)]" />
        <Gauge className="relative h-8 w-8 text-gold" />
      </div>
      <h2 className="font-display text-3xl">Your compass has no bearing yet</h2>
      <p className="mt-3 text-muted-foreground">Chart where you are first: your stream, interests and skills. It takes about four minutes, or one click with the sample profile.</p>
      <Link href="/compass" className="btn-gold mt-8" data-testid="link-start-compass">Chart my position</Link>
    </div>
  );
}

export function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = size / 2 - 5; const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(235 30% 20%)" strokeWidth="4" fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke="url(#gr)" strokeWidth="4" fill="none" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - score / 100) }} transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }} />
        <defs><linearGradient id="gr"><stop offset="0" stopColor="#ffd56b" /><stop offset="1" stopColor="#b48cff" /></linearGradient></defs>
      </svg>
      <span className="absolute font-mono text-sm font-semibold">{score.toFixed(0)}</span>
    </div>
  );
}
