import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, PlayCircle, Images, Sparkles, ArrowRight, Phone, ZoomIn, GraduationCap, ShieldCheck, Home as HomeIcon, Camera, Clapperboard } from 'lucide-react';
import { Site, PageIntro, Heading } from '@/components/Site';
import { StatsBar } from '@/components/InstitutionSections';
import { Button } from '@/components/ui/button';
import { useInstitutionContent } from '@/lib/institution-content';
import { galleryCategories, galleryPhotos, facilityImages } from '@/lib/content';
import { useSiteSettings, youtubeEmbed } from '@/lib/site-settings';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/gallery')({
  head: () => seo('ফটো ও ভিডিও গ্যালারি', 'ক্যাম্পাস, শ্রেণিকক্ষ, কুরআন শিক্ষা, হিফজ, নাজেরা, কিতাব, আবাসিক জীবন, খাবার, খেলাধুলা, অনুষ্ঠান ও শিক্ষার্থীদের কার্যক্রমের ছবি ও ক্যাম্পাস ভিডিও।'),
  component: Gallery,
});

const bn = (n: number) => n.toLocaleString('bn-BD');

function GalleryHero({ slides }: { slides: { src: string; alt: string }[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setI((x) => (x + 1) % slides.length), 6000); return () => window.clearInterval(id); }, [slides.length]);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[calc(100svh-230px)] sm:rounded-[1.25rem]">
      {slides.map((sl, k) => <img key={sl.src + k} src={sl.src} alt={sl.alt} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${k === i ? 'opacity-100' : 'opacity-0'}`} />)}
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 pt-16 max-[359px]:px-4 max-[359px]:pt-10 sm:justify-center sm:py-6 lg:px-8">
        <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Images className="size-3 shrink-0 sm:size-3.5" />ফটো ও ভিডিও গ্যালারি</span>
        <p className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-gold-light sm:mt-4 sm:gap-3 sm:text-sm"><span className="h-px w-5 shrink-0 bg-gold sm:w-8" />প্রতিষ্ঠানের বাস্তব পরিবেশ</p>
        <h1 className="mt-1.5 max-w-5xl font-display text-[1.65rem] font-bold leading-[1.12] max-[359px]:text-[1.4rem] sm:mt-2.5 sm:text-5xl lg:text-6xl xl:text-7xl">মুহূর্তগুলোর<br /><span className="text-gold-light">বাস্তব গল্প</span></h1>
        <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">প্রতিষ্ঠানের বাস্তব ছবিই আমাদের সবচেয়ে বড় আস্থার প্রমাণ — ক্যাম্পাস, শ্রেণিকক্ষ, আবাসিক জীবন ও শিক্ষার্থীদের কার্যক্রমের একঝাঁক মুহূর্ত।</p>
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          <Button size="lg" className="max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] bg-gold text-primary hover:bg-gold-light" onClick={() => go('gallery-photos')}>ছবিগুলো দেখুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></Button>
          <Button size="lg" variant="outline" className="max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => go('gallery-videos')}><PlayCircle className="size-4" />ভিডিও দেখুন</Button>
        </div>
        <div className="mt-3.5 flex items-center justify-between gap-3 sm:mt-6 sm:justify-start">
          <div className="flex shrink-0 gap-1.5 sm:gap-2">{slides.map((_, k) => <button key={k} type="button" aria-label={`ছবি ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-8 bg-gold sm:w-10' : 'w-4 bg-primary-foreground/40 sm:w-5'}`} />)}</div>
        </div>
      </div>
      <div className="relative w-full px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary shadow-elegant sm:rounded-[1.25rem]"><StatsBar hero /></div></div>
    </section>
  );
}

function Gallery() {
  const dbPhotos = useInstitutionContent('gallery');
  const videos = useInstitutionContent('video');
  const s = useSiteSettings();
  const images = [...dbPhotos.filter((p) => p.image_url).map((p) => ({ src: p.image_url as string, category: p.category ?? 'ক্যাম্পাস', alt: p.title })), ...galleryPhotos];
  const [cat, setCat] = useState('সব');
  const [view, setView] = useState<number | null>(null);
  const list = cat === 'সব' ? images : images.filter((i) => i.category === cat);
  const mainVideo = s.video_url ? youtubeEmbed(s.video_url) : null;
  const featured = images.slice(0, 7);
  const marqueeImgs = images.slice(0, 14);
  useEffect(() => {
    if (view === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setView(null); if (e.key === 'ArrowRight') setView((v) => (v === null ? v : (v + 1) % list.length)); if (e.key === 'ArrowLeft') setView((v) => (v === null ? v : (v - 1 + list.length) % list.length)); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, list.length]);
  return (
    <Site>
      <GalleryHero slides={[{ src: facilityImages.quran, alt: 'রেহালে কুরআন তিলাওয়াতরত শিক্ষার্থীরা' }, ...images.slice(0, 2)]} />

      {/* নির্বাচিত মুহূর্ত — মোজাইক */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary py-8 text-primary-foreground shadow-elegant max-[359px]:py-6 sm:rounded-[1.25rem] sm:py-12">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl px-3 sm:px-8 lg:px-10">
            <Heading compact light eyebrow="নির্বাচিত মুহূর্ত" title="এক নজরে আমাদের প্রতিষ্ঠান" description="সবচেয়ে সুন্দর কয়েকটি মুহূর্ত — ক্লিক করলে বড় করে দেখতে পারবেন।" />
            <div className="grid auto-rows-[130px] grid-cols-2 gap-2 max-[359px]:auto-rows-[110px] max-[359px]:gap-1.5 sm:auto-rows-[190px] sm:gap-3 md:grid-cols-4">
              {featured.map((g, k) => (
                <button key={g.src + k} type="button" onClick={() => { setCat('সব'); setView(k); }} className={`group relative min-w-0 overflow-hidden rounded-lg shadow-elegant max-[359px]:rounded-md sm:rounded-2xl ${k === 0 ? 'col-span-2 row-span-2' : ''}`}>
                  <img src={g.src} alt={g.alt} loading={k > 2 ? 'lazy' : undefined} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute bottom-2 start-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-background/90 px-2 py-0.5 text-[9.5px] font-semibold text-primary sm:bottom-3 sm:start-3 sm:px-3 sm:py-1 sm:text-xs">{g.category}</span>
                  <span className="absolute end-2 top-2 grid size-7 place-items-center rounded-full bg-gold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:end-3 sm:top-3 sm:size-9"><ZoomIn className="size-3.5 sm:size-4.5" /></span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* চলমান ছবির সারি */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="overflow-hidden rounded-[0.75rem] py-4 sm:rounded-[1.25rem] sm:py-7">
          <Heading compact eyebrow="চলমান অ্যালবাম" title="ছবির ধারায় আমাদের জীবন" />
          <div className="marquee-fade mt-4 overflow-hidden sm:mt-7">
            <div className="marquee-track flex w-max gap-2.5 sm:gap-5">
              {[...marqueeImgs, ...marqueeImgs].map((g, i) => (
                <button key={i} type="button" onClick={() => { setCat('সব'); setView(i % marqueeImgs.length); }} aria-label="ছবি বড় করে দেখুন" className="shrink-0 cursor-zoom-in focus-visible:outline-none">
                  <img src={g.src} alt={g.alt} loading={i > 9 ? 'lazy' : undefined} className="h-36 w-[46.5vw] rounded-lg object-cover shadow-elegant transition-transform duration-500 hover:scale-[1.03] max-[359px]:h-28 max-[359px]:w-[47vw] sm:h-52 sm:w-[30vw] sm:rounded-2xl lg:h-60 lg:w-[18vw]" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ফটো গ্যালারি — বিভাগভিত্তিক */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section id="gallery-photos" className="relative scroll-mt-24 overflow-hidden rounded-[0.75rem] bg-primary py-8 text-primary-foreground shadow-elegant max-[359px]:py-6 sm:rounded-[1.25rem] sm:py-12">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl px-3 sm:px-8 lg:px-10">
            <Heading compact light eyebrow="ফটো গ্যালারি" title="মুহূর্তগুলোর অ্যালবাম" description="বিভাগ বেছে নিন — প্রতিটি ছবিতে ক্লিক করলে বড় করে দেখতে পারবেন।" />
            <div className="mb-4 flex flex-wrap items-center gap-1.5 sm:mb-7 sm:gap-2">
              {['সব', ...galleryCategories].map((c) => (
                <button key={c} type="button" onClick={() => { setCat(c); setView(null); }} className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors sm:px-4 sm:py-2 sm:text-sm ${cat === c ? 'border-gold bg-gold text-primary' : 'border-gold/50 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/15'}`}>{c}</button>
              ))}
            </div>
            <p className="mb-3.5 flex min-w-0 items-center gap-2 text-[11px] font-semibold text-primary-foreground/80 sm:mb-5 sm:text-sm"><Images className="size-4 shrink-0 text-gold-light" /><span className="truncate">{cat === 'সব' ? 'সব বিভাগ' : cat} — {bn(list.length)}টি ছবি</span></p>
            {list.length ? (
              <div className="columns-2 gap-2.5 sm:columns-2 sm:gap-4 lg:columns-3">
                {list.map((img, k) => (
                  <button key={img.src + k} type="button" onClick={() => setView(k)} className="group relative mb-2.5 block w-full overflow-hidden rounded-lg border border-gold/25 bg-card shadow-elegant transition-shadow duration-300 break-inside-avoid hover:shadow-lg sm:mb-4 sm:rounded-2xl">
                    <img src={img.src} alt={img.alt} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${k % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} />
                    <span className="absolute end-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-gold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:end-2.5 sm:top-2.5 sm:size-9"><ZoomIn className="size-3.5 sm:size-4.5" /></span>
                    <span className="absolute inset-x-1.5 bottom-1.5 translate-y-[130%] rounded-lg bg-background p-2 text-start shadow-elegant transition-transform duration-300 group-hover:translate-y-0 sm:inset-x-2.5 sm:bottom-2.5 sm:rounded-xl sm:p-3">
                      <span className="block text-[9px] font-bold text-gold-deep sm:text-xs">{img.category}</span>
                      <span className="block truncate text-[11px] font-semibold text-primary sm:text-sm">{img.alt}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : <p className="rounded-2xl bg-primary-foreground/10 p-10 text-center text-primary-foreground/80">এই বিভাগের ছবি শীঘ্রই যুক্ত করা হবে।</p>}
          </div>
        </section>
      </div>

      {/* ভিডিও গ্যালারি — হোম স্টাইল স্প্লিট */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative grid lg:grid-cols-2">
            <div className="min-w-0 p-5 max-[359px]:p-4 sm:p-10 lg:p-12">
              <Heading light compact eyebrow="ভিডিও" title="ক্যাম্পাস ট্যুর ও প্রতিষ্ঠানের ভিডিও" description="একটি ভিডিওতে পুরো ক্যাম্পাস, শ্রেণিকক্ষ, আবাসিক ভবন ও দৈনন্দিন জীবনের মনোরম দৃশ্য।" />
              <ul className="mb-6 grid gap-1.5 sm:gap-2.5">
                {[['camera', 'ক্যাম্পাসের প্রতিটি কোণের বাস্তব দৃশ্য'], ['clap', 'ক্লাস, হিফজ ও দৈনন্দিন রুটিনের ভিডিও']].map(([ic, txt]) => (
                  <li key={txt} className="flex min-w-0 items-center gap-2 rounded-lg border border-gold/25 bg-primary-foreground/5 px-2.5 py-2 sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-primary sm:size-8">{ic === 'camera' ? <Camera className="size-3 sm:size-4" /> : <Clapperboard className="size-3 sm:size-4" />}</span>
                    <span className="min-w-0 text-[11px] font-semibold leading-snug sm:text-sm">{txt}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-gold font-bold text-primary hover:bg-gold-light"><a href="#gallery-photos" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>ফটো গ্যালারি দেখুন<ArrowRight className="size-4 rtl:rotate-180" /></a></Button>
            </div>
            <div className="relative min-h-60 sm:min-h-80">
              {mainVideo ? <iframe title="ক্যাম্পাস ভিডিও" src={mainVideo} loading="lazy" allowFullScreen className="absolute inset-0 h-full w-full" /> : (<>
                <img src={facilityImages.playground} alt="ক্যাম্পাসের দৃশ্য" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-primary/50"><div className="text-center"><PlayCircle className="mx-auto size-14 text-gold-light sm:size-20" /><p className="mt-3 text-xs font-semibold sm:text-sm">ক্যাম্পাস ভিডিও শীঘ্রই প্রকাশিত হবে</p></div></div>
              </>)}
            </div>
          </div>
          {videos.length > 0 && <div className="relative grid gap-3 border-t border-gold/25 p-4 sm:grid-cols-3 sm:gap-5 sm:p-8">{videos.map((v) => { const e = v.image_url ? youtubeEmbed(v.image_url) : null; return e ? <div key={v.id} className="overflow-hidden rounded-xl border border-gold/30 bg-primary sm:rounded-2xl"><div className="aspect-video"><iframe title={v.title} src={e} loading="lazy" allowFullScreen className="h-full w-full" /></div><div className="p-3 text-sm font-semibold sm:p-4">{v.title}</div></div> : null; })}</div>}
        </section>
      </div>

      {/* ভর্তি CTA — হোম স্টাইল দুই প্যানেল */}
      <div className="px-2.5 pb-8 pt-2.5 max-[359px]:px-2 max-[359px]:pb-6 max-[359px]:pt-2 sm:px-5 sm:pb-16 sm:pt-5">
        <section className="grid gap-2.5 max-[359px]:gap-2 sm:gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="absolute right-3 top-3 z-10 flex size-16 items-center justify-center rounded-2xl bg-gold shadow-elegant sm:right-5 sm:top-5 sm:size-14 sm:rounded-[1rem]">
              <GraduationCap className="size-7 text-primary sm:size-7" strokeWidth={1.75} />
            </div>
            <div className="relative flex h-full flex-col justify-center px-4 py-4 max-[359px]:px-3 sm:px-7 sm:py-6 lg:px-9">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />{s.admission_badge}</span>
              <h2 className="mt-2.5 font-display text-[1.35rem] font-bold leading-[1.2] sm:mt-3 sm:pr-16 sm:text-[1.9rem] lg:text-[1.8rem] xl:text-[2.1rem]">ছবিতে যা দেখলেন,<br className="sm:hidden" /> বাস্তবে তার চেয়েও সুন্দর</h2>
              <div className="mt-2.5 h-1 w-16 rounded-full bg-gold sm:mt-3 sm:w-24" />
              <p className="mt-2.5 text-[12.5px] leading-6 text-primary-foreground/90 sm:mt-3 sm:text-[15px] sm:leading-7">সরেজমিনে ক্যাম্পাস ঘুরে দেখুন অথবা আজই অনলাইনে আবেদন করুন। আসন সীমিত।</p>
              <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-semibold text-primary sm:px-3.5 sm:py-1.5 sm:text-[11.5px]"><GraduationCap className="size-3 sm:size-3.5" />কুরআন ও জাতীয় পাঠক্রম</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-semibold text-primary sm:px-3.5 sm:py-1.5 sm:text-[11.5px]"><HomeIcon className="size-3 sm:size-3.5" />পূর্ণাঙ্গ আবাসিক ব্যবস্থা</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-semibold text-primary sm:px-3.5 sm:py-1.5 sm:text-[11.5px]"><ShieldCheck className="size-3 sm:size-3.5" />২৪ ঘণ্টা নিরাপত্তা</span>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative flex h-full flex-col p-2 max-[359px]:p-1.5 sm:p-3 lg:p-2.5">
              <div className="relative h-28 shrink-0 overflow-hidden rounded-[0.75rem] shadow-elegant max-[359px]:h-24 sm:h-36 sm:rounded-[0.9rem] lg:h-44 xl:h-48">
                <img src={facilityImages.classroom} alt="শ্রেণিকক্ষে পাঠরত শিক্ষার্থীরা" loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-primary shadow-elegant sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />আসন সীমিত</span>
              </div>
              <div className="mt-2 grid gap-2 sm:mt-2.5 sm:grid-cols-2 lg:grid-cols-2">
                <Button asChild className="bg-gold text-primary shadow-elegant hover:bg-gold-light max-sm:h-10 max-sm:w-full max-sm:justify-center max-sm:text-[13px]"><Link to="/admission">অনলাইনে আবেদন করুন <ArrowRight className="size-4 rtl:rotate-180" /></Link></Button>
                <Button asChild variant="outline" className="border-primary-foreground/60 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary max-sm:h-10 max-sm:w-full max-sm:justify-center max-sm:text-[13px]"><a href="tel:+8801711022734"><Phone className="size-4" />কথা বলুন</a></Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* লাইটবক্স */}
      {view !== null && list[view] && (
        <div role="dialog" aria-modal="true" aria-label={list[view].alt} className="fixed inset-0 z-[120] grid place-items-center bg-primary/95 p-4" onClick={() => setView(null)}>
          <button type="button" aria-label="বন্ধ করুন" className="absolute end-4 top-4 grid size-11 place-items-center rounded-full bg-gold text-primary" onClick={() => setView(null)}><X /></button>
          <button type="button" aria-label="আগের ছবি" className="absolute start-3 grid size-11 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground" onClick={(e) => { e.stopPropagation(); setView((view - 1 + list.length) % list.length); }}><ChevronLeft className="rtl:rotate-180" /></button>
          <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={list[view].src} alt={list[view].alt} className="max-h-[80vh] w-full rounded-2xl border border-gold/40 object-contain" />
            <figcaption className="mt-3 text-center text-primary-foreground"><span className="font-bold text-gold-light">{list[view].category}</span> · {list[view].alt}<span className="ms-2 text-xs text-primary-foreground/60">{bn(view + 1)} / {bn(list.length)}</span></figcaption>
          </figure>
          <button type="button" aria-label="পরের ছবি" className="absolute end-3 grid size-11 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground" onClick={(e) => { e.stopPropagation(); setView((view + 1) % list.length); }}><ChevronRight className="rtl:rotate-180" /></button>
        </div>
      )}
    </Site>
  );
}
