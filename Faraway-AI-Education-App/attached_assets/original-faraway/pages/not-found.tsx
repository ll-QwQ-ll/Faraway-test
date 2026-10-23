import { Link } from 'wouter';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6 py-32">
      <div className="text-center">
        <div className="relative mx-auto h-40 w-40">
          <div className="anim-spin absolute inset-0 rounded-full border border-dashed border-[hsl(44_96%_58%/.4)]" />
          <div className="anim-spin-r absolute inset-6 rounded-full border border-[hsl(262_80%_70%/.3)]" />
          <Compass className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_ease-in-out_infinite] text-gold" />
        </div>
        <p className="eyebrow mt-8">Error 404 · Uncharted space</p>
        <h1 className="mt-3 font-display text-5xl sm:text-7xl">You’ve drifted off the map.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">This page doesn’t exist, or it floated away. The compass still points home.</p>
        <Link href="/" className="btn-gold mt-10" data-testid="link-404-home">Return to Faraway</Link>
      </div>
    </div>
  );
}
