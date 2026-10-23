import { useRef, type PointerEvent } from 'react';
import { Link } from 'wouter';
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowRight, Compass, LineChart, Telescope, Route as RouteIcon, Trophy, ShieldCheck, Sparkles, Wallet, Clock3, GraduationCap, Building2, BriefcaseBusiness } from 'lucide-react';
import heroImg from '@assets/generated_images/hero-galaxy.jpg';
import planetImg from '@assets/generated_images/planet-ringed.png';
import travelerImg from '@assets/generated_images/traveler-nebula.jpg';
import { Logo } from '@/components/layout';
import { Counter, Reveal } from '@/components/ui-bits';
import { CourseCard } from '@/components/course-card';
import { COURSES } from '@/data/courses';
import { JOB_TRENDS } from '@/data/careers';

const ease = [0.2, 0.8, 0.2, 1] as const;

function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const galY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const mx = useMotionValue(0.7); const my = useMotionValue(0.4);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 }); const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const lightX = useTransform(sx, (v) => `${v * 100}%`); const lightY = useTransform(sy, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(520px circle at ${lightX} ${lightY}, hsl(44 96% 62% / .16), transparent 60%)`;
  const planetX = useTransform(sx, [0, 1], [18, -18]); const planetY = useTransform(sy, [0, 1], [12, -12]);
  const onMove = (e: PointerEvent) => {
    if (reduce) return;
    mx.set(e.clientX / window.innerWidth); my.set(e.clientY / window.innerHeight);
  };
  const words = ['Learn', 'beyond'];

  return (
    <section ref={ref} onPointerMove={onMove} className="relative flex min-h-[100dvh] items-center overflow-hidden" aria-label="Faraway introduction">
      <motion.div style={{ y: reduce ? 0 : bgY }} className="absolute inset-0">
        <img src={heroImg} alt="" aria-hidden className="anim-drift h-full w-full object-cover object-[70%_50%] opacity-80" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(232_45%_5%)_0%,hsl(232_45%_5%/.85)_30%,hsl(232_45%_5%/.2)_65%,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[hsl(232_45%_5%)] to-transparent" />

      {/* rotating galaxy & orbit rings */}
      <motion.div style={{ y: reduce ? 0 : galY }} className="pointer-events-none absolute right-[-30%] top-1/2 aspect-square w-[130vw] -translate-y-1/2 sm:right-[-12%] sm:w-[78vw] lg:right-[-6%] lg:w-[62vw]" aria-hidden>
        <div className="anim-spin absolute inset-[18%] rounded-full opacity-70 mix-blend-screen blur-[2px]" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, hsl(262 90% 70% / .45) 40deg, transparent 90deg, hsl(200 90% 65% / .35) 160deg, transparent 210deg, hsl(44 96% 62% / .45) 280deg, transparent 330deg)', maskImage: 'radial-gradient(circle, black 18%, transparent 68%)', WebkitMaskImage: 'radial-gradient(circle, black 18%, transparent 68%)' }} />
        <div className="anim-pulse absolute inset-[42%] rounded-full bg-[radial-gradient(circle,hsl(44_100%_85%),hsl(40_96%_58%/.6)_35%,transparent_70%)] blur-md" />
        <div className="absolute inset-[6%] rounded-full border border-[hsl(44_96%_58%/.16)]" style={{ transform: 'rotateX(68deg)' }} />
        <div className="anim-spin absolute inset-[6%]" style={{ transform: 'rotateX(68deg)' }}>
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(44_100%_75%)] shadow-[0_0_20px_4px_hsl(44_96%_58%/.8)]" />
        </div>
        <div className="absolute inset-[24%] rounded-full border border-[hsl(262_80%_70%/.22)]" style={{ transform: 'rotateX(68deg) rotateZ(20deg)' }} />
        <div className="anim-spin-r absolute inset-[24%]" style={{ transform: 'rotateX(68deg) rotateZ(20deg)' }}>
          <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-[hsl(190_90%_70%)] shadow-[0_0_14px_3px_hsl(190_90%_60%/.8)]" />
        </div>
      </motion.div>

      <motion.div style={{ x: planetX, y: planetY }} className="pointer-events-none absolute bottom-[8%] right-[4%] w-[34vw] max-w-[360px] sm:bottom-[10%] lg:right-[10%]" aria-hidden>
        <img src={planetImg} alt="" className="anim-float w-full drop-shadow-[0_0_60px_hsl(262_80%_60%/.35)]" />
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0" style={{ background: light }} aria-hidden />

      <motion.div style={{ y: reduce ? 0 : textY, opacity: fade }} className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-28 sm:px-8">
        <motion.div initial={reduce ? false : { opacity: 0, scale: 0.85, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1.4, ease }} className="mb-8 w-28 sm:w-36">
          <Logo className="w-full" />
        </motion.div>
        <motion.p initial={reduce ? false : { opacity: 0, letterSpacing: '0.5em' }} animate={{ opacity: 1, letterSpacing: '0.22em' }} transition={{ duration: 1.6, delay: 0.3, ease }} className="eyebrow mb-5">Career compass  /  Learning platform</motion.p>
        <h1 className="font-display text-[clamp(3.2rem,10vw,8.5rem)] leading-[0.88] text-[hsl(40_40%_97%)]">
          {words.map((w, i) => (
            <span key={w} className="inline-block overflow-hidden pb-[0.2em] -mb-[0.12em] pr-[0.25em] align-bottom">
              <motion.span className="inline-block" initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.45 + i * 0.12, ease }}>{w}</motion.span>
            </span>
          ))}
          <br />
          <span className="inline-block overflow-hidden pb-[0.2em] pr-[0.08em] -mb-[0.12em] align-bottom">
            <motion.span className="gold-text inline-block italic" initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.75, ease }}>limits.</motion.span>
          </span>
        </h1>
        <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1, ease }}>
          <p className="mt-6 max-w-lg text-lg text-[hsl(232_30%_82%)] sm:text-xl">
            <span className="font-display text-2xl italic text-[hsl(44_100%_82%)]">Your galaxy of knowledge.</span> Chart your skills, read where AI is taking the job market, and follow a course path to the career that fits you.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/compass" className="btn-gold text-base" data-testid="link-hero-start">Start learning <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/courses" className="btn-ghost text-base" data-testid="link-hero-courses">Explore courses</Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.a href="#journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground" data-testid="link-scroll">
        <span className="font-mono uppercase tracking-[0.3em]">Scroll</span>
        <span className="relative h-9 w-5 rounded-full border border-white/25"><span className="absolute left-1/2 top-1.5 h-2 w-1 -translate-x-1/2 rounded-full bg-[hsl(var(--gold))] [animation:scroll-dot_1.6s_ease-in-out_infinite]" /></span>
      </motion.a>
    </section>
  );
}

const JOURNEY = [
  { icon: Compass, t: 'Chart', d: 'Pick your stream and the careers that pull at you. Rate your skills honestly.', href: '/compass' },
  { icon: LineChart, t: 'Read the signals', d: 'Which skills are rising, which are fading, under fast or moderate AI adoption.', href: '/insights' },
  { icon: Telescope, t: 'Find destinations', d: 'Ranked careers with a transparent match score and a skill-gap radar.', href: '/careers' },
  { icon: RouteIcon, t: 'Plot the route', d: 'A study plan shaped by your time, budget and HRD Corp eligibility.', href: '/plan' },
  { icon: Trophy, t: 'Make the voyage', d: 'Track each skill, earn badges, watch your match score climb.', href: '/progress' },
];

function Journey() {
  return (
    <section id="journey" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-28 sm:px-8">
      <Reveal><p className="eyebrow">The compass journey</p></Reveal>
      <Reveal delay={0.05}><h2 className="mt-3 max-w-3xl font-display text-4xl leading-[1.02] sm:text-6xl">Five bearings between <em className="text-gold">where you are</em> and where you could be.</h2></Reveal>
      <div className="relative mt-16">
        <svg className="pointer-events-none absolute left-0 top-10 hidden h-24 w-full lg:block" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
          <motion.path d="M10 70 C 200 0, 300 100, 500 50 S 800 0, 990 60" fill="none" stroke="url(#jg)" strokeWidth="1.5" strokeDasharray="4 6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease }} />
          <defs><linearGradient id="jg"><stop stopColor="#b48cff" /><stop offset="1" stopColor="#ffd56b" /></linearGradient></defs>
        </svg>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {JOURNEY.map((j, i) => (
            <Reveal key={j.t} delay={i * 0.08} className={i % 2 ? 'lg:mt-16' : ''}>
              <li className="list-none">
                <Link href={j.href} className="group glass glass-hi block rounded-3xl p-6 transition-colors hover:border-[hsl(44_96%_58%/.4)]" data-testid={`link-journey-step-${i}`}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(44_96%_58%/.12)] text-gold ring-1 ring-[hsl(44_96%_58%/.3)]"><j.icon className="h-5 w-5" /></span>
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{j.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{j.d}</p>
                  <ArrowRight className="mt-5 h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ScenarioTeaser() {
  const rows = JOB_TRENDS.slice(0, 5);
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <Reveal><p className="eyebrow">Two futures, one decision</p></Reveal>
        <Reveal delay={0.05}><h2 className="mt-3 font-display text-4xl leading-[1.02] sm:text-5xl">The job market is not one forecast. It is a <em className="text-[hsl(330_85%_75%)]">fork</em>.</h2></Reveal>
        <Reveal delay={0.1}><p className="mt-5 text-muted-foreground">If Malaysian employers adopt AI quickly, some roles boom and others thin out within five years. If adoption is moderate, the curve is gentler. Faraway shows you both, so you can plan for either.</p></Reveal>
        <Reveal delay={0.15}><Link href="/insights" className="btn-ghost mt-8" data-testid="link-teaser-insights">See the market signals <ArrowRight className="h-4 w-4" /></Link></Reveal>
      </div>
      <Reveal delay={0.1}>
        <div className="glass glass-hi rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-widest text-muted-foreground">Job postings index, 2030 (2021 = 100)</span>
          </div>
          <div className="space-y-5">
            {rows.map((r, i) => (
              <div key={r.role}>
                <div className="mb-2 flex justify-between text-sm"><span>{r.role}</span><span className="font-mono text-muted-foreground"><span className="text-gold">{r.moderate}</span> / <span className="text-[hsl(330_85%_75%)]">{r.fast}</span></span></div>
                <div className="relative h-2 rounded-full bg-white/5">
                  <motion.div className="absolute inset-y-0 left-0 rounded-full bg-[hsl(330_80%_65%/.55)]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.1, ease }} style={{ width: `${(r.fast / 340) * 100}%`, transformOrigin: 'left' }} />
                  <motion.div className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,hsl(40_95%_52%),hsl(46_100%_70%))]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease }} style={{ width: `${(r.moderate / 340) * 100}%`, transformOrigin: 'left' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[hsl(var(--gold))]" />Moderate adoption</span>
            <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[hsl(330_80%_65%)]" />Fast adoption</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Featured() {
  const picks = ['python-programming', 'ml-fundamentals', 'cloud-foundations', 'ux-research'].map((id) => COURSES.find((c) => c.id === id)!);
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal><p className="eyebrow">Featured courses</p></Reveal>
          <Reveal delay={0.05}><h2 className="mt-3 font-display text-4xl sm:text-5xl">Fuel for the voyage.</h2></Reveal>
        </div>
        <Reveal delay={0.1}><Link href="/courses" className="btn-ghost" data-testid="link-all-courses">All {COURSES.length} courses <ArrowRight className="h-4 w-4" /></Link></Reveal>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((c, i) => <Reveal key={c.id} delay={i * 0.08} className="h-full"><CourseCard course={c} /></Reveal>)}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: ShieldCheck, t: 'A score you can audit', d: 'Match = 100 x (0.65 Skill + 0.15 Interest + 0.10 Experience + 0.10 Market). Every factor is shown. No black box.', span: 'lg:col-span-2' },
    { icon: Wallet, t: 'Priced in ringgit', d: 'Free, low cost and HRD Corp claimable courses, with the total cost shown before you commit.' },
    { icon: Clock3, t: 'Fits real days', d: 'Tell us 30 minutes or three hours a day. Plans adapt.' },
    { icon: Sparkles, t: 'Ready for either future', d: 'Plans re-weight automatically when you switch between fast and moderate AI adoption.', span: 'lg:col-span-2' },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <Reveal><p className="eyebrow">Why navigate with Faraway</p></Reveal>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {items.map((b, i) => (
          <Reveal key={b.t} delay={i * 0.06} className={b.span}>
            <div className="glass glass-hi h-full rounded-3xl p-8">
              <b.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-6 font-display text-3xl">{b.t}</h3>
              <p className="mt-3 max-w-xl text-muted-foreground">{b.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const s = [
    { v: 13, s: '', l: 'career destinations mapped' },
    { v: COURSES.length, s: '', l: 'courses across six fields' },
    { v: 23, s: '', l: 'skills tracked against SDGs' },
    { v: 4.7, d: 1, s: '', l: 'average course rating' },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="glass glass-hi relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(44_96%_58%/.22),transparent_65%)]" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {s.map((x) => (
            <div key={x.l}>
              <div className="font-display text-6xl text-gold sm:text-7xl"><Counter to={x.v} decimals={x.d ?? 0} suffix={x.s} /></div>
              <p className="mt-2 text-sm text-muted-foreground">{x.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Audiences() {
  const a = [
    { icon: GraduationCap, t: 'Fresh graduates', d: 'You have a degree and a dozen tabs of job listings. Find the three that actually fit.' },
    { icon: BriefcaseBusiness, t: 'Worried about AI', d: 'See how exposed your current role is, and the shortest skill path to steadier ground.' },
    { icon: Building2, t: 'Career centres & HR', d: 'TVET, universities and HR teams: a cohort view is on our roadmap.', soon: true },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal><h2 className="font-display text-4xl leading-[1.02] sm:text-5xl">Built for anyone who has asked <em className="text-gold">“what now?”</em></h2></Reveal>
        <div className="divide-y divide-white/5">
          {a.map((x, i) => (
            <Reveal key={x.t} delay={i * 0.06}>
              <div className="flex gap-5 py-6">
                <x.icon className="mt-1 h-6 w-6 shrink-0 text-[hsl(262_80%_78%)]" />
                <div>
                  <h3 className="flex items-center gap-3 text-lg font-semibold">{x.t}{x.soon && <span className="rounded-full border border-[hsl(262_80%_70%/.4)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[hsl(262_80%_80%)]">Coming soon</span>}</h3>
                  <p className="mt-1 text-muted-foreground">{x.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
        <img src={travelerImg} alt="A traveller on a small moon looking at a golden path of stars" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,hsl(232_45%_5%/.95),hsl(232_45%_5%/.6)_50%,transparent)]" />
        <div className="relative max-w-xl px-7 py-20 sm:px-14 sm:py-28">
          <Reveal><p className="eyebrow">Four minutes to a bearing</p></Reveal>
          <Reveal delay={0.05}><h2 className="mt-4 font-display text-5xl leading-[0.98] sm:text-6xl">The stars are far. <em className="gold-text">The first step isn’t.</em></h2></Reveal>
          <Reveal delay={0.1}><Link href="/compass" className="btn-gold mt-10" data-testid="link-final-cta">Chart my position <ArrowRight className="h-4 w-4" /></Link></Reveal>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Journey />
      <ScenarioTeaser />
      <Featured />
      <Benefits />
      <Stats />
      <Audiences />
      <FinalCta />
    </>
  );
}
