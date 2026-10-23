import { Link } from 'wouter';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Eye, Scale, HeartHandshake, Lightbulb } from 'lucide-react';
import travelerImg from '@assets/generated_images/traveler-nebula.jpg';
import planetImg from '@assets/generated_images/planet-ringed.png';
import { Logo, Page } from '@/components/layout';
import { Counter, Reveal } from '@/components/ui-bits';

const VALUES = [
  { icon: Eye, t: 'Honest instruments', d: 'We label demo data as demo data and show every weight in the match score. A compass you cannot read is just jewellery.' },
  { icon: Scale, t: 'Two futures, always', d: 'We never present one forecast as fate. Fast and moderate AI adoption sit side by side.' },
  { icon: HeartHandshake, t: 'Within reach', d: 'Free and HRD Corp claimable courses come first, because the best path is one you can afford.' },
  { icon: Lightbulb, t: 'Learning is the engine', d: 'Insight without action is stargazing. Every analysis ends in a concrete next lesson.' },
];

export default function About() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -120]);
  const rot = useTransform(scrollY, [0, 1200], [0, 40]);

  return (
    <Page>
      <section className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal><p className="eyebrow">About Faraway</p></Reveal>
          <Reveal delay={0.05}><h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-7xl">Nobody should face the future of work <em className="gold-text">without a compass.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="mt-6 max-w-xl text-lg text-muted-foreground">Faraway began with a simple worry heard in every Malaysian campus career fair: “Will AI take the job I just trained for?” We built a way to answer it with evidence, then turn the answer into a learning plan you can start tonight.</p></Reveal>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <motion.div style={{ rotate: reduce ? 0 : rot }} className="absolute inset-0 rounded-full border border-[hsl(44_96%_58%/.2)]" />
          <div className="anim-spin absolute inset-8 rounded-full border border-dashed border-[hsl(262_80%_70%/.3)]" />
          <div className="anim-spin-r absolute inset-20 rounded-full border border-[hsl(190_90%_60%/.2)]"><span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-[hsl(190_90%_70%)] shadow-[0_0_14px_hsl(190_90%_60%)]" /></div>
          <div className="anim-pulse absolute inset-[30%] rounded-full bg-[radial-gradient(circle,hsl(44_96%_58%/.35),transparent_70%)]" />
          <Logo className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2" />
          <motion.img style={{ y: reduce ? 0 : y1 }} src={planetImg} alt="" aria-hidden className="anim-float absolute -right-6 -top-6 w-32" />
        </div>
      </section>

      <section className="mt-28 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { v: 18205, l: 'learners in our most popular course' },
          { v: 13, l: 'careers mapped with skill hexagons' },
          { v: 4.7, d: 1, l: 'average course rating' },
          { v: 62, s: '%', l: 'of catalogue is free or HRD Corp claimable' },
        ].map((x, i) => (
          <Reveal key={x.l} delay={i * 0.06}>
            <div className="border-l border-[hsl(44_96%_58%/.35)] pl-5">
              <p className="font-display text-5xl text-gold sm:text-6xl"><Counter to={x.v} decimals={x.d ?? 0} suffix={x.s ?? ''} /></p>
              <p className="mt-2 text-sm text-muted-foreground">{x.l}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="relative mt-28 overflow-hidden rounded-[2rem] border border-white/10">
        <img src={travelerImg} alt="A traveller on a small moon beneath a nebula" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,hsl(232_45%_5%),hsl(232_45%_5%/.3))]" />
        <div className="relative px-7 pb-14 pt-56 sm:px-14">
          <p className="eyebrow">Our mission</p>
          <p className="mt-4 max-w-3xl font-display text-3xl leading-tight sm:text-5xl">Give every graduate, job seeker and career centre in Malaysia a clear, honest view of where work is heading, and the shortest learning path to meet it.</p>
        </div>
      </section>

      <section className="mt-28">
        <Reveal><p className="eyebrow">What we steer by</p></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <div className="glass glass-hi h-full rounded-[2rem] p-8">
                <v.icon className="h-6 w-6 text-gold" />
                <h3 className="mt-6 font-display text-3xl">{v.t}</h3>
                <p className="mt-3 text-muted-foreground">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-28 text-center">
        <Reveal><h2 className="mx-auto max-w-2xl font-display text-4xl sm:text-6xl">Pick a star. <em className="text-gold">We’ll plot the course.</em></h2></Reveal>
        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/courses" className="btn-gold" data-testid="link-about-courses">Browse the catalogue <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/compass" className="btn-ghost" data-testid="link-about-compass">Chart my position</Link>
          </div>
        </Reveal>
      </section>
    </Page>
  );
}
