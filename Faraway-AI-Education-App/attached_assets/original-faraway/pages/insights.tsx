import { useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, Area, AreaChart, CartesianGrid } from 'recharts';
import { RotateCw, ArrowRight, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Page } from '@/components/layout';
import { JourneyBar, PageHeader, Reveal, ScenarioToggle } from '@/components/ui-bits';
import { JOB_TRENDS, SKILL_TRENDS, TREND_YEARS } from '@/data/careers';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const tooltipStyle = { background: 'hsl(234 42% 10%)', border: '1px solid hsl(235 30% 22%)', borderRadius: 12, color: 'hsl(40 30% 94%)', fontSize: 12 };

function Flip({ flipped, axis, front, back, onFlip, label }: { flipped: boolean; axis: 'x' | 'y'; front: ReactNode; back: ReactNode; onFlip: () => void; label: string }) {
  const rot = axis === 'y' ? 'rotateY(180deg)' : 'rotateX(180deg)';
  return (
    <div className="flip-scene">
      <div className="flip-card relative grid" style={{ transform: flipped ? rot : 'none' }}>
        <div className="flip-face glass glass-hi col-start-1 row-start-1 rounded-[2rem] p-5 sm:p-7" aria-hidden={flipped}>{front}</div>
        <div className="flip-face glass glass-hi col-start-1 row-start-1 rounded-[2rem] p-5 sm:p-7" style={{ transform: rot }} aria-hidden={!flipped}>{back}</div>
      </div>
      <button onClick={onFlip} className="btn-ghost mt-4 text-sm" data-testid={`button-flip-${label}`} aria-pressed={flipped}>
        <RotateCw className={cn('h-4 w-4 transition-transform duration-700', flipped && 'rotate-180')} />{flipped ? 'Back to today' : 'Flip to the future'}
      </button>
    </div>
  );
}

function SkillChart({ data, title, sub }: { data: { skill: string; v: number }[]; title: string; sub: string }) {
  return (
    <div>
      <p className="eyebrow">{sub}</p>
      <h3 className="mt-1 font-display text-2xl">{title}</h3>
      <div className="mt-4 h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30, top: 4, bottom: 4 }}>
            <XAxis type="number" domain={[-60, 70]} tick={{ fill: 'hsl(232 18% 70%)', fontSize: 11 }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="skill" width={118} tick={{ fill: 'hsl(40 30% 90%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <ReferenceLine x={0} stroke="hsl(235 30% 30%)" />
            <Tooltip cursor={{ fill: 'hsl(0 0% 100% / .03)' }} contentStyle={tooltipStyle} formatter={(v: number) => [`${v > 0 ? '+' : ''}${v}%`, 'Change in demand']} />
            <Bar dataKey="v" radius={[0, 6, 6, 0]} animationDuration={900}>
              {data.map((d) => <Cell key={d.skill} fill={d.v >= 0 ? 'url(#rise)' : 'hsl(352 70% 62%)'} />)}
            </Bar>
            <defs><linearGradient id="rise" x1="0" x2="1"><stop offset="0" stopColor="hsl(262 80% 68%)" /><stop offset="1" stopColor="hsl(44 96% 60%)" /></linearGradient></defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function JobChart({ data, title, sub, color }: { data: Record<string, number | string>[]; title: string; sub: string; color: string }) {
  const keys = JOB_TRENDS.map((j) => j.role);
  const palette = ['#ffd56b', '#b48cff', '#5fd6f0', '#ff8fc7', '#9aa5c9', '#ff7a7a'];
  const chart = (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid stroke="hsl(235 30% 18%)" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: 'hsl(232 18% 70%)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'hsl(232 18% 70%)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        {keys.map((k, i) => (
          <Area key={k} type="monotone" dataKey={k} stroke={palette[i]} strokeWidth={2} fill={palette[i]} fillOpacity={0.06} animationDuration={1100} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
  return (
    <div>
      <p className="eyebrow" style={{ color }}>{sub}</p>
      <h3 className="mt-1 font-display text-2xl">{title}</h3>
      <div className="relative mt-4">
        <div className="h-[260px]">{chart}</div>
        {/* reflection */}
        <div aria-hidden className="pointer-events-none h-[90px] overflow-hidden opacity-30 blur-[1.5px]" style={{ maskImage: 'linear-gradient(to bottom, black, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)' }}>
          <div className="h-[260px] -scale-y-100">{chart}</div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {keys.map((k, i) => <span key={k} className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: palette[i] }} />{k}</span>)}
      </div>
    </div>
  );
}

export default function Insights() {
  const scenario = useStore((s) => s.scenario);
  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(false);
  const label = scenario === 'fast' ? 'Fast AI adoption' : 'Moderate AI adoption';

  const now = SKILL_TRENDS.map((s) => ({ skill: s.skill, v: s.now }));
  const future = SKILL_TRENDS.map((s) => ({ skill: s.skill, v: s[scenario] })).sort((a, b) => b.v - a.v);
  const hist = TREND_YEARS.map((y, i) => ({ year: y, ...Object.fromEntries(JOB_TRENDS.map((j) => [j.role, j.history[i]])) }));
  const fut = ['2025', '2026', '2027', '2028', '2029', '2030'].map((y, i) => ({ year: y, ...Object.fromEntries(JOB_TRENDS.map((j) => { const a = j.history[4]; const b = j[scenario]; return [j.role, Math.round(a + ((b - a) * i) / 5)]; })) }));

  const rising = [...SKILL_TRENDS].sort((a, b) => b[scenario] - a[scenario]).slice(0, 3);
  const falling = [...SKILL_TRENDS].sort((a, b) => a[scenario] - b[scenario]).slice(0, 3);

  return (
    <Page>
      <JourneyBar />
      <PageHeader eyebrow="Step 02 · Market signals" title={<>What the market is <em className="text-gold">telling</em> you</>} right={<ScenarioToggle />}>
        Today’s trends on the front. Flip any chart to see the 2030 scenario. Switch adoption speed to compare futures.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <Flip label="skills" axis="y" flipped={f1} onFlip={() => setF1((f) => !f)}
            front={<SkillChart data={now} title="Skill demand, 2021 to 2025" sub="Today · Rising and declining" />}
            back={<SkillChart data={future} title={`Projected to 2030`} sub={label} />} />
        </Reveal>
        <Reveal delay={0.08}>
          <Flip label="jobs" axis="x" flipped={f2} onFlip={() => setF2((f) => !f)}
            front={<JobChart data={hist} title="Job postings index, past to now" sub="Today · 2021 = 100" color="hsl(44 96% 60%)" />}
            back={<JobChart data={fut} title="Job postings to 2030" sub={label} color={scenario === 'fast' ? 'hsl(330 85% 75%)' : 'hsl(44 96% 60%)'} />} />
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Reveal><div className="glass glass-hi h-full rounded-3xl p-7">
          <p className="flex items-center gap-2 font-semibold text-[hsl(150_60%_70%)]"><TrendingUp className="h-5 w-5" />Brightest stars · {label}</p>
          <ul className="mt-5 space-y-3">{rising.map((s) => <li key={s.skill} className="flex justify-between border-b border-white/5 pb-3"><span>{s.skill}</span><span className="font-mono text-gold">+{s[scenario]}%</span></li>)}</ul>
        </div></Reveal>
        <Reveal delay={0.06}><div className="glass glass-hi h-full rounded-3xl p-7">
          <p className="flex items-center gap-2 font-semibold text-[hsl(352_85%_75%)]"><TrendingDown className="h-5 w-5" />Fading signals · {label}</p>
          <ul className="mt-5 space-y-3">{falling.map((s) => <li key={s.skill} className="flex justify-between border-b border-white/5 pb-3"><span>{s.skill}</span><span className="font-mono text-[hsl(352_85%_75%)]">{s[scenario]}%</span></li>)}</ul>
        </div></Reveal>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/5 p-6 sm:flex-row sm:items-center">
        <p className="flex max-w-2xl gap-3 text-sm text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0" />Figures are illustrative scenarios assembled for this prototype, informed by public reporting on Malaysian job postings and AI exposure studies. They are not live JobStreet data or guaranteed predictions.</p>
        <Link href="/careers" className="btn-gold shrink-0" data-testid="link-to-careers">See my matches <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </Page>
  );
}
