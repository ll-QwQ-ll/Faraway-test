import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import logo from '@assets/faraway-logo-trimmed.png';
import { Starfield } from './starfield';
import { setState, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/compass', label: 'Compass', match: ['/compass', '/insights', '/careers', '/plan', '/progress'] },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
];

export function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="Faraway" className={cn('h-auto select-none drop-shadow-[0_0_18px_rgba(255,214,90,.25)]', className)} draggable={false} />;
}

function Nav() {
  const [loc] = useLocation();
  const session = useStore((s) => s.session);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { setOpen(false); }, [loc]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  const isActive = (l: (typeof LINKS)[number]) => (l.match ? l.match.some((m) => loc.startsWith(m)) : l.href === '/' ? loc === '/' : loc.startsWith(l.href));
  const logout = () => setState((s) => ({ ...s, session: null }));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div className={cn('mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500', scrolled || open ? 'glass glass-hi' : 'border border-transparent')}>
        <Link href="/" className="flex items-center" data-testid="link-home-logo" aria-label="Faraway home">
          <Logo className="w-[58px]" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} data-testid={`link-nav-${l.label.toLowerCase()}`} className={cn('relative rounded-full px-4 py-2 text-sm transition-colors', isActive(l) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
              {isActive(l) && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/[.06] ring-1 ring-white/10" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative">{l.label}</span>
              {isActive(l) && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[hsl(var(--gold))] shadow-[0_0_8px_hsl(44_96%_58%)]" />}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground" data-testid="text-session-name">{session.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn-ghost !py-2 text-sm" data-testid="button-logout"><LogOut className="h-4 w-4" />Log out</button>
            </>
          ) : (
            <Link href="/login" className="btn-gold !py-2 text-sm" data-testid="link-login">Log in</Link>
          )}
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full md:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} data-testid="button-menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass glass-hi mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-3xl p-3 md:hidden" aria-label="Mobile">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={cn('rounded-2xl px-4 py-3', isActive(l) ? 'bg-white/[.06] text-gold' : 'text-foreground')} data-testid={`link-mobile-${l.label.toLowerCase()}`}>{l.label}</Link>
            ))}
            {session ? (
              <button onClick={logout} className="btn-ghost mt-2 justify-center" data-testid="button-mobile-logout">Log out {session.name.split(' ')[0]}</button>
            ) : (
              <Link href="/login" className="btn-gold mt-2 justify-center" data-testid="link-mobile-login">Log in</Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/5">
      <div className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-[hsl(44_96%_58%/.6)] to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="w-28" />
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">A compass for careers in an age of fast-moving AI. Built in Malaysia for graduates, job seekers and the career centres who guide them.</p>
        </div>
        {[
          { h: 'Navigate', l: [['Chart your skills', '/compass'], ['Market signals', '/insights'], ['Career matches', '/careers'], ['Flight plan', '/plan']] },
          { h: 'Learn', l: [['Course catalogue', '/courses'], ['Python Programming', '/courses/python-programming'], ['Your voyage', '/progress']] },
          { h: 'Faraway', l: [['About', '/about'], ['Log in', '/login'], ['Create account', '/register']] },
        ].map((c) => (
          <div key={c.h}>
            <p className="eyebrow mb-4">{c.h}</p>
            <ul className="space-y-2.5 text-sm">
              {c.l.map(([t, h]) => <li key={h}><Link href={h} className="text-muted-foreground transition-colors hover:text-gold">{t}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/5 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>2025 Faraway. Demo prototype — market figures are illustrative, not live data.</span>
        <span className="font-mono">3.1390 N, 101.6869 E</span>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [loc]);
  const bare = loc === '/login' || loc === '/register';
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip">
      <Starfield />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[hsl(var(--gold))] focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      {!bare && <Nav />}
      <AnimatePresence mode="wait">
        <motion.main
          id="main" key={loc} className="relative z-10"
          initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!bare && <Footer />}
    </div>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 md:pt-36', className)}>{children}</div>;
}
