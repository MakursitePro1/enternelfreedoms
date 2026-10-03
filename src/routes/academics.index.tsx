import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Clock, Users, CalendarRange, GraduationCap, BookOpen, Sparkles, Phone } from 'lucide-react';
import { Site, Heading } from '@/components/Site';
import { InstitutionSections, StatsBar } from '@/components/InstitutionSections';
import { programs, facilityImages } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/academics/')({
  head: () => seo('শিক্ষা কার্যক্রম', 'সাধারণ শিক্ষা (প্লে–দশম/দাখিল), নূরানী, নাজেরা, হিফজ, কিতাব, স্পোকেন ইংলিশ, আইসিটি ও জীবনদক্ষতা—প্রতিটি বিভাগের বিস্তারিত।'),
  component: Academics,
});

const groups = ['সাধারণ শিক্ষা', 'কুরআন শিক্ষা', 'ইসলামিক স্টাডিজ', 'বিশেষ কার্যক্রম'];

function AcademicsHero() {
  return (
    <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[calc(100svh-260px)] sm:rounded-[1.25rem]">
      <img src={facilityImages.classroom} alt="ইটারনাল ফ্রিডমের শ্রেণিকক্ষে পাঠদান" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 pt-16 max-[359px]:px-4 max-[359px]:pt-10 sm:justify-center sm:py-10 lg:px-8">
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><GraduationCap className="size-3 shrink-0 sm:size-3.5" />শিক্ষা কার্যক্রম</span>
        <p className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-gold-light sm:mt-4 sm:gap-3 sm:text-sm"><span className="h-px w-5 shrink-0 bg-gold sm:w-8" />প্লে থেকে দাখিল—প্রতিটি ধাপে যত্নশীল পাঠদান</p>
        <h1 className="mt-1.5 max-w-5xl font-display text-[1.65rem] font-bold leading-[1.15] max-[359px]:text-[1.4rem] sm:mt-2.5 sm:text-5xl lg:text-6xl">একটি সমন্বিত<br /><span className="text-gold-light">শিক্ষাযাত্রা</span></h1>
        <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">অভিভাবকের সবচেয়ে গুরুত্বপূর্ণ প্রশ্ন—“আমার সন্তান এখানে কী পড়বে?”—তার পূর্ণ উত্তর। সাধারণ শিক্ষা, কুরআন শিক্ষা, ইসলামিক স্টাডিজ ও বিশেষ দক্ষতা—সবকিছু এক ছাতার নিচে।</p>
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px]"><Link to="/admission">ভর্তি আবেদন করুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></Link></Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px]"><Link to="/contact"><Phone className="size-4" />পরামর্শ নিন</Link></Button>
        </div>
      </div>
      <div className="relative w-full px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8"><div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary shadow-elegant sm:rounded-[1.25rem]"><StatsBar hero /></div></div>
    </section>
  );
}

function ProgramCard({ p }: { p: (typeof programs)[number] }) {
  return (
    <Link to="/academics/$slug" params={{ slug: p.slug }} className="group flex flex-col overflow-hidden rounded-[0.75rem] bg-background shadow-elegant premium-card sm:rounded-[1.25rem]">
      <div className="relative overflow-hidden">
        <img src={p.image} alt={p.name} loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 font-display text-[11px] font-bold text-primary shadow-elegant sm:left-4 sm:top-4 sm:text-xs">{p.number}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <h2 className="font-display text-lg font-semibold text-primary sm:text-2xl">{p.name}</h2>
        <p className="mt-2 text-[13px] leading-6 text-muted-foreground sm:mt-3 sm:text-sm sm:leading-7">{p.text}</p>
        <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3">
          <span className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-[11px] font-semibold text-primary sm:text-xs"><Users className="size-3.5 shrink-0 text-gold" />{p.age}</span>
          <span className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-[11px] font-semibold text-primary sm:text-xs"><CalendarRange className="size-3.5 shrink-0 text-gold" />{p.duration}</span>
          <span className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-[11px] font-semibold text-primary sm:text-xs"><Clock className="size-3.5 shrink-0 text-gold" />{p.classes}</span>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-primary group-hover:text-gold sm:mt-5 sm:text-sm">বিস্তারিত দেখুন <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
      </div>
    </Link>
  );
}

function Academics() {
  return (
    <Site>
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <AcademicsHero />
      </div>

      {/* Program groups */}
      {groups.map((g, gi) => (
        <div key={g} className="px-2.5 py-2.5 sm:px-5 sm:py-5">
          <section className={`rounded-[0.75rem] px-4 py-8 sm:rounded-[1.25rem] sm:px-8 sm:py-14 ${gi % 2 ? 'bg-secondary' : ''}`}>
            <div className="mx-auto max-w-7xl">
              <Heading compact eyebrow={`বিভাগ ${(gi + 1).toLocaleString('bn-BD')}`} title={g} />
              <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2">
                {programs.filter((p) => p.group === g).map((p) => <ProgramCard key={p.slug} p={p} />)}
              </div>
            </div>
          </section>
        </div>
      ))}

      {/* Why this curriculum */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto grid max-w-7xl items-center gap-7 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="relative min-w-0">
            <img src={facilityImages.library} alt="প্রতিষ্ঠানের লাইব্রেরি" className="h-72 w-full rounded-[0.75rem] object-cover shadow-elegant sm:h-[420px] sm:rounded-[1.25rem]" />
            <div className="absolute bottom-3 left-3 rounded-xl bg-gold px-4 py-2.5 text-primary shadow-elegant sm:bottom-5 sm:left-5 sm:px-5 sm:py-3">
              <div className="font-display text-lg font-bold leading-none sm:text-2xl">০৮টি</div>
              <div className="mt-1 text-[11px] font-semibold sm:text-xs">বিভাগ ও কার্যক্রম</div>
            </div>
          </div>
          <div className="min-w-0">
            <Heading compact eyebrow="পাঠক্রমের বৈশিষ্ট্য" title="কেন আমাদের শিক্ষা কার্যক্রম আলাদা" />
            <ul className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
              {[
                'জাতীয় পাঠক্রমের সঙ্গে কুরআন ও ইসলামি মূল্যবোধের পূর্ণ সমন্বয়',
                'সীমিত শিক্ষার্থী সংখ্যায় প্রতিটি শিক্ষার্থীর প্রতি ব্যক্তিগত মনোযোগ',
                'নিয়মিত মূল্যায়ন ও মাসিক অগ্রগতি রিপোর্ট অভিভাবকের কাছে',
                'স্পোকেন ইংলিশ, আইসিটি ও জীবনদক্ষতার বাড়তি চর্চা',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-primary text-gold-light sm:size-9"><BookOpen className="size-4" /></span>
                  <span className="text-sm font-medium leading-6 text-primary sm:text-[15px] sm:leading-7">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* CTA band */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary px-4 py-8 text-center text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:px-8 sm:py-14">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold text-primary sm:text-xs"><Sparkles className="size-3.5" />সঠিক বিভাগ বেছে নিন</span>
            <h2 className="mt-4 font-display text-2xl font-bold sm:mt-5 sm:text-4xl">আপনার সন্তানের জন্য সঠিক বিভাগ বেছে নিন</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-6 text-primary-foreground/85 sm:mt-4 sm:text-base sm:leading-8">বিভাগ নির্বাচন নিয়ে দ্বিধা থাকলে আমাদের সঙ্গে কথা বলুন—শিক্ষার্থীর বয়স ও যোগ্যতা অনুযায়ী পরামর্শ দেওয়া হবে।</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:mt-8 sm:gap-3">
              <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light max-sm:h-10 max-sm:text-[13px]"><Link to="/admission">ভর্তি আবেদন <ArrowRight className="size-4 rtl:rotate-180" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary max-sm:h-10 max-sm:text-[13px]"><Link to="/contact">পরামর্শ নিন</Link></Button>
            </div>
          </div>
        </section>
      </div>

      <InstitutionSections kind="program" eyebrow="বিভাগভিত্তিক তথ্য" title="পাঠক্রমের অতিরিক্ত তথ্য" />
    </Site>
  );
}
