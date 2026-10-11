import { pageSeo } from '@/lib/seo-pages';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowRight, CalendarDays, Camera, ChevronRight, Images, Trophy } from 'lucide-react';
import { Site, Heading } from '@/components/Site';
import { AchievementsGrid, EventCard, itemImage } from '@/components/InstitutionSections';
import { Button } from '@/components/ui/button';
import { useInstitutionContent } from '@/lib/institution-content';
import { photos } from '@/lib/content';
import { youtubeEmbed } from '@/lib/site-settings';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/activities/')({
  head: (ctx) => pageSeo(ctx, '/activities'),
  component: Activities,
});

function Activities() {
  const items = useInstitutionContent('event');
  const achievements = useInstitutionContent('achievement');
  const gallery = useInstitutionContent('gallery');
  const cats = ['সব', ...Array.from(new Set(items.map((item) => item.category).filter((value): value is string => Boolean(value))))];
  const [cat, setCat] = useState('সব');
  const list = cat === 'সব' ? items : items.filter((item) => item.category === cat);
  const featured = items[0];
  const featuredVideo = featured?.image_url ? youtubeEmbed(featured.image_url) : null;
  const galleryImages = gallery.filter((item) => item.image_url && !youtubeEmbed(item.image_url)).slice(0, 4);

  return (
    <Site>
      <div className="px-2.5 pt-2.5 sm:px-5 sm:pt-5">
        <section className="relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground sm:min-h-[540px] sm:rounded-[1.25rem]">
          <img src={photos[3]} alt="প্রতিষ্ঠানের শিক্ষার্থী ও শিক্ষকদের সমাবেশ" className="absolute inset-0 h-full w-full object-cover brightness-[.48]" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-24 sm:px-8 sm:pb-16 lg:px-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-1.5 text-xs font-bold text-primary"><Camera className="size-4" />খবর ও অনুষ্ঠান</span>
            <p className="mt-5 text-sm font-semibold text-gold-light">Eternal Freedom Institute Al Islamia</p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">প্রতিষ্ঠানের<br />কার্যক্রম ও মুহূর্ত</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 sm:text-base sm:leading-8">আমাদের অনুষ্ঠান, কার্যক্রম ও অর্জনের খবর এক জায়গায় দেখুন।</p>
            <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
              <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><a href="#activities-list">সব খবর দেখুন <ArrowRight className="size-4" /></a></Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/gallery"><Images className="size-4" />ছবি দেখুন</Link></Button>
            </div>
          </div>
        </section>
      </div>

      {featured && <section className="px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading compact eyebrow="সর্বশেষ আয়োজন" title="সাম্প্রতিক খবর" />
          <Link to="/activities/$id" params={{ id: featured.id }} className="group grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-2">
            <div className="relative min-h-60 overflow-hidden sm:min-h-80 lg:min-h-[390px]">
              {featuredVideo ? <iframe title={featured.title} src={featuredVideo} loading="lazy" allowFullScreen className="absolute inset-0 h-full w-full" /> : <img src={featured.image_url ?? photos[3]} alt={featured.image_url ? featured.title : 'প্রতিষ্ঠানের শিক্ষার্থী ও শিক্ষকবৃন্দ'} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
            </div>
            <div className="flex min-w-0 flex-col justify-center p-5 sm:p-8 lg:p-12">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gold-deep sm:text-sm"><CalendarDays className="size-4" />{featured.detail ?? new Date(featured.created_at).toLocaleDateString('bn-BD')}{featured.category && <span className="rounded-md bg-gold-soft px-2.5 py-1 text-primary">{featured.category}</span>}</div>
              <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-primary sm:text-3xl lg:text-4xl">{featured.title}</h2>
              {featured.body && <p className="mt-4 line-clamp-3 leading-7 text-muted-foreground">{featured.body}</p>}
              <span className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-gold pb-1 text-sm font-bold text-primary">বিস্তারিত পড়ুন <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </div>
          </Link>
        </div>
      </section>}

      <section id="activities-list" className="scroll-mt-24 px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3 sm:mb-9"><Heading compact className="mb-0" eyebrow="সব আয়োজন" title="খবর ও অনুষ্ঠান" />{items.length > 0 && <span className="text-sm font-semibold text-muted-foreground">{list.length.toLocaleString('bn-BD')}টি খবর</span>}</div>
          {cats.length > 1 && <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="খবরের বিভাগ">
            {cats.map((category) => <Button key={category} type="button" variant="outline" aria-pressed={cat === category} onClick={() => setCat(category)} className={`h-10 rounded-md border font-semibold ${cat === category ? 'border-primary bg-primary text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground' : 'border-border bg-card text-primary hover:border-gold hover:bg-gold-soft'}`}>{category}</Button>)}
          </div>}
          {list.length ? <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">{list.map((item, index) => <EventCard key={item.id} item={item} index={index} />)}</div> : <div className="border-y border-border py-12 text-center"><p className="text-muted-foreground">{items.length ? 'এই বিভাগে এখনো কোনো খবর নেই।' : 'খবর ও অনুষ্ঠানের তথ্য শীঘ্রই প্রকাশ করা হবে।'}</p>{items.length > 0 && <Button variant="outline" className="mt-5" onClick={() => setCat('সব')}>সব খবর দেখুন</Button>}</div>}
        </div>
      </section>

      {achievements.length > 0 && <section className="bg-secondary px-5 py-16 sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-8 flex items-center gap-3 text-gold-deep"><Trophy className="size-6" /><span className="text-sm font-bold">আমাদের সাফল্য</span></div><Heading compact eyebrow="অর্জন" title="অর্জনসমূহ" /><AchievementsGrid /></div></section>}

      {galleryImages.length > 0 && <section className="px-5 py-16 sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><Heading compact className="mb-0" eyebrow="ছবিতে মুহূর্ত" title="আয়োজনের ছবিগুলো" /><Button asChild variant="outline" className="border-primary text-primary"><Link to="/gallery">সব ছবি দেখুন <ChevronRight className="size-4" /></Link></Button></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">{galleryImages.map((item) => <Link to="/gallery" key={item.id} className="group relative aspect-square overflow-hidden rounded-md bg-secondary"><img src={item.image_url ?? ''} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground sm:text-sm">{item.title}</span></Link>)}</div></div></section>}

      <div className="px-2.5 pb-5 sm:px-5 sm:pb-8"><section className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground sm:rounded-[1.25rem]"><img src={photos[2]} alt="প্রতিষ্ঠানের শিক্ষার্থী ও শিক্ষকবৃন্দ" loading="lazy" className="absolute inset-0 h-full w-full object-cover brightness-[.35]" /><div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"><span className="text-sm font-bold text-gold-light">আরও দেখুন</span><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">আমাদের আরও মুহূর্ত ছবিতে</h2><p className="mt-3 max-w-xl text-sm leading-7">প্রতিষ্ঠানের ছবি ও ভিডিও দেখতে গ্যালারি ঘুরে দেখুন।</p><Button asChild size="lg" className="mt-6 bg-gold text-primary hover:bg-gold-light"><Link to="/gallery"><Images className="size-4" />গ্যালারি দেখুন <ArrowRight className="size-4" /></Link></Button></div></section></div>
    </Site>
  );
}
