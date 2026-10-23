import { useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Check, Clock, RefreshCw, Rocket, X, BookOpen, ArrowRight } from 'lucide-react';
import { Page } from '@/components/layout';
import { JourneyBar, NeedProfile, PageHeader, Reveal, ScoreRing } from '@/components/ui-bits';
import { CoursePlanet } from '@/components/course-card';
import { careerById } from '@/data/careers';
import { setState, useStore } from '@/lib/store';
import { checklistFor, computeMatch, courseForSkill, rankCareers } from '@/lib/match';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function BadgeModal({ skill, onClose }: { skill: string; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-[hsl(232_45%_3%/.75)] p-6 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal aria-label={`${skill} badge earned`}>
      <motion.div initial={{ scale: 0.6, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }} className="glass glass-hi relative w-full max-w-sm rounded-[2rem] p-10 text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-white/5" aria-label="Close" data-testid="button-close-badge"><X className="h-4 w-4" /></button>
        <div className="relative mx-auto h-36 w-36">
          <div className="anim-spin absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, hsl(44 96% 58%), hsl(262 80% 68%), hsl(190 90% 60%), hsl(44 96% 58%))', maskImage: 'radial-gradient(circle, transparent 60%, black 61%, black 68%, transparent 69%)', WebkitMaskImage: 'radial-gradient(circle, transparent 60%, black 61%, black 68%, transparent 69%)' }} />
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span key={i} className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[hsl(44_100%_75%)]" initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos((i / 12) * Math.PI * 2) * 110, y: Math.sin((i / 12) * Math.PI * 2) * 110, opacity: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
          ))}
          <div className="absolute inset-6 grid place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,hsl(46_100%_75%),hsl(40_95%_48%)_60%,hsl(30_80%_25%))] shadow-[0_0_50px_hsl(44_96%_58%/.5)]">
            <Award className="h-12 w-12 text-[hsl(232_45%_10%)]" />
          </div>
        </div>
        <p className="eyebrow mt-6">Badge earned</p>
        <h2 className="mt-2 font-display text-4xl">{skill}</h2>
        <p className="mt-2 text-sm text-muted-foreground">A new star in your constellation. Your skill level has been updated.</p>
        <button onClick={onClose} className="btn-gold mt-7" data-testid="button-continue-badge">Keep flying</button>
      </motion.div>
    </motion.div>
  );
}

export default function ProgressPage() {
  const profile = useStore((s) => s.profile);
  const scenario = useStore((s) => s.scenario);
  const plan = useStore((s) => s.plan);
  const progress = useStore((s) => s.progress);
  const badges = useStore((s) => s.badges);
  const [badge, setBadge] = useState<string | null>(null);
  const [shownScore, setShownScore] = useState<number | null>(null);
  const { toast } = useToast();

  if (!profile.stream) return <Page><JourneyBar /><NeedProfile /></Page>;
  const career = careerById(plan.target) ?? rankCareers(profile, scenario)[0].career;
  if (!plan.saved || plan.skills.length === 0) {
    return (
      <Page>
        <JourneyBar />
        <div className="glass glass-hi mx-auto max-w-xl rounded-3xl p-10 text-center">
          <Rocket className="mx-auto h-10 w-10 text-gold" />
          <h2 className="mt-5 font-display text-3xl">No flight plan launched yet</h2>
          <p className="mt-3 text-muted-foreground">Choose the skills you want to learn and we will track every checkpoint here.</p>
          <Link href="/plan" className="btn-gold mt-8" data-testid="link-to-plan">Build my flight plan</Link>
        </div>
      </Page>
    );
  }

  const live = computeMatch(career, profile, scenario).score;
  const score = shownScore ?? live;
  const skills = plan.skills.map((skill) => {
    const course = courseForSkill(skill, plan);
    const list = checklistFor(skill, course?.hours ?? 10);
    const done = progress[skill] ?? [];
    const doneHours = list.filter((l) => done.includes(l.id)).reduce((a, l) => a + l.hours, 0);
    const total = list.reduce((a, l) => a + l.hours, 0);
    return { skill, course, list, done, pct: total ? doneHours / total : 0, total, left: total - doneHours };
  });
  const overall = skills.reduce((a, s) => a + s.pct, 0) / skills.length;

  const toggle = (skill: string, item: string, list: { id: string }[]) => {
    const cur = progress[skill] ?? [];
    const next = cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item];
    const complete = list.every((l) => next.includes(l.id));
    setState((s) => {
      const need = career.required[skill] ?? 4;
      return {
        ...s,
        progress: { ...s.progress, [skill]: next },
        badges: complete && !s.badges.includes(skill) ? [...s.badges, skill] : s.badges,
        profile: complete ? { ...s.profile, skills: { ...s.profile.skills, [skill]: Math.max(s.profile.skills[skill] ?? 0, need) } } : s.profile,
      };
    });
    if (complete && !badges.includes(skill)) { setBadge(skill); if (shownScore === null) setShownScore(score); }
  };

  const refresh = () => {
    const before = score;
    setShownScore(null);
    toast({ title: 'Match score refreshed', description: `${career.title}: ${before.toFixed(1)} to ${live.toFixed(1)}` });
  };

  return (
    <Page>
      <JourneyBar />
      <PageHeader eyebrow="Step 05 · Voyage log" title={<>Bound for <em className="text-gold">{career.title}</em></>}
        right={
          <div className="glass glass-hi flex items-center gap-5 rounded-3xl p-4 pr-6">
            <ScoreRing key={score} score={score} size={76} />
            <div>
              <p className="text-xs text-muted-foreground">Current match</p>
              <button onClick={refresh} className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline" data-testid="button-refresh-score"><RefreshCw className="h-3.5 w-3.5" />Refresh score</button>
            </div>
          </div>
        }>
        {Math.round(overall * 100)}% of your route complete · {badges.length} badge{badges.length === 1 ? '' : 's'} earned
      </PageHeader>

      <div className="relative mb-10 h-16">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/5" />
        <motion.div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,hsl(262_80%_68%),hsl(44_96%_58%))]" initial={{ width: 0 }} animate={{ width: `${overall * 100}%` }} transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }} />
        <motion.div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" initial={{ left: 0 }} animate={{ left: `${overall * 100}%` }} transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}>
          <Rocket className="h-7 w-7 rotate-45 text-gold drop-shadow-[0_0_10px_hsl(44_96%_58%)]" />
        </motion.div>
        <span className="absolute right-0 top-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{career.title}</span>
      </div>

      {badges.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-3">
          {badges.map((b) => (
            <motion.span key={b} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 rounded-full border border-[hsl(44_96%_58%/.5)] bg-[hsl(44_96%_58%/.1)] px-3 py-1.5 text-sm text-[hsl(44_100%_82%)]"><Award className="h-4 w-4" />{b}</motion.span>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {skills.map((s, i) => (
          <Reveal key={s.skill} delay={i * 0.05}>
            <div className={cn('glass glass-hi h-full rounded-[2rem] p-6 sm:p-7', s.pct === 1 && 'border-[hsl(44_96%_58%/.5)]')} data-testid={`card-progress-${s.skill.replace(/\W/g, '')}`}>
              <div className="flex items-start gap-4">
                {s.course && <CoursePlanet course={s.course} size={52} />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><h3 className="text-xl font-semibold">{s.skill}</h3>{s.pct === 1 && <Award className="h-5 w-5 text-gold" />}</div>
                  {s.course && <Link href={`/courses/${s.course.id}`} className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"><BookOpen className="h-3.5 w-3.5" />{s.course.title}<ArrowRight className="h-3 w-3" /></Link>}
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground"><Clock className="mb-1 ml-auto h-3.5 w-3.5" />{s.left}h left</div>
              </div>
              <div className="relative mt-6 h-8">
                <div className="absolute inset-x-0 bottom-1 h-1.5 rounded-full bg-white/5" />
                <motion.div className="absolute bottom-1 left-0 h-1.5 rounded-full bg-[linear-gradient(90deg,hsl(262_80%_68%),hsl(44_96%_58%))]" animate={{ width: `${s.pct * 100}%` }} transition={{ duration: 0.8 }} />
                <motion.div className="absolute bottom-2 -translate-x-1/2" animate={{ left: `${Math.max(s.pct * 100, 3)}%` }} transition={{ duration: 0.8 }}>
                  <motion.svg width="18" height="22" viewBox="0 0 18 22" animate={s.pct > 0 && s.pct < 1 ? { y: [0, -3, 0] } : {}} transition={{ repeat: Infinity, duration: 0.45 }} aria-hidden>
                    <circle cx="10" cy="3" r="2.5" fill="hsl(44 96% 62%)" />
                    <path d="M10 6 L8 12 L12 15 M8 12 L4 16 M9 8 L13 10 M9 8 L5 9" stroke="hsl(44 96% 62%)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  </motion.svg>
                </motion.div>
              </div>
              <p className="mt-1 text-right font-mono text-xs text-gold">{Math.round(s.pct * 100)}%</p>
              <ul className="mt-4 space-y-2">
                {s.list.map((l) => {
                  const on = s.done.includes(l.id);
                  return (
                    <li key={l.id}>
                      <button onClick={() => toggle(s.skill, l.id, s.list)} aria-pressed={on} className={cn('flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors', on ? 'border-[hsl(44_96%_58%/.35)] bg-[hsl(44_96%_58%/.06)]' : 'border-white/5 hover:border-white/20')} data-testid={`check-${s.skill.replace(/\W/g, '')}-${l.id}`}>
                        <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors', on ? 'border-transparent bg-[hsl(var(--gold))] text-black' : 'border-white/30')}>{on && <Check className="h-3.5 w-3.5" />}</span>
                        <span className={cn('flex-1', on && 'text-muted-foreground line-through')}>{l.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">~{l.hours}h</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>{badge && <BadgeModal skill={badge} onClose={() => setBadge(null)} />}</AnimatePresence>
    </Page>
  );
}
