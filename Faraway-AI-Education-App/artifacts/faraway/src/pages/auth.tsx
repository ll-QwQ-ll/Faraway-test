import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, User, Building2, Sparkles, Compass } from 'lucide-react';
import { setState, useStore } from '@/lib/store';
import { Aurora, LOGO, Magnetic, ParticleField, SpectrumIcon, Tilt } from '@/components/spectrum';
import { cn } from '@/lib/utils';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}

const signIn = (name: string, email: string) => setState((s) => ({ ...s, session: { name, email } }));

export function Login() {
  const [, nav] = useLocation();
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const go = () => nav('/mode');
  const submit = (e: FormEvent) => { e.preventDefault(); if (!email.includes('@')) return; signIn(email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), email); go(); };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <Aurora />
      <div className="mx-auto grid min-h-[100dvh] max-w-[1360px] gap-8 px-6 py-8 lg:grid-cols-[1fr_0.85fr] lg:gap-14 lg:px-14">
        <div className="flex flex-col">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border bg-white shadow-md"><img src={LOGO} alt="Faraway logo" className="h-11 w-11 object-contain" /></div>
            <span className="font-mono text-sm tracking-[0.35em]">FARAWAY</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.9 }} className="mt-[8vh]">
            <p className="eyebrow mb-4">Career &amp; education compass · Malaysia</p>
            <h1 className="font-display text-5xl leading-[0.98] sm:text-6xl xl:text-7xl">Where <em className="spectrum-text">Possibilities</em><br />Take You.</h1>
            <p className="mt-6 max-w-md text-muted-foreground">Faraway reads your skills, models the job market under moderate and fast AI adoption, and plots the shortest study route to a role that will still matter in 2030.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9 }} className="mt-10 w-full max-w-sm space-y-3">
            <button onClick={() => { signIn('Aina Sofea', 'aina.sofea@gmail.com'); go(); }} className="btn-ghost w-full justify-center py-3 shadow-sm" data-testid="button-login-google"><GoogleMark />Login with Google</button>
            {!showEmail ? (
              <button onClick={() => setShowEmail(true)} className="btn-ink w-full py-3" data-testid="button-login-email"><Mail className="h-4 w-4" />Login with email</button>
            ) : (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={submit} className="space-y-3">
                <input autoFocus type="email" required placeholder="you@university.edu.my" value={email} onChange={(e) => setEmail(e.target.value)} className="field py-3" data-testid="input-login-email" />
                <input type="password" required placeholder="Password" className="field py-3" data-testid="input-login-password" />
                <button className="btn-ink w-full py-3" data-testid="button-login-submit">Continue <ArrowRight className="h-4 w-4" /></button>
              </motion.form>
            )}
            <p className="text-right text-sm text-muted-foreground">No account? <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline" data-testid="link-signup">Sign up</Link></p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 1 }} className="hidden lg:block">
          <Tilt className="h-full" max={4}>
            <div className="glass spectrum-border relative h-full min-h-[560px] overflow-hidden rounded-[2.5rem]">
              <div className="absolute inset-0 opacity-70"><ParticleField height={900} converge /></div>
              <div className="absolute inset-0 grid place-items-center">
                <motion.img src={LOGO} alt="" className="w-[42%] max-w-[260px] object-contain drop-shadow-[0_20px_40px_rgba(200,150,0,.25)]" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
              </div>
              <div className="absolute inset-x-6 bottom-6 grid grid-cols-3 gap-3">
                {[['12', 'career paths modelled'], ['2', 'AI adoption scenarios'], ['8', 'UN SDGs mapped']].map(([n, l]) => (
                  <div key={l} className="glass rounded-2xl p-4"><p className="font-display text-3xl">{n}</p><p className="text-xs text-muted-foreground">{l}</p></div>
                ))}
              </div>
            </div>
          </Tilt>
        </motion.div>
      </div>
    </div>
  );
}

export function Register() {
  const [, nav] = useLocation();
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); if (!name.trim() || !email.includes('@')) return; signIn(name.trim(), email); nav('/mode'); };
  return (
    <div className="relative grid min-h-[100dvh] place-items-center px-5 py-10">
      <Aurora />
      <Link href="/login" className="absolute left-6 top-6 flex items-center gap-2" data-testid="link-back-login"><img src={LOGO} alt="Faraway" className="h-9 w-9 object-contain" /><span className="font-mono text-xs tracking-[0.3em]">FARAWAY</span></Link>
      <Tilt max={3} className="w-full max-w-md">
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="glass spectrum-border rounded-[2rem] p-8 sm:p-10">
          <p className="eyebrow">Sign up</p>
          <h1 className="mt-2 font-display text-4xl">Start charting.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Two fields. Your data stays on this device.</p>
          <label className="mt-8 block text-sm font-medium">Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nurul Izzati binti Hassan" className="field mt-2 py-3" data-testid="input-register-name" />
          <label className="mt-5 block text-sm font-medium">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="izzati@gmail.com" className="field mt-2 py-3" data-testid="input-register-email" />
          <div className="mt-10 flex justify-center"><Magnetic><button className="btn-ink px-10 py-3" data-testid="button-register-enter">Enter <ArrowRight className="h-4 w-4" /></button></Magnetic></div>
          <p className="mt-6 text-center text-sm text-muted-foreground">Already have one? <Link href="/login" className="font-medium text-foreground hover:underline" data-testid="link-login">Log in</Link></p>
        </motion.form>
      </Tilt>
    </div>
  );
}

export function Mode() {
  const [, nav] = useLocation();
  const name = useStore((s) => s.session?.name ?? '');
  const [hover, setHover] = useState<'p' | 'o' | null>(null);
  const choose = (m: 'personal' | 'organization') => { try { localStorage.setItem('faraway_mode', m); } catch { /* ignore */ } nav(m === 'personal' ? '/' : '/organization'); };
  const opts = [
    { k: 'p' as const, m: 'personal' as const, icon: User, title: 'Personal', sub: 'Fresh graduate, job seeker, or a worker whose role is shifting under AI.' },
    { k: 'o' as const, m: 'organization' as const, icon: Building2, title: 'Organization', sub: 'HR manager, TVET centre or university career office planning for a team.' },
  ];
  return (
    <div className="relative min-h-[100dvh] px-5 py-8 sm:px-10">
      <Aurora />
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col">
        <div className="flex items-center gap-3"><img src={LOGO} alt="Faraway" className="h-10 w-10 object-contain" /><span className="font-mono text-xs tracking-[0.3em]">FARAWAY</span></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="glass mt-[8vh] rounded-[2.25rem] p-8 sm:p-14">
          <div className="flex items-center gap-3"><SpectrumIcon icon={Compass} size={26} /><p className="eyebrow">{name ? `Welcome, ${name.split(' ')[0]}` : 'Welcome'}</p></div>
          <h1 className="mt-5 font-display text-5xl leading-[1] sm:text-7xl">Who are you exploring for?</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">Faraway tunes its compass differently for one person charting a career and for an organisation charting many.</p>
        </motion.div>
        <div className="mt-6 grid flex-1 gap-6 pb-6 md:grid-cols-2">
          {opts.map((o, i) => (
            <motion.button key={o.k} onClick={() => choose(o.m)} onMouseEnter={() => setHover(o.k)} onMouseLeave={() => setHover(null)} data-testid={`button-mode-${o.m}`}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.8 }} whileTap={{ scale: 0.985 }}
              className={cn('glass glass-hover group relative flex min-h-[220px] flex-col justify-between rounded-[2.25rem] p-8 text-left', hover === o.k && 'spectrum-border')}>
              <div className="flex items-start justify-between">
                <div className="grid h-16 w-16 place-items-center rounded-2xl border bg-white shadow-md transition-transform group-hover:-rotate-6 group-hover:scale-105"><SpectrumIcon icon={o.icon} size={30} still={hover !== o.k} /></div>
                <Sparkles className={cn('h-5 w-5 text-muted-foreground transition-opacity', hover === o.k ? 'opacity-100' : 'opacity-0')} />
              </div>
              <div>
                <p className="font-display text-4xl">{o.title}</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">{o.sub}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
