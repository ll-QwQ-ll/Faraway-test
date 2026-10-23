import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { ArrowLeft, ArrowRight, RefreshCw, Wallet, Bot, Briefcase, TrendingUp } from 'lucide-react';
import { Page } from '@/components/layout';
import { NeedProfile, Reveal, ScenarioToggle, ScoreRing, SdgPill } from '@/components/ui-bits';
import { careerById, SDGS, SKILL_SDG } from '@/data/careers';
import { setState, useStore } from '@/lib/store';
import { computeMatch, myr } from '@/lib/match';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import NotFound from './not-found';

const LEVELS = ['None', 'Aware', 'Beginner', 'Working', 'Strong', 'Expert'];

export default function CareerDetail() {
  const { id } = useParams<{ id: string }>();
  const career = careerById(id ?? '');
  const profile = useStore((s) => s.profile);
  const scenario = useStore((s) => s.scenario);
  const [hover, setHover] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, number>>({});
  const [spin, setSpin] = useState(0);
  const [, nav] = useLocation();
  const { toast } = useToast();

  const match = useMemo(() => (career ? computeMatch(career, profile, scenario) : null), [career, profile, scenario]);
  if (!career) return <NotFound />;
  if (!profile.stream || !match) return <Page><NeedProfile /></Page>;

  const data = Object.entries(career.required).map(([skill, need]) => ({ skill, need, have: Math.min(profile.skills[skill] ?? 0, 5) }));
  const dirty = Object.keys(draft).length > 0;
  const refresh = () => {
    const before = match.score;
    setState((s) => ({ ...s, profile: { ...s.profile, skills: { ...s.profile.skills, ...draft } } }));
    const after = computeMatch(career, { ...profile, skills: { ...profile.skills, ...draft } }, scenario).score;
    setDraft({}); setSpin((x) => x + 1);
    toast({ title: 'Hexagon refreshed', description: `Match moved from ${before.toFixed(1)} to ${after.toFixed(1)}.` });
  };
  const plan = () => {
    setState((s) => ({ ...s, plan: { ...s.plan, target: career.id, skills: match.gaps.map((g) => g.skill), saved: false } }));
    nav('/plan');
  };
  const hovered = hover ? SDGS[SKILL_SDG[hover] ?? 8] : null;

  const Tick = (props: { x?: number; y?: number; payload?: { value: string }; textAnchor?: string }) => {
    const { x = 0, y = 0, payload } = props;
    const sk = payload?.value ?? '';
    const sdg = SDGS[SKILL_SDG[sk] ?? 8];
    const gap = (profile.skills[sk] ?? 0) < career.required[sk];
    return (
      <g transform={`translate(${x},${y})`} onMouseEnter={() => setHover(sk)} onMouseLeave={() => setHover(null)} style={{ cursor: 'help' }}>
        <text textAnchor={props.textAnchor as 'start' | 'middle' | 'end'} fill={gap ? 'hsl(330 85% 78%)' : 'hsl(40 30% 92%)'} fontSize={12} fontWeight={600}>{sk}</text>
        <text textAnchor={props.textAnchor as 'start' | 'middle' | 'end'} y={14} fill={sdg.color} fontSize={9} fontFamily="JetBrains Mono">SDG {sdg.n}</text>
      </g>
    );
  };

  return (
    <Page>
      <Link href="/careers" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="link-back-careers"><ArrowLeft className="h-4 w-4" />All destinations</Link>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-6">
          <motion.div key={spin} initial={{ rotate: -90, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
            <ScoreRing score={match.score} size={112} />
          </motion.div>
          <div>
            <p className="eyebrow">Destination analysis</p>
            <h1 className="mt-2 font-display text-4xl leading-none sm:text-6xl">{career.title}</h1>
            <p className="mt-2 text-muted-foreground">{career.blurb}</p>
          </div>
        </div>
        <ScenarioToggle />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <div className="glass glass-hi relative rounded-[2rem] p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl">Skill hexagon</h2>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-[hsl(44_96%_58%/.5)] ring-1 ring-[hsl(44_96%_58%)]" />Required</span>
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-[hsl(262_80%_68%/.6)] ring-1 ring-[hsl(262_80%_75%)]" />You have</span>
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-[hsl(330_85%_70%)]" />Gap skill</span>
              </div>
            </div>
            <div className="mt-2 h-[380px] sm:h-[440px]" data-testid="chart-radar">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} outerRadius="68%">
                  <PolarGrid gridType="polygon" stroke="hsl(235 30% 26%)" />
                  <PolarAngleAxis dataKey="skill" tick={<Tick />} />
                  <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={false} axisLine={false} />
                  <Radar name="Required" dataKey="need" stroke="hsl(44 96% 58%)" fill="hsl(44 96% 58%)" fillOpacity={0.16} strokeWidth={2} animationDuration={900} />
                  <Radar key={spin} name="You" dataKey="have" stroke="hsl(262 80% 75%)" fill="hsl(262 80% 68%)" fillOpacity={0.45} strokeWidth={2} animationDuration={1100} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="min-h-[52px] rounded-2xl border border-white/5 bg-white/[.02] p-3 text-sm" aria-live="polite">
              {hover && hovered ? (
                <span className="flex flex-wrap items-center gap-2"><strong>{hover}</strong> connects to <SdgPill n={hovered.n} small /> — building it supports {career.title.toLowerCase()} work that advances this goal.</span>
              ) : <span className="text-muted-foreground">Hover a skill label to see how it links to the Sustainable Development Goals.</span>}
            </div>
          </div>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.05}>
            <div className="glass glass-hi rounded-[2rem] p-6">
              <h2 className="font-display text-2xl">Reassess your skills</h2>
              <p className="mt-1 text-sm text-muted-foreground">Missed one during your profile? Update it, then refresh the hexagon.</p>
              <div className="mt-5 space-y-4">
                {data.map((d) => {
                  const cur = draft[d.skill] ?? profile.skills[d.skill] ?? 0;
                  return (
                    <div key={d.skill}>
                      <div className="flex justify-between text-sm"><span className={cn(cur < d.need && 'text-[hsl(330_85%_80%)]')}>{d.skill}</span><span className="font-mono text-xs text-muted-foreground">{LEVELS[cur]} · need {d.need}</span></div>
                      <input type="range" min={0} max={5} step={1} value={cur} aria-label={`${d.skill} level`} onChange={(e) => setDraft((x) => ({ ...x, [d.skill]: Number(e.target.value) }))} className="mt-2 w-full accent-[hsl(44_96%_58%)]" data-testid={`range-reassess-${d.skill.replace(/\W/g, '')}`} />
                    </div>
                  );
                })}
              </div>
              <button onClick={refresh} disabled={!dirty} className="btn-gold mt-6 w-full justify-center" data-testid="button-refresh-match"><RefreshCw className="h-4 w-4" />Refresh hexagon & score</button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass glass-hi grid grid-cols-2 gap-4 rounded-[2rem] p-6">
              <div><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5" />Expected salary</p><p className="mt-2 font-mono text-lg text-gold">{myr(career.salary[0])}–{(career.salary[1] / 1000).toFixed(1)}k</p><p className="text-xs text-muted-foreground">per month, Malaysia</p></div>
              <div><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><TrendingUp className="h-3.5 w-3.5" />Demand to 2030</p><p className={cn('mt-2 font-mono text-lg', career.growth[scenario] >= 0 ? 'text-[hsl(150_60%_70%)]' : 'text-[hsl(352_85%_75%)]')}>{career.growth[scenario] > 0 ? '+' : ''}{career.growth[scenario]}%</p><p className="text-xs text-muted-foreground">{scenario} adoption</p></div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="glass glass-hi h-full rounded-[2rem] p-7">
            <p className="flex items-center gap-2 font-semibold"><Briefcase className="h-4 w-4 text-gold" />The role</p>
            <p className="mt-3 text-[hsl(232_25%_85%)]">{career.description}</p>
            <p className="mt-6 flex items-center gap-2 font-semibold"><TrendingUp className="h-4 w-4 text-gold" />Prospects</p>
            <p className="mt-3 text-[hsl(232_25%_85%)]">{career.prospects}</p>
            <p className="mt-6 font-semibold">Related SDGs</p>
            <div className="mt-3 flex flex-wrap gap-2">{career.sdgs.map((n) => <SdgPill key={n} n={n} />)}</div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="glass glass-hi h-full rounded-[2rem] p-7">
            <p className="flex items-center gap-2 font-semibold"><Bot className="h-4 w-4 text-gold" />AI outlook</p>
            <div className="mt-5 space-y-5">
              {(['moderate', 'fast'] as const).map((s) => (
                <div key={s} className={cn('rounded-2xl border p-4 transition-colors', s === scenario ? 'border-[hsl(44_96%_58%/.5)] bg-[hsl(44_96%_58%/.06)]' : 'border-white/5')}>
                  <p className="text-sm font-semibold capitalize">{s} adoption</p>
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>Tasks exposed to automation</span><span className="font-mono">{career.automationRisk[s]}%</span></div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-[hsl(330_80%_65%)]" style={{ width: `${career.automationRisk[s]}%` }} /></div>
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>Market demand</span><span className="font-mono">{career.demand[s]}/100</span></div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-[hsl(var(--gold))]" style={{ width: `${career.demand[s]}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-[hsl(44_96%_58%/.25)] bg-[hsl(44_96%_58%/.05)] p-6 sm:flex-row sm:items-center">
        <p className="max-w-xl">{match.gaps.length ? <>Close <strong className="text-gold">{match.gaps.length}</strong> gap{match.gaps.length > 1 ? 's' : ''} — {match.gaps.map((g) => g.skill).join(', ')} — to reach this destination.</> : 'You already meet every required level. Keep sharpening.'}</p>
        <button onClick={plan} className="btn-gold shrink-0" data-testid="button-build-plan">Plot my flight plan <ArrowRight className="h-4 w-4" /></button>
      </div>
    </Page>
  );
}
