import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, PlayCircle, Images, Sparkles, ArrowRight, Phone, ZoomIn } from 'lucide-react';
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

function Gallery() {
  const dbPhotos = useInstitutionContent('gallery');
  const videos = useInstitutionContent('video');
  const s = useSiteSettings();
  const images = [...dbPhotos.filter((p) => p.image_url).map((p) => ({ src: p.image_url as string, category: p.category ?? 'ক্যাম্পাস', alt: p.title })), ...galleryPhotos];
  const [cat, setCat] = useState('সব');
  const [view, setView] = useState<number | null>(null);
  const list = cat === 'সব' ? images : images.filter((i) => i.category === cat);
  const mainVideo = s.video_url ? youtubeEmbed(s.video_url) : null;
  useEffect(() => {
    if (view === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setView(null); if (e.key === 'ArrowRight') setView((v) => (v === null ? v : (v + 1) % list.length)); if (e.key === 'ArrowLeft') setView((v) => (v === null ? v : (v - 1 + list.length) % list.length)); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, list.length]);
  return (
    <Site>
      <PageIntro eyebrow="গ্যালারি" title="প্রতিষ্ঠানের বাস্তব পরিবেশ" description="প্রতিষ্ঠানের বাস্তব ছবিই আমাদের সবচেয়ে বড় আস্থার প্রমাণ। ক্যাম্পাস, শ্রেণিকক্ষ, আবাসিক জীবন ও শিক্ষার্থীদের কার্যক্রমের একঝাঁক মুহূর্ত।" image={facilityImages.quran} />
      <div className="relative w-full px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary shadow-elegant sm:rounded-[1.25rem]"><StatsBar hero /></div></div>

      {/* ফটো গ্যালারি */}
      <section className="px-2.5 py-10 sm:px-5 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="ফটো গ্যালারি" title="মুহূর্তগুলোর অ্যালবাম" description="বিভাগ বেছে নিন — প্রতিটি ছবিতে ক্লিক করলে বড় করে দেখতে পারবেন।" />
          <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8">
            {['সব', ...galleryCategories].map((c) => (
              <button key={c} type="button" onClick={() => { setCat(c); setView(null); }} className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors sm:px-4 sm:py-2 sm:text-sm ${cat === c ? 'border-gold bg-primary text-gold-light' : 'border-gold/50 bg-card text-primary hover:bg-accent'}`}>{c}</button>
            ))}
          </div>
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground sm:mb-6 sm:text-sm"><Images className="size-4 text-gold-deep" />{cat === 'সব' ? 'সব বিভাগ' : cat} — {bn(list.length)}টি ছবি</p>
          {list.length ? (
            <div className="columns-2 gap-2.5 sm:columns-2 sm:gap-4 lg:columns-3">
              {list.map((img, k) => (
                <button key={img.src + k} type="button" onClick={() => setView(k)} className="group relative mb-2.5 block w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow duration-300 break-inside-avoid hover:shadow-elegant sm:mb-4 sm:rounded-2xl">
                  <img src={img.src} alt={img.alt} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${k % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} />
                  <span className="absolute end-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-gold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:end-2.5 sm:top-2.5 sm:size-9"><ZoomIn className="size-3.5 sm:size-4.5" /></span>
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-primary p-2 text-start transition-transform duration-300 group-hover:translate-y-0 sm:p-3.5">
                    <span className="block text-[9px] font-bold text-gold-light sm:text-xs">{img.category}</span>
                    <span className="block truncate text-[11px] font-semibold text-primary-foreground sm:text-sm">{img.alt}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : <p className="rounded-2xl bg-secondary p-10 text-center text-muted-foreground">এই বিভাগের ছবি শীঘ্রই যুক্ত করা হবে।</p>}
        </div>
      </section>

      {/* ভিডিও গ্যালারি */}
      <section className="bg-primary px-2.5 py-12 text-primary-foreground sm:px-5 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading light eyebrow="ভিডিও" title="ক্যাম্পাস ট্যুর ও প্রতিষ্ঠানের ভিডিও" description="চোখে দেখুন আমাদের ক্যাম্পাস, ক্লাস ও দৈনন্দিন জীবন।" />
          <div className="overflow-hidden rounded-xl border border-gold/40 shadow-elegant sm:rounded-3xl">{mainVideo ? <div className="aspect-video"><iframe title="ক্যাম্পাস ভিডিও" src={mainVideo} allowFullScreen className="h-full w-full" /></div> : <div className="relative aspect-video"><img src={facilityImages.playground} alt="ক্যাম্পাস" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 grid place-items-center bg-primary/80 text-center"><div><PlayCircle className="mx-auto size-14 text-gold-light sm:size-20" /><p className="mt-3 text-sm font-semibold sm:text-base">প্রতিষ্ঠানের ক্যাম্পাস ভিডিও শীঘ্রই প্রকাশিত হবে</p></div></div></div>}</div>
          {videos.length > 0 && <div className="mt-5 grid gap-3.5 sm:mt-6 sm:gap-5 md:grid-cols-3">{videos.map((v) => { const e = v.image_url ? youtubeEmbed(v.image_url) : null; return e ? <div key={v.id} className="overflow-hidden rounded-xl border border-gold/30 bg-primary sm:rounded-2xl"><div className="aspect-video"><iframe title={v.title} src={e} loading="lazy" allowFullScreen className="h-full w-full" /></div><div className="p-3 text-sm font-semibold sm:p-4 sm:text-base">{v.title}</div></div> : null; })}</div>}
        </div>
      </section>

      {/* ভর্তি CTA */}
      <section className="px-2.5 py-10 sm:px-5 sm:py-16 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary px-5 py-9 text-primary-foreground shadow-elegant sm:rounded-[1.5rem] sm:px-10 sm:py-14">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold text-primary sm:text-xs"><Sparkles className="size-3.5" />ভর্তি চলছে</span>
              <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold leading-snug sm:text-4xl">ছবিতে যা দেখলেন, বাস্তবে তার চেয়েও সুন্দর</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/90 sm:text-base sm:leading-8">সরেজমিনে ক্যাম্পাস ঘুরে দেখুন অথবা আজই অনলাইনে আবেদন করুন।</p>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-wrap sm:gap-3">
              <Button asChild size="lg" className="bg-gold font-bold text-primary hover:bg-gold-light"><Link to="/admission">অনলাইনে আবেদন করুন<ArrowRight className="size-4 rtl:rotate-180" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-gold/60 bg-transparent font-bold text-gold-light hover:bg-primary-foreground/10"><a href="tel:+8801711022734"><Phone className="size-4" />কথা বলুন</a></Button>
            </div>
          </div>
        </div>
      </section>

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
