import { useRef, type PointerEvent } from 'react';
import { Link } from 'wouter';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Code2, BrainCircuit, PenTool, Atom, BarChart3, Sigma, Clock, ArrowRight, Star } from 'lucide-react';
import type { Category, Course } from '@/data/courses';
import { myr } from '@/lib/match';

export const CAT_ICON: Record<Category, typeof Code2> = {
  Programming: Code2,
  'AI & Machine Learning': BrainCircuit,
  Design: PenTool,
  Science: Atom,
  Business: BarChart3,
  Mathematics: Sigma,
};

export function CoursePlanet({ course, size = 72 }: { course: Course; size?: number }) {
  const Icon = CAT_ICON[course.category];
  const h = course.hue;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 32% 28%, hsl(${h} 90% 78%), hsl(${h} 70% 42%) 45%, hsl(${(h + 40) % 360} 60% 14%) 85%)`, boxShadow: `0 0 30px -4px hsl(${h} 90% 60% / .55), inset -8px -10px 20px hsl(240 60% 4% / .7)` }} />
      <div className="absolute left-1/2 top-1/2 h-[30%] w-[160%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-white/25" />
      <Icon className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 text-white drop-shadow" />
    </div>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const gx = useMotionValue(50); const gy = useMotionValue(50);
  const onMove = (e: PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * 10); rx.set(-(y - 0.5) * 10);
    gx.set(x * 100); gy.set(y * 100);
    ref.current.style.setProperty('--gx', `${x * 100}%`); ref.current.style.setProperty('--gy', `${y * 100}%`);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={reduce ? undefined : { y: -6 }} className="group relative h-full" data-testid={`card-course-${course.id}`}>
      <div className="glass glass-hi relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-[border-color,box-shadow] duration-300 group-hover:border-[hsl(44_96%_58%/.45)] group-hover:shadow-[0_30px_60px_-25px_hsl(44_96%_50%/.35)]">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(400px circle at var(--gx,50%) var(--gy,50%), hsl(44 96% 60% / .10), transparent 45%)' }} />
        <div className="flex items-start justify-between gap-3">
          <CoursePlanet course={course} size={64} />
          <div className="flex flex-col items-end gap-1.5">
            <span className="rounded-full bg-white/[.05] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{course.level}</span>
            {course.hrdc && <span className="rounded-full bg-[hsl(44_96%_58%/.12)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">HRD Corp</span>}
          </div>
        </div>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(262_80%_80%)]">{course.category}</p>
        <h3 className="mt-1.5 text-xl font-semibold leading-tight">{course.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{course.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.hours} hrs</span>
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-gold" />{course.rating}</span>
          <span className="font-mono">{course.cost === 0 ? 'Free' : myr(course.cost)}</span>
        </div>
        <Link href={`/courses/${course.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold" data-testid={`link-view-course-${course.id}`}>
          View course <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
