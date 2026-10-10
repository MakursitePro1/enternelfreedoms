import { useState, type FormEvent } from 'react';
import { ArrowLeft, BookOpen, Eye, EyeOff, GraduationCap, KeyRound, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logoAsset from '@/assets/institute-logo.jpeg.asset.json';

export const REMEMBER_KEY = 'ef-admin-remember';
export const ALIVE_KEY = 'ef-admin-alive';

const input = 'h-11 w-full rounded-xl border-2 border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary';

export function AdminAuth({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setMessage(''); setBusy(true);
    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
      setBusy(false);
      if (error) setError('লিংক পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      else setMessage('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।'); return; }
    localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
    sessionStorage.setItem(ALIVE_KEY, '1');
    onSignedIn();
  }

  return (
    <div className="grid h-svh overflow-hidden bg-secondary p-2.5 sm:p-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden rounded-[1.25rem] bg-primary text-primary-foreground shadow-elegant lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative flex items-center gap-3">
          <img src={logoAsset.url} alt="Eternal Freedom লোগো" className="size-12 rounded-full bg-background object-contain p-1" />
          <div><p className="font-brand text-lg font-bold">Eternal Freedom</p><p className="text-xs text-gold">INSTITUTE AL ISLAMIA</p></div>
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><Sparkles className="size-3.5" />প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র</span>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight xl:text-5xl">যত দূর, তত নূর</h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-gold" />
          <p className="mt-4 max-w-md text-[15px] leading-7 text-primary-foreground/85">ভর্তি আবেদন, বইয়ের অর্ডার, নোটিশ, শিক্ষক, গ্যালারি ও ওয়েবসাইটের সব তথ্য — এক জায়গা থেকে নিরাপদে পরিচালনা করুন।</p>
          <div className="mt-6 grid max-w-md grid-cols-3 gap-2.5">
            {[[GraduationCap, 'ভর্তি'], [BookOpen, 'বই ও অর্ডার'], [ShieldCheck, 'নিরাপদ']].map(([Icon, l]) => { const I = Icon as typeof GraduationCap; return <div key={l as string} className="rounded-xl bg-background p-3 text-center text-primary"><I className="mx-auto size-5 text-gold-deep" /><p className="mt-1.5 text-xs font-bold">{l as string}</p></div>; })}
          </div>
        </div>
        <p className="relative text-xs text-primary-foreground/70">© Eternal Freedom Institute Al Islamia · গফরগাঁও, ময়মনসিংহ</p>
      </div>

      {/* Form panel */}
      <div className="grid min-h-0 place-items-center overflow-y-auto rounded-[1.25rem] bg-background p-5 shadow-elegant sm:p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <img src={logoAsset.url} alt="Eternal Freedom লোগো" className="size-11 rounded-full bg-background object-contain p-0.5 shadow-elegant" />
            <div><p className="font-brand font-bold text-primary">Eternal Freedom</p><p className="text-[11px] text-gold-deep">INSTITUTE AL ISLAMIA</p></div>
          </div>
          <span className="mt-5 grid size-12 place-items-center rounded-2xl bg-primary text-gold lg:mt-0">{mode === 'login' ? <Lock className="size-5" /> : <KeyRound className="size-5" />}</span>
          <h1 className="mt-4 font-display text-2xl font-bold text-primary sm:text-3xl">{mode === 'login' ? 'অ্যাডমিন লগইন' : 'পাসওয়ার্ড ভুলে গেছেন?'}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{mode === 'login' ? 'অনুমোদিত অ্যাকাউন্ট দিয়ে প্রবেশ করুন।' : 'আপনার ইমেইল দিন — রিসেট লিংক পাঠানো হবে।'}</p>
          <form onSubmit={submit} className="mt-6 space-y-3.5">
            <label className="block text-sm font-semibold text-primary">ইমেইল
              <span className="relative mt-1.5 block"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" className={input} /></span>
            </label>
            {mode === 'login' && <>
              <label className="block text-sm font-semibold text-primary">পাসওয়ার্ড
                <span className="relative mt-1.5 block"><Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type={show ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${input} pr-10`} /><button type="button" aria-label={show ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span>
              </label>
              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-foreground"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-primary" />আমাকে মনে রাখুন</label>
                <button type="button" onClick={() => { setMode('forgot'); setError(''); setMessage(''); }} className="font-semibold text-gold-deep hover:underline">পাসওয়ার্ড ভুলে গেছেন?</button>
              </div>
            </>}
            {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            {message && <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-primary">{message}</p>}
            <button disabled={busy} className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-raised disabled:opacity-60">{busy ? 'অপেক্ষা করুন...' : mode === 'login' ? 'প্রবেশ করুন' : 'রিসেট লিংক পাঠান'}</button>
            {mode === 'forgot' && <button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" />লগইনে ফিরে যান</button>}
          </form>
          <a href="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← ওয়েবসাইটে ফিরে যান</a>
        </div>
      </div>
    </div>
  );
}
