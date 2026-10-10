import { useState, type FormEvent } from 'react';
import { ArrowLeft, BookOpen, Eye, EyeOff, GraduationCap, KeyRound, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logoAsset from '@/assets/institute-logo.jpeg.asset.json';
import { Button } from '@/components/ui/button';

export const REMEMBER_KEY = 'ef-admin-remember';
export const ALIVE_KEY = 'ef-admin-alive';

const input = 'auth-field h-12 w-full rounded-lg border border-panel-dark-border bg-panel-dark-soft pl-11 pr-3 text-base text-panel-dark-foreground outline-none transition-colors placeholder:text-panel-dark-muted focus:border-gold focus:ring-1 focus:ring-gold';

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
    <div className="admin-auth grid h-svh overflow-hidden bg-primary p-2.5 sm:p-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
      {/* Brand panel */}
      <div className="auth-brand relative hidden overflow-hidden rounded-[1.25rem] border border-panel-green-border bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-8 xl:p-10">
        <div className="relative flex items-center gap-3">
          <img src={logoAsset.url} alt="Eternal Freedom লোগো" className="size-12 rounded-full bg-background object-contain p-1" />
          <div><p className="font-brand text-lg font-bold">Eternal Freedom</p><p className="text-xs text-gold">INSTITUTE AL ISLAMIA</p></div>
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><Sparkles className="size-3.5" />প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র</span>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight xl:text-5xl">যত দূর, তত নূর</h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-gold" />
          <p className="mt-4 max-w-md text-[15px] leading-7 text-panel-green-muted">ভর্তি আবেদন, বইয়ের অর্ডার, নোটিশ, শিক্ষক, গ্যালারি ও ওয়েবসাইটের সব তথ্য — এক জায়গা থেকে নিরাপদে পরিচালনা করুন।</p>
          <div className="mt-6 grid max-w-md grid-cols-3 gap-2.5">
            {[[GraduationCap, 'ভর্তি'], [BookOpen, 'বই ও অর্ডার'], [ShieldCheck, 'নিরাপদ']].map(([Icon, l]) => { const I = Icon as typeof GraduationCap; return <div key={l as string} className="rounded-lg border border-panel-green-border bg-primary-raised p-3 text-center text-primary-foreground"><I className="mx-auto size-5 text-gold" /><p className="mt-1.5 text-xs font-bold">{l as string}</p></div>; })}
          </div>
        </div>
        <p className="relative text-xs text-panel-green-muted">© Eternal Freedom Institute Al Islamia · গফরগাঁও, ময়মনসিংহ</p>
      </div>

      {/* Form panel */}
      <div className="auth-panel grid min-h-0 place-items-center overflow-y-auto rounded-[1.25rem] border border-panel-dark-border bg-panel-dark p-5 text-panel-dark-foreground sm:p-8">
        <div className="auth-content w-full max-w-sm">
          <div className="auth-mobile-brand flex min-w-0 items-center gap-3 border-b border-panel-dark-border pb-4 lg:hidden">
            <img src={logoAsset.url} alt="Eternal Freedom লোগো" className="size-11 rounded-full bg-background object-contain p-0.5 shadow-elegant" />
            <div className="min-w-0"><p className="truncate font-brand font-bold text-panel-dark-foreground">Eternal Freedom</p><p className="text-[11px] text-gold">INSTITUTE AL ISLAMIA</p></div>
          </div>
          <span className="auth-lock mt-5 grid size-12 place-items-center rounded-xl border border-panel-green-border bg-primary text-gold lg:mt-0">{mode === 'login' ? <Lock className="size-5" /> : <KeyRound className="size-5" />}</span>
          <h1 className="auth-title mt-4 font-display text-2xl font-bold text-panel-dark-foreground sm:text-3xl">{mode === 'login' ? 'অ্যাডমিন লগইন' : 'পাসওয়ার্ড ভুলে গেছেন?'}</h1>
          <p className="mt-1.5 text-sm text-panel-dark-muted">{mode === 'login' ? 'অনুমোদিত অ্যাকাউন্ট দিয়ে প্রবেশ করুন।' : 'আপনার ইমেইল দিন — রিসেট লিংক পাঠানো হবে।'}</p>
          <form onSubmit={submit} className="auth-form mt-6 space-y-4">
            <label className="block text-sm font-semibold text-panel-dark-foreground">ইমেইল
              <span className="relative mt-1.5 block"><Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gold" /><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="আপনার ইমেইল" className={input} /></span>
            </label>
            {mode === 'login' && <>
              <label className="block text-sm font-semibold text-panel-dark-foreground">পাসওয়ার্ড
                <span className="relative mt-1.5 block"><Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gold" /><input type={show ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${input} pr-12`} /><Button type="button" variant="ghost" size="icon" aria-label={show ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'} onClick={() => setShow(!show)} className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-panel-dark-muted hover:bg-panel-dark-border hover:text-gold">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button></span>
              </label>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-xs sm:text-sm">
                <label className="flex min-w-0 cursor-pointer items-center gap-1.5 text-panel-dark-muted"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 shrink-0 accent-gold" />আমাকে মনে রাখুন</label>
                <Button type="button" variant="link" onClick={() => { setMode('forgot'); setError(''); setMessage(''); }} className="h-auto shrink-0 p-0 text-xs font-semibold text-gold sm:text-sm">পাসওয়ার্ড ভুলে গেছেন?</Button>
              </div>
            </>}
            {error && <p role="alert" className="rounded-lg border border-destructive bg-panel-dark-soft px-3 py-2 text-sm text-panel-dark-foreground">{error}</p>}
            {message && <p role="status" className="rounded-lg border border-panel-green-border bg-primary px-3 py-2 text-sm text-primary-foreground">{message}</p>}
            <Button type="submit" disabled={busy} className="auth-submit h-12 w-full rounded-lg bg-gold text-sm font-bold text-primary hover:bg-gold-light">{busy ? 'অপেক্ষা করুন...' : mode === 'login' ? 'প্রবেশ করুন' : 'রিসেট লিংক পাঠান'}<ArrowLeft className="size-4 rotate-180" /></Button>
            {mode === 'forgot' && <Button type="button" variant="link" onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="h-auto w-full p-0 text-sm font-semibold text-gold"><ArrowLeft className="size-4" />লগইনে ফিরে যান</Button>}
          </form>
          <a href="/" className="auth-return mt-6 flex items-center justify-center gap-2 border-t border-panel-dark-border pt-4 text-xs text-panel-dark-muted hover:text-gold"><ArrowLeft className="size-3.5" />ওয়েবসাইটে ফিরে যান</a>
        </div>
      </div>
    </div>
  );
}
