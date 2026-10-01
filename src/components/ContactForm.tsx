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
    <div className="rounded-2xl bg-background p-8 text-center shadow-elegant">
      <CheckCircle2 className="mx-auto size-12 text-primary" />
      <h3 className="mt-4 font-display text-2xl text-primary">বার্তা পাঠানো হয়েছে</h3>
      <p className="mt-2 text-muted-foreground">প্রতিষ্ঠানের পক্ষ থেকে শীঘ্রই আপনার সঙ্গে যোগাযোগ করা হবে।</p>
      <Button variant="secondary" className="mt-5" onClick={() => setDone(false)}>আরেকটি বার্তা পাঠান</Button>
    </div>
  );
  const input = 'mt-1.5 w-full bg-secondary px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring';
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-background p-6 shadow-elegant sm:grid-cols-2 sm:p-8">
      <label className="text-sm font-semibold text-primary">আপনার নাম *<input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} /></label>
      <label className="text-sm font-semibold text-primary">মোবাইল নম্বর *<input required type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} /></label>
      <label className="text-sm font-semibold text-primary">ইমেইল<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} /></label>
      <label className="text-sm font-semibold text-primary">বিষয়<select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={input}>{subjects.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label className="text-sm font-semibold text-primary sm:col-span-2">বার্তা *<textarea required minLength={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${input} min-h-32`} /></label>
      {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2"><Button type="submit" size="lg" disabled={busy}><Send className="size-4" />{busy ? 'পাঠানো হচ্ছে...' : t('বার্তা পাঠান')}</Button></div>
    </form>
  );
}
