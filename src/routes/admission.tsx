import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Search, Upload, FileText, X, ClipboardList, FileCheck2, Wallet, Phone, MapPin, BadgeCheck, ChevronRight } from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { Site, Heading } from '@/components/Site';
import { FeeTable, StatsBar } from '@/components/InstitutionSections';
import { useInstitutionContent } from '@/lib/institution-content';
import { useSiteSettings, telHref } from '@/lib/site-settings';
import { programs, admissionSteps, requiredDocs, eligibility, photos, facilityImages } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { submitAdmission, trackAdmission } from '@/lib/platform.functions';

export const Route = createFileRoute('/admission')({
  head: () => seo('অনলাইন ভর্তি', 'ভর্তির তথ্য, বিভাগ, যোগ্যতা, প্রয়োজনীয় কাগজপত্র, ফি তালিকা, অনলাইন আবেদন (ছবি ও কাগজ আপলোডসহ) ও আবেদনের অবস্থা।'),
  component: Admission,
});

type Form = { student_name: string; birth_date: string; program: string; guardian_name: string; phone: string; address: string; previous_school: string; notes: string };
const initial: Form = { student_name: '', birth_date: '', program: '', guardian_name: '', phone: '', address: '', previous_school: '', notes: '' };
type Doc = { label: string; name: string; type: string; data: string };
const docLabels = ['শিক্ষার্থীর ছবি', 'জন্মনিবন্ধন', 'অভিভাবকের পরিচয়পত্র', 'অন্যান্য কাগজ'];
const steps = ['শিক্ষার্থীর তথ্য', 'অভিভাবকের তথ্য', 'কাগজপত্র', 'যাচাই ও জমা'];
const bn = (n: number) => n.toLocaleString('bn-BD');

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); });
}

function Admission() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initial);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tracking, setTracking] = useState({ reference: '', phone: '' });
  const [tracked, setTracked] = useState<{ student_name: string; program: string; status: string } | null | undefined>(undefined);
  const faqs = useInstitutionContent('faq').filter((f) => f.category === 'ভর্তি');
  const s = useSiteSettings();
  const send = useServerFn(submitAdmission);
  const track = useServerFn(trackAdmission);
  const input = 'mt-2 w-full rounded-lg bg-secondary px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring';
  function field(name: keyof Form, label: string, required = false, type = 'text') {
    return <label className="block text-sm font-semibold text-primary">{label}{required && ' *'}<input type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required={required} className={input} /></label>;
  }
  async function addDoc(label: string, file: File | undefined) {
    if (!file) return;
    setError('');
    if (!/^(image\/(jpeg|png|webp)|application\/pdf)$/.test(file.type)) { setError('শুধু JPG, PNG, WEBP ছবি বা PDF ফাইল দিন।'); return; }
    if (file.size > 3 * 1024 * 1024) { setError('প্রতিটি ফাইল ৩ MB-এর মধ্যে হতে হবে।'); return; }
    const data = await readFile(file);
    setDocs((d) => [...d.filter((x) => x.label !== label), { label, name: file.name, type: file.type, data }]);
  }
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true);
    try { const r = await send({ data: { ...form, documents: docs } }); setReference(r.reference); }
    catch (err) { setError(err instanceof Error ? err.message : 'আবেদন জমা দেওয়া যায়নি।'); }
    finally { setBusy(false); }
  }
  async function lookup(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true);
    try { setTracked(await track({ data: tracking })); } catch { setError('আবেদনের তথ্য খুঁজে পাওয়া যায়নি।'); } finally { setBusy(false); }
  }
  function next() {
    if (step === 0 && (!form.student_name.trim() || !form.program)) { setError('শিক্ষার্থীর নাম ও বিভাগ দিন।'); return; }
    if (step === 1 && (!form.guardian_name.trim() || !/^01\d{9}$/.test(form.phone) || form.address.trim().length < 5)) { setError('অভিভাবকের নাম, সঠিক ফোন নম্বর ও ঠিকানা দিন।'); return; }
    setError(''); setStep(step + 1);
  }
  return (
    <Site>
      {/* ভর্তি পৃষ্ঠার সূচনা */}
      <div className="px-2.5 pt-2.5 sm:px-5 sm:pt-5">
        <section className="relative overflow-hidden rounded-lg bg-primary text-primary-foreground sm:rounded-2xl">
          <img src={photos[2]} alt="Eternal Freedom Institute Al Islamia-র শিক্ষার্থী ও শিক্ষকবৃন্দ" className="h-56 w-full object-cover object-center sm:h-80 lg:h-[440px]" />
          <div className="relative mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10 lg:py-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><BadgeCheck className="size-4" />{s.admission_badge}</span>
            <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold text-gold-light sm:text-sm">ETERNAL FREEDOM INSTITUTE AL ISLAMIA</p>
                <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-5xl">অনলাইন ভর্তি</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 sm:text-base sm:leading-8">আপনার সন্তানের নতুন শিক্ষাযাত্রার শুরু এখানেই। বিভাগ, যোগ্যতা, ফি ও কাগজপত্র দেখে ঘরে বসেই আবেদন করুন।</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2.5">
                <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><a href="#apply">আবেদন শুরু করুন <ArrowRight className="size-4" /></a></Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground"><a href={telHref(s.phone)}><Phone className="size-4" /> সরাসরি কথা বলুন</a></Button>
              </div>
            </div>
            <p className="mt-5 flex items-center gap-2 border-t border-primary-foreground/20 pt-4 text-xs sm:text-sm"><MapPin className="size-4 shrink-0 text-gold-light" />{s.address}</p>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-5 sm:px-8"><div className="overflow-hidden rounded-lg bg-primary sm:rounded-xl"><StatsBar hero /></div></div>

      <nav className="sticky top-[68px] z-30 mt-5 border-y border-border bg-background px-5 lg:px-8" aria-label="ভর্তি পাতার অংশ">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto py-2 text-xs sm:gap-2 sm:text-sm">{[['info', 'ভর্তির ধাপ'], ['programs', 'বিভাগ'], ['requirements', 'যোগ্যতা'], ['docs', 'কাগজপত্র'], ['fees', 'ফি'], ['apply', 'আবেদন'], ['track', 'আবেদনের অবস্থা']].map(([id, l]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-md px-3 py-2 font-semibold text-primary hover:bg-secondary">{l}</a>)}</div>
      </nav>

      {/* প্রক্রিয়া */}
      <section id="info" className="scroll-mt-32 px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4"><Heading eyebrow="ভর্তির পথ" title="শুরু থেকে ভর্তি নিশ্চিত করা পর্যন্ত" description="কী করতে হবে, কখন করতে হবে—সব ধাপ এক জায়গায়।" /><a href="#apply" className="inline-flex items-center gap-1.5 pb-2 text-sm font-bold text-primary underline decoration-gold underline-offset-4">আবেদন ফর্মে যান <ArrowRight className="size-4" /></a></div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {admissionSteps.map(([t, d], k) => (
              <div key={t} className="min-w-0 rounded-lg border border-border bg-secondary p-3 sm:p-6">
                <div className="flex items-center justify-between"><span className="font-display text-3xl font-bold text-gold-deep sm:text-5xl">{bn(k + 1)}</span><ArrowRight className="size-4 text-primary sm:size-5" /></div>
                <h3 className="mt-5 font-display text-sm font-semibold leading-snug text-primary sm:text-lg">{t}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* বিভাগ */}
      <section id="programs" className="scroll-mt-32 bg-secondary px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="শিক্ষা কার্যক্রম" title="আপনার সন্তানের জন্য সঠিক বিভাগ" description="প্রতিটি বিভাগের পাঠ ও বয়সের তথ্য দেখে সিদ্ধান্ত নিন।" />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {programs.map((p) => (
              <Link key={p.slug} to="/academics/$slug" params={{ slug: p.slug }} className="group flex min-w-0 flex-col overflow-hidden rounded-lg bg-background transition-transform duration-300 hover:-translate-y-1">
                <img src={p.image} alt={p.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="flex flex-1 flex-col p-3 sm:p-5"><span className="text-[10px] font-bold text-gold-deep sm:text-xs">{p.group} · {p.number}</span><h3 className="mt-2 font-display text-sm font-semibold leading-snug text-primary sm:text-base">{p.name}</h3><p className="mt-2 text-xs text-muted-foreground sm:text-sm">বয়স: {p.age}</p><span className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-bold text-primary sm:text-sm">বিস্তারিত দেখুন <ChevronRight className="size-4" /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* যোগ্যতা এবং কাগজপত্র */}
      <section className="px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="আবেদনের প্রস্তুতি" title="আবেদনের আগে যা জেনে নেবেন" description="যোগ্যতা ও প্রয়োজনীয় কাগজপত্র আগে দেখে নিলে আবেদন করা সহজ হবে।" />
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div id="requirements" className="scroll-mt-32 border-t-2 border-primary pt-5">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-primary"><ClipboardList className="size-5 text-gold-light" /></span><h2 className="font-display text-xl font-semibold text-primary sm:text-2xl">ভর্তির যোগ্যতা</h2></div>
              <ul className="mt-5 divide-y divide-border">{eligibility.map((x) => <li key={x} className="flex gap-3 py-3 text-sm leading-6 text-foreground"><CheckCircle2 className="mt-1 size-4 shrink-0 text-gold-deep" />{x}</li>)}</ul>
            </div>
            <div id="docs" className="scroll-mt-32 border-t-2 border-primary pt-5">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-primary"><FileCheck2 className="size-5 text-gold-light" /></span><h2 className="font-display text-xl font-semibold text-primary sm:text-2xl">প্রয়োজনীয় কাগজপত্র</h2></div>
              <ul className="mt-5 divide-y divide-border">{requiredDocs.map((x) => <li key={x} className="flex gap-3 py-3 text-sm leading-6 text-foreground"><CheckCircle2 className="mt-1 size-4 shrink-0 text-gold-deep" />{x}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ফি */}
      <section id="fees" className="scroll-mt-32 bg-secondary px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-14">
          <div><Heading eyebrow="ফি সংক্রান্ত তথ্য" title="ফি ও গুরুত্বপূর্ণ তথ্য" description="আবেদনের আগে বিভাগের ফি ও সংশ্লিষ্ট তথ্য দেখে নিন।" /><div className="hidden overflow-hidden rounded-lg lg:block"><img src={facilityImages.classroom} alt="শ্রেণিকক্ষে পাঠরত শিক্ষার্থীরা" loading="lazy" className="aspect-[16/9] w-full object-cover" /></div></div>
          <div className="min-w-0"><FeeTable /></div>
        </div>
      </section>

      {/* আবেদন ফর্ম + ট্র্যাক */}
      <section id="apply" className="scroll-mt-32 px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.65fr)] lg:gap-10">
          <div className="min-w-0 border-t-2 border-primary pt-5 sm:pt-7">
            {reference ? (
              <div className="py-6 text-center">
                <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary"><CheckCircle2 className="size-10 text-gold-light" /></div>
                <h2 className="mt-5 font-display text-2xl text-primary sm:text-3xl">আবেদন জমা হয়েছে</h2>
                <p className="mt-3 leading-7">আপনার আবেদন নম্বর: <strong className="select-all text-xl text-primary">{reference}</strong></p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">এই নম্বর ও অভিভাবকের ফোন নম্বর দিয়ে নিচে আবেদনের অবস্থা দেখতে পারবেন। প্রতিষ্ঠান শীঘ্রই যোগাযোগ করবে।</p>
              </div>
            ) : (<>
              <Heading eyebrow="অনলাইন আবেদন" title="ভর্তি আবেদন ফর্ম" description="চারটি ধাপে ফর্মটি পূরণ করুন। তারকাচিহ্নিত (*) ঘরগুলো অবশ্যই পূরণ করতে হবে।" />
              <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {steps.map((st, i) => (
                  <div key={st} className={`rounded-lg px-2 py-3 text-center text-xs font-semibold sm:text-sm ${step === i ? 'bg-primary text-primary-foreground' : step > i ? 'bg-gold text-primary' : 'bg-secondary text-muted-foreground'}`}>{bn(i + 1)}. {st}</div>
                ))}
              </div>
              <form onSubmit={submit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  {step === 0 && <>{field('student_name', 'শিক্ষার্থীর নাম', true)}{field('birth_date', 'জন্ম তারিখ', false, 'date')}<label className="block text-sm font-semibold text-primary sm:col-span-2">বিভাগ *<select value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} required className={input}><option value="">বিভাগ নির্বাচন করুন</option>{programs.map((p) => <option key={p.slug}>{p.name}</option>)}</select></label>{field('previous_school', 'আগের প্রতিষ্ঠান')}</>}
                  {step === 1 && <>{field('guardian_name', 'অভিভাবকের নাম', true)}{field('phone', 'মোবাইল নম্বর (১১ সংখ্যা)', true, 'tel')}<div className="sm:col-span-2">{field('address', 'সম্পূর্ণ ঠিকানা', true)}</div><label className="block text-sm font-semibold text-primary sm:col-span-2">অতিরিক্ত তথ্য<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${input} min-h-28`} /></label></>}
                  {step === 2 && <div className="sm:col-span-2"><p className="mb-4 text-sm text-muted-foreground">ছবি ও কাগজপত্র যুক্ত করা ঐচ্ছিক, তবে দিলে ভর্তি দ্রুত হয়। (JPG/PNG/PDF, প্রতিটি ৩ MB পর্যন্ত)</p><div className="grid gap-3 sm:grid-cols-2">{docLabels.map((l) => { const d = docs.find((x) => x.label === l); return (
                    <div key={l} className={`rounded-xl border-2 border-dashed p-4 ${d ? 'border-primary bg-accent' : 'border-border'}`}>
                      <div className="text-sm font-semibold text-primary">{l}</div>
                      {d ? <div className="mt-2 flex items-center justify-between gap-2 text-sm"><span className="flex min-w-0 items-center gap-2"><FileText className="size-4 shrink-0 text-gold" /><span className="truncate">{d.name}</span></span><button type="button" aria-label={`${l} সরান`} onClick={() => setDocs(docs.filter((x) => x.label !== l))}><X className="size-4" /></button></div>
                        : <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary"><Upload className="size-4" />ফাইল নির্বাচন করুন<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" aria-label={`${l} আপলোড`} onChange={(e) => addDoc(l, e.target.files?.[0])} /></label>}
                    </div>
                  ); })}</div></div>}
                  {step === 3 && <div className="sm:col-span-2"><dl className="grid gap-4 rounded-2xl bg-secondary p-6 sm:grid-cols-2">{[['শিক্ষার্থী', form.student_name], ['বিভাগ', form.program], ['জন্ম তারিখ', form.birth_date || '—'], ['অভিভাবক', form.guardian_name], ['ফোন', form.phone], ['ঠিকানা', form.address], ['কাগজপত্র', docs.length ? docs.map((d) => d.label).join(', ') : 'যুক্ত করা হয়নি']].map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold text-primary">{v}</dd></div>)}</dl></div>}
                </div>
                {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
                <div className="mt-8 flex justify-between gap-3">{step > 0 ? <Button type="button" variant="secondary" onClick={() => { setError(''); setStep(step - 1); }}><ArrowLeft className="size-4 rtl:rotate-180" /> পেছনে</Button> : <span />}{step < 3 ? <Button key="next" type="button" onClick={next}>পরবর্তী ধাপ <ArrowRight className="size-4 rtl:rotate-180" /></Button> : <Button key="submit" type="submit" disabled={busy}>{busy ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'}</Button>}</div>
              </form>
            </>)}
          </div>
          <aside id="track" className="h-fit scroll-mt-32 space-y-6">
            <div className="rounded-lg bg-primary p-5 text-primary-foreground sm:p-7">
              <h2 className="font-display text-xl sm:text-2xl">আবেদন ট্র্যাক করুন</h2>
              <p className="mt-2 text-xs leading-5 text-primary-foreground/75 sm:text-sm">আবেদন নম্বর ও অভিভাবকের ফোন দিয়ে সর্বশেষ অবস্থা জানুন।</p>
              <form onSubmit={lookup} className="mt-5 grid gap-3"><input aria-label="আবেদন নম্বর" placeholder="আবেদন নম্বর (EF-...)" required value={tracking.reference} onChange={(e) => setTracking({ ...tracking, reference: e.target.value })} className="min-w-0 rounded-lg bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-ring" /><input aria-label="অভিভাবকের ফোন" placeholder="অভিভাবকের ফোন" required value={tracking.phone} onChange={(e) => setTracking({ ...tracking, phone: e.target.value })} className="min-w-0 rounded-lg bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-ring" /><Button type="submit" disabled={busy} className="bg-gold text-primary hover:bg-gold-light"><Search className="size-4" /> খুঁজুন</Button></form>
              {tracked === null && <p className="mt-4 text-sm text-gold-light">এই নম্বর ও ফোন দিয়ে কোনো আবেদন পাওয়া যায়নি।</p>}
              {tracked && <p className="mt-4 rounded-lg bg-primary-foreground/10 p-3 text-sm">{tracked.student_name} · {tracked.program}<br />অবস্থা: <strong className="text-gold-light">{tracked.status}</strong></p>}
            </div>
            {faqs.length > 0 && <div className="border-t-2 border-primary pt-5 sm:pt-7"><h2 className="font-display text-xl text-primary">ভর্তি সংক্রান্ত প্রশ্ন</h2><div className="mt-4 space-y-4">{faqs.map((f) => <div key={f.id}><div className="font-semibold text-primary">{f.title}</div><p className="mt-1 text-sm leading-6 text-muted-foreground">{f.body}</p></div>)}</div><Link to="/faq" className="mt-4 inline-block text-sm font-semibold text-primary underline decoration-gold underline-offset-4">সব প্রশ্ন দেখুন</Link></div>}
          </aside>
        </div>
      </section>

      {/* সহায়তা ব্যানার */}
      <section className="px-5 pb-10 pt-5 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-primary text-primary-foreground sm:rounded-xl">
          <img src={facilityImages.quran} alt="কুরআন পাঠরত শিক্ষার্থীরা" loading="lazy" className="h-36 w-full object-cover sm:h-48" />
          <div className="p-6 sm:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-primary">সহায়তা প্রয়োজন?</span>
              <h2 className="mt-4 font-display text-2xl font-semibold leading-tight sm:text-3xl">ফর্ম পূরণে কোনো সমস্যা হলে সরাসরি কল করুন</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/85">অফিস সময়ের মধ্যে ফোন করলেই ভর্তি সংক্রান্ত যেকোনো প্রশ্নের উত্তর পাবেন। চাইলে সরাসরি ক্যাম্পাসে এসেও আবেদন করতে পারেন।</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><a href={telHref(s.phone)}><Phone className="size-4" /> {s.phone}</a></Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/contact">যোগাযোগ করুন</Link></Button>
            </div>
          </div>
          </div>
        </div>
      </section>
    </Site>
  );
}
