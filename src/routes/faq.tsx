import { pageSeo } from '@/lib/seo-pages';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, ShieldAlert, Backpack, FileCheck2, Sparkles, ArrowRight, Phone, GraduationCap, Home as HomeIcon, ShieldCheck, MessageCircleQuestion } from 'lucide-react';
import { Site, Heading } from '@/components/Site';
import { StatsBar } from '@/components/InstitutionSections';
import { Button } from '@/components/ui/button';
import { useInstitutionContent } from '@/lib/institution-content';
import { useSiteSettings, telHref } from '@/lib/site-settings';
import { useLang } from '@/lib/i18n';
import { faq as staticFaq, parentRules, prepareList, requiredDocs, facilityImages, photos } from '@/lib/content';
import { jsonLd } from '@/lib/seo';

export const Route = createFileRoute('/faq')({
  head: (ctx) => { const base = pageSeo(ctx, '/faq'); return { ...base, scripts: [...(base.scripts ?? []), jsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: staticFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })] }; },
  component: Faq,
});

const heroSlides = [
  { src: photos[2], alt: 'ইটারনাল ফ্রিডমের শিক্ষার্থী ও শিক্ষকবৃন্দ' },
  { src: facilityImages.classroom, alt: 'শ্রেণিকক্ষে পাঠরত শিক্ষার্থীরা' },
  { src: facilityImages.quran, alt: 'রেহালে কুরআন তিলাওয়াতরত শিক্ষার্থীরা' },
];

const guideCards = [
  { icon: ShieldAlert, title: 'নিয়মকানুন', items: parentRules },
  { icon: Backpack, title: 'শিক্ষার্থীর প্রস্তুতি', items: prepareList },
  { icon: FileCheck2, title: 'প্রয়োজনীয় কাগজপত্র', items: requiredDocs },
];

const bn = (n: number) => n.toLocaleString('bn-BD');

function FaqHero() {
  const { t } = useLang();
  const s = useSiteSettings();
  const [i, setI] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setI((x) => (x + 1) % heroSlides.length), 6000); return () => window.clearInterval(id); }, []);
  return (
    <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[calc(100svh-430px)] sm:rounded-[1.25rem]">
      {heroSlides.map((sl, k) => <img key={sl.src} src={sl.src} alt={sl.alt} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${k === i ? 'opacity-100' : 'opacity-0'}`} />)}
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-4 pt-10 max-[359px]:px-3.5 max-[359px]:pt-8 sm:justify-center sm:py-6 lg:px-8">
        <nav aria-label="ব্রেডক্রাম্ব" className="flex items-center gap-2 text-[11px] text-primary-foreground/70 sm:text-xs">
          <Link to="/" className="hover:text-gold-light">{t('হোম')}</Link><span>/</span><span className="text-gold-light">{t('নির্দেশিকা ও প্রশ্নোত্তর')}</span>
        </nav>
        <span className="mt-2.5 inline-flex self-start items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:mt-3.5 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><MessageCircleQuestion className="size-3 shrink-0 sm:size-3.5" />{t('অভিভাবক নির্দেশিকা')}</span>
        <h1 className="mt-1.5 max-w-5xl font-display text-[1.65rem] font-bold leading-[1.12] max-[359px]:text-[1.4rem] sm:mt-2.5 sm:text-5xl lg:text-6xl xl:text-[4rem]">নির্দেশিকা ও<br /><span className="text-gold-light">সচরাচর জিজ্ঞাসা</span></h1>
        <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">{t('একই প্রশ্নের উত্তর জানতে বারবার ফোন করতে হবে না—ভর্তি, আবাসিক জীবন, কাগজপত্র ও নিয়মকানুনের প্রয়োজনীয় সব তথ্য একসাথে এখানে।')}</p>
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          <Button size="lg" asChild className="max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] bg-gold text-primary hover:bg-gold-light"><Link to="/admission">{t('অনলাইনে আবেদন করুন')} <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></Link></Button>
          <Button size="lg" variant="outline" asChild className="max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact">{t('যোগাযোগ করুন')}</Link></Button>
        </div>
        <div className="mt-3.5 flex items-center justify-between gap-3 sm:mt-6 sm:justify-start">
          <div className="flex shrink-0 gap-1.5 sm:gap-2">{heroSlides.map((sl, k) => <button key={sl.src} type="button" aria-label={`ছবি ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-8 bg-gold sm:w-10' : 'w-4 bg-primary-foreground/40 sm:w-5'}`} />)}</div>
        </div>
      </div>
      <div className="relative w-full px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary shadow-elegant sm:rounded-[1.25rem]"><StatsBar hero /></div></div>
    </section>
  );
}

function Faq() {
  const { t } = useLang();
  const s = useSiteSettings();
  const db = useInstitutionContent('faq');
  const all = [...db.map((f) => ({ q: f.title, a: f.body, c: f.category ?? 'সাধারণ' })), ...staticFaq.map(([q, a]) => ({ q, a, c: 'সাধারণ' }))];
  const cats = ['সব', ...Array.from(new Set(all.map((f) => f.c)))];
  const [cat, setCat] = useState('সব');
  const [open, setOpen] = useState<number | null>(0);
  const list = cat === 'সব' ? all : all.filter((f) => f.c === cat);
  return (
    <Site>
      <div className="px-2.5 pb-2.5 pt-2.5 max-[359px]:px-2 sm:px-5 sm:pb-5 sm:pt-5">
        <FaqHero />
      </div>

      {/* অভিভাবক নির্দেশিকা — হোম স্টাইল গাঢ় সবুজ প্যানেল */}
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary py-5 text-primary-foreground shadow-elegant max-[359px]:py-4 sm:rounded-[1.25rem] sm:py-9">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <Heading compact light eyebrow="অভিভাবক নির্দেশিকা" title="ভর্তির আগে যা জানা জরুরি" description="নিয়মকানুন, শিক্ষার্থীর প্রস্তুতি ও প্রয়োজনীয় কাগজপত্র—সবকিছু গুছিয়ে এক জায়গায়।" />
            <div className="grid gap-2 max-[359px]:gap-2 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3">
              {guideCards.map(({ icon: Icon, title, items }) => (
                <div key={title} className="group rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-primary-foreground/10 max-[359px]:p-2.5 sm:rounded-2xl sm:p-4 lg:p-5">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold text-primary max-[359px]:size-8 max-[359px]:rounded-lg sm:size-10 sm:rounded-xl"><Icon className="size-4.5 max-[359px]:size-4 sm:size-5" /></div>
                    <h3 className="font-display text-[13px] font-semibold leading-snug sm:text-base lg:text-[15px]">{title}</h3>
                  </div>
                  <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
                    {items.map((x) => <li key={x} className="flex gap-2 text-[10.5px] leading-[1.55] text-primary-foreground/80 max-[359px]:text-[10px] sm:text-[13px] sm:leading-6"><span className="shrink-0 text-gold">✦</span>{x}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* সচরাচর জিজ্ঞাসা — সোনালি ট্যাব ও প্রিমিয়াম অ্যাকর্ডিয়ন */}
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary py-8 text-primary-foreground shadow-elegant max-[359px]:py-6 sm:rounded-[1.25rem] sm:py-12">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-5xl px-3 sm:px-8 lg:px-10">
            <Heading compact light eyebrow="প্রশ্ন ও উত্তর" title="সচরাচর জিজ্ঞাসা" description="প্রশ্নটির উপর ক্লিক করলেই উত্তর খুলে যাবে—বিভাগ বেছে নিয়ে দ্রুত খুঁজে নিন।" />
            <div className="mb-3.5 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-2">
              {cats.map((c) => (
                <button key={c} type="button" onClick={() => { setCat(c); setOpen(0); }} className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors sm:px-4 sm:py-2 sm:text-sm ${cat === c ? 'border-gold bg-gold text-primary' : 'border-gold/50 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/15'}`}>{c}</button>
              ))}
            </div>
            <p className="mb-3.5 flex min-w-0 items-center gap-2 text-[11px] font-semibold text-primary-foreground/80 sm:mb-5 sm:text-sm"><MessageCircleQuestion className="size-4 shrink-0 text-gold-light" /><span className="truncate">{cat === 'সব' ? t('সব প্রশ্ন') : cat} — {bn(list.length)}{t('টি প্রশ্ন')}</span></p>
            <div className="space-y-2 sm:space-y-3">
              {list.map((f, k) => (
                <div key={f.q} className="overflow-hidden rounded-lg bg-background shadow-elegant transition-shadow duration-300 hover:shadow-lg max-[359px]:rounded-md sm:rounded-2xl">
                  <button type="button" aria-expanded={open === k} onClick={() => setOpen(open === k ? null : k)} className="flex w-full items-center gap-2.5 p-3 text-start max-[359px]:gap-2 max-[359px]:p-2.5 sm:gap-4 sm:p-5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-gold font-display text-[11px] font-bold text-primary shadow-elegant max-[359px]:size-6.5 max-[359px]:text-[10px] sm:size-9 sm:rounded-xl sm:text-base">{bn(k + 1)}</span>
                    <span className="min-w-0 flex-1 font-display text-[12.5px] font-semibold leading-snug text-primary max-[359px]:text-[12px] sm:text-[15px]">{f.q}</span>
                    <ChevronDown className={`size-4 shrink-0 text-gold-deep transition-transform max-[359px]:size-3.5 sm:size-5 ${open === k ? 'rotate-180' : ''}`} />
                  </button>
                  {open === k && <p className="border-t border-border/60 px-3 pb-4 pt-3 text-[11.5px] leading-[1.7] text-muted-foreground max-[359px]:px-2.5 max-[359px]:text-[11px] sm:px-5 sm:pb-5 sm:text-[13.5px] sm:leading-7">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* সহায়তা CTA — হোম স্টাইল দুই প্যানেল */}
      <div className="px-2.5 pb-8 pt-2.5 max-[359px]:px-2 max-[359px]:pb-6 max-[359px]:pt-2 sm:px-5 sm:pb-16 sm:pt-5">
        <section className="grid gap-2.5 max-[359px]:gap-2 sm:gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="absolute right-3 top-3 z-10 flex size-16 items-center justify-center rounded-2xl bg-gold shadow-elegant sm:right-5 sm:top-5 sm:size-14 sm:rounded-[1rem]">
              <MessageCircleQuestion className="size-7 text-primary sm:size-7" strokeWidth={1.75} />
            </div>
            <div className="relative flex h-full flex-col justify-center px-4 py-4 max-[359px]:px-3 sm:px-7 sm:py-6 lg:px-9">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />{t('সহায়তা প্রয়োজন?')}</span>
              <h2 className="mt-2.5 font-display text-[1.35rem] font-bold leading-[1.2] sm:mt-3 sm:pr-16 sm:text-[1.9rem] lg:text-[1.8rem] xl:text-[2.1rem]">আপনার প্রশ্নের<br className="sm:hidden" /> উত্তর পাননি?</h2>
              <div className="mt-2.5 h-1 w-16 rounded-full bg-gold sm:mt-3 sm:w-24" />
              <p className="mt-2.5 text-[12.5px] leading-6 text-primary-foreground/90 sm:mt-3 sm:text-[15px] sm:leading-7">{t('আমাদের লিখুন অথবা সরাসরি কথা বলুন—ভর্তি ও আবাসিক জীবন নিয়ে দ্রুত উত্তর দেওয়া হবে।')}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-semibold text-primary sm:px-3.5 sm:py-1.5 sm:text-[11.5px]"><GraduationCap className="size-3 sm:size-3.5" />{t('কুরআন ও জাতীয় পাঠক্রম')}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-semibold text-primary sm:px-3.5 sm:py-1.5 sm:text-[11.5px]"><HomeIcon className="size-3 sm:size-3.5" />{t('পূর্ণাঙ্গ আবাসিক ব্যবস্থা')}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-semibold text-primary sm:px-3.5 sm:py-1.5 sm:text-[11.5px]"><ShieldCheck className="size-3 sm:size-3.5" />{t('২৪ ঘণ্টা নিরাপত্তা')}</span>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative flex h-full flex-col p-2 max-[359px]:p-1.5 sm:p-3 lg:p-2.5">
              <div className="relative h-28 shrink-0 overflow-hidden rounded-[0.75rem] shadow-elegant max-[359px]:h-24 sm:h-36 sm:rounded-[0.9rem] lg:h-44 xl:h-48">
                <img src={facilityImages.quran} alt="রেহালে কুরআন তিলাওয়াতরত শিক্ষার্থীরা" loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-primary shadow-elegant sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />{t('আসন সীমিত')}</span>
              </div>
              <div className="mt-2 grid gap-2 sm:mt-2.5 sm:grid-cols-2 lg:grid-cols-2">
                <Button asChild className="max-sm:h-10 max-sm:w-full max-sm:justify-center max-sm:text-[13px] bg-gold text-primary shadow-elegant hover:bg-gold-light"><Link to="/contact">{t('যোগাযোগ করুন')} <ArrowRight className="size-4 rtl:rotate-180" /></Link></Button>
                <Button asChild variant="outline" className="max-sm:h-10 max-sm:w-full max-sm:justify-center max-sm:text-[13px] border-primary-foreground/60 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href={telHref(s.phone)}><Phone className="size-4" />{t('কথা বলুন')}</a></Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Site>
  );
}
