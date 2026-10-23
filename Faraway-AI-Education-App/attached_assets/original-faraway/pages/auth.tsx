import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Info, ArrowRight } from 'lucide-react';
import planetImg from '@assets/generated_images/planet-ringed.png';
import { Logo } from '@/components/layout';
import { setState } from '@/lib/store';

const loginSchema = z.object({
  email: z.string().min(1, 'Enter your email').email('That email looks off — check for a typo'),
  password: z.string().min(8, 'Passwords are at least 8 characters'),
});
const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Tell us what to call you'),
  confirm: z.string().min(1, 'Confirm your password'),
}).refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

type RegisterValues = z.infer<typeof registerSchema>;

function PasswordInput({ id, label, error, reg, testid }: { id: string; label: string; error?: string; reg: UseFormRegisterReturn; testid: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-[hsl(232_25%_85%)]">{label}</label>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} className="field pr-11" aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} data-testid={testid} {...reg} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground" aria-label={show ? 'Hide password' : 'Show password'} data-testid={`button-toggle-${testid}`}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-[hsl(352_85%_72%)]">{error}</p>}
    </div>
  );
}

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const [, nav] = useLocation();
  const isReg = mode === 'register';
  const form = useForm<RegisterValues>({
    resolver: zodResolver(isReg ? registerSchema : (loginSchema as unknown as typeof registerSchema)),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
    mode: 'onTouched',
  });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (v: RegisterValues) => {
    await new Promise((r) => setTimeout(r, 600));
    const name = isReg ? v.name : v.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    setState((s) => ({ ...s, session: { name, email: v.email } }));
    nav('/compass');
  };

  return (
    <div className="relative grid min-h-[100dvh] lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_45%,hsl(262_70%_30%/.6),transparent_60%)]" />
        <img src={planetImg} alt="" aria-hidden className="anim-float absolute left-1/2 top-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 opacity-90" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="eyebrow">Demo mode</p>
          <p className="mt-3 max-w-md font-display text-4xl leading-tight">“Every navigator begins by admitting where they are.”</p>
        </div>
      </div>
      <div className="relative flex items-center justify-center px-5 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }} className="glass glass-hi w-full max-w-md rounded-[2rem] p-8 sm:p-10">
          <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground" data-testid="link-back-home"><ArrowLeft className="h-3.5 w-3.5" />Back to Faraway</Link>
          <Logo className="mx-auto w-28" />
          <h1 className="mt-6 text-center font-display text-4xl">{isReg ? 'Begin your voyage' : 'Welcome back, navigator'}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{isReg ? 'Create a demo profile to save your journey.' : 'Log in to pick up your bearing.'}</p>

          <div className="mt-6 flex gap-2 rounded-2xl border border-[hsl(190_80%_60%/.25)] bg-[hsl(190_80%_40%/.08)] p-3 text-xs text-[hsl(190_60%_85%)]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>This is a demo. No account is created on a server; your name and journey are kept only in this browser’s local storage. Do not use a real password.</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
            {isReg && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm text-[hsl(232_25%_85%)]">Name</label>
                <input id="name" className="field" autoComplete="name" aria-invalid={!!errors.name} data-testid="input-name" {...register('name')} />
                {errors.name && <p role="alert" className="mt-1.5 text-xs text-[hsl(352_85%_72%)]">{errors.name.message}</p>}
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-[hsl(232_25%_85%)]">Email</label>
              <input id="email" type="email" className="field" autoComplete="email" aria-invalid={!!errors.email} data-testid="input-email" {...register('email')} />
              {errors.email && <p role="alert" className="mt-1.5 text-xs text-[hsl(352_85%_72%)]">{errors.email.message}</p>}
            </div>
            <PasswordInput id="password" label="Password" error={errors.password?.message} reg={register('password')} testid="input-password" />
            {isReg && <PasswordInput id="confirm" label="Confirm password" error={errors.confirm?.message} reg={register('confirm')} testid="input-confirm" />}
            <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center" data-testid="button-submit-auth">
              {isSubmitting ? 'Aligning the compass...' : isReg ? 'Create demo account' : 'Log in'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <button type="button" disabled className="btn-ghost mt-3 w-full justify-center opacity-50" title="Google sign-in is not available in this demo" data-testid="button-google">Continue with Google (coming soon)</button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isReg ? 'Already charted? ' : 'New to Faraway? '}
            <Link href={isReg ? '/login' : '/register'} className="font-semibold text-gold hover:underline" data-testid="link-switch-auth">{isReg ? 'Log in' : 'Create an account'}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
