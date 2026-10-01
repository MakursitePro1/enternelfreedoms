import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, PlayCircle } from 'lucide-react';
import { Site, PageIntro, Heading } from '@/components/Site';
import { useInstitutionContent } from '@/lib/institution-content';
import { galleryCategories, galleryPhotos, facilityImages } from '@/lib/content';
import { useSiteSettings, youtubeEmbed } from '@/lib/site-settings';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/gallery')({
  head: () => seo('ফটো ও ভিডিও গ্যালারি', 'ক্যাম্পাস, শ্রেণিকক্ষ, কুরআন শিক্ষা, হিফজ, নাজেরা, কিতাব, আবাসিক জীবন, খাবার, খেলাধুলা, অনুষ্ঠান ও শিক্ষার্থীদের কার্যক্রমের ছবি ও ক্যাম্পাস ভিডিও।'),
  component: Gallery,
});

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
      <PageIntro eyebrow="গ্যালারি" title="প্রতিষ্ঠানের বাস্তব পরিবেশ" description="প্রতিষ্ঠানের বাস্তব ছবিই আমাদের সবচেয়ে বড় আস্থার প্রমাণ।" image={facilityImages.quran} />
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap gap-2">{['সব', ...galleryCategories].map((c) => <button key={c} type="button" onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${cat === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary hover:bg-accent'}`}>{c}</button>)}</div>
          {list.length ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {list.map((img, k) => (
                <button key={img.src + k} type="button" onClick={() => setView(k)} className="group relative mb-4 block w-full overflow-hidden rounded-2xl break-inside-avoid">
                  <img src={img.src} alt={img.alt} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${k % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"><div className="text-start text-primary-foreground"><div className="text-xs text-gold-light">{img.category}</div><div className="font-semibold">{img.alt}</div></div></div>
                </button>
              ))}
            </div>
          ) : <p className="rounded-2xl bg-secondary p-10 text-center text-muted-foreground">এই বিভাগের ছবি শীঘ্রই যুক্ত করা হবে।</p>}
        </div>
      </section>
      <section className="bg-primary px-5 py-20 text-primary-foreground lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading light eyebrow="ভিডিও" title="ক্যাম্পাস ট্যুর ও প্রতিষ্ঠানের ভিডিও" />
          <div className="overflow-hidden rounded-3xl shadow-elegant">{mainVideo ? <div className="aspect-video"><iframe title="ক্যাম্পাস ভিডিও" src={mainVideo} allowFullScreen className="h-full w-full" /></div> : <div className="relative aspect-video"><img src={facilityImages.playground} alt="ক্যাম্পাস" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 grid place-items-center bg-primary/60 text-center"><div><PlayCircle className="mx-auto size-20 text-gold-light" /><p className="mt-3 font-semibold">প্রতিষ্ঠানের ক্যাম্পাস ভিডিও শীঘ্রই প্রকাশিত হবে</p></div></div></div>}</div>
          {videos.length > 0 && <div className="mt-6 grid gap-5 md:grid-cols-3">{videos.map((v) => { const e = v.image_url ? youtubeEmbed(v.image_url) : null; return e ? <div key={v.id} className="overflow-hidden rounded-2xl bg-primary-foreground/10"><div className="aspect-video"><iframe title={v.title} src={e} loading="lazy" allowFullScreen className="h-full w-full" /></div><div className="p-4 font-semibold">{v.title}</div></div> : null; })}</div>}
        </div>
      </section>
      {view !== null && list[view] && (
        <div role="dialog" aria-modal="true" aria-label={list[view].alt} className="fixed inset-0 z-[120] grid place-items-center bg-primary/95 p-4" onClick={() => setView(null)}>
          <button type="button" aria-label="বন্ধ করুন" className="absolute end-4 top-4 grid size-11 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground" onClick={() => setView(null)}><X /></button>
          <button type="button" aria-label="আগের ছবি" className="absolute start-3 grid size-11 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground" onClick={(e) => { e.stopPropagation(); setView((view - 1 + list.length) % list.length); }}><ChevronLeft className="rtl:rotate-180" /></button>
          <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}><img src={list[view].src} alt={list[view].alt} className="max-h-[80vh] w-full rounded-2xl object-contain" /><figcaption className="mt-3 text-center text-primary-foreground"><span className="text-gold-light">{list[view].category}</span> · {list[view].alt}</figcaption></figure>
          <button type="button" aria-label="পরের ছবি" className="absolute end-3 grid size-11 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground" onClick={(e) => { e.stopPropagation(); setView((view + 1) % list.length); }}><ChevronRight className="rtl:rotate-180" /></button>
        </div>
      )}
    </Site>
  );
}
