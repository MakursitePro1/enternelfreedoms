import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [{ title: 'নতুন পাসওয়ার্ড — Eternal Freedom' }, { name: 'description', content: 'অ্যাকাউন্টের নতুন পাসওয়ার্ড নির্ধারণ।' }, { property: 'og:title', content: 'নতুন পাসওয়ার্ড — Eternal Freedom' }, { property: 'og:description', content: 'অ্যাকাউন্টের নতুন পাসওয়ার্ড নির্ধারণ।' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((e) => { if (e === 'PASSWORD_RECOVERY' || e === 'SIGNED_IN') setReady(true); });
    supabase.auth.getSession().then(({ data: s }) => { if (s.session) setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); setErr('');
    if (password.length < 8) return setErr('কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন।');
    if (password !== confirm) return setErr('দুটি পাসওয়ার্ড মিলছে না।');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setErr('পাসওয়ার্ড বদলানো যায়নি। লিংকটি আবার নিন।'); else setMsg('পাসওয়ার্ড বদলানো হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
  }
  const f = 'h-11 w-full rounded-xl border-2 border-border bg-background px-3 text-sm outline-none focus:border-primary';
  return (
    <div className="grid min-h-svh place-items-center bg-secondary p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3.5 rounded-[1.25rem] bg-background p-6 shadow-elegant sm:p-8">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary text-gold"><KeyRound className="size-5" /></span>
        <h1 className="font-display text-2xl font-bold text-primary">নতুন পাসওয়ার্ড দিন</h1>
        {!ready && !msg && <p className="text-sm text-muted-foreground">ইমেইলে পাঠানো লিংক থেকে এই পাতায় আসুন।</p>}
        <input type="password" required placeholder="নতুন পাসওয়ার্ড" value={password} onChange={(e) => setPassword(e.target.value)} className={f} />
        <input type="password" required placeholder="আবার লিখুন" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={f} />
        {err && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}
        {msg && <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-primary">{msg}</p>}
        <button disabled={!ready} className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60">পাসওয়ার্ড সংরক্ষণ</button>
      </form>
    </div>
  );
}
