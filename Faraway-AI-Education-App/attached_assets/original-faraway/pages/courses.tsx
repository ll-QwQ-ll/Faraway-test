import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Page } from '@/components/layout';
import { PageHeader } from '@/components/ui-bits';
import { CourseCard, CAT_ICON } from '@/components/course-card';
import { CATEGORIES, COURSES, type Category, type Level } from '@/data/courses';
import { cn } from '@/lib/utils';

export default function Courses() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category | 'All'>('All');
  const [level, setLevel] = useState<Level | 'All'>('All');
  const [free, setFree] = useState(false);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return COURSES.filter((c) =>
      (cat === 'All' || c.category === cat) &&
      (level === 'All' || c.level === level) &&
      (!free || c.cost === 0) &&
      (!t || [c.title, c.description, c.instructor, ...c.skills].join(' ').toLowerCase().includes(t)),
    );
  }, [q, cat, level, free]);

  const clear = () => { setQ(''); setCat('All'); setLevel('All'); setFree(false); };

  return (
    <Page>
      <PageHeader eyebrow="Course catalogue" title={<>A galaxy of <em className="text-gold">courses</em></>}>
        {COURSES.length} courses across six fields, priced in ringgit, many claimable through HRD Corp.
      </PageHeader>

      <div className="glass glass-hi sticky top-20 z-30 mb-10 rounded-3xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses, skills, instructors" className="field rounded-full pl-11" aria-label="Search courses" data-testid="input-search-courses" />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'All')} className="field w-auto rounded-full py-2" aria-label="Level" data-testid="select-level">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l} value={l}>{l === 'All' ? 'All levels' : l}</option>)}
            </select>
            <button onClick={() => setFree((f) => !f)} className="chip !py-2" data-on={free} aria-pressed={free} data-testid="button-filter-free">Free only</button>
          </div>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {(['All', ...CATEGORIES] as const).map((c) => {
            const Icon = c === 'All' ? null : CAT_ICON[c];
            return (
              <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} data-testid={`button-category-${c.replace(/\W/g, '')}`}
                className={cn('relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors', cat === c ? 'text-[hsl(232_45%_7%)]' : 'text-muted-foreground hover:text-foreground')}>
                {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,hsl(46_100%_70%),hsl(40_95%_52%))]" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                {Icon && <Icon className="relative h-4 w-4" />}<span className="relative">{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mb-5 font-mono text-xs text-muted-foreground" aria-live="polite" data-testid="text-result-count">{list.length} course{list.length === 1 ? '' : 's'}</p>
      {list.length === 0 ? (
        <div className="glass mx-auto max-w-md rounded-3xl p-10 text-center">
          <div className="relative mx-auto h-20 w-20"><div className="anim-spin absolute inset-0 rounded-full border border-dashed border-white/20" /><Search className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" /></div>
          <h2 className="mt-5 font-display text-3xl">Empty sky</h2>
          <p className="mt-2 text-sm text-muted-foreground">No courses match those filters. Widen the search.</p>
          <button onClick={clear} className="btn-ghost mt-6" data-testid="button-clear-filters"><X className="h-4 w-4" />Clear filters</button>
        </div>
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35 }}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </Page>
  );
}
