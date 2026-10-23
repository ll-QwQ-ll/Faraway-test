import { useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, FileText, Plus, Sparkles, Trash2, Upload, RotateCcw, X } from 'lucide-react';
import { Page } from '@/components/layout';
import { JourneyBar, PageHeader } from '@/components/ui-bits';
import { STREAMS, CAREERS } from '@/data/careers';
import { emptyProfile, sampleProfile, setState, useStore, type Highest, type Profile, type EduEntry } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const STEPS = ['Stream', 'Interests', 'CV', 'Basics', 'Experience', 'Education', 'Skills', 'Summary'];
const LEVELS = ['None', 'Aware', 'Beginner', 'Working', 'Strong', 'Expert'];
const HIGHEST: Highest[] = ['SPM', 'Diploma', 'Degree', 'Masters', 'PhD'];

function update(fn: (p: Profile) => Profile) {
  setState((s) => ({ ...s, profile: fn(s.profile) }));
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[hsl(232_25%_85%)]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function EduBlock({ title, k, p }: { title: string; k: 'ug' | 'pg' | 'phd'; p: Profile }) {
  const e = p[k];
  const set = (f: keyof EduEntry, v: string) => update((x) => ({ ...x, [k]: { ...x[k], [f]: v } }));
  const empty = !e.field || !e.institution;
  return (
    <div className={cn('rounded-2xl border p-5', empty ? 'border-dashed border-[hsl(44_96%_58%/.35)]' : 'border-white/10')}>
      <div className="mb-4 flex items-center justify-between"><p className="font-semibold">{title}</p>{empty && <span className="font-mono text-[10px] uppercase tracking-widest text-gold">Needs your input</span>}</div>
      <div className="grid gap-3 sm:grid-cols-[1.4fr_1.4fr_0.6fr]">
        <input className="field" placeholder="Programme / field" value={e.field} onChange={(ev) => set('field', ev.target.value)} aria-label={`${title} field`} data-testid={`input-${k}-field`} />
        <input className="field" placeholder="Institution" value={e.institution} onChange={(ev) => set('institution', ev.target.value)} aria-label={`${title} institution`} data-testid={`input-${k}-institution`} />
        <input className="field" placeholder="Year" inputMode="numeric" value={e.year} onChange={(ev) => set('year', ev.target.value.replace(/\D/g, '').slice(0, 4))} aria-label={`${title} year`} data-testid={`input-${k}-year`} />
      </div>
    </div>
  );
}

export default function CompassPage() {
  const p = useStore((s) => s.profile);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [other, setOther] = useState('');
  const [fileName, setFileName] = useState('');
  const [, nav] = useLocation();
  const { toast } = useToast();
  const stream = STREAMS.find((s) => s.id === p.stream);

  const valid = [
    !!p.stream,
    p.careers.length > 0,
    true,
    p.name.trim().length > 1 && /\S+@\S+\.\S+/.test(p.email),
    true,
    true,
    Object.values(p.skills).filter((v) => v > 0).length >= 3,
    true,
  ];
  const hints = ['Choose a stream to continue', 'Pick at least one career', '', 'Add your name and a valid email', '', '', 'Rate at least three skills above None', ''];

  const go = (d: number) => { setDir(d); setStep((s) => Math.min(Math.max(s + d, 0), STEPS.length - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const finish = () => {
    update((x) => ({ ...x, complete: true }));
    toast({ title: 'Bearing set', description: 'Your profile is charted. Here is what the market is signalling.' });
    nav('/insights');
  };
  const useSample = () => {
    update(() => ({ ...sampleProfile }));
    toast({ title: 'Sample profile loaded', description: 'Demo data for Aina, a fresh CS graduate. Edit anything that does not fit you.' });
  };
  const skillList = Array.from(new Set([...(stream?.skills ?? []), ...Object.keys(p.skills)]));

  const panels: ReactNode[] = [
    <div key="0">
      <h2 className="font-display text-3xl">Which stream are you navigating from?</h2>
      <p className="mt-2 text-muted-foreground">This narrows careers and skills to the ones that matter for you.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {STREAMS.map((s, i) => (
          <button key={s.id} onClick={() => update((x) => ({ ...x, stream: s.id, careers: x.stream === s.id ? x.careers : [] }))} data-testid={`button-stream-${s.id}`}
            className={cn('group relative overflow-hidden rounded-3xl border p-6 text-left transition-all', p.stream === s.id ? 'border-[hsl(44_96%_58%/.7)] bg-[hsl(44_96%_58%/.08)]' : 'border-white/10 bg-white/[.02] hover:border-white/25')}>
            <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
            <p className="mt-3 text-xl font-semibold">{s.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
            {p.stream === s.id && <Check className="absolute right-5 top-5 h-5 w-5 text-gold" />}
          </button>
        ))}
      </div>
    </div>,
    <div key="1">
      <h2 className="font-display text-3xl">Which destinations pull at you?</h2>
      <p className="mt-2 text-muted-foreground">Select every career you are curious about in {stream?.name ?? 'your stream'}. Interest counts for 15% of your match.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(stream?.careers ?? []).map((id) => {
          const c = CAREERS.find((x) => x.id === id)!;
          const on = p.careers.includes(id);
          return (
            <button key={id} aria-pressed={on} onClick={() => update((x) => ({ ...x, careers: on ? x.careers.filter((y) => y !== id) : [...x.careers, id] }))} data-testid={`button-career-${id}`}
              className={cn('flex items-start gap-4 rounded-2xl border p-5 text-left transition-all', on ? 'border-[hsl(44_96%_58%/.7)] bg-[hsl(44_96%_58%/.08)]' : 'border-white/10 hover:border-white/25')}>
              <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border', on ? 'border-transparent bg-[hsl(var(--gold))] text-black' : 'border-white/30')}>{on && <Check className="h-3.5 w-3.5" />}</span>
              <span><span className="block font-semibold">{c.title}</span><span className="text-sm text-muted-foreground">{c.blurb}</span></span>
            </button>
          );
        })}
      </div>
    </div>,
    <div key="2">
      <h2 className="font-display text-3xl">Bring your CV, or start from a sample</h2>
      <p className="mt-2 text-muted-foreground">CV scanning is not available in this demo build, so nothing is read from your file. You can attach it for your reference and fill in the next steps by hand, or load a sample profile to see the whole journey.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/15 p-10 text-center transition-colors hover:border-[hsl(44_96%_58%/.5)]">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="mt-4 font-semibold">{fileName || 'Attach your CV'}</span>
          <span className="mt-1 text-xs text-muted-foreground">{fileName ? 'Attached locally — not uploaded or analysed' : 'PDF or DOCX. Stays on your device.'}</span>
          <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} data-testid="input-cv" />
        </label>
        <button onClick={useSample} className="group flex flex-col items-center justify-center rounded-3xl border border-[hsl(262_80%_70%/.35)] bg-[hsl(262_60%_30%/.15)] p-10 text-center transition-colors hover:bg-[hsl(262_60%_35%/.25)]" data-testid="button-sample-profile">
          <Sparkles className="h-8 w-8 text-[hsl(262_80%_80%)]" />
          <span className="mt-4 font-semibold">Use sample profile</span>
          <span className="mt-1 text-xs text-muted-foreground">Demo autofill: Aina, CS graduate from Shah Alam</span>
        </button>
      </div>
      {fileName && <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><FileText className="h-4 w-4" />Empty boxes in the next steps are waiting for you to fill them.</p>}
    </div>,
    <div key="3">
      <h2 className="font-display text-3xl">Basic information</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Full name"><input className="field" value={p.name} onChange={(e) => update((x) => ({ ...x, name: e.target.value }))} data-testid="input-profile-name" /></Field>
        <Field label="Email"><input className="field" type="email" value={p.email} onChange={(e) => update((x) => ({ ...x, email: e.target.value }))} data-testid="input-profile-email" /></Field>
        <Field label="Location"><input className="field" placeholder="e.g. Johor Bahru, Johor" value={p.location} onChange={(e) => update((x) => ({ ...x, location: e.target.value }))} data-testid="input-profile-location" /></Field>
        <Field label="Where are you right now?">
          <select className="field" value={p.status} onChange={(e) => update((x) => ({ ...x, status: e.target.value as Profile['status'] }))} data-testid="select-status">
            <option value="graduate">Fresh graduate</option>
            <option value="jobseeker">Job seeker</option>
            <option value="switcher">Employed, worried about AI risk</option>
          </select>
        </Field>
      </div>
    </div>,
    <div key="4">
      <h2 className="font-display text-3xl">Experience</h2>
      <p className="mt-2 text-muted-foreground">Internships, part-time and project roles all count.</p>
      <div className="mt-8 max-w-xs">
        <Field label="Total years of relevant experience" hint="Use 0.5 for six months">
          <input className="field" type="number" min={0} max={40} step={0.5} value={p.years} onChange={(e) => update((x) => ({ ...x, years: Math.max(0, Number(e.target.value) || 0) }))} data-testid="input-years" />
        </Field>
      </div>
      <div className="mt-6 space-y-3">
        {p.roles.map((r, i) => (
          <div key={i} className="grid gap-3 rounded-2xl border border-white/10 p-4 sm:grid-cols-[1.3fr_1.3fr_0.5fr_auto]">
            <input className="field" placeholder="Role" value={r.title} aria-label="Role" onChange={(e) => update((x) => ({ ...x, roles: x.roles.map((y, j) => (j === i ? { ...y, title: e.target.value } : y)) }))} data-testid={`input-role-title-${i}`} />
            <input className="field" placeholder="Organisation" value={r.company} aria-label="Organisation" onChange={(e) => update((x) => ({ ...x, roles: x.roles.map((y, j) => (j === i ? { ...y, company: e.target.value } : y)) }))} data-testid={`input-role-company-${i}`} />
            <input className="field" type="number" step={0.5} min={0} value={r.years} aria-label="Years" onChange={(e) => update((x) => ({ ...x, roles: x.roles.map((y, j) => (j === i ? { ...y, years: Number(e.target.value) || 0 } : y)) }))} data-testid={`input-role-years-${i}`} />
            <button onClick={() => update((x) => ({ ...x, roles: x.roles.filter((_, j) => j !== i) }))} className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:bg-white/5 hover:text-[hsl(352_85%_72%)]" aria-label="Remove role" data-testid={`button-remove-role-${i}`}><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <button onClick={() => update((x) => ({ ...x, roles: [...x.roles, { title: '', company: '', years: 0 }] }))} className="btn-ghost text-sm" data-testid="button-add-role"><Plus className="h-4 w-4" />Add a role</button>
      </div>
    </div>,
    <div key="5">
      <h2 className="font-display text-3xl">Education</h2>
      <div className="mt-8 max-w-xs">
        <Field label="Highest qualification">
          <select className="field" value={p.highest} onChange={(e) => update((x) => ({ ...x, highest: e.target.value as Highest }))} data-testid="select-highest">
            {HIGHEST.map((h) => <option key={h} value={h}>{h === 'Degree' ? "Bachelor's degree" : h === 'Masters' ? "Master's degree" : h}</option>)}
          </select>
        </Field>
      </div>
      <div className="mt-6 space-y-4">
        {['Degree', 'Masters', 'PhD'].includes(p.highest) && <EduBlock title="Undergraduate" k="ug" p={p} />}
        {['Masters', 'PhD'].includes(p.highest) && <EduBlock title="Postgraduate" k="pg" p={p} />}
        {p.highest === 'PhD' && <EduBlock title="Doctorate" k="phd" p={p} />}
        {!['Degree', 'Masters', 'PhD'].includes(p.highest) && <p className="text-sm text-muted-foreground">Great — {p.highest} holders follow many of these paths through TVET and HRD Corp programmes. No further details needed.</p>}
      </div>
    </div>,
    <div key="6">
      <h2 className="font-display text-3xl">Rate your skills honestly</h2>
      <p className="mt-2 text-muted-foreground">Skill fit is 65% of your match. Overrating only hides the gaps you need to close.</p>
      <div className="mt-8 space-y-2">
        {skillList.map((sk) => {
          const v = p.skills[sk] ?? 0;
          return (
            <div key={sk} className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[.02] p-4 sm:flex-row sm:items-center">
              <span className="w-48 shrink-0 font-medium">{sk}</span>
              <div className="flex flex-1 flex-wrap gap-1.5" role="radiogroup" aria-label={`${sk} level`}>
                {LEVELS.map((l, i) => (
                  <button key={l} role="radio" aria-checked={v === i} onClick={() => update((x) => ({ ...x, skills: { ...x.skills, [sk]: i } }))} className="chip" data-on={v === i} data-testid={`button-skill-${sk.replace(/\W/g, '')}-${i}`}>
                    <span className="font-mono text-[10px] opacity-60">{i}</span>{l}
                  </button>
                ))}
              </div>
              {!stream?.skills.includes(sk) && <button onClick={() => update((x) => { const n = { ...x.skills }; delete n[sk]; return { ...x, skills: n }; })} aria-label={`Remove ${sk}`} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
            </div>
          );
        })}
      </div>
      <form className="mt-5 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); const t = other.trim(); if (t) { update((x) => ({ ...x, skills: { ...x.skills, [t]: x.skills[t] ?? 2 } })); setOther(''); } }}>
        <input className="field" placeholder="Other skill (e.g. Tableau, Bahasa Mandarin)" value={other} onChange={(e) => setOther(e.target.value)} aria-label="Other skill" data-testid="input-other-skill" />
        <button className="btn-ghost shrink-0 text-sm" type="submit" data-testid="button-add-skill"><Plus className="h-4 w-4" />Add</button>
      </form>
    </div>,
    <div key="7">
      <h2 className="font-display text-3xl">Your chart, at a glance</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-5"><p className="eyebrow mb-3">Navigator</p><p className="text-lg font-semibold">{p.name || '—'}</p><p className="text-sm text-muted-foreground">{p.location || 'Location not set'} · {p.years} yrs experience · {p.highest}</p></div>
        <div className="rounded-2xl border border-white/10 p-5"><p className="eyebrow mb-3">Destinations</p><div className="flex flex-wrap gap-2">{p.careers.map((c) => <span key={c} className="chip" data-on>{CAREERS.find((x) => x.id === c)?.title}</span>)}</div></div>
        <div className="rounded-2xl border border-white/10 p-5 md:col-span-2"><p className="eyebrow mb-3">Skills</p><div className="flex flex-wrap gap-2">{Object.entries(p.skills).filter(([, v]) => v > 0).map(([k, v]) => <span key={k} className="chip">{k}<span className="font-mono text-gold">{v}</span></span>)}</div></div>
      </div>
      <Field label="Personal summary">
        <textarea className="field mt-5 min-h-28" value={p.summary} placeholder="Two or three sentences about what you want next." onChange={(e) => update((x) => ({ ...x, summary: e.target.value }))} data-testid="input-summary" />
      </Field>
    </div>,
  ];

  return (
    <Page>
      <JourneyBar />
      <PageHeader eyebrow="Step 01 · Chart your position" title={<>Where are you <em className="text-gold">standing</em>?</>}
        right={<button onClick={() => { update(() => ({ ...emptyProfile })); setStep(0); }} className="btn-ghost text-sm" data-testid="button-reset-profile"><RotateCcw className="h-4 w-4" />Start over</button>}>
        Eight short steps. Everything stays in your browser.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <ol className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col" aria-label="Profile steps">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button onClick={() => { if (i <= step || valid.slice(0, i).every(Boolean)) { setDir(i > step ? 1 : -1); setStep(i); } }} aria-current={i === step ? 'step' : undefined} data-testid={`button-step-${i}`}
                className={cn('flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors', i === step ? 'bg-white/[.06] text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <span className={cn('grid h-6 w-6 place-items-center rounded-full border font-mono text-[10px]', i < step && valid[i] ? 'border-transparent bg-[hsl(var(--gold))] text-black' : i === step ? 'border-[hsl(var(--gold))] text-gold' : 'border-white/20')}>{i < step && valid[i] ? <Check className="h-3 w-3" /> : i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>

        <div className="glass glass-hi min-w-0 overflow-hidden rounded-[2rem] p-6 sm:p-10">
          <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/5"><motion.div className="h-full bg-[linear-gradient(90deg,hsl(262_80%_68%),hsl(44_96%_58%))]" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ ease: [0.2, 0.8, 0.2, 1], duration: 0.6 }} /></div>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}>
              {panels[step]}
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
            <button onClick={() => go(-1)} disabled={step === 0} className="btn-ghost disabled:opacity-30" data-testid="button-back"><ArrowLeft className="h-4 w-4" />Back</button>
            {!valid[step] && <span className="text-sm text-[hsl(44_100%_75%)]" role="status">{hints[step]}</span>}
            {step < STEPS.length - 1 ? (
              <button onClick={() => go(1)} disabled={!valid[step]} className="btn-gold" data-testid="button-next">Next <ArrowRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={finish} disabled={!valid.every(Boolean)} className="btn-gold" data-testid="button-finish">See my signals <ArrowRight className="h-4 w-4" /></button>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
