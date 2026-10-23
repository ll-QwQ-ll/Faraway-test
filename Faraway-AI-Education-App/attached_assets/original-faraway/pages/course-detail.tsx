import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Clock, Download, FileText, Play, Star, Users, BookOpen, Award } from 'lucide-react';
import heroImg from '@assets/generated_images/hero-galaxy.jpg';
import { Page } from '@/components/layout';
import { CoursePlanet } from '@/components/course-card';
import { courseById, genericLessons, PYTHON_LESSONS, PYTHON_RESOURCES } from '@/data/courses';
import { setState, useStore } from '@/lib/store';
import { myr } from '@/lib/match';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import NotFound from './not-found';

type Tab = 'overview' | 'chapters' | 'resources';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const course = courseById(id ?? '');
  const allLessons = useStore((s) => s.lessons);
  const done = allLessons[id ?? ''] ?? [];
  const [idx, setIdx] = useState(0);
  const [tab, setTab] = useState<Tab>('overview');
  const [playing, setPlaying] = useState(false);
  const { toast } = useToast();
  if (!course) return <NotFound />;

  const lessons = course.id === 'python-programming' ? PYTHON_LESSONS : genericLessons(course);
  const resources = course.id === 'python-programming' ? PYTHON_RESOURCES : PYTHON_RESOURCES.slice(0, 1).map((r) => ({ ...r, name: `${course.title} study guide` }));
  const lesson = lessons[idx];
  const pct = Math.round((done.length / lessons.length) * 100);
  const isDone = done.includes(lesson.id);

  const go = (i: number) => { setIdx(i); setPlaying(false); };
  const mark = () => {
    setState((s) => {
      const cur = s.lessons[course.id] ?? [];
      return { ...s, lessons: { ...s.lessons, [course.id]: isDone ? cur.filter((x) => x !== lesson.id) : [...cur, lesson.id] } };
    });
    if (!isDone) {
      toast({ title: 'Lesson complete', description: done.length + 1 === lessons.length ? `You finished ${course.title}.` : lesson.title });
      if (idx < lessons.length - 1) setTimeout(() => go(idx + 1), 400);
    }
  };
  const download = (r: (typeof resources)[number]) => {
    const blob = new Blob([r.content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${r.name.toLowerCase().replace(/\s+/g, '-')}-sample.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Page>
      <Link href="/courses" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="link-back-courses"><ArrowLeft className="h-4 w-4" />Back to courses</Link>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-6">
          <CoursePlanet course={course} size={96} />
          <div>
            <p className="eyebrow">{course.category} · {course.level}</p>
            <h1 className="mt-2 font-display text-4xl leading-none sm:text-6xl" data-testid="text-course-title">{course.title}</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">{course.description}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[hsl(232_25%_82%)]">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-gold" />{course.hours} hours</span>
              <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-gold" />{lessons.length} lessons</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-gold" />{course.rating}</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-gold" />{course.learners.toLocaleString('en-MY')} learners</span>
            </div>
          </div>
        </div>
        <div className="glass glass-hi w-full rounded-3xl p-5 lg:w-80">
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Your progress</span><span className="font-mono text-gold" data-testid="text-course-progress">{pct}%</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"><motion.div className="h-full rounded-full bg-[linear-gradient(90deg,hsl(262_80%_68%),hsl(44_96%_58%))]" animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} /></div>
          <p className="mt-3 text-xs text-muted-foreground">{done.length} of {lessons.length} lessons complete</p>
          {pct === 100 && <p className="mt-3 flex items-center gap-2 text-sm text-gold"><Award className="h-4 w-4" />Course complete</p>}
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-white/10">
            <img src={heroImg} alt="" className={cn('absolute inset-0 h-full w-full object-cover transition-transform duration-[20s]', playing && 'scale-125')} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,hsl(232_45%_5%/.9))]" />
            <AnimatePresence mode="wait">
              {!playing ? (
                <motion.button key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPlaying(true)} className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[hsl(44_96%_58%/.9)] text-black shadow-[0_0_50px_hsl(44_96%_58%/.6)] transition-transform hover:scale-110" aria-label={`Play ${lesson.title}`} data-testid="button-play">
                  <Play className="ml-1 h-8 w-8" fill="currentColor" />
                </motion.button>
              ) : (
                <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 px-4 py-2 font-mono text-xs backdrop-blur" role="status">Preview playing · video lessons are illustrative in this demo</motion.div>
              )}
            </AnimatePresence>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-mono text-xs text-gold">Lesson {idx + 1} of {lessons.length} · {lesson.duration}</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl" data-testid="text-lesson-title">{lesson.title}</h2>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => go(idx - 1)} disabled={idx === 0} className="btn-ghost disabled:opacity-30" data-testid="button-prev-lesson"><ArrowLeft className="h-4 w-4" />Previous lesson</button>
            <button onClick={mark} className={isDone ? 'btn-ghost' : 'btn-gold'} data-testid="button-mark-complete">{isDone ? <><CheckCircle2 className="h-4 w-4 text-gold" />Completed — undo</> : <><Check className="h-4 w-4" />Mark as complete</>}</button>
            <button onClick={() => go(idx + 1)} disabled={idx === lessons.length - 1} className="btn-ghost disabled:opacity-30" data-testid="button-next-lesson">Next lesson<ArrowRight className="h-4 w-4" /></button>
          </div>

          <div className="glass glass-hi mt-6 rounded-[2rem] p-6 sm:p-8">
            <div role="tablist" className="flex gap-1 border-b border-white/5">
              {(['overview', 'chapters', 'resources'] as Tab[]).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn('relative px-4 pb-3 text-sm capitalize transition-colors', tab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} data-testid={`tab-${t}`}>
                  {t}{tab === t && <motion.span layoutId="tab-line" className="absolute inset-x-2 -bottom-px h-0.5 bg-[hsl(var(--gold))]" />}
                </button>
              ))}
            </div>
            <div className="pt-6" role="tabpanel">
              {tab === 'overview' && (
                <div>
                  <p className="text-[hsl(232_25%_88%)]">{lesson.summary}</p>
                  <ul className="mt-4 space-y-2">{lesson.points.map((p) => <li key={p} className="flex gap-2 text-sm text-muted-foreground"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--gold))]" />{p}</li>)}</ul>
                  {lesson.code && <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/5 bg-[hsl(232_45%_4%)] p-5 font-mono text-sm text-[hsl(44_100%_82%)]"><code>{lesson.code}</code></pre>}
                  <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[hsl(262_60%_30%)] font-semibold">{course.instructor.replace(/^(Dr\.|Prof\.)\s/, '').split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                    <div><p className="font-semibold">{course.instructor}</p><p className="text-sm text-muted-foreground">{course.provider} · {course.cost === 0 ? 'Free' : myr(course.cost)}{course.hrdc ? ' · HRD Corp claimable' : ''}</p></div>
                  </div>
                </div>
              )}
              {tab === 'chapters' && (
                <ol className="space-y-1">{lessons.map((l, i) => (
                  <li key={l.id}><button onClick={() => go(i)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/[.03]"><span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span><span className="flex-1">{l.title}</span>{done.includes(l.id) && <CheckCircle2 className="h-4 w-4 text-gold" />}<span className="font-mono text-xs text-muted-foreground">{l.duration}</span></button></li>
                ))}</ol>
              )}
              {tab === 'resources' && (
                <ul className="space-y-3">{resources.map((r) => (
                  <li key={r.name} className="flex items-center gap-4 rounded-2xl border border-white/5 p-4">
                    <FileText className="h-5 w-5 text-gold" />
                    <div className="flex-1"><p className="font-medium">{r.name}</p><p className="font-mono text-xs text-muted-foreground">{r.type} · {r.size} · sample file</p></div>
                    <button onClick={() => download(r)} className="btn-ghost !px-3 !py-2 text-sm" data-testid={`button-download-${r.type.toLowerCase()}`}><Download className="h-4 w-4" />Download</button>
                  </li>
                ))}</ul>
              )}
            </div>
          </div>
        </div>

        <aside className="glass glass-hi h-fit rounded-[2rem] p-5 lg:sticky lg:top-24" aria-label="Course content">
          <p className="eyebrow mb-4 px-2">Course content</p>
          <ol className="space-y-1">
            {lessons.map((l, i) => {
              const d = done.includes(l.id);
              return (
                <li key={l.id}>
                  <button onClick={() => go(i)} aria-current={i === idx} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors', i === idx ? 'bg-[hsl(44_96%_58%/.1)] text-foreground ring-1 ring-[hsl(44_96%_58%/.35)]' : 'text-muted-foreground hover:bg-white/[.03] hover:text-foreground')} data-testid={`button-lesson-${l.id}`}>
                    {d ? <CheckCircle2 className="h-4 w-4 shrink-0 text-gold" /> : <Circle className="h-4 w-4 shrink-0 opacity-40" />}
                    <span className="flex-1">{i + 1}. {l.title}</span>
                    <span className="font-mono text-[11px]">{l.duration}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </Page>
  );
}
