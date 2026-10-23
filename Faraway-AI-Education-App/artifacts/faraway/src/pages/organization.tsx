import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Plus, Trash2, X, Users } from 'lucide-react';
import { ALL_SKILLS } from '@/data/careers';
import { Card, CardTitle, PageTitle, Reveal } from '@/components/bits';
import { SpectrumIcon } from '@/components/spectrum';
import { cn } from '@/lib/utils';

interface Member { id: string; name: string; position: string; department: string; skills: Record<string, number> }
interface Org { kind: 'company' | 'university'; name: string; departments: string[]; members: Member[] }

const KEY = 'faraway_org_v1';
const seed: Org = {
  kind: 'company', name: 'Klang Valley Logistics Sdn Bhd', departments: ['Finance', 'Operations', 'People & Culture'],
  members: [
    { id: 'm1', name: 'Tan Wei Ling', position: 'Accounts Executive', department: 'Finance', skills: { Accounting: 4, Excel: 4, 'AI Tools': 1 } },
    { id: 'm2', name: 'Muhammad Irfan bin Zainal', position: 'Operations Analyst', department: 'Operations', skills: { Excel: 3, SQL: 2, 'Data Visualisation': 2 } },
    { id: 'm3', name: 'Kavitha Raman', position: 'HR Officer', department: 'People & Culture', skills: { Communication: 4, 'Stakeholder Management': 3 } },
  ],
};
const load = (): Org => { try { const r = localStorage.getItem(KEY); return r ? (JSON.parse(r) as Org) : seed; } catch { return seed; } };

export default function Organization() {
  const [org, setOrg] = useState<Org>(load);
  const [dept, setDept] = useState('');
  const [adding, setAdding] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(org)); } catch { /* ignore */ } }, [org]);

  const upd = (p: Partial<Org>) => setOrg((o) => ({ ...o, ...p }));
  const updM = (id: string, p: Partial<Member>) => setOrg((o) => ({ ...o, members: o.members.map((m) => (m.id === id ? { ...m, ...p } : m)) }));
  const avg = (() => { const all = org.members.flatMap((m) => Object.values(m.skills)); return all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0; })();
  const aiReady = org.members.filter((m) => (m.skills['AI Tools'] ?? 0) >= 3).length;

  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Workspace · Organization" title={<>See your people's<br /><span className="text-muted-foreground">skills as a whole.</span></>}>For HR, TVET centres and university career offices planning reskilling at scale.</PageTitle>

      <Reveal><Card testId="card-org-basic">
        <CardTitle eyebrow="Basic info" title="Who you are" />
        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          <div className="grid grid-cols-2 gap-3">
            {([['company', Building2, 'Company'], ['university', GraduationCap, 'University / TVET']] as const).map(([k, I, l]) => (
              <button key={k} onClick={() => upd({ kind: k })} data-testid={`button-org-${k}`} className={cn('flex w-36 flex-col items-center gap-2 rounded-2xl border bg-white/70 p-5 text-sm transition-all', org.kind === k && 'spectrum-border border-transparent bg-white shadow-md')}>
                <SpectrumIcon icon={I} size={28} still={org.kind !== k} />{l}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">{org.kind === 'company' ? 'Company name' : 'Institution name'}</span>
              <input className="field" value={org.name} onChange={(e) => upd({ name: e.target.value })} data-testid="input-org-name" /></label>
            <div>
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{org.kind === 'company' ? 'Departments' : 'Faculties'}</span>
              <div className="flex flex-wrap gap-2">
                {org.departments.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-sm">{d}
                    <button onClick={() => upd({ departments: org.departments.filter((x) => x !== d) })} aria-label={`Remove ${d}`} data-testid={`button-remove-dept-${d.replace(/\W/g, '')}`}><X className="h-3 w-3 text-muted-foreground" /></button></span>
                ))}
                <form onSubmit={(e) => { e.preventDefault(); if (dept.trim() && !org.departments.includes(dept.trim())) { upd({ departments: [...org.departments, dept.trim()] }); setDept(''); } }} className="flex gap-2">
                  <input className="field w-44 py-1.5" placeholder="New department" value={dept} onChange={(e) => setDept(e.target.value)} data-testid="input-new-dept" />
                  <button className="btn-ghost py-1.5" data-testid="button-add-dept"><Plus className="h-4 w-4" />Add</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Card></Reveal>

      <div className="grid gap-6 sm:grid-cols-3">
        {[['Members', String(org.members.length)], ['Avg self-rating', avg.toFixed(1) + ' / 5'], ['AI-ready (AI Tools 3+)', `${aiReady} of ${org.members.length}`]].map(([l, v], i) => (
          <Reveal key={l} delay={i * 0.05}><Card><p className="eyebrow">{l}</p><p className="mt-3 font-display text-4xl" data-testid={`stat-org-${i}`}>{v}</p></Card></Reveal>
        ))}
      </div>

      <Reveal><Card testId="card-members">
        <CardTitle eyebrow="Members" title="Team skills" right={<button className="btn-ink" data-testid="button-add-member" onClick={() => upd({ members: [...org.members, { id: `m${Date.now()}`, name: '', position: '', department: org.departments[0] ?? '', skills: {} }] })}><Plus className="h-4 w-4" />Add member</button>} />
        {org.members.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed p-12 text-center"><SpectrumIcon icon={Users} size={36} /><p className="mt-3 text-sm text-muted-foreground">No members yet. Add the first to begin mapping skills.</p></div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-[hsl(232_50%_98%)] text-left text-xs text-muted-foreground"><tr><th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Position</th><th className="p-3 font-medium">Department</th><th className="p-3 font-medium">Skills · self-evaluation</th><th className="w-10" /></tr></thead>
              <tbody>
                {org.members.map((m) => (
                  <motion.tr layout key={m.id} className="border-t bg-white/70 align-top" data-testid={`row-member-${m.id}`}>
                    <td className="p-2"><input className="field py-1.5" placeholder="Name" value={m.name} onChange={(e) => updM(m.id, { name: e.target.value })} data-testid={`input-member-name-${m.id}`} /></td>
                    <td className="p-2"><input className="field py-1.5" placeholder="Position" value={m.position} onChange={(e) => updM(m.id, { position: e.target.value })} data-testid={`input-member-position-${m.id}`} /></td>
                    <td className="p-2"><select className="field py-1.5" value={m.department} onChange={(e) => updM(m.id, { department: e.target.value })} data-testid={`select-member-dept-${m.id}`}>{org.departments.map((d) => <option key={d}>{d}</option>)}</select></td>
                    <td className="p-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {Object.entries(m.skills).map(([s, v]) => (
                          <span key={s} className="inline-flex items-center gap-1.5 rounded-full border bg-white py-0.5 pl-2.5 pr-1 text-xs">{s}
                            <select value={v} onChange={(e) => updM(m.id, { skills: { ...m.skills, [s]: Number(e.target.value) } })} className="rounded-full bg-muted px-1 font-mono text-[10px] outline-none" aria-label={`${s} rating`} data-testid={`select-rating-${m.id}-${s.replace(/\W/g, '')}`}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}/5</option>)}</select>
                            <button onClick={() => { const n = { ...m.skills }; delete n[s]; updM(m.id, { skills: n }); }} aria-label={`Remove ${s}`}><X className="h-3 w-3 text-muted-foreground" /></button>
                          </span>
                        ))}
                        {adding === m.id ? (
                          <form className="flex gap-1" onSubmit={(e) => { e.preventDefault(); if (newSkill.trim()) updM(m.id, { skills: { ...m.skills, [newSkill.trim()]: 3 } }); setNewSkill(''); setAdding(null); }}>
                            <input autoFocus list="org-skills" className="field w-36 py-1 text-xs" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Skill" data-testid={`input-add-skill-${m.id}`} />
                            <datalist id="org-skills">{ALL_SKILLS.map((s) => <option key={s} value={s} />)}</datalist>
                            <button className="btn-ink px-3 py-1 text-xs">Add</button>
                          </form>
                        ) : <button onClick={() => setAdding(m.id)} className="inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground" data-testid={`button-add-skill-${m.id}`}><Plus className="h-3 w-3" />Add skill</button>}
                      </div>
                    </td>
                    <td className="p-2"><button onClick={() => upd({ members: org.members.filter((x) => x.id !== m.id) })} className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-muted" aria-label="Remove member" data-testid={`button-remove-member-${m.id}`}><Trash2 className="h-4 w-4" /></button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card></Reveal>
    </div>
  );
}
