import { pageSeo } from '@/lib/seo-pages';
import { usePrincipal } from '@/lib/principal';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Sparkles, ArrowRight, Phone, GraduationCap, HeartHandshake, BookOpenCheck, ShieldCheck, Quote, Award } from 'lucide-react';
import { Site, Heading } from '@/components/Site';
import { StatsBar, TeachersGrid, TeachersCarousel } from '@/components/InstitutionSections';
import { photos, programs, facilityImages } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/teachers/')({
  head: (ctx) => pageSeo(ctx, '/teachers'),
  component: Teachers,
});

const qualities = [
  [GraduationCap, 'যোগ্য ও প্রশিক্ষিত', 'প্রতিটি শিক্ষক নিজ বিভাগে ডিগ্রিধারী ও অভিজ্ঞ; নিয়মিত প্রশিক্ষণের মাধ্যমে পাঠদানের মান উন্নত করা হয়।'],
  [HeartHandshake, 'আন্তরিক ও যত্নশীল', 'প্রতিটি শিক্ষার্থীকে নিজ সন্তানের মতো যত্নে পড়ানো হয়; দুর্বল শিক্ষার্থীদের জন্য রয়েছে বিশেষ যত্ন।'],
  [BookOpenCheck, 'দ্বীনি ও সাধারণ শিক্ষার সমন্বয়', 'কুরআন-সুন্নাহর আলোকে আদব-আখলাকের পাশাপাশি আধুনিক সাধারণ শিক্ষায় দক্ষ পাঠদান।'],
  [ShieldCheck, 'নিয়মিত মূল্যায়ন', 'শিক্ষার্থীর অগ্রগতি নিয়মিত মূল্যায়ন করে মাসিক রিপোর্ট অভিভাবকদের জানানো হয়।'],
] as const;

function TeachersHero() {
  return (
    <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[calc(100svh-260px)] sm:rounded-[1.25rem]">
      <img src={photos[2]} alt="ইটারনাল ফ্রিডমের শিক্ষক ও শিক্ষার্থীবৃন্দ" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 pt-16 max-[359px]:px-4 max-[359px]:pt-10 sm:justify-center sm:py-10 lg:px-8">
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />শিক্ষকমণ্ডলী</span>
        <p className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-gold-light sm:mt-4 sm:gap-3 sm:text-sm"><span className="h-px w-5 shrink-0 bg-gold sm:w-8" />যোগ্য, অভিজ্ঞ ও আন্তরিক শিক্ষকদের পরিচিতি</p>
        <h1 className="mt-1.5 max-w-5xl font-display text-[1.65rem] font-bold leading-[1.15] max-[359px]:text-[1.4rem] sm:mt-2.5 sm:text-5xl lg:text-6xl">আমাদের শিক্ষক,<br /><span className="text-gold-light">আমাদের গর্ব</span></h1>
        <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">একজন শিক্ষার্থীর শিক্ষাজীবনের সবচেয়ে গুরুত্বপূর্ণ অংশ শিক্ষক। সন্তানের শিক্ষকদের সম্পর্কে আগেই জেনে নিন।</p>
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px]"><a href="#teachers-list">শিক্ষকদের দেখুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></a></Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px]"><Link to="/admission">ভর্তি সম্পর্কে জানুন</Link></Button>
        </div>
      </div>
      <div className="relative w-full px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary shadow-elegant sm:rounded-[1.25rem]"><StatsBar hero /></div></div>
    </section>
  );
}

function Teachers() {
  const principal = usePrincipal();
  return (
    <Site>
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <TeachersHero />
      </div>

      {/* Qualities */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="rounded-[0.75rem] bg-secondary px-4 py-8 sm:rounded-[1.25rem] sm:px-8 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <Heading compact eyebrow="কেন আমাদের শিক্ষক" title="শিক্ষকদের বিশেষ গুণাবলি" description="প্রতিটি শিক্ষক নির্বাচনে আমরা যোগ্যতা, অভিজ্ঞতা ও আখলাক—তিনটিই যাচাই করি।" />
            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {qualities.map(([Icon, t, d]) => (
                <div key={t} className="rounded-2xl bg-background p-5 shadow-elegant sm:p-6">
                  <div className="grid size-11 place-items-center rounded-2xl bg-primary text-gold-light sm:size-12"><Icon className="size-5" /></div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-primary sm:text-xl">{t}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-muted-foreground sm:text-sm sm:leading-7">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Teachers grid */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section id="teachers-list" className="mx-auto max-w-7xl scroll-mt-24">
          <Heading compact eyebrow="আমাদের শিক্ষক" title="শিক্ষক ও একাডেমিক টিম" description="প্রতিটি প্রোফাইলে শিক্ষকের যোগ্যতা, অভিজ্ঞতা ও পাঠদানের বিভাগ দেওয়া আছে। প্রোফাইলে চাপ দিয়ে বিস্তারিত দেখুন।" />
          <div className="mt-6 sm:mt-8"><TeachersGrid /></div>
        </section>
      </div>

      {/* Departments */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary px-4 py-8 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:px-8 sm:py-14">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl">
            <Heading compact light eyebrow="বিভাগসমূহ" title="কোন কোন বিভাগে পাঠদান হয়" />
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
              {programs.map((p) => <Link key={p.slug} to="/academics/$slug" params={{ slug: p.slug }} className="rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-gold hover:text-primary">{p.name}</Link>)}
            </div>
            <div className="mt-6 rounded-2xl bg-primary-foreground/10 p-5 sm:mt-8 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-primary"><Award className="size-5" /></span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gold-light">ব্যক্তিগত তত্ত্বাবধান</h3>
                  <p className="mt-1 text-[13px] leading-6 text-primary-foreground/85 sm:text-sm sm:leading-7">সীমিত শিক্ষার্থী সংখ্যার কারণে প্রতিটি শিক্ষক প্রতিটি শিক্ষার্থীর প্রতি ব্যক্তিগত মনোযোগ দিতে পারেন—এটাই আমাদের পাঠদানের সবচেয়ে বড় শক্তি।</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Principal quote */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto grid max-w-7xl items-center gap-7 sm:gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
          <div className="relative min-w-0 overflow-hidden rounded-[0.75rem] bg-primary px-5 py-8 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:px-9 sm:py-12">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold text-primary sm:text-xs"><Quote className="size-3.5" />শিক্ষকদের প্রতি অধ্যক্ষের বার্তা</span>
              <blockquote className="mt-5 border-s-4 border-gold ps-4 font-display text-base leading-8 sm:mt-6 sm:ps-6 sm:text-lg sm:leading-9">“শিক্ষক শুধু পাঠদান করেন না, তিনি গড়েন চরিত্র। আমাদের প্রতিটি শিক্ষক এই দায়িত্বটুকুই সবচেয়ে বড় আমানত মনে করেন।”</blockquote>
              <div className="mt-6 flex items-center gap-3 sm:mt-7">
                <div className="grid size-11 place-items-center rounded-full bg-gold font-display text-lg font-bold text-primary sm:size-12">{principal.name.slice(0, 1)}</div>
                <div>
                  <div className="font-semibold text-gold-light">{principal.name}</div>
                  <div className="text-xs text-primary-foreground/70 sm:text-sm">{principal.role}</div>
                </div>
              </div>
            </div>
          </div>
          <img src={principal.image || undefined} alt={principal.name} className="h-72 w-full rounded-[0.75rem] object-cover object-top shadow-elegant sm:h-[440px] sm:rounded-[1.25rem]" />
        </section>
      </div>

      {/* Carousel loop */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto max-w-7xl">
          <Heading compact eyebrow="এক নজরে" title="শিক্ষকদের ঝলক" />
          <div className="mt-6 sm:mt-8"><TeachersCarousel /></div>
        </section>
      </div>

      {/* CTA banner */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
          <img src={facilityImages.classroom} alt="শ্রেণিকক্ষে পাঠদান" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold text-primary sm:text-xs"><Sparkles className="size-3.5" />ভর্তি চলছে</span>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold leading-snug sm:text-4xl">এই শিক্ষকদের হাতেই গড়ে উঠুক<br className="hidden sm:block" /> আপনার সন্তানের ভবিষ্যৎ</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/90 sm:text-base sm:leading-8">আসন সীমিত। আজই আবেদন করুন অথবা সরাসরি কথা বলুন আমাদের সাথে।</p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px]"><Link to="/admission">অনলাইনে আবেদন করুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></Link></Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px]"><Link to="/contact"><Phone className="size-4" />যোগাযোগ করুন</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </Site>
  );
}
