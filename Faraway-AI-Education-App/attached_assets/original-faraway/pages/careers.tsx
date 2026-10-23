import { useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Telescope, ChevronDown } from 'lucide-react';
import { Page } from '@/components/layout';
import { JourneyBar, NeedProfile, PageHeader, ScenarioToggle, ScoreRing } from '@/components/ui-bits';
import { useStore } from '@/lib/store';
import { myr, suggested } from '@/lib/match';
import { STREAMS } from '@/data/careers';

const FACTORS = [
  { k: 'skillFit', l: 'Skill', w: 0.65 },
  { k: 'interestFit', l: 'Interest', w: 0.15 },
  { k: 'experienceFit', l: 'Experience', w: 0.1 },
  { k: 'marketFit', l: 'Market', w: 0.1 },
] as const;

export default function Careers() {
  const profile = useStore((s) => s.profile);
  const scenario = useStore((s) => s.scenario);
  const [more, setMore] = useState(false);
  const has = profile.stream && Object.keys(profile.skills).length >= 3;
  const list = has ? suggested(profile, scenario, more) : [];

  return (
    <Page>
      <JourneyBar />
      <PageHeader eyebrow="Step 03 · Destinations" title={<>Careers within <em className="text-gold">reach</em></>} right={<ScenarioToggle />}>
        Ranked by Match = 100 × (0.65 × Skill + 0.15 × Interest + 0.10 × Experience + 0.10 × Market).
      </PageHeader>
      {!has ? <NeedProfile /> : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <AnimatePresence initial={false}>
              {list.map((m, i) => {
                const top = i === 0;
                return (
                  <motion.div key={m.career.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.05 }} className={top ? 'md:col-span-2' : ''}>
                    <Link href={`/careers/${m.career.id}`} className="group glass glass-hi relative block h-full overflow-hidden rounded-[2rem] p-6 transition-colors hover:border-[hsl(44_96%_58%/.45)] sm:p-8" data-testid={`card-career-${m.career.id}`}>
                      {top && <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(44_96%_58%/.2),transparent_65%)]" />}
                      <div className="relative flex items-start gap-5">
                        <ScoreRing score={m.score} size={top ? 96 : 72} />
                        <div className="min-w-0 flex-1">
                          {top && <p className="eyebrow mb-1">Closest destination</p>}
                          <h2 className={top ? 'font-display text-4xl' : 'text-xl font-semibold'}>{m.career.title}</h2>
                          <p className="mt-1 text-sm text-muted-foreground">{m.career.blurb}</p>
                          <p className="mt-2 font-mono text-xs text-[hsl(232_25%_80%)]">{myr(m.career.salary[0])} – {myr(m.career.salary[1])} / month · {STREAMS.find((s) => s.id === m.career.stream)?.name}</p>
                        </div>
                      </div>
                      <div className="relative mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                        {FACTORS.map((f) => (
                          <div key={f.k}>
                            <div className="flex justify-between text-xs"><span className="text-muted-foreground">{f.l} <span className="opacity-60">×{f.w}</span></span><span className="font-mono">{Math.round(m[f.k] * 100)}</span></div>
                            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5"><motion.div className="h-full rounded-full bg-[linear-gradient(90deg,hsl(262_80%_68%),hsl(44_96%_58%))]" initial={{ width: 0 }} animate={{ width: `${m[f.k] * 100}%` }} transition={{ duration: 1, delay: 0.2 }} /></div>
                          </div>
                        ))}
                      </div>
                      <div className="relative mt-5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{m.gaps.length ? `${m.gaps.length} skill gap${m.gaps.length > 1 ? 's' : ''} to close` : 'No skill gaps'}</span>
                        <span className="flex items-center gap-1.5 font-semibold text-gold">Analyse <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="mt-10 flex justify-center">
            <button onClick={() => setMore((m) => !m)} className="btn-ghost" data-testid="button-explore-more">
              <Telescope className="h-4 w-4" />{more ? 'Show only my stream' : 'Explore more destinations'}<ChevronDown className={`h-4 w-4 transition-transform ${more ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </>
      )}
    </Page>
  );
}
