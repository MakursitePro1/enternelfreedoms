import { usePrincipal } from '@/lib/principal';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Target, Eye, BookOpen, Sparkles, Rocket, ArrowRight, Phone, Quote } from 'lucide-react';
import { Site, Heading, TextLink } from '@/components/Site';
import { StatsBar, AchievementsGrid, TeachersCarousel } from '@/components/InstitutionSections';
import { photos, whyCards, programs } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/about')({
  head: () => seo('প্রতিষ্ঠান পরিচিতি', 'Eternal Freedom Institute Al Islamia-এর ইতিহাস, প্রতিষ্ঠাতা, লক্ষ্য-উদ্দেশ্য, শিক্ষাদর্শ, বিশেষত্ব, শিক্ষক-শিক্ষার্থী সংখ্যা, অর্জন ও ভবিষ্যৎ লক্ষ্য।'),
  component: About,
});

const history = [
  ['২০১৫', 'প্রতিষ্ঠা', 'গফরগাঁওয়ে অল্প কয়েকজন শিক্ষার্থী নিয়ে নূরানী ও হিফজ বিভাগের যাত্রা শুরু।'],
  ['২০১৮', 'আবাসিক ব্যবস্থা', 'পূর্ণাঙ্গ আবাসিক ভবন, নিজস্ব রান্নাঘর ও ডাইনিং চালু।'],
  ['২০২১', 'সাধারণ শিক্ষা', 'প্লে থেকে দশম শ্রেণি পর্যন্ত সাধারণ শিক্ষার সমন্বয়।'],
  ['২০২৪', 'আধুনিক সুবিধা', 'আইসিটি ল্যাব, স্পোকেন ইংলিশ ও সিসিটিভি নিরাপত্তা সংযোজন।'],
];
const futureGoals = ['পূর্ণাঙ্গ দাখিল / এসএসসি পর্যন্ত বোর্ড স্বীকৃতি', 'নতুন একাডেমিক ও আবাসিক ভবন', 'ডিজিটাল শিক্ষার্থী ও অভিভাবক পোর্টাল', 'সমৃদ্ধ লাইব্রেরি ও বিজ্ঞানাগার'];

function AboutHero() {
  return (
    <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[calc(100svh-260px)] sm:rounded-[1.25rem]">
      <img src={photos[2]} alt="ইটারনাল ফ্রিডমের শিক্ষার্থী ও শিক্ষকবৃন্দ" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 pt-16 max-[359px]:px-4 max-[359px]:pt-10 sm:justify-center sm:py-10 lg:px-8">
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />প্রতিষ্ঠান পরিচিতি</span>
        <p className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-gold-light sm:mt-4 sm:gap-3 sm:text-sm"><span className="h-px w-5 shrink-0 bg-gold sm:w-8" />গফরগাঁও, ময়মনসিংহের সমন্বিত শিক্ষা প্রতিষ্ঠান</p>
        <h1 className="mt-1.5 max-w-5xl font-display text-[1.65rem] font-bold leading-[1.15] max-[359px]:text-[1.4rem] sm:mt-2.5 sm:text-5xl lg:text-6xl">আমাদের গল্প,<br /><span className="text-gold-light">আমাদের লক্ষ্য</span></h1>
        <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">কুরআনের শিক্ষা ও সাধারণ জ্ঞানের সমন্বয়ে শিক্ষার্থীদের সুন্দর ভবিষ্যতের জন্য একটি যত্নশীল পরিবেশ।</p>
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px]"><Link to="/admission">ভর্তি সম্পর্কে জানুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></Link></Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px]"><Link to="/contact"><Phone className="size-4" />যোগাযোগ করুন</Link></Button>
        </div>
      </div>
      <div className="relative w-full px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary shadow-elegant sm:rounded-[1.25rem]"><StatsBar hero /></div></div>
    </section>
  );
}

function About() {
  const principal = usePrincipal();
  return (
    <Site>
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <AboutHero />
      </div>

      {/* History */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto grid max-w-7xl items-center gap-7 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="relative min-w-0">
            <img src={photos[0]} alt="প্রতিষ্ঠানের শিক্ষার্থীরা" className="h-72 w-full rounded-[0.75rem] object-cover shadow-elegant sm:h-[420px] sm:rounded-[1.25rem]" />
            <div className="absolute bottom-3 left-3 rounded-xl bg-gold px-4 py-2.5 text-primary shadow-elegant sm:bottom-5 sm:left-5 sm:px-5 sm:py-3">
              <div className="font-display text-lg font-bold leading-none sm:text-2xl">২০১৫</div>
              <div className="mt-1 text-[11px] font-semibold sm:text-xs">প্রতিষ্ঠার বছর</div>
            </div>
          </div>
          <div className="min-w-0">
            <Heading eyebrow="ইতিহাস" title="দ্বীনি ও সাধারণ শিক্ষার সমন্বয়ে পথচলা" />
            <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">Eternal Freedom Institute Al Islamia গফরগাঁও, ময়মনসিংহে অবস্থিত একটি সমন্বিত ইসলামী ও সাধারণ শিক্ষার সম্পূর্ণ আবাসিক প্রতিষ্ঠান। প্লে থেকে দশম / দাখিল পর্যন্ত সাধারণ শিক্ষা, নূরানী, নাজেরা, হিফজ, হিফজ শুনানি ও কিতাব বিভাগের পাশাপাশি স্পোকেন ইংলিশ, আইসিটি ও জীবনদক্ষতার চর্চা হয়। পাঠদান, আবাসিক জীবন, আদব-আখলাক এবং দক্ষতা বিকাশকে একই শিক্ষাযাত্রার অংশ হিসেবে দেখা হয়।</p>
            <ol className="mt-6 space-y-4 border-s-2 border-gold/50 ps-5 sm:mt-8 sm:space-y-5 sm:ps-6">
              {history.map(([y, t, d]) => (
                <li key={y} className="relative">
                  <span className="absolute -start-[27px] top-1 size-3.5 rounded-full border-4 border-background bg-gold sm:-start-[31px] sm:size-4" />
                  <div className="text-xs font-bold text-gold sm:text-sm">{y}</div>
                  <div className="font-semibold text-primary">{t}</div>
                  <p className="text-[13px] text-muted-foreground sm:text-sm">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      {/* Mission / Vision / Features */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="rounded-[0.75rem] bg-secondary px-4 py-8 sm:rounded-[1.25rem] sm:px-8 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <Heading compact eyebrow="আমাদের ভিত্তি" title="লক্ষ্য, দর্শন ও বৈশিষ্ট্য" />
            <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-3">
              {[[Target, 'লক্ষ্য ও উদ্দেশ্য', 'কুরআনের সঙ্গে গভীর সম্পর্ক, নৈতিক মূল্যবোধ, সাধারণ শিক্ষায় সক্ষমতা এবং জীবনদক্ষতা গড়ে তুলে দ্বীন ও দুনিয়ায় সফল মানুষ তৈরি করা।'], [Eye, 'শিক্ষাদর্শ', 'প্রতিটি শিক্ষার্থী একটি আমানত। পাঠের পাশাপাশি শৃঙ্খলা, অনুশীলন, বিশ্রাম ও খেলাধুলার ভারসাম্য এবং অভিভাবক-শিক্ষকের সম্মিলিত সহযোগিতা।'], [BookOpen, 'শিক্ষা ব্যবস্থার বৈশিষ্ট্য', 'সীমিত শিক্ষার্থী সংখ্যা, ব্যক্তিগত তত্ত্বাবধান, নিয়মিত মূল্যায়ন, মাসিক অগ্রগতি রিপোর্ট ও দ্বীনি পরিবেশে আধুনিক পাঠদান।']].map(([Icon, t, d]) => {
                const I = Icon as typeof Target;
                return (
                  <div key={t as string} className="rounded-2xl bg-background p-6 shadow-elegant sm:p-8">
                    <div className="grid size-12 place-items-center rounded-2xl bg-primary text-gold-light sm:size-14"><I className="size-5 sm:size-6" /></div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-primary sm:mt-6 sm:text-2xl">{t as string}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-muted-foreground sm:mt-3 sm:leading-8">{d as string}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Principal's message */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto grid max-w-7xl items-center gap-7 sm:gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
          <div className="relative min-w-0 overflow-hidden rounded-[0.75rem] bg-primary px-5 py-8 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:px-9 sm:py-12">
            <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold text-primary sm:text-xs"><Quote className="size-3.5" />অধ্যক্ষের বাণী</span>
              <blockquote className="mt-5 border-s-4 border-gold ps-4 font-display text-base leading-8 sm:mt-6 sm:ps-6 sm:text-lg sm:leading-9">“আমরা বিশ্বাস করি, প্রকৃত শিক্ষা মানুষকে জ্ঞানী করার পাশাপাশি চরিত্রবান ও দায়িত্বশীল করে তোলে। কুরআনের আলোয় আলোকিত হৃদয় এবং আধুনিক জ্ঞানে সমৃদ্ধ মেধা—এই দুইয়ের সমন্বয়েই আমরা প্রতিটি শিক্ষার্থীকে গড়ে তুলতে চাই।”</blockquote>
              <p className="mt-5 text-sm leading-7 text-primary-foreground/85 sm:mt-6 sm:leading-8">প্রতিষ্ঠার শুরু থেকেই তিনি একটি স্বপ্ন লালন করেছেন—গ্রামীণ জনপদেও যেন শহরের মানসম্মত শিক্ষা ও নিরাপদ আবাসিক পরিবেশ পাওয়া যায়। তাঁর নেতৃত্বে প্রতিষ্ঠানটি আজ অভিভাবকদের আস্থার নাম।</p>
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

      {/* Specialties */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary px-4 py-8 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:px-8 sm:py-14">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-7xl">
            <Heading compact light eyebrow="বিশেষত্ব" title="প্রতিষ্ঠানের বিশেষত্ব" />
            <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {whyCards.map((w) => (
                <div key={w.title} className="flex gap-3 rounded-2xl bg-primary-foreground/5 p-5 sm:p-6">
                  <Sparkles className="size-5 shrink-0 text-gold sm:size-6" />
                  <div><h3 className="font-semibold">{w.title}</h3><p className="mt-1 text-[13px] opacity-75 sm:text-sm">{w.text}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-primary-foreground/10 p-5 sm:mt-8 sm:p-6">
              <h3 className="font-semibold text-gold-light">কোন কোন ক্লাস ও বিভাগ রয়েছে</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {programs.map((p) => <Link key={p.slug} to="/academics/$slug" params={{ slug: p.slug }} className="rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm hover:bg-gold hover:text-primary">{p.name}</Link>)}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Teachers */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4"><Heading compact eyebrow="শিক্ষকমণ্ডলী" title="আমাদের শিক্ষক" /><TextLink to="/teachers">সব শিক্ষক</TextLink></div>
          <div className="mt-6 sm:mt-8"><TeachersCarousel /></div>
        </section>
      </div>

      {/* Achievements */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="rounded-[0.75rem] bg-secondary px-4 py-8 sm:rounded-[1.25rem] sm:px-8 sm:py-14">
          <div className="mx-auto max-w-7xl"><Heading compact eyebrow="অর্জন" title="গুরুত্বপূর্ণ অর্জন" /><div className="mt-6 sm:mt-8"><AchievementsGrid /></div></div>
        </section>
      </div>

      {/* Future goals */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto grid max-w-7xl items-center gap-7 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <Heading compact eyebrow="ভবিষ্যৎ লক্ষ্য" title="আগামীর পরিকল্পনা" description="মানসম্মত শিক্ষা ও সুযোগ-সুবিধা আরও বিস্তৃত করার লক্ষ্যে আমাদের পরিকল্পনা।" />
            <Button asChild size="lg" className="mt-5 bg-gold text-primary hover:bg-gold-light sm:mt-6"><Link to="/admission">আমাদের পরিবারে যোগ দিন <ArrowRight className="size-4 rtl:rotate-180" /></Link></Button>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {futureGoals.map((g) => (
              <li key={g} className="flex items-start gap-3 rounded-2xl bg-secondary p-5 shadow-elegant">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-gold-light"><Rocket className="size-4.5" /></span>
                <span className="text-sm font-medium leading-6 text-primary">{g}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Site>
  );
}
