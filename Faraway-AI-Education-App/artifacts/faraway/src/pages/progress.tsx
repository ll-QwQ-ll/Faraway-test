import { useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Check, Clock, ExternalLink, RefreshCw, Star, X } from 'lucide-react';
import { careerById } from '@/data/careers';
import { setState, useStore } from '@/lib/store';
import { checklistFor, computeMatch, courseForSkill, filterCourses, myr } from '@/lib/match';
import { Card, CardTitle, NeedProfile, PageTitle, Reveal, ScoreRing, SdgPill, skillSdg } from '@/components/bits';
import { SpectrumIcon } from '@/components/spectrum';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function Runner({ pct }: { pct: number }) {
  return (
    <div className="relative h-14" data-testid="progress-runner">
      <div className="absolute inset-x-0 bottom-3 h-2 overflow-hidden rounded-full bg-[hsl(232_40%_95%)]">
        <motion.div className="spectrum-bar h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }} />
      </div>
      <motion.div className="absolute bottom-4" initial={{ left: 0 }} animate={{ left: `calc(${pct}% - 14px)` }} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}>
        <svg width="28" height="34" viewBox="0 0 28 34" style={{ animation: pct < 100 ? 'run-bob .5s ease-in-out infinite' : undefined }} aria-hidden>
          <g stroke="url(#fw-spectrum)" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <circle cx="17" cy="5" r="3.2" />
            <path d="M15 9 L12 19" />
            <motion.path d="M13 12 L19 15 M13 12 L7 14" animate={{ rotate: [0, 18, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} style={{ originX: '13px', originY: '12px' }} />
            <motion.path d="M12 19 L17 25 L15 31 M12 19 L8 25 L3 26" animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} style={{ originX: '12px', originY: '19px' }} />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

export default function Progress() {
  const profile = useStore((s) => s.profile);
  const scenario = useStore((s) => s.scenario);
  const plan = useStore((s) => s.plan);
  const progress = useStore((s) => s.progress);
  const badges = useStore((s) => s.badges);
  const [pop, setPop] = useState<string | null>(null);
  const [scoreKey, setScoreKey] = useState(0);
  const { toast } = useToast();
  const career = careerById(plan.target);
  if (!profile.stream) return <NeedProfile />;
  if (!career || !plan.skills.length) return <NeedProfile text="Save a study plan to track progress." />;

  const items = plan.skills.map((skill) => { const course = courseForSkill(skill, plan); return { skill, course, list: checklistFor(skill, course?.hours ?? 8) }; });
  const allHours = items.reduce((a, i) => a + i.list.reduce((b, l) => b + l.hours, 0), 0);
  const doneHours = items.reduce((a, i) => a + i.list.filter((l) => progress[i.skill]?.includes(l.id)).reduce((b, l) => b + l.hours, 0), 0);
  const pct = allHours ? (doneHours / allHours) * 100 : 0;
  const completed = items.filter((i) => (progress[i.skill]?.length ?? 0) >= i.list.length).map((i) => i.skill);
  const boosted = { ...profile.skills }; completed.forEach((s) => { boosted[s] = Math.max(boosted[s] ?? 0, career.required[s] ?? 3); });
  const current = computeMatch(career, profile, scenario);
  const projected = computeMatch(career, profile, scenario, boosted);

  const tick = (skill: string, id: string, total: number) => {
    const cur = progress[skill] ?? [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    const newly = next.length >= total && !badges.includes(skill);
    setState((s) => ({ ...s, progress: { ...s.progress, [skill]: next }, badges: newly ? [...s.badges, skill] : s.badges }));
    if (newly) setPop(skill);
  };
  const refresh = () => {
    setState((s) => ({ ...s, profile: { ...s.profile, skills: boosted } }));
    setScoreKey((k) => k + 1);
    toast({ title: 'Match score refreshed', description: `${current.score.toFixed(1)} → ${projected.score.toFixed(1)}` });
  };
  const resources = filterCourses(plan).filter((c) => !items.some((i) => i.course?.id === c.id) && c.skills.some((s) => Object.keys(career.required).includes(s))).slice(0, 4);

  return (
    <div className="space-y-8">
      <PageTitle eyebrow={`Learning progress · ${career.title}`} title={<>Every checkbox<br /><span className="text-muted-foreground">moves the needle.</span></>} right={<Link href="/plan" className="btn-ghost" data-testid="link-edit-plan">Edit plan</Link>} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal><Card className="h-full" testId="card-overall">
          <CardTitle eyebrow="Overall" title={`${Math.round(pct)}% of the route`} />
          <Runner pct={pct} />
          <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground"><span>{doneHours}h done</span><span>{allHours - doneHours}h to go · ~{Math.ceil(((allHours - doneHours) * 60) / plan.minutesPerDay)} days</span></div>
          <p className="eyebrow mb-3 mt-8">Badges · {badges.filter((b) => plan.skills.includes(b)).length}/{plan.skills.length}</p>
          <div className="flex flex-wrap gap-3">
            {plan.skills.map((s) => { const got = badges.includes(s); return (
              <motion.div key={s} whileHover={{ y: -3, rotate: got ? -4 : 0 }} className={cn('flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center', got ? 'spectrum-border bg-white shadow-md' : 'border-dashed opacity-60')} data-testid={`badge-${s.replace(/\W/g, '')}`}>
                <SpectrumIcon icon={Award} size={28} still={!got} />
                <span className="max-w-[80px] truncate text-[11px]">{s}</span>
              </motion.div>
            ); })}
          </div>
        </Card></Reveal>
        <Reveal delay={0.08}><Card className="spectrum-border h-full" testId="card-refresh-score">
          <CardTitle eyebrow="Match score" title="Updated as you learn" />
          <div className="flex items-center gap-6">
            <motion.div key={scoreKey} initial={{ rotate: -90, scale: 0.85 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}><ScoreRing score={current.score} size={110} /></motion.div>
            <div className="text-sm"><p className="text-muted-foreground">With completed skills</p><p className="font-mono text-3xl">{projected.score.toFixed(1)}</p><p className="text-xs text-muted-foreground">+{(projected.score - current.score).toFixed(1)} available</p></div>
          </div>
          <button onClick={refresh} disabled={projected.score <= current.score} className="btn-ink mt-6 w-full" data-testid="button-refresh-score"><RefreshCw className="h-4 w-4" />Refresh match score</button>
        </Card></Reveal>
      </div>

      <div className="space-y-5">
        {items.map(({ skill, course, list }, idx) => {
          const done = progress[skill] ?? []; const p = done.length / list.length;
          return (
            <Reveal key={skill} delay={idx * 0.04}><Card testId={`card-skill-${skill.replace(/\W/g, '')}`}>
              <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                <div>
                  <div className="flex items-center gap-3"><h3 className="font-display text-3xl">{skill}</h3>{p >= 1 && <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-white"><Check className="h-3.5 w-3.5" /></span>}</div>
                  <div className="mt-2"><SdgPill n={skillSdg(skill)} small /></div>
                  {course && (
                    <div className="mt-5 rounded-2xl border bg-white/80 p-4">
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.provider} · {course.instructor}</p>
                      <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.hours}h</span><span className="flex items-center gap-1"><Star className="h-3 w-3" />{course.rating}</span><span>{course.cost ? myr(course.cost) : 'Free'}</span>{course.hrdc && <span>HRD Corp</span>}</div>
                    </div>
                  )}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[hsl(232_40%_95%)]"><motion.div className="spectrum-bar h-full" animate={{ width: `${p * 100}%` }} transition={{ duration: 0.6 }} /></div>
                </div>
                <ul className="space-y-2">
                  {list.map((l) => { const on = done.includes(l.id); return (
                    <li key={l.id}>
                      <button onClick={() => tick(skill, l.id, list.length)} data-testid={`check-${skill.replace(/\W/g, '')}-${l.id}`}
                        className={cn('flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-sm transition-all', on ? 'bg-[hsl(250_60%_98%)]' : 'bg-white/70 hover:bg-white hover:shadow-sm')}>
                        <motion.span animate={on ? { scale: [1, 1.3, 1] } : {}} className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-md border', on && 'border-transparent bg-ink text-white')}>{on && <Check className="h-3 w-3" />}</motion.span>
                        <span className={cn('flex-1', on && 'text-muted-foreground line-through')}>{l.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">~{l.hours}h</span>
                      </button>
                    </li>
                  ); })}
                </ul>
              </div>
            </Card></Reveal>
          );
        })}
      </div>

      {resources.length > 0 && (
        <Reveal><Card testId="card-resources">
          <CardTitle eyebrow="Recommended resources" title="Also worth your time" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((c) => (
              <div key={c.id} className="rounded-2xl border bg-white/80 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md" data-testid={`resource-${c.id}`}>
                <p className="eyebrow">{c.category} · {c.level}</p>
                <p className="mt-2 font-medium leading-snug">{c.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                <p className="mt-3 flex items-center justify-between font-mono text-xs"><span>{c.hours}h · {c.cost ? myr(c.cost) : 'Free'}</span><ExternalLink className="h-3 w-3 text-muted-foreground" /></p>
              </div>
            ))}
          </div>
        </Card></Reveal>
      )}

      <AnimatePresence>
        {pop && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-white/60 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPop(null)} data-testid="overlay-badge">
            <motion.div initial={{ scale: 0.4, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              className="glass spectrum-border relative rounded-[2rem] p-10 text-center" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setPop(null)} className="absolute right-4 top-4 text-muted-foreground" aria-label="Close" data-testid="button-close-badge"><X className="h-4 w-4" /></button>
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.span key={i} className="absolute left-1/2 top-[38%] h-1.5 w-1.5 rounded-full" style={{ background: `hsl(${i * 26} 85% 68%)` }}
                  initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(i) * 130, y: Math.sin(i) * 110, opacity: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
              ))}
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border bg-white shadow-lg"><SpectrumIcon icon={Award} size={52} /></div>
              <p className="eyebrow mt-6">Badge earned</p>
              <p className="mt-2 font-display text-4xl">{pop}</p>
              <p className="mt-2 text-sm text-muted-foreground">Refresh your match score to see the effect.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
