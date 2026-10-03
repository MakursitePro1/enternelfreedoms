import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Search, Upload, FileText, X, ClipboardList, FileCheck2, Phone, MapPin, Sparkles, ListOrdered, BookOpen, FileCheck, Banknote, PenLine, SearchCheck } from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { Site, Heading, TextLink } from '@/components/Site';
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

const heroSlides = [
  { src: photos[2], alt: 'ইটারনাল ফ্রিডমের শিক্ষার্থী ও শিক্ষকবৃন্দ' },
  { src: facilityImages.classroom, alt: 'শ্রেণিকক্ষে পাঠরত শিক্ষার্থীরা' },
  { src: facilityImages.quran, alt: 'কুরআন তিলাওয়াতরত শিক্ষার্থীরা' },
];

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); });
}

function Admission() {
  const [step, setStep] = useState(0);
  const [slide, setSlide] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setSlide((x) => (x + 1) % heroSlides.length), 6000); return () => window.clearInterval(id); }, []);
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
      {/* হিরো — হোম পেজের মতো */}
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[calc(100svh-230px)] sm:rounded-[1.25rem]">
          {heroSlides.map((sl, k) => <img key={sl.src} src={sl.src} alt={sl.alt} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${k === slide ? 'opacity-100' : 'opacity-0'}`} />)}
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 pt-16 max-[359px]:px-4 max-[359px]:pt-10 sm:justify-center sm:py-6 lg:px-8">
            <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />{s.admission_badge}</span>
            <p className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-gold-light sm:mt-4 sm:gap-3 sm:text-sm"><span className="h-px w-5 shrink-0 bg-gold sm:w-8" />Eternal Freedom Institute Al Islamia</p>
            <h1 className="mt-1.5 max-w-5xl font-display text-[1.75rem] font-bold leading-[1.15] max-[359px]:text-[1.5rem] sm:mt-2.5 sm:text-5xl lg:text-6xl">অনলাইন ভর্তি<br /><span className="text-gold-light">সন্তানের নতুন যাত্রা শুরু হোক</span></h1>
            <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">বিভাগ, যোগ্যতা, ফি ও কাগজপত্র দেখে ঘরে বসেই মাত্র চারটি ধাপে আবেদন করুন।</p>
            <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
              <Button size="lg" asChild className="max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] bg-gold text-primary hover:bg-gold-light"><a href="#apply">আবেদন শুরু করুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></a></Button>
              <Button size="lg" variant="outline" asChild className="max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href="#track">আবেদনের অবস্থা</a></Button>
              <Button size="lg" asChild className="max-sm:col-span-2 max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] bg-primary-foreground text-primary shadow-elegant hover:bg-primary-foreground/90"><a href={telHref(s.phone)}><Phone className="size-4" />সরাসরি কথা বলুন</a></Button>
            </div>
            <div className="mt-3.5 flex gap-1.5 sm:mt-6 sm:gap-2">{heroSlides.map((sl, k) => <button key={sl.src} type="button" aria-label={`ছবি ${k + 1}`} onClick={() => setSlide(k)} className={`h-1.5 rounded-full transition-all ${k === slide ? 'w-8 bg-gold sm:w-10' : 'w-4 bg-primary-foreground/40 sm:w-5'}`} />)}</div>
          </div>
          <div className="relative w-full px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary shadow-elegant sm:rounded-[1.25rem]"><StatsBar hero /></div></div>
        </section>
      </div>

      {/* দ্রুত নেভিগেশন */}
      <nav className="sticky top-[68px] z-30 px-2.5 py-2 sm:px-5" aria-label="ভর্তি পাতার অংশ">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-1.5 rounded-2xl bg-primary p-1.5 shadow-elegant sm:grid-cols-6 sm:gap-2 sm:rounded-full sm:p-2">{([
          ['info', 'ভর্তির ধাপ', ListOrdered],
          ['programs', 'বিভাগ', BookOpen],
          ['requirements', 'যোগ্যতা ও কাগজপত্র', FileCheck],
          ['fees', 'ফি', Banknote],
          ['apply', 'আবেদন', PenLine],
          ['track', 'আবেদনের অবস্থা', SearchCheck],
        ] as [string, string, LucideIcon][]).map(([id, l, Icon]) => <a key={id} href={`#${id}`} className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-center text-[11px] font-semibold leading-tight text-primary-foreground transition-colors hover:bg-gold hover:text-primary sm:flex-row sm:gap-2 sm:rounded-full sm:px-3 sm:py-2.5 sm:text-sm"><Icon className="size-4 shrink-0 sm:size-[18px]" strokeWidth={2.2} /><span className="truncate">{l}</span></a>)}</div>
      </nav>

      {/* ভর্তি প্রক্রিয়া — হোমের মতো */}
      <div id="info" className="scroll-mt-32 px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary py-9 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:py-10">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <Heading center light eyebrow="ভর্তি" title="ভর্তি প্রক্রিয়া" description="মাত্র চারটি সহজ ধাপে আপনার সন্তানের ভর্তি সম্পন্ন করুন।" />
            <div className="relative grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              <span aria-hidden className="absolute inset-x-8 top-9 hidden h-px bg-gold lg:block" />
              {admissionSteps.map(([title, text], k) => (
                <div key={title} className="relative z-10 flex flex-col rounded-2xl border border-border/60 bg-background p-4 shadow-elegant transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                  <div className="grid size-9 place-items-center rounded-full bg-gold font-display text-base text-primary shadow-elegant sm:size-12 sm:text-xl">{bn(k + 1)}</div>
                  <h3 className="mt-3 font-display text-[14px] font-semibold leading-snug text-primary sm:mt-5 sm:text-lg">{title}</h3>
                  <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3"><Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light hover:text-primary"><a href="#apply">অনলাইনে আবেদন করুন <ArrowRight className="size-4 rtl:rotate-180" /></a></Button><Button size="lg" variant="secondary" asChild className="bg-background text-primary hover:bg-secondary"><Link to="/faq">ভর্তি সংক্রান্ত প্রশ্ন</Link></Button></div>
          </div>
        </section>
      </div>

      {/* বিভাগ — হোমের মতো ছবির কার্ড */}
      <section id="programs" className="scroll-mt-32 px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="শিক্ষা কার্যক্রম" title="কোন বিভাগে ভর্তি করাবেন?" description="প্রতিটি বিভাগের পাঠ, বয়স ও লক্ষ্য দেখে আপনার সন্তানের জন্য সঠিক বিভাগ বেছে নিন।" /><TextLink to="/academics">সব বিভাগ দেখুন</TextLink></div>
          <div className="grid grid-cols-2 gap-2.5 max-[359px]:gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {programs.map((p) => (
              <Link to="/academics/$slug" params={{ slug: p.slug }} key={p.slug} className="group relative flex min-h-[210px] flex-col justify-end overflow-hidden rounded-xl shadow-elegant transition-transform duration-300 hover:-translate-y-1.5 max-[359px]:min-h-[185px] max-[359px]:rounded-lg sm:min-h-[340px] sm:rounded-2xl">
                <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/25" />
                <div className="relative flex flex-1 flex-col p-3 max-[359px]:p-2.5 sm:p-6">
                  <div className="flex items-center justify-between gap-1"><span className="rounded-full bg-primary-foreground/15 px-2 py-1 text-[9.5px] font-semibold text-primary-foreground ring-1 ring-primary-foreground/20 max-[359px]:px-1.5 max-[359px]:text-[9px] sm:px-3 sm:text-[11px]">{p.group}</span><span className="shrink-0 font-display text-base text-gold drop-shadow sm:text-2xl">{p.number}</span></div>
                  <h3 className="mt-auto pt-8 font-display text-[13.5px] font-semibold leading-snug text-primary-foreground drop-shadow-sm max-[359px]:pt-6 sm:pt-14 sm:text-xl">{p.name}</h3>
                  <p className="mt-1.5 text-[10.5px] leading-[1.55] text-primary-foreground/85 sm:mt-2 sm:text-[13px] sm:leading-6">বয়স: {p.age}</p>
                  <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-2.5 py-1.5 text-[10.5px] font-bold text-primary shadow-md transition-all duration-300 group-hover:gap-2.5 group-hover:bg-gold-light max-[359px]:px-2 max-[359px]:py-1 max-[359px]:text-[10px] sm:mt-4 sm:px-4 sm:py-2 sm:text-[13px]">বিস্তারিত <ArrowRight className="size-3 sm:size-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* যোগ্যতা ও কাগজপত্র — হোমের "আমাদের পরিচয়" ধরনের */}
      <div id="requirements" className="scroll-mt-32 px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto grid max-w-7xl gap-2.5 sm:gap-5 lg:grid-cols-2">
          {[{ id: 'eligibility', icon: ClipboardList, eyebrow: 'আবেদনের প্রস্তুতি', title: 'ভর্তির যোগ্যতা', list: eligibility, img: facilityImages.classroom }, { id: 'docs', icon: FileCheck2, eyebrow: 'সঙ্গে রাখুন', title: 'প্রয়োজনীয় কাগজপত্র', list: requiredDocs, img: facilityImages.library }].map((b) => (
            <div key={b.id} id={b.id} className="relative min-w-0 scroll-mt-32 overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
              <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
              <div className="relative p-2 sm:p-3"><img src={b.img} alt={b.title} loading="lazy" className="h-32 w-full rounded-[0.6rem] object-cover shadow-elegant sm:h-44 sm:rounded-[0.9rem]" /></div>
              <div className="relative px-4 pb-5 pt-2 sm:px-7 sm:pb-8">
                <div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-primary shadow-elegant sm:size-12"><b.icon className="size-5 sm:size-6" /></span><div><p className="text-[11px] font-semibold text-gold-light sm:text-xs">{b.eyebrow}</p><h2 className="font-display text-lg font-semibold sm:text-2xl">{b.title}</h2></div></div>
                <div className="mt-3 h-1 w-16 rounded-full bg-gold sm:w-24" />
                <ul className="mt-4 grid gap-1.5 sm:gap-2.5">
                  {b.list.map((x) => (
                    <li key={x} className="flex items-center gap-2.5 rounded-xl border border-gold/25 bg-card px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/55 sm:px-4 sm:py-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold-soft ring-1 ring-gold/45 sm:size-7"><CheckCircle2 className="size-3.5 text-gold-deep sm:size-4" /></span>
                      <span className="min-w-0 text-[12px] font-semibold leading-snug text-primary sm:text-[14px]">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ফি — হোমের খাবার সেকশনের ধরন */}
      <section id="fees" className="scroll-mt-32 px-5 py-14 max-[359px]:px-4 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-12 [&>*]:min-w-0">
          <div>
            <Heading compact eyebrow="ফি সংক্রান্ত তথ্য" title="ফি ও গুরুত্বপূর্ণ তথ্য" description="আবেদনের আগে বিভাগভিত্তিক ভর্তি ফি, মাসিক বেতন ও আবাসিক খরচ দেখে নিন।" />
            <img src={facilityImages.dorm} alt="আবাসিক ভবনের কক্ষ" loading="lazy" className="mt-5 aspect-[16/10] w-full rounded-lg object-cover shadow-elegant transition-transform duration-500 hover:scale-[1.02] sm:mt-7 sm:rounded-xl lg:aspect-[4/3]" />
          </div>
          <div><FeeTable /></div>
        </div>
      </section>

      {/* আবেদন ফর্ম + ট্র্যাক */}
      <div id="apply" className="scroll-mt-32 bg-secondary px-2.5 py-10 sm:px-5 sm:py-20 lg:px-8">
        <section className="mx-auto grid max-w-7xl gap-2.5 sm:gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,.7fr)]">
          <div className="min-w-0 rounded-[0.75rem] bg-background p-4 shadow-elegant sm:rounded-[1.25rem] sm:p-8 lg:p-10">
            {reference ? (
              <div className="py-6 text-center">
                <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary shadow-elegant"><CheckCircle2 className="size-10 text-gold-light" /></div>
                <h2 className="mt-5 font-display text-2xl text-primary sm:text-3xl">আবেদন জমা হয়েছে</h2>
                <p className="mt-3 leading-7">আপনার আবেদন নম্বর: <strong className="select-all text-xl text-primary">{reference}</strong></p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">এই নম্বর ও অভিভাবকের ফোন নম্বর দিয়ে পাশে আবেদনের অবস্থা দেখতে পারবেন। প্রতিষ্ঠান শীঘ্রই যোগাযোগ করবে।</p>
              </div>
            ) : (<>
              <Heading compact eyebrow="অনলাইন আবেদন" title="ভর্তি আবেদন ফর্ম" description="চারটি ধাপে ফর্মটি পূরণ করুন। তারকাচিহ্নিত (*) ঘরগুলো অবশ্যই পূরণ করতে হবে।" />
              <div className="mb-6 grid grid-cols-4 gap-1.5 sm:mb-8 sm:gap-2.5">
                {steps.map((st, i) => (
                  <div key={st} className={`flex flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 text-center transition-colors sm:flex-row sm:justify-center sm:gap-2 sm:px-3 sm:py-3 ${step === i ? 'bg-primary text-primary-foreground shadow-elegant' : step > i ? 'bg-gold text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <span className={`grid size-6 shrink-0 place-items-center rounded-full font-display text-xs sm:size-7 sm:text-sm ${step === i ? 'bg-gold text-primary' : step > i ? 'bg-primary text-primary-foreground' : 'bg-background text-primary'}`}>{step > i ? <CheckCircle2 className="size-3.5" /> : bn(i + 1)}</span>
                    <span className="text-[10px] font-semibold leading-tight sm:text-[13px]">{st}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={submit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  {step === 0 && <>{field('student_name', 'শিক্ষার্থীর নাম', true)}{field('birth_date', 'জন্ম তারিখ', false, 'date')}<label className="block text-sm font-semibold text-primary sm:col-span-2">বিভাগ *<select value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} required className={input}><option value="">বিভাগ নির্বাচন করুন</option>{programs.map((p) => <option key={p.slug}>{p.name}</option>)}</select></label>{field('previous_school', 'আগের প্রতিষ্ঠান')}</>}
                  {step === 1 && <>{field('guardian_name', 'অভিভাবকের নাম', true)}{field('phone', 'মোবাইল নম্বর (১১ সংখ্যা)', true, 'tel')}<div className="sm:col-span-2">{field('address', 'সম্পূর্ণ ঠিকানা', true)}</div><label className="block text-sm font-semibold text-primary sm:col-span-2">অতিরিক্ত তথ্য<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${input} min-h-28`} /></label></>}
                  {step === 2 && <div className="sm:col-span-2"><p className="mb-4 text-sm text-muted-foreground">ছবি ও কাগজপত্র যুক্ত করা ঐচ্ছিক, তবে দিলে ভর্তি দ্রুত হয়। (JPG/PNG/PDF, প্রতিটি ৩ MB পর্যন্ত)</p><div className="grid gap-3 sm:grid-cols-2">{docLabels.map((l) => { const d = docs.find((x) => x.label === l); return (
                    <div key={l} className={`rounded-xl border-2 border-dashed p-4 ${d ? 'border-primary bg-accent' : 'border-border'}`}>
                      <div className="text-sm font-semibold text-primary">{l}</div>
                      {d ? <div className="mt-2 flex items-center justify-between gap-2 text-sm"><span className="flex min-w-0 items-center gap-2"><FileText className="size-4 shrink-0 text-gold" /><span className="truncate">{d.name}</span></span><Button type="button" size="icon" variant="ghost" aria-label={`${l} সরান`} onClick={() => setDocs(docs.filter((x) => x.label !== l))}><X className="size-4" /></Button></div>
                        : <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary"><Upload className="size-4" />ফাইল নির্বাচন করুন<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" aria-label={`${l} আপলোড`} onChange={(e) => addDoc(l, e.target.files?.[0])} /></label>}
                    </div>
                  ); })}</div></div>}
                  {step === 3 && <div className="sm:col-span-2"><dl className="grid gap-4 rounded-2xl bg-secondary p-6 sm:grid-cols-2">{[['শিক্ষার্থী', form.student_name], ['বিভাগ', form.program], ['জন্ম তারিখ', form.birth_date || '—'], ['অভিভাবক', form.guardian_name], ['ফোন', form.phone], ['ঠিকানা', form.address], ['কাগজপত্র', docs.length ? docs.map((d) => d.label).join(', ') : 'যুক্ত করা হয়নি']].map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold text-primary">{v}</dd></div>)}</dl></div>}
                </div>
                {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
                <div className="mt-8 flex justify-between gap-3">{step > 0 ? <Button type="button" variant="secondary" onClick={() => { setError(''); setStep(step - 1); }}><ArrowLeft className="size-4 rtl:rotate-180" /> পেছনে</Button> : <span />}{step < 3 ? <Button key="next" type="button" onClick={next}>পরবর্তী ধাপ <ArrowRight className="size-4 rtl:rotate-180" /></Button> : <Button key="submit" type="submit" disabled={busy} className="bg-gold text-primary hover:bg-gold-light">{busy ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'}</Button>}</div>
              </form>
            </>)}
          </div>
          <aside id="track" className="h-fit scroll-mt-32 space-y-2.5 sm:space-y-5">
            <div className="relative overflow-hidden rounded-[0.75rem] bg-primary p-5 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:p-7">
              <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
              <div className="relative">
                <span className="grid size-12 place-items-center rounded-xl bg-gold text-primary shadow-elegant"><Search className="size-6" /></span>
                <h2 className="mt-4 font-display text-xl font-semibold sm:text-2xl">আবেদন ট্র্যাক করুন</h2>
                <div className="mt-2.5 h-1 w-16 rounded-full bg-gold" />
                <p className="mt-3 text-xs leading-5 text-primary-foreground/80 sm:text-sm">আবেদন নম্বর ও অভিভাবকের ফোন দিয়ে সর্বশেষ অবস্থা জানুন।</p>
                <form onSubmit={lookup} className="mt-5 grid gap-3"><input aria-label="আবেদন নম্বর" placeholder="আবেদন নম্বর (EF-...)" required value={tracking.reference} onChange={(e) => setTracking({ ...tracking, reference: e.target.value })} className="min-w-0 rounded-lg bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-ring" /><input aria-label="অভিভাবকের ফোন" placeholder="অভিভাবকের ফোন" required value={tracking.phone} onChange={(e) => setTracking({ ...tracking, phone: e.target.value })} className="min-w-0 rounded-lg bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-ring" /><Button type="submit" disabled={busy} className="bg-gold text-primary hover:bg-gold-light"><Search className="size-4" /> খুঁজুন</Button></form>
                {tracked === null && <p className="mt-4 text-sm text-gold-light">এই নম্বর ও ফোন দিয়ে কোনো আবেদন পাওয়া যায়নি।</p>}
                {tracked && <p className="mt-4 rounded-lg bg-primary-foreground/10 p-3 text-sm">{tracked.student_name} · {tracked.program}<br />অবস্থা: <strong className="text-gold-light">{tracked.status}</strong></p>}
              </div>
            </div>
            {faqs.length > 0 && <div className="rounded-[0.75rem] bg-background p-5 shadow-elegant sm:rounded-[1.25rem] sm:p-7"><h2 className="font-display text-xl font-semibold text-primary">ভর্তি সংক্রান্ত প্রশ্ন</h2><div className="mt-2.5 h-1 w-16 rounded-full bg-gold" /><div className="mt-4 divide-y divide-border">{faqs.map((f) => <div key={f.id} className="py-3"><div className="font-semibold text-primary">{f.title}</div><p className="mt-1 text-sm leading-6 text-muted-foreground">{f.body}</p></div>)}</div><Link to="/faq" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-bold text-primary hover:bg-gold-light">সব প্রশ্ন দেখুন <ArrowRight className="size-4" /></Link></div>}
          </aside>
        </section>
      </div>

      {/* সহায়তা ব্যানার — হোমের ভর্তি ব্যানারের মতো */}
      <div className="px-2.5 pb-8 pt-5 max-[359px]:px-2 max-[359px]:pb-6 sm:px-5 sm:pb-16 sm:pt-10">
        <section className="grid gap-2.5 max-[359px]:gap-2 sm:gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="absolute right-3 top-3 z-10 flex size-16 items-center justify-center rounded-2xl bg-gold shadow-elegant sm:right-5 sm:top-5 sm:size-14 sm:rounded-[1rem]"><Phone className="size-7 text-primary" strokeWidth={1.75} /></div>
            <div className="relative flex h-full flex-col justify-center px-4 py-4 max-[359px]:px-3 sm:px-7 sm:py-6 lg:px-9">
              <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />সহায়তা প্রয়োজন?</span>
              <h2 className="mt-2.5 pr-20 font-display text-[1.35rem] font-bold leading-[1.2] sm:mt-3 sm:pr-16 sm:text-[1.9rem] lg:text-[1.8rem] xl:text-[2.1rem]">ফর্ম পূরণে সমস্যা?<br className="sm:hidden" /> সরাসরি কল করুন</h2>
              <div className="mt-2.5 h-1 w-16 rounded-full bg-gold sm:mt-3 sm:w-24" />
              <p className="mt-2.5 text-[12.5px] leading-6 text-primary-foreground/90 sm:mt-3 sm:text-[15px] sm:leading-7">অফিস সময়ে ফোন করলেই ভর্তি সংক্রান্ত যেকোনো প্রশ্নের উত্তর পাবেন। চাইলে সরাসরি ক্যাম্পাসে এসেও আবেদন করতে পারেন।</p>
              <p className="mt-3 flex items-start gap-2 text-[12px] text-primary-foreground/85 sm:text-sm"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-light" />{s.address}</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative flex h-full flex-col p-2 max-[359px]:p-1.5 sm:p-3 lg:p-2.5">
              <div className="relative h-28 shrink-0 overflow-hidden rounded-[0.75rem] shadow-elegant max-[359px]:h-24 sm:h-36 sm:rounded-[0.9rem] lg:h-44 xl:h-48">
                <img src={facilityImages.quran} alt="কুরআন পাঠরত শিক্ষার্থীরা" loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-primary shadow-elegant sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />আসন সীমিত</span>
              </div>
              <div className="mt-2 grid gap-2 sm:mt-2.5 sm:grid-cols-2">
                <Button asChild className="max-sm:h-10 max-sm:w-full max-sm:justify-center max-sm:text-[13px] bg-gold text-primary shadow-elegant hover:bg-gold-light"><a href={telHref(s.phone)}><Phone className="size-4" /> {s.phone}</a></Button>
                <Button asChild variant="outline" className="max-sm:h-10 max-sm:w-full max-sm:justify-center max-sm:text-[13px] border-primary-foreground/60 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact">যোগাযোগ করুন</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Site>
  );
}
