import { type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Atom, BarChart3, Briefcase, Brain, LogOut, RotateCcw, Building2, LayoutGrid } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { resetJourney, setState, useStore } from '@/lib/store';
import { rankCareers } from '@/lib/match';
import { cn } from '@/lib/utils';
import { Aurora, LOGO, Magnetic, SpectrumIcon } from './spectrum';

const CRUMB: Record<string, string> = {
  '/': 'Personal', '/pathway': 'Explore pathway', '/analysis': 'Skill analysis', '/plan': 'Study plan', '/progress': 'Learning progress', '/organization': 'Organization',
};

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'FA';
}

export function Shell({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const session = useStore((s) => s.session);
  const profile = useStore((s) => s.profile);
  const scenario = useStore((s) => s.scenario);
  const target = useStore((s) => s.plan.target);
  const jobHref = '/jobs/' + (target || (profile.stream ? rankCareers(profile, scenario)[0].career.id : 'data-analyst'));

  const items = [
    { href: '/pathway', label: 'Explore pathway', icon: Atom, match: (l: string) => l.startsWith('/pathway') },
    { href: '/analysis', label: 'Skill analysis', icon: BarChart3, match: (l: string) => l.startsWith('/analysis') },
    { href: jobHref, label: 'Career target', icon: Briefcase, match: (l: string) => l.startsWith('/jobs') },
    { href: '/plan', label: 'Study plan & progress', icon: Brain, match: (l: string) => l.startsWith('/plan') || l.startsWith('/progress') },
  ];
  const crumb = loc.startsWith('/jobs') ? 'Career target' : CRUMB[loc] ?? 'Personal';
  const name = session?.name ?? 'Guest';

  return (
    <div className="relative min-h-[100dvh]">
      <Aurora />
      {/* Left icon rail */}
      <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t bg-white/80 backdrop-blur-xl md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-[76px] md:flex-col md:justify-start md:border-r md:border-t-0 md:pt-5">
        <Link href="/" className="hidden md:mb-[8vh] md:block" data-testid="link-home-logo" aria-label="Faraway home">
          <motion.img src={LOGO} alt="Faraway" className="h-11 w-11 object-contain drop-shadow-[0_2px_6px_rgba(200,150,0,.25)]" whileHover={{ rotate: 25 }} transition={{ type: 'spring', stiffness: 200 }} />
        </Link>
        <Link href="/" className="md:hidden" data-testid="link-home-mobile" aria-label="Dashboard"><div className={cn('grid h-11 w-11 place-items-center rounded-2xl', loc === '/' && 'bg-white shadow-md')}><SpectrumIcon icon={LayoutGrid} size={20} still={loc !== '/'} /></div></Link>
        {items.map((it, i) => {
          const active = it.match(loc);
          return (
            <Magnetic key={it.label} strength={0.35} className={cn(i === 2 && 'md:mt-[10vh]', i === 1 && 'md:mt-[8vh]', i === 3 && 'md:mt-[6vh]')}>
              <Link href={it.href} data-testid={`nav-${it.label.toLowerCase().replace(/\W+/g, '-')}`} aria-label={it.label} className="group relative block">
                <div className={cn('relative grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300', active ? 'bg-white shadow-[0_10px_30px_-12px_hsl(250_60%_40%/.45)]' : 'hover:bg-white hover:shadow-md')}>
                  {active && <motion.span layoutId="rail-active" className="spectrum-border absolute inset-0 rounded-2xl" />}
                  <SpectrumIcon icon={it.icon} size={22} still={!active} />
                </div>
                <span className="pointer-events-none absolute left-[60px] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs text-white opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 md:block">{it.label}</span>
              </Link>
            </Magnetic>
          );
        })}
      </nav>

      <div className="md:pl-[76px]">
        <header className="mx-auto max-w-[1280px] px-5 pt-5 sm:px-8 md:px-12">
          <div className="flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm" data-testid="text-breadcrumb">
              <img src={LOGO} alt="" className="h-7 w-7 object-contain md:hidden" />
              <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground" data-testid="link-crumb-workspace">Workspace</Link>
              <span className="text-muted-foreground/50">/</span>
              <span className="font-medium">{crumb}</span>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex flex-col items-center gap-1 outline-none" data-testid="button-avatar">
                  <span className="spectrum-border relative grid h-10 w-10 place-items-center rounded-full bg-white font-mono text-xs font-medium shadow-md transition-transform group-hover:scale-105">{initials(name)}</span>
                  <span className="hidden max-w-[110px] truncate text-[10.5px] text-muted-foreground sm:block">{name.split(' ')[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                <DropdownMenuLabel><p className="font-medium">{name}</p><p className="text-xs font-normal text-muted-foreground">{session?.email}</p></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/organization" data-testid="menu-organization"><Building2 className="mr-2 h-4 w-4" />Organization view</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={() => resetJourney()} data-testid="menu-reset"><RotateCcw className="mr-2 h-4 w-4" />Restart journey</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setState((s) => ({ ...s, session: null }))} data-testid="menu-signout"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[hsl(232_30%_88%)] to-transparent" />
        </header>
        <motion.main key={loc} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto max-w-[1280px] px-5 pb-28 pt-8 sm:px-8 md:px-12 md:pb-20">
          {children}
        </motion.main>
      </div>
    </div>
  );
}
