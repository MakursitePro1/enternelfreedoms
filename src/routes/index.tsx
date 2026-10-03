import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, ShieldCheck, Heart, GraduationCap, Home as HomeIcon, Trophy, PlayCircle, Sparkles, CheckCircle2, CalendarDays, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Site, Heading, TextLink, DemoNote } from '@/components/Site';
import { StatsBar, TeachersCarousel, TestimonialSlider, ActivitiesTeaser, AchievementsGrid, SafetyGrid, MealTable, itemImage } from '@/components/InstitutionSections';
import { ContactSection } from '@/components/ContactSection';
import { photos, programs, dayTimeline, whyCards, parentQuestions, facilityImages, admissionSteps, galleryPhotos, bookCovers, isDemo, pick } from '@/lib/content';
import { useInstitutionContent } from '@/lib/institution-content';
import { useSiteSettings, youtubeEmbed } from '@/lib/site-settings';
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

const galleryUnique = [...photos, facilityImages.dorm, facilityImages.dining, facilityImages.classroom, facilityImages.playground, facilityImages.library, facilityImages.quran];

type Notice = { id: string; title: string; category: string; published_at: string };
import { FeaturedBookBanner } from '@/components/FeaturedBookBanner';

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
          <Button size="lg" asChild className="max-sm:col-span-2 max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] bg-primary-foreground text-primary shadow-elegant hover:bg-primary-foreground/90"><a href="#magic-english" onClick={(e) => { e.preventDefault(); document.getElementById('magic-english')?.scrollIntoView({ behavior: 'smooth' }); }}><BookOpen className="size-4" />{t('ম্যাজিক ইংলিশ বইটি দেখুন')}</a></Button>
        </div>
        <div className="mt-3.5 flex items-center justify-between gap-3 sm:mt-6 sm:justify-start">
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
  const [day, setDay] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const video = s.video_url ? youtubeEmbed(s.video_url) : null;
  const [dTime, dAct, dDesc] = dayTimeline[day] ?? ['', '', ''];
  useEffect(() => {
    supabase.from('notices').select('id,title,category,published_at').order('published_at', { ascending: false }).limit(4).then(({ data }) => setNotices(data ?? []));
  }, []);

  return (
    <Site>
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <Hero />
      </div>

      {/* Gallery loop */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="overflow-hidden rounded-[0.75rem] py-4 sm:rounded-[1.25rem] sm:py-7">
          <Heading compact eyebrow="আমাদের মুহূর্ত" title="ছবিতে আমাদের প্রতিষ্ঠান" />
          <div className="marquee-fade mt-4 overflow-hidden sm:mt-7">
            <div className="marquee-track flex w-max gap-3 sm:gap-5">
              {[...galleryUnique, ...galleryUnique].map((src, i) => (
                <button key={i} type="button" onClick={() => setLightbox(i % galleryUnique.length)} aria-label="ছবি বড় করে দেখুন" className="shrink-0 cursor-zoom-in focus-visible:outline-none">
                  <img src={src} alt="প্রতিষ্ঠানের মুহূর্ত" loading={i > 13 ? 'lazy' : undefined} className="h-40 w-[46.5vw] rounded-xl object-cover shadow-elegant transition-transform duration-500 hover:scale-[1.03] max-[359px]:h-32 max-[359px]:w-[47vw] sm:h-52 sm:w-[30vw] sm:rounded-2xl lg:h-60 lg:w-[18vw]" />
                </button>
              ))}
            </div>
          </div>
          <Dialog open={lightbox !== null} onOpenChange={(o) => { if (!o) setLightbox(null); }}>
            <DialogContent className="max-w-4xl gap-0 overflow-hidden rounded-2xl border-border p-0">
              <DialogTitle className="sr-only">প্রতিষ্ঠানের ছবি</DialogTitle>
              <DialogDescription className="sr-only">ছবিটি বড় করে দেখানো হচ্ছে</DialogDescription>
              {lightbox !== null && (
                <>
                  <img src={galleryUnique[lightbox]} alt="প্রতিষ্ঠানের মুহূর্ত" className="max-h-[70vh] w-full bg-secondary object-contain" />
                  <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3">
                    <Button variant="outline" size="icon" aria-label="আগের ছবি" onClick={() => setLightbox((lightbox - 1 + galleryUnique.length) % galleryUnique.length)}><ChevronLeft className="size-4" /></Button>
                    <span className="text-sm font-medium text-muted-foreground">{lightbox + 1} / {galleryUnique.length}</span>
                    <Button variant="outline" size="icon" aria-label="পরের ছবি" onClick={() => setLightbox((lightbox + 1) % galleryUnique.length)}><ChevronRight className="size-4" /></Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </section>
      </div>

      {/* About */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto grid max-w-7xl items-center gap-7 sm:gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <div className="about-compact relative min-w-0 overflow-hidden rounded-[0.75rem] bg-primary px-5 py-10 text-primary-foreground shadow-elegant max-[359px]:px-4 max-[359px]:py-8 sm:rounded-[1.25rem] sm:px-8 sm:py-14 lg:px-10 lg:py-16">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary-foreground/10 blur-3xl sm:size-96" />
            <div className="pointer-events-none absolute -bottom-32 -right-24 size-72 rounded-full bg-gold/10 blur-3xl sm:size-96" />
            <div className="relative">
              <Heading light hideDescriptionOnMobile eyebrow="আমাদের পরিচয়" title="শুধু প্রতিষ্ঠান নয়—একটি পূর্ণাঙ্গ শিক্ষা পরিবার" description="Eternal Freedom Institute Al Islamia একটি সমন্বিত ইসলামী ও সাধারণ শিক্ষার সম্পূর্ণ আবাসিক প্রতিষ্ঠান। এখানে কুরআন, দ্বীনি জ্ঞান ও জাতীয় পাঠক্রমের পাশাপাশি আদব-আখলাক, শৃঙ্খলা এবং আধুনিক দক্ষতার মাধ্যমে শিক্ষার্থীকে আলোকিত মানুষ হিসেবে গড়ে তোলা হয়।" />
              <ul className="mb-6 grid grid-cols-2 gap-1.5 max-[359px]:gap-1 sm:mb-9 sm:gap-3">
                {['প্লে থেকে দশম / দাখিল পর্যন্ত', 'নূরানী, নাজেরা, হিফজ ও কিতাব', 'সম্পূর্ণ আবাসিক ব্যবস্থা', 'সিসিটিভি ও সার্বক্ষণিক তত্ত্বাবধান'].map((x) => (
                  <li key={x} className="group flex items-center gap-1.5 rounded-lg border border-gold/25 bg-card px-2 py-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/55 hover:shadow-elegant sm:rounded-xl sm:gap-2.5 sm:px-4 sm:py-3">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold-soft ring-1 ring-gold/45 sm:size-7"><CheckCircle2 className="size-2.5 text-gold-deep sm:size-4" /></span>
                    <span className="min-w-0 text-[9.5px] font-semibold leading-snug text-primary max-[359px]:text-[9px] sm:text-[13px]">{x}</span>
                  </li>
                ))}
              </ul>
              <TextLink light to="/about">প্রতিষ্ঠান সম্পর্কে বিস্তারিত</TextLink>
            </div>
          </div>
          <div className="relative min-w-0">
            <div className="relative grid grid-cols-2 gap-2.5 sm:gap-5">
              <img src={photos[0]} alt="প্রতিষ্ঠানের শিক্ষার্থী ও শিক্ষক" className="h-28 w-full rounded-xl object-cover shadow-elegant transition-transform duration-500 hover:scale-[1.02] max-[359px]:h-24 sm:h-56 lg:h-[21rem]" />
              <img src={facilityImages.library} alt="লাইব্রেরি ও পাঠকক্ষ" loading="lazy" className="mt-4 h-28 w-full rounded-xl object-cover shadow-elegant transition-transform duration-500 hover:scale-[1.02] max-[359px]:h-24 sm:mt-12 sm:h-56 lg:h-[21rem]" />
              <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 justify-center sm:flex">
                <div className="grid size-14 place-items-center rounded-full bg-gold text-primary shadow-elegant ring-4 ring-background"><BookOpen className="size-6" /></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Why */}
      <div className="px-2.5 pb-2.5 pt-5 sm:px-5 sm:pb-5 sm:pt-9">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary py-5 text-primary-foreground shadow-elegant max-[359px]:py-4 sm:rounded-[1.25rem] sm:py-9">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <Heading compact center light eyebrow="আমাদের শক্তি" title="কেন Eternal Freedom?" description="একজন অভিভাবক কেন তাঁর সন্তানের জন্য আমাদের বেছে নেবেন—তার স্পষ্ট উত্তর।" />
            <div className="grid grid-cols-2 gap-2 max-[359px]:gap-2 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3">
              {whyCards.map((w, k) => { const Icon = whyIcons[w.icon]; return (
                <div key={w.title} className="group rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-primary-foreground/10 max-[359px]:p-2 sm:rounded-2xl sm:p-4">
                  <div className="flex items-center"><div className="grid size-9 place-items-center rounded-xl bg-gold text-primary max-[359px]:size-8 max-[359px]:rounded-lg sm:size-10 sm:rounded-xl"><Icon className="size-4.5 max-[359px]:size-4 sm:size-5" /></div></div>
                  <h3 className="mt-2.5 font-display text-[12px] font-semibold leading-snug max-[359px]:text-[11px] sm:mt-3 sm:text-base">{w.title}</h3>
                  <p className="mt-1 text-[10px] leading-4 text-primary-foreground/75 max-[359px]:text-[9.5px] max-[359px]:leading-4 sm:mt-1.5 sm:leading-5 sm:text-[12.5px]">{w.text}</p>
                </div>
              ); })}
            </div>
          </div>
        </section>
      </div>

      {/* Programs */}
      <section className="bg-secondary px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="শিক্ষা কার্যক্রম" title="আমার সন্তান এখানে কী পড়বে?" description="সাধারণ শিক্ষা, কুরআন শিক্ষা, ইসলামিক স্টাডিজ এবং বিশেষ দক্ষতা—প্রতিটি বিভাগের আলাদা বিস্তারিত।" /><TextLink to="/academics">সব বিভাগ দেখুন</TextLink></div>
          <div className="grid grid-cols-2 gap-2.5 max-[359px]:gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {programs.map((p) => (
              <Link to="/academics/$slug" params={{ slug: p.slug }} key={p.slug} className="group relative flex min-h-[210px] flex-col justify-end overflow-hidden rounded-xl shadow-elegant transition-transform duration-300 hover:-translate-y-1.5 max-[359px]:min-h-[185px] max-[359px]:rounded-lg sm:min-h-[340px] sm:rounded-2xl">
                <img src={p.image} alt={p.name} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/25 transition-colors duration-300 group-hover:via-primary/80" />
                <div className="relative flex flex-1 flex-col p-3 max-[359px]:p-2.5 sm:p-6">
                  <div className="flex items-center justify-between gap-1"><span className="rounded-full bg-primary-foreground/15 px-2 py-1 text-[9.5px] font-semibold text-primary-foreground backdrop-blur-sm ring-1 ring-primary-foreground/20 max-[359px]:px-1.5 max-[359px]:text-[9px] sm:px-3 sm:text-[11px]">{p.group}</span><span className="shrink-0 font-display text-base text-gold drop-shadow sm:text-2xl">{p.number}</span></div>
                  <h3 className="mt-auto pt-8 font-display text-[13.5px] font-semibold leading-snug text-primary-foreground drop-shadow-sm max-[359px]:pt-6 sm:pt-14 sm:text-xl">{p.name}</h3>
                  <p className="mt-1.5 flex-1 text-[10.5px] leading-[1.55] text-primary-foreground/85 max-[359px]:text-[10px] sm:mt-2 sm:text-[13px] sm:leading-6">{p.text}</p>
                  <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-2.5 py-1.5 text-[10.5px] font-bold text-primary shadow-md transition-all duration-300 group-hover:gap-2.5 group-hover:bg-gold-light group-hover:shadow-lg max-[359px]:px-2 max-[359px]:py-1 max-[359px]:text-[10px] sm:mt-4 sm:px-4 sm:py-2 sm:text-[13px]">বিস্তারিত <ArrowRight className="size-3 sm:size-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Principal */}
      <section className="bg-secondary px-2.5 py-10 max-[359px]:px-2 max-[359px]:py-8 sm:px-5 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto grid max-w-6xl gap-4 max-[359px]:gap-3 sm:gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-14">
            <img src={photos[5]} alt="প্রতিষ্ঠাতা ও অধ্যক্ষ মোঃ আনছারুল হক" className="h-60 w-full rounded-2xl object-cover object-top shadow-elegant max-[359px]:h-52 max-[359px]:rounded-xl sm:h-[420px] lg:h-[540px]" />
            <div className="principal-card min-w-0 rounded-2xl border border-primary-foreground/15 bg-primary p-4 shadow-elegant max-[359px]:rounded-xl max-[359px]:p-3.5 sm:p-8 lg:p-10">
              <Heading light eyebrow="অধ্যক্ষের বাণী" title="আলোকিত মানুষ গড়ার প্রত্যয়ে" />
              <blockquote className="border-s-4 border-gold ps-4 font-display text-[15px] leading-8 text-primary-foreground sm:ps-6 sm:text-lg sm:leading-9">“আমরা বিশ্বাস করি, প্রকৃত শিক্ষা মানুষকে জ্ঞানী করার পাশাপাশি চরিত্রবান ও দায়িত্বশীল করে তোলে। কুরআনের আলোয় আলোকিত হৃদয় এবং আধুনিক জ্ঞানে সমৃদ্ধ মেধা—এই দুইয়ের সমন্বয়েই আমরা প্রতিটি শিক্ষার্থীকে গড়ে তুলতে চাই। অভিভাবকদের আমানত হিসেবে আমরা প্রতিটি শিশুকে নিজের সন্তানের মতো যত্ন করি।”</blockquote>
              <p className="mt-4 text-[13px] leading-7 text-primary-foreground/75 sm:mt-6 sm:text-base sm:leading-8">আমাদের লক্ষ্য এমন একটি প্রজন্ম তৈরি করা, যারা দ্বীন ও দুনিয়া—উভয় ক্ষেত্রে সফল হবে এবং সমাজ ও দেশের কল্যাণে অবদান রাখবে।</p>
              <div className="mt-5 flex items-center gap-3 sm:mt-8 sm:gap-4"><div className="h-10 w-1 shrink-0 rounded bg-gold sm:h-12" /><div className="min-w-0"><div className="font-display text-lg font-semibold text-primary-foreground sm:text-xl">মোঃ আনছারুল হক (আনছার)</div><div className="text-xs text-primary-foreground/70 sm:text-sm">Founder Principal & Director</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Residential questions */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary py-8 text-primary-foreground shadow-elegant max-[359px]:py-7 sm:rounded-[1.25rem] sm:py-12">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <Heading compact light eyebrow="আবাসিক জীবন" title="অভিভাবকের সবচেয়ে বড় দুশ্চিন্তার সমাধান" description="সন্তানকে আবাসিকে দেওয়ার আগে যে প্রশ্নগুলো মনে আসে—তার প্রতিটির উত্তর।" />
              <TextLink light to="/residential">আবাসিক জীবন বিস্তারিত</TextLink>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 max-[359px]:gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
              {parentQuestions.map((q, k) => (
                <div key={q.q} className={`group flex h-full flex-col overflow-hidden rounded-md bg-background shadow-elegant premium-card sm:rounded-lg ${k >= 4 ? 'hidden sm:flex' : ''}`}>
                <img src={facilityImages[q.img]} alt={q.q} loading="lazy" className="aspect-[4/3] w-full shrink-0 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="flex flex-1 flex-col p-2 max-[359px]:p-1.5 sm:p-4">
                  <h3 className="font-display text-[11.5px] font-semibold leading-snug text-primary max-[359px]:text-[11px] sm:text-[15px] lg:text-[14px]">{q.q}</h3>
                  <p className="mt-1 line-clamp-3 text-[10px] leading-4 text-muted-foreground max-[359px]:text-[9.5px] max-[359px]:leading-4 sm:mt-2 sm:text-[13px] sm:leading-6 lg:text-[12px] lg:leading-5">{q.a}</p>
                  <Link to="/residential" className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-gold px-2 py-1 text-[9.5px] font-bold text-primary transition-all duration-300 hover:gap-2 hover:bg-gold-light max-[359px]:px-1.5 max-[359px]:text-[9px] sm:mt-2 sm:gap-1.5 sm:px-4 sm:py-2 sm:text-[13px] lg:px-3 lg:py-1.5 lg:text-[11.5px]">বিস্তারিত <ArrowRight className="size-2.5 sm:size-4" /></Link>
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>
      </div>

      {/* Food */}
      <section className="px-5 py-24 max-[359px]:px-4 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 max-[359px]:gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-12 [&>*]:min-w-0">
          <div className="min-w-0">
            <Heading compact eyebrow="খাবার ও পুষ্টি" title="নিজস্ব রান্নাঘরে যত্নে তৈরি খাবার" description="নিজস্ব কিচেন, বেকারি ও পরিচ্ছন্ন ডাইনিংয়ে স্বাস্থ্যসম্মতভাবে তৈরি তিনবেলা পুষ্টিকর খাবার ও নাশতা।" />
            <img src={facilityImages.dining} alt="ডাইনিংয়ে খাবার পরিবেশন" loading="lazy" className="mt-5 aspect-[4/3] w-full rounded-lg object-cover shadow-elegant transition-transform duration-500 hover:scale-[1.02] max-[359px]:mt-4 max-[359px]:aspect-[3/2] max-[359px]:rounded-md sm:mt-7 sm:aspect-[16/10] sm:rounded-xl lg:aspect-[4/3]" />
          </div>
          <div className="min-w-0">
            <MealTable limit={4} />
            <div className="mt-5 max-[359px]:mt-4 sm:mt-6"><TextLink to="/residential">পূর্ণ সাপ্তাহিক মেনু দেখুন</TextLink></div>
          </div>
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
      <section className="bg-secondary px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5"><Heading eyebrow="শিক্ষকমণ্ডলী" title="যাঁরা আপনার সন্তানকে গড়বেন" description="অভিজ্ঞ, যোগ্য ও আন্তরিক শিক্ষকমণ্ডলী।" /><TextLink to="/teachers">সব শিক্ষক</TextLink></div>
          <TeachersCarousel />
        </div>
      </section>

      {/* Safety */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:gap-10">
          <div className="lg:sticky lg:top-28"><Heading eyebrow="নিরাপত্তা ও যত্ন" title="আপনার সন্তান নিরাপদ হাতে" description="সিসিটিভি পর্যবেক্ষণ, নিয়ন্ত্রিত পরিবেশ, চিকিৎসা সহায়তা ও সার্বক্ষণিক তত্ত্বাবধান।" /><div className="flex items-center gap-4 rounded-2xl bg-primary p-6 text-primary-foreground"><ShieldCheck className="size-12 shrink-0 text-gold" /><p className="text-sm leading-6 opacity-90">শিক্ষার্থীর নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার—দিন-রাত ২৪ ঘণ্টা।</p></div></div>
          <SafetyGrid />
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-secondary px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Heading center eyebrow="সাফল্য" title="অর্জনসমূহ" /><AchievementsGrid /></div></section>

      {/* Admission process */}
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
      <section className="relative overflow-hidden rounded-[0.75rem] bg-primary py-9 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:py-10">

        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">

          <Heading center light eyebrow="ভর্তি" title="ভর্তি প্রক্রিয়া" description="মাত্র চারটি সহজ ধাপে আপনার সন্তানের ভর্তি সম্পন্ন করুন।" />
          <div className="relative grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            <span aria-hidden className="absolute inset-x-8 top-9 hidden h-px bg-gold lg:block" />
            {admissionSteps.map(([title, text], k) => (
              <div key={title} className="relative z-10 flex flex-col rounded-2xl border border-border/60 bg-background p-4 shadow-elegant transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                <div className="grid size-9 place-items-center rounded-full bg-gold font-display text-base text-primary shadow-elegant sm:size-12 sm:text-xl">{(k + 1).toLocaleString('bn-BD')}</div>
                <h3 className="mt-3 font-display text-[14px] font-semibold leading-snug text-primary sm:mt-5 sm:text-lg">{title}</h3>
                <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light hover:text-primary"><Link to="/admission">অনলাইনে আবেদন করুন <ArrowRight className="size-4 rtl:rotate-180" /></Link></Button><Button size="lg" variant="secondary" asChild className="bg-background text-primary hover:bg-secondary"><Link to="/faq">ভর্তি সংক্রান্ত প্রশ্ন</Link></Button></div>
        </div>
      </section>
      </div>


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
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
      <section className="relative overflow-hidden rounded-[0.75rem] bg-primary py-14 text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-10"><Heading center light eyebrow="অভিভাবকের কণ্ঠ" title="অভিভাবকদের মতামত" /><TestimonialSlider /></div>
      </section>
      </div>

      {/* Books */}
      <FeaturedBookBanner />

       {/* Contact */}
       <ContactSection />

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
