import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, ShieldCheck, Heart, GraduationCap, MapPin, Home as HomeIcon, Trophy, Phone, Mail, Clock, PlayCircle, Sparkles, CheckCircle2, CalendarDays, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Site, Heading, TextLink, DemoNote } from '@/components/Site';
import { StatsBar, TeachersGrid, TestimonialSlider, ActivitiesTeaser, AchievementsGrid, SafetyGrid, MealTable, itemImage } from '@/components/InstitutionSections';
import { ContactForm } from '@/components/ContactForm';
import { photos, programs, dayTimeline, whyCards, parentQuestions, facilityImages, admissionSteps, galleryPhotos, bookCovers, isDemo, pick } from '@/lib/content';
import { useInstitutionContent } from '@/lib/institution-content';
import { useSiteSettings, telHref, youtubeEmbed } from '@/lib/site-settings';
import { useLang } from '@/lib/i18n';
import { seo } from '@/lib/seo';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/')({
  head: () => seo('হোম', 'Eternal Freedom Institute Al Islamia, গফরগাঁও, ময়মনসিংহ—কুরআনকেন্দ্রিক ইসলামী ও সাধারণ শিক্ষার সমন্বিত পূর্ণাঙ্গ আবাসিক প্রতিষ্ঠান। ভর্তি, শিক্ষক, আবাসিক জীবন ও বইয়ের দোকান।'),
  component: Home,
});

const heroSlides = [
  { src: photos[2], alt: 'ইটারনাল ফ্রিডমের শিক্ষার্থী ও শিক্ষকবৃন্দ' },
  { src: facilityImages.quran, alt: 'রেহালে কুরআন তিলাওয়াতরত শিক্ষার্থীরা' },
  { src: facilityImages.classroom, alt: 'শ্রেণিকক্ষে পাঠরত শিক্ষার্থীরা' },
];
const whyIcons = { book: BookOpen, grad: GraduationCap, home: HomeIcon, shield: ShieldCheck, heart: Heart, trophy: Trophy } as const;

type Notice = { id: string; title: string; category: string; published_at: string };
type Book = { id: string; title: string; description: string; price: number; cover_url: string | null; slug: string | null; author: string | null };

function Hero() {
  const { t } = useLang();
  const s = useSiteSettings();
  const [i, setI] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setI((x) => (x + 1) % heroSlides.length), 6000); return () => window.clearInterval(id); }, []);
  return (
    <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[calc(100svh-230px)] sm:rounded-[1.25rem]">
      {heroSlides.map((sl, k) => <img key={sl.src} src={sl.src} alt={sl.alt} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${k === i ? 'opacity-100' : 'opacity-0'}`} />)}
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 pt-16 max-[359px]:px-4 max-[359px]:pt-10 sm:justify-center sm:py-6 lg:px-8">
        <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />{s.admission_badge}</span>
        <p className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-gold-light sm:mt-4 sm:gap-3 sm:text-sm"><span className="h-px w-5 shrink-0 bg-gold sm:w-8" />{t('গফরগাঁও, ময়মনসিংহের সমন্বিত শিক্ষা প্রতিষ্ঠান')}</p>
        <h1 className="mt-1.5 max-w-5xl font-hero text-[1.65rem] font-bold leading-[1.12] max-[359px]:text-[1.4rem] sm:mt-2.5 sm:text-5xl lg:text-6xl xl:text-7xl">Eternal Freedom<br /><span className="text-gold-light">Institute Al Islamia</span></h1>
        <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">“{t('কুরআনের আলোয় জ্ঞান, চরিত্র ও দক্ষতার সমন্বিত শিক্ষা')}”</p>
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          <Button size="lg" asChild className="max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] bg-gold text-primary hover:bg-gold-light"><Link to="/admission">{t('ভর্তি সম্পর্কে জানুন')} <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></Link></Button>
          <Button size="lg" variant="outline" asChild className="max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground hover:text-primary"><Link to="/campus">{t('ক্যাম্পাস ঘুরে দেখুন')}</Link></Button>
          <Button size="lg" variant="ghost" asChild className="max-sm:hidden text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><a href={telHref(s.phone)}><Phone className="size-4" />{s.phone}</a></Button>
        </div>
        <div className="mt-3.5 flex items-center justify-between gap-3 sm:mt-6 sm:justify-start">
          <a href={telHref(s.phone)} className="inline-flex min-w-0 items-center gap-1.5 text-[12.5px] font-semibold text-primary-foreground/90 sm:hidden"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-foreground/15"><Phone className="size-3" /></span>{s.phone}</a>
          <div className="flex shrink-0 gap-1.5 sm:gap-2">{heroSlides.map((sl, k) => <button key={sl.src} type="button" aria-label={`ছবি ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-8 bg-gold sm:w-10' : 'w-4 bg-primary-foreground/40 sm:w-5'}`} />)}</div>
        </div>
      </div>
      <div className="relative w-full bg-primary/85 backdrop-blur-sm"><div className="mx-auto max-w-7xl sm:px-5 lg:px-8"><StatsBar hero /></div></div>
    </section>
  );
}

function Home() {
  const { t } = useLang();
  const s = useSiteSettings();
  const facilities = useInstitutionContent('facility');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [day, setDay] = useState(0);
  const video = s.video_url ? youtubeEmbed(s.video_url) : null;
  const [dTime, dAct, dDesc] = dayTimeline[day] ?? ['', '', ''];
  useEffect(() => {
    supabase.from('notices').select('id,title,category,published_at').order('published_at', { ascending: false }).limit(4).then(({ data }) => setNotices(data ?? []));
    supabase.from('books').select('id,title,description,price,cover_url,slug,author').eq('active', true).order('created_at', { ascending: true }).limit(4).then(({ data }) => setBooks((data ?? []) as Book[]));
  }, []);

  return (
    <Site>
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <Hero />
      </div>

      {/* About */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Heading eyebrow="আমাদের পরিচয়" title="শুধু প্রতিষ্ঠান নয়—একটি পূর্ণাঙ্গ শিক্ষা পরিবার" description="Eternal Freedom Institute Al Islamia একটি সমন্বিত ইসলামী ও সাধারণ শিক্ষার সম্পূর্ণ আবাসিক প্রতিষ্ঠান। এখানে কুরআন, দ্বীনি জ্ঞান ও জাতীয় পাঠক্রমের পাশাপাশি আদব-আখলাক, শৃঙ্খলা এবং আধুনিক দক্ষতার মাধ্যমে শিক্ষার্থীকে আলোকিত মানুষ হিসেবে গড়ে তোলা হয়।" />
            <ul className="mb-8 grid gap-3 sm:grid-cols-2">{['প্লে থেকে দশম / দাখিল পর্যন্ত', 'নূরানী, নাজেরা, হিফজ ও কিতাব', 'সম্পূর্ণ আবাসিক ব্যবস্থা', 'সিসিটিভি ও সার্বক্ষণিক তত্ত্বাবধান'].map((x) => <li key={x} className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="size-5 text-gold" />{x}</li>)}</ul>
            <TextLink to="/about">প্রতিষ্ঠান সম্পর্কে বিস্তারিত</TextLink>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            <img src={photos[0]} alt="প্রতিষ্ঠানের শিক্ষার্থী ও শিক্ষক" className="h-64 w-full object-cover premium-image shadow-elegant sm:h-80" />
            <img src={facilityImages.library} alt="লাইব্রেরি ও পাঠকক্ষ" loading="lazy" className="mt-10 h-64 w-full object-cover premium-image shadow-elegant sm:h-80" />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="relative overflow-hidden bg-primary px-5 py-24 text-primary-foreground lg:px-8">
        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl">
          <Heading center light eyebrow="আমাদের শক্তি" title="কেন Eternal Freedom?" description="একজন অভিভাবক কেন তাঁর সন্তানের জন্য আমাদের বেছে নেবেন—তার স্পষ্ট উত্তর।" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((w, k) => { const Icon = whyIcons[w.icon]; return (
              <div key={w.title} className="group rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-7 transition-colors hover:bg-primary-foreground/10">
                <div className="flex items-center"><div className="grid size-14 place-items-center rounded-2xl bg-gold text-primary"><Icon className="size-7" /></div></div>
                <h3 className="mt-6 font-display text-xl font-semibold">{w.title}</h3>
                <p className="mt-2 leading-7 text-primary-foreground/75">{w.text}</p>
              </div>
            ); })}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-secondary px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="শিক্ষা কার্যক্রম" title="আমার সন্তান এখানে কী পড়বে?" description="সাধারণ শিক্ষা, কুরআন শিক্ষা, ইসলামিক স্টাডিজ এবং বিশেষ দক্ষতা—প্রতিটি বিভাগের আলাদা বিস্তারিত।" /><TextLink to="/academics">সব বিভাগ দেখুন</TextLink></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => (
              <Link to="/academics/$slug" params={{ slug: p.slug }} key={p.slug} className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl shadow-elegant transition-transform duration-300 hover:-translate-y-1.5 sm:min-h-[340px]">
                <img src={p.image} alt={p.name} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/25 transition-colors duration-300 group-hover:via-primary/80" />
                <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between"><span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur-sm ring-1 ring-primary-foreground/20">{p.group}</span><span className="font-display text-2xl text-gold drop-shadow">{p.number}</span></div>
                  <h3 className="mt-auto pt-14 font-display text-xl font-semibold text-primary-foreground drop-shadow-sm">{p.name}</h3>
                  <p className="mt-2 flex-1 text-[13px] leading-6 text-primary-foreground/85">{p.text}</p>
                  <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-[13px] font-bold text-primary shadow-md transition-all duration-300 group-hover:gap-2.5 group-hover:bg-gold-light group-hover:shadow-lg">বিস্তারিত <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Principal */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div className="relative"><div className="absolute -inset-3 rounded-3xl bg-gold-gradient opacity-30 blur-2xl" /><img src={photos[5]} alt="প্রতিষ্ঠাতা ও অধ্যক্ষ মোঃ আনছারুল হক" className="relative h-[460px] w-full object-cover object-top premium-image shadow-elegant lg:h-[540px]" /></div>
          <div>
            <Heading eyebrow="অধ্যক্ষের বাণী" title="আলোকিত মানুষ গড়ার প্রত্যয়ে" />
            <blockquote className="relative border-s-4 border-gold ps-6 font-display text-lg leading-9 text-primary">“আমরা বিশ্বাস করি, প্রকৃত শিক্ষা মানুষকে জ্ঞানী করার পাশাপাশি চরিত্রবান ও দায়িত্বশীল করে তোলে। কুরআনের আলোয় আলোকিত হৃদয় এবং আধুনিক জ্ঞানে সমৃদ্ধ মেধা—এই দুইয়ের সমন্বয়েই আমরা প্রতিটি শিক্ষার্থীকে গড়ে তুলতে চাই। অভিভাবকদের আমানত হিসেবে আমরা প্রতিটি শিশুকে নিজের সন্তানের মতো যত্ন করি।”</blockquote>
            <p className="mt-6 leading-8 text-muted-foreground">আমাদের লক্ষ্য এমন একটি প্রজন্ম তৈরি করা, যারা দ্বীন ও দুনিয়া—উভয় ক্ষেত্রে সফল হবে এবং সমাজ ও দেশের কল্যাণে অবদান রাখবে।</p>
            <div className="mt-8 flex items-center gap-4"><div className="h-12 w-1 rounded bg-gold" /><div><div className="font-display text-xl font-semibold text-primary">মোঃ আনছারুল হক (আনছার)</div><div className="text-sm text-muted-foreground">Founder Principal & Director</div></div></div>
          </div>
        </div>
      </section>

      {/* Residential questions */}
      <section className="bg-secondary px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="আবাসিক জীবন" title="অভিভাবকের সবচেয়ে বড় দুশ্চিন্তার সমাধান" description="সন্তানকে আবাসিকে দেওয়ার আগে যে প্রশ্নগুলো মনে আসে—তার প্রতিটির উত্তর।" /><TextLink to="/residential">আবাসিক জীবন বিস্তারিত</TextLink></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {parentQuestions.map((q) => (
              <div key={q.q} className="group overflow-hidden rounded-2xl bg-background shadow-elegant premium-card">
                <img src={facilityImages[q.img]} alt={q.q} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="p-5"><h3 className="font-display text-lg font-semibold text-primary">{q.q}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{q.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center [&>*]:min-w-0">
          <div>
            <Heading eyebrow="খাবার ও পুষ্টি" title="নিজস্ব রান্নাঘরে যত্নে তৈরি খাবার" description="নিজস্ব কিচেন, বেকারি ও পরিচ্ছন্ন ডাইনিংয়ে স্বাস্থ্যসম্মতভাবে তৈরি তিনবেলা পুষ্টিকর খাবার ও নাশতা।" />
            <img src={facilityImages.dining} alt="ডাইনিংয়ে খাবার পরিবেশন" loading="lazy" className="h-72 w-full object-cover premium-image shadow-elegant" />
          </div>
          <div><MealTable limit={4} /><div className="mt-5"><TextLink to="/residential">পূর্ণ সাপ্তাহিক মেনু দেখুন</TextLink></div></div>
        </div>
      </section>

      {/* Day timeline */}
      <section className="relative overflow-hidden bg-primary px-5 py-24 text-primary-foreground lg:px-8">
        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl">
          <Heading center light eyebrow="দৈনন্দিন জীবন" title="একটি দিন Eternal Freedom-এ" description="“আমার সন্তান এখানে সারাদিন কীভাবে সময় কাটাবে?” — ফজর থেকে ঘুম পর্যন্ত সুশৃঙ্খল রুটিন।" />
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="rounded-3xl bg-primary-foreground/10 p-8 sm:p-10">
              <div className="text-sm font-semibold text-gold-light">{dTime}</div>
              <div key={day} className="fade-slide mt-2 font-display text-4xl font-semibold">{dAct}</div>
              <p className="mt-4 leading-8 text-primary-foreground/80">{dDesc}</p>
              <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-primary-foreground/15"><div className="h-full bg-gold transition-all" style={{ width: `${((day + 1) / dayTimeline.length) * 100}%` }} /></div>
              <div className="mt-2 text-xs opacity-70">ধাপ {(day + 1).toLocaleString('bn-BD')} / {dayTimeline.length.toLocaleString('bn-BD')}</div>
            </div>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {dayTimeline.map(([time, act], k) => (
                <li key={act}><button type="button" onClick={() => setDay(k)} onMouseEnter={() => setDay(k)} className={`w-full rounded-xl p-3 text-start transition-colors ${k === day ? 'bg-gold text-primary' : 'bg-primary-foreground/5 hover:bg-primary-foreground/15'}`}><div className="text-[11px] opacity-75">{time}</div><div className="font-semibold">{act}</div></button></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="ক্যাম্পাস ও সুবিধা" title="শেখা ও বেড়ে ওঠার পরিপূর্ণ পরিবেশ" /><TextLink to="/campus">সব সুবিধা দেখুন</TextLink></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.slice(0, 6).map((f, k) => (
              <article key={f.id} className="group relative h-72 overflow-hidden rounded-2xl shadow-elegant">
                <img src={itemImage(f, k)} alt={f.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground"><h3 className="font-display text-xl font-semibold">{f.title}</h3><p className="mt-1 line-clamp-2 text-sm opacity-85">{f.body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="bg-secondary px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="শিক্ষকমণ্ডলী" title="যাঁরা আপনার সন্তানকে গড়বেন" description="অভিজ্ঞ, যোগ্য ও আন্তরিক শিক্ষকমণ্ডলী।" /><TextLink to="/teachers">সব শিক্ষক</TextLink></div>
          <TeachersGrid limit={4} />
        </div>
      </section>

      {/* Safety */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28"><Heading eyebrow="নিরাপত্তা ও যত্ন" title="আপনার সন্তান নিরাপদ হাতে" description="সিসিটিভি পর্যবেক্ষণ, নিয়ন্ত্রিত পরিবেশ, চিকিৎসা সহায়তা ও সার্বক্ষণিক তত্ত্বাবধান।" /><div className="flex items-center gap-4 rounded-2xl bg-primary p-6 text-primary-foreground"><ShieldCheck className="size-12 shrink-0 text-gold" /><p className="text-sm leading-6 opacity-90">শিক্ষার্থীর নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার—দিন-রাত ২৪ ঘণ্টা।</p></div></div>
          <SafetyGrid />
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-secondary px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Heading center eyebrow="সাফল্য" title="অর্জনসমূহ" /><AchievementsGrid /></div></section>

      {/* Admission process */}
      <section className="relative overflow-hidden px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading center eyebrow="ভর্তি" title="ভর্তি প্রক্রিয়া" description="মাত্র চারটি সহজ ধাপে আপনার সন্তানের ভর্তি সম্পন্ন করুন।" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {admissionSteps.map(([title, text], k) => (
              <div key={title} className="relative rounded-2xl bg-background p-7 shadow-elegant">
                <div className="grid size-12 place-items-center rounded-full bg-primary font-display text-xl text-gold-light">{(k + 1).toLocaleString('bn-BD')}</div>
                <h3 className="mt-5 font-display text-lg font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3"><Button size="lg" asChild><Link to="/admission">অনলাইনে আবেদন করুন <ArrowRight className="size-4 rtl:rotate-180" /></Link></Button><Button size="lg" variant="secondary" asChild><Link to="/faq">ভর্তি সংক্রান্ত প্রশ্ন</Link></Button></div>
        </div>
      </section>

      {/* Notices + News */}
      <section className="bg-secondary px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <div className="flex items-end justify-between gap-4"><Heading eyebrow="ঘোষণা" title="নোটিশ বোর্ড" /><TextLink to="/notices">{t('সব দেখুন')}</TextLink></div>
            <div className="overflow-hidden rounded-2xl bg-background shadow-elegant">
              {notices.length ? notices.map((n) => { const d = new Date(n.published_at); return (
                <Link key={n.id} to="/notices/$id" params={{ id: n.id }} className="flex gap-4 border-b border-border p-5 last:border-0 hover:bg-accent">
                  <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary text-center text-primary-foreground"><div><div className="font-display text-lg leading-none text-gold-light">{d.toLocaleDateString('bn-BD', { day: 'numeric' })}</div><div className="text-[10px]">{d.toLocaleDateString('bn-BD', { month: 'short' })}</div></div></div>
                  <div className="min-w-0"><span className="text-xs font-semibold text-gold">{n.category}</span><h3 className="font-semibold leading-snug text-primary">{n.title}</h3></div>
                </Link>
              ); }) : <p className="p-6 text-muted-foreground">এই মুহূর্তে কোনো নোটিশ নেই।</p>}
            </div>
          </div>
          <div>
            <div className="flex items-end justify-between gap-4"><Heading eyebrow="কার্যক্রম" title="খবর ও অনুষ্ঠান" /><TextLink to="/activities">{t('সব দেখুন')}</TextLink></div>
            <ActivitiesTeaser />
          </div>
        </div>
      </section>

      {/* Gallery + Video */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="গ্যালারি" title="প্রতিষ্ঠানের বাস্তব পরিবেশ" /><TextLink to="/gallery">পুরো গ্যালারি</TextLink></div>
          <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4">
            {galleryPhotos.slice(0, 7).map((g, k) => (
              <Link to="/gallery" key={g.src + k} className={`group relative overflow-hidden rounded-2xl ${k === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute bottom-3 start-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary">{g.category}</span>
              </Link>
            ))}
          </div>
          <div className="mt-16 overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-elegant">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12"><Heading light eyebrow="ক্যাম্পাস ট্যুর" title="ক্যাম্পাস ভিডিও" description="একটি ভিডিওতে পুরো ক্যাম্পাস, শ্রেণিকক্ষ, আবাসিক ভবন ও দৈনন্দিন জীবনের মনোরম দৃশ্য।" /><Button asChild className="bg-gold text-primary hover:bg-gold-light"><Link to="/gallery">গ্যালারিতে আরও দেখুন</Link></Button></div>
              <div className="relative min-h-72">
                {video ? <iframe title="ক্যাম্পাস ভিডিও" src={video} loading="lazy" allowFullScreen className="absolute inset-0 h-full w-full" /> : (<>
                  <img src={facilityImages.playground} alt="ক্যাম্পাসের দৃশ্য" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 grid place-items-center bg-primary/50"><div className="text-center"><PlayCircle className="mx-auto size-20 text-gold-light" /><p className="mt-3 text-sm font-semibold">ক্যাম্পাস ভিডিও শীঘ্রই প্রকাশিত হবে</p></div></div>
                </>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Heading center eyebrow="অভিভাবকের কণ্ঠ" title="অভিভাবকদের মতামত" /><TestimonialSlider /></div></section>

      {/* Books */}
      {books.length > 0 && (
        <section className="px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="অনলাইন বইয়ের দোকান" title="প্রতিষ্ঠানের নিজস্ব প্রকাশনা" description="ঘরে বসেই অর্ডার করুন—ক্যাশ অন ডেলিভারি, বিকাশ বা নগদে পেমেন্ট।" /><TextLink to="/books">সব বই দেখুন</TextLink></div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((b, k) => (
                <Link key={b.id} to="/books/$id" params={{ id: b.id }} className="group overflow-hidden rounded-2xl bg-secondary premium-card shadow-elegant">
                  <div className="relative aspect-[3/4] overflow-hidden"><img src={b.cover_url ?? pick(bookCovers, k)} alt={b.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />{!b.cover_url && <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-lg bg-background/90 p-3 text-center font-display text-sm font-semibold text-primary">{b.title}</div>}</div>
                  <div className="p-5"><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{b.author}</span><DemoNote show={isDemo(b.slug)} /></div><h3 className="mt-1 font-display text-lg font-semibold text-primary">{b.title}</h3><div className="mt-3 flex items-center justify-between"><strong className="text-lg text-primary">৳ {Number(b.price).toLocaleString('bn-BD')}</strong><span className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><ShoppingBag className="size-3.5" />{t('এখনই কিনুন')}</span></div></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="bg-secondary px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Heading eyebrow="যোগাযোগ" title="আমাদের সঙ্গে যোগাযোগ করুন" description="ভর্তি, আবাসিক ব্যবস্থা বা যেকোনো প্রশ্নে আমরা আছি আপনার পাশে।" />
            <div className="space-y-3">
              {[[MapPin, 'ঠিকানা', s.address, undefined], [Phone, 'ফোন', s.phone, telHref(s.phone)], [Mail, 'ইমেইল', s.email, `mailto:${s.email}`], [Clock, 'অফিস সময়', s.office_hours, undefined]].map(([Icon, label, value, href]) => {
                const I = Icon as typeof MapPin; const inner = <><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-gold-light"><I className="size-5" /></div><div className="min-w-0"><div className="text-xs text-muted-foreground">{label as string}</div><div className="break-words font-semibold text-primary">{value as string}</div></div></>;
                return href ? <a key={label as string} href={href as string} className="flex items-center gap-4 rounded-2xl bg-background p-4 shadow-elegant hover:bg-accent">{inner}</a> : <div key={label as string} className="flex items-center gap-4 rounded-2xl bg-background p-4 shadow-elegant">{inner}</div>;
              })}
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl shadow-elegant"><iframe title="গুগল ম্যাপে প্রতিষ্ঠানের অবস্থান" src="https://www.google.com/maps?q=Gafargaon,+Mymensingh&output=embed" loading="lazy" className="h-56 w-full border-0" /></div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary px-5 py-24 text-center text-primary-foreground">
        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl">
          <CalendarDays className="mx-auto mb-5 size-10 text-gold" />
          <h2 className="font-display text-3xl sm:text-5xl">সন্তানের শিক্ষাযাত্রা শুরু হোক এখানে</h2>
          <p className="mt-5 leading-8 opacity-80">{s.admission_badge} — আসন সীমিত। আজই অনলাইনে আবেদন করুন অথবা ক্যাম্পাস পরিদর্শন করুন।</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><Link to="/admission">ভর্তি আবেদন করুন <ArrowRight className="size-4 rtl:rotate-180" /></Link></Button><Button asChild size="lg" variant="outline" className="border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact">যোগাযোগ করুন</Link></Button></div>
        </div>
      </section>
    </Site>
  );
}
