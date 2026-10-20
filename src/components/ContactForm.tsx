import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitContact } from '@/lib/platform.functions';
import { useLang } from '@/lib/i18n';

const subjects = ['ভর্তি সংক্রান্ত', 'আবাসিক তথ্য', 'বই অর্ডার', 'সাধারণ জিজ্ঞাসা'];

export function ContactForm() {
  const { t } = useLang();
  const send = useServerFn(submitContact);
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: subjects[0], message: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!/^01\d{9}$/.test(form.phone)) { setError('১১ সংখ্যার সঠিক মোবাইল নম্বর দিন।'); return; }
    setBusy(true);
    try { await send({ data: form }); setDone(true); setForm({ name: '', phone: '', email: '', subject: subjects[0], message: '' }); }
    catch { setError('বার্তা পাঠানো যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।'); }
    finally { setBusy(false); }
  }
  if (done) return (
    <div className="py-6 text-center">
      <CheckCircle2 className="mx-auto size-11 text-gold" />
      <h3 className="mt-3 font-display text-xl text-primary-foreground">বার্তা পাঠানো হয়েছে</h3>
      <p className="mt-2 text-sm text-primary-foreground/80">প্রতিষ্ঠানের পক্ষ থেকে শীঘ্রই আপনার সঙ্গে যোগাযোগ করা হবে।</p>
      <Button variant="secondary" className="mt-4" onClick={() => setDone(false)}>আরেকটি বার্তা পাঠান</Button>
    </div>
  );
  const input = 'mt-1.5 block h-10 w-full min-w-0 rounded-md border-0 bg-background px-3.5 py-2 text-sm font-normal text-foreground outline-none transition-colors focus:ring-2 focus:ring-gold/70';
  return (
    <form onSubmit={submit} className="grid gap-3.5 sm:grid-cols-2">
      <label className="text-sm font-semibold text-gold-light">আপনার নাম *<input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} /></label>
      <label className="text-sm font-semibold text-gold-light">মোবাইল নম্বর *<input required type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} /></label>
      <label className="text-sm font-semibold text-gold-light">ইমেইল<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} /></label>
      <label className="text-sm font-semibold text-gold-light">বিষয়<select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={input}>{subjects.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
      <label className="text-sm font-semibold text-gold-light sm:col-span-2">বার্তা *<textarea required minLength={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${input} min-h-24 resize-y`} /></label>
      {error && <p role="alert" className="text-sm font-semibold text-gold sm:col-span-2">{error}</p>}
      <div className="pt-1 sm:col-span-2"><Button type="submit" size="lg" disabled={busy} className="w-full bg-gold text-primary hover:bg-gold-light sm:w-auto"><Send className="size-4" />{busy ? 'পাঠানো হচ্ছে...' : t('বার্তা পাঠান')}</Button></div>
    </form>
  );
}
