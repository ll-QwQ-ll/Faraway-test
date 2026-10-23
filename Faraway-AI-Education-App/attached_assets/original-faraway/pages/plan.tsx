import { useEffect, useMemo, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Check, Home, Trees, Shuffle, Wifi, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Page } from '@/components/layout';
import { JourneyBar, NeedProfile, PageHeader, Reveal, ScenarioToggle } from '@/components/ui-bits';
import { CoursePlanet } from '@/components/course-card';
import { careerById, CAREERS, SKILL_TRENDS } from '@/data/careers';
import { setState, useStore, type Plan } from '@/lib/store';
import { computeMatch, courseForSkill, myr, rankCareers } from '@/lib/match';
import { cn } from '@/lib/utils';

function setPlan(fn: (p: Plan) => Plan) {
  setState((s) => ({ ...s, plan: fn(s.plan) }));
}

function Opt<T extends string>({ value, current, onPick, children, testid }: { value: T; current: T; onPick: (v: T) => void; children: ReactNode; testid: string }) {
  return (
    <button aria-pressed={value === current} onClick={() => onPick(value)} data-testid={testid}
      className={cn('flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition-all', value === current ? 'border-[hsl(44_96%_58%/.7)] bg-[hsl(44_96%_58%/.1)] text-[hsl(44_100%_85%)]' : 'border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground')}>
      {children}
    </button>
  );
}

export default function PlanPage() {
  const profile = useStore((s) => s.profile);
  const scenario = useStore((s) => s.scenario);
  const plan = useStore((s) => s.plan);
  const [, nav] = useLocation();
  const ready = !!profile.stream && Object.keys(profile.skills).length >= 3;

  const targetId = plan.target || (ready ? rankCareers(profile, scenario)[0].career.id : '');
  const career = careerById(targetId);
  const match = career && ready ? computeMatch(career, profile, scenario) : null;

  const recommended = useMemo(() => {
    if (!match || !career) return [];
    const trend = (s: string) => SKILL_TRENDS.find((t) => t.skill === s)?.[scenario] ?? 0;
    const g = match.gaps.map((x) => x.skill).sort((a, b) => Number(career.core.includes(b)) - Number(career.core.includes(a)) || trend(b) - trend(a));
    if (scenario === 'fast' && !g.includes('AI Tools') && (profile.skills['AI Tools'] ?? 0) < 4) g.push('AI Tools');
    return g;
  }, [match, career, scenario, profile.skills]);

  const recKey = recommended.join('|');
  useEffect(() => {
    if (plan.mode === 'recommended' && recKey !== plan.skills.join('|')) setPlan((p) => ({ ...p, skills: recKey ? recKey.split('|') : [] }));
  }, [plan.mode, recKey, plan.skills]);

  if (!ready || !career || !match) return <Page><JourneyBar /><NeedProfile /></Page>;

  const pool = Array.from(new Set([...Object.keys(career.required), ...recommended]));
  const missingCore = career.core.filter((c) => match.gaps.some((g) => g.skill === c) && !plan.skills.includes(c));
  const items = plan.skills.map((s) => ({ skill: s, course: courseForSkill(s, plan) }));
  const totalCost = items.reduce((a, i) => a + (i.course?.cost ?? 0), 0);
  const claimable = items.reduce((a, i) => a + (i.course?.hrdc ? i.course.cost : 0), 0);
  const totalHours = items.reduce((a, i) => a + (i.course?.hours ?? 0), 0);
  const weeks = Math.ceil((totalHours * 60) / plan.minutesPerDay / 7);

  const toggle = (s: string) => setPlan((p) => ({ ...p, mode: 'custom', skills: p.skills.includes(s) ? p.skills.filter((x) => x !== s) : [...p.skills, s] }));
  const save = () => { setPlan((p) => ({ ...p, target: career.id, saved: true })); nav('/progress'); };

  return (
    <Page>
      <JourneyBar />
      <PageHeader eyebrow="Step 04 · Flight plan" title={<>Plot a route that fits <em className="text-gold">your days</em></>} right={<ScenarioToggle />}>
        The plan re-weights when you switch AI adoption speed. Fast adoption pulls AI skills forward.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <Reveal>
          <div className="glass glass-hi space-y-8 rounded-[2rem] p-6 sm:p-8">
            <div>
              <p className="eyebrow mb-3">Destination</p>
              <select className="field" value={career.id} onChange={(e) => setPlan((p) => ({ ...p, target: e.target.value }))} data-testid="select-target">
                {CAREERS.map((c) => <option key={c.id} value={c.id}>{c.title} — match {computeMatch(c, profile, scenario).score.toFixed(0)}</option>)}
              </select>
            </div>
            <div>
              <p className="eyebrow mb-3">Where do you learn best?</p>
              <div className="flex flex-wrap gap-2">
                <Opt value="indoor" current={plan.setting} onPick={(v) => setPlan((p) => ({ ...p, setting: v }))} testid="opt-indoor"><Home className="h-4 w-4" />Indoor</Opt>
                <Opt value="outdoor" current={plan.setting} onPick={(v) => setPlan((p) => ({ ...p, setting: v }))} testid="opt-outdoor"><Trees className="h-4 w-4" />Outdoor / field</Opt>
                <Opt value="either" current={plan.setting} onPick={(v) => setPlan((p) => ({ ...p, setting: v }))} testid="opt-either"><Shuffle className="h-4 w-4" />Either</Opt>
              </div>
            </div>
            <div>
              <div className="mb-3 flex justify-between"><p className="eyebrow">Daily study time</p><span className="font-mono text-sm text-gold" data-testid="text-minutes">{plan.minutesPerDay} min</span></div>
              <input type="range" min={15} max={240} step={15} value={plan.minutesPerDay} onChange={(e) => setPlan((p) => ({ ...p, minutesPerDay: Number(e.target.value) }))} className="w-full accent-[hsl(44_96%_58%)]" aria-label="Minutes per day" data-testid="range-minutes" />
            </div>
            <div>
              <p className="eyebrow mb-3">Budget</p>
              <div className="flex flex-wrap gap-2">
                <Opt value="free" current={plan.cost} onPick={(v) => setPlan((p) => ({ ...p, cost: v }))} testid="opt-free">Free only</Opt>
                <Opt value="low" current={plan.cost} onPick={(v) => setPlan((p) => ({ ...p, cost: v }))} testid="opt-low">Low cost (≤ RM 200)</Opt>
                <Opt value="hrdc" current={plan.cost} onPick={(v) => setPlan((p) => ({ ...p, cost: v }))} testid="opt-hrdc">HRD Corp claimable</Opt>
                <Opt value="any" current={plan.cost} onPick={(v) => setPlan((p) => ({ ...p, cost: v }))} testid="opt-any">Any</Opt>
              </div>
            </div>
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4">
              <span className="flex items-center gap-2 text-sm"><Wifi className="h-4 w-4 text-gold" />Online courses only</span>
              <input type="checkbox" checked={plan.onlineOnly} onChange={(e) => setPlan((p) => ({ ...p, onlineOnly: e.target.checked }))} className="h-5 w-5 accent-[hsl(44_96%_58%)]" data-testid="checkbox-online" />
            </label>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="glass glass-hi rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <Opt value="recommended" current={plan.mode} onPick={(v) => setPlan((p) => ({ ...p, mode: v }))} testid="opt-recommended"><Sparkles className="h-4 w-4" />Recommended plan</Opt>
              <Opt value="custom" current={plan.mode} onPick={(v) => setPlan((p) => ({ ...p, mode: v }))} testid="opt-custom"><SlidersHorizontal className="h-4 w-4" />Custom plan</Opt>
            </div>
            <p className="eyebrow mb-3 mt-7">Skills to learn</p>
            <div className="flex flex-wrap gap-2">
              {pool.map((s) => (
                <button key={s} onClick={() => toggle(s)} className="chip" data-on={plan.skills.includes(s)} aria-pressed={plan.skills.includes(s)} data-testid={`chip-skill-${s.replace(/\W/g, '')}`}>
                  {plan.skills.includes(s) && <Check className="h-3 w-3" />}{s}{career.core.includes(s) && <span className="font-mono text-[9px] uppercase text-gold">core</span>}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {missingCore.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-5 flex gap-3 rounded-2xl border border-[hsl(30_90%_60%/.4)] bg-[hsl(30_90%_50%/.08)] p-4 text-sm text-[hsl(36_100%_82%)]" role="alert">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Heads up: {missingCore.join(', ')} {missingCore.length > 1 ? 'are core skills' : 'is a core skill'} for {career.title}. Skipping {missingCore.length > 1 ? 'them' : 'it'} will cap your match score and may hold back applications.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-7 space-y-3">
              <AnimatePresence initial={false}>
                {items.map(({ skill, course }) => (
                  <motion.div key={skill} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[.02] p-4">
                    {course ? <CoursePlanet course={course} size={44} /> : <div className="h-11 w-11 rounded-full bg-white/5" />}
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[hsl(262_80%_80%)]">{skill}</p>
                      {course ? <Link href={`/courses/${course.id}`} className="block truncate font-semibold hover:text-gold">{course.title}</Link> : <p className="text-sm text-muted-foreground">No course yet — self-study recommended</p>}
                      {course && <p className="text-xs text-muted-foreground">{course.hours} hrs · {course.online ? 'Online' : 'In person'} · {course.provider}</p>}
                    </div>
                    {course && <div className="text-right"><p className="font-mono text-sm">{course.cost === 0 ? 'Free' : myr(course.cost)}</p>{course.hrdc && <p className="font-mono text-[10px] text-gold">HRD Corp</p>}</div>}
                  </motion.div>
                ))}
              </AnimatePresence>
              {items.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">Select at least one skill to build a route.</p>}
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/5 pt-6 text-center">
              <div><p className="font-mono text-xl text-gold" data-testid="text-total-cost">{myr(totalCost)}</p><p className="text-xs text-muted-foreground">total cost</p></div>
              <div><p className="font-mono text-xl">{totalHours} h</p><p className="text-xs text-muted-foreground">learning</p></div>
              <div><p className="font-mono text-xl">{weeks || 0} wk</p><p className="text-xs text-muted-foreground">at {plan.minutesPerDay} min/day</p></div>
            </div>
            {claimable > 0 && <p className="mt-3 text-center text-xs text-muted-foreground">{myr(claimable)} may be claimable through HRD Corp if your employer is registered.</p>}
            <button onClick={save} disabled={items.length === 0} className="btn-gold mt-6 w-full justify-center" data-testid="button-save-plan">Launch this plan <ArrowRight className="h-4 w-4" /></button>
          </div>
        </Reveal>
      </div>
    </Page>
  );
}
