import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Clock, Users, CalendarRange, GraduationCap, BookOpen, Sparkles, Phone, Check, Layers3 } from 'lucide-react';
import { Site } from '@/components/Site';
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
    <section className="relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-elegant sm:min-h-[540px] sm:rounded-[1.25rem] lg:min-h-[600px]">
      <img src={facilityImages.classroom} alt="ইটারনাল ফ্রিডমের শ্রেণিকক্ষে পাঠদান" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-5 pt-12 sm:justify-center sm:px-8 sm:py-12 lg:px-12">
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-primary"><GraduationCap className="size-4" />শিক্ষা কার্যক্রম</span>
        <p className="mt-4 text-xs font-semibold text-gold-light sm:text-sm">প্লে থেকে দাখিল—প্রতিটি ধাপে যত্নশীল পাঠদান</p>
        <h1 className="mt-2 max-w-3xl font-display text-[2rem] font-bold leading-[1.18] sm:text-5xl lg:text-6xl">একটি সমন্বিত<br /><span className="text-gold-light">শিক্ষাযাত্রা</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-6 sm:text-base sm:leading-8">সাধারণ শিক্ষা, কুরআন শিক্ষা, ইসলামিক স্টাডিজ ও বিশেষ দক্ষতা—সবকিছু এক ছাতার নিচে।</p>
        <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
          <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light"><Link to="/admission">ভর্তি আবেদন করুন <ArrowRight className="size-4" /></Link></Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact"><Phone className="size-4" />পরামর্শ নিন</Link></Button>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-3 pb-3 sm:px-8 sm:pb-7 lg:px-12"><div className="overflow-hidden rounded-xl bg-primary shadow-elegant"><StatsBar hero /></div></div>
    </section>
  );
}

function ProgramCard({ p, featured = false }: { p: (typeof programs)[number]; featured?: boolean }) {
  return (
    <Link to="/academics/$slug" params={{ slug: p.slug }} className={`group grid min-w-0 grid-cols-[104px_minmax(0,1fr)] overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-elegant ${featured ? 'sm:grid-cols-[32%_minmax(0,1fr)]' : 'sm:flex sm:flex-col'}`}>
      <div className="relative min-h-full overflow-hidden sm:min-h-0">
        <img src={p.image} alt={p.name} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${featured ? '' : 'sm:relative sm:aspect-[16/9]'}`} />
        <span className="absolute left-2 top-2 rounded-md bg-gold px-2 py-0.5 font-display text-xs font-bold text-primary sm:left-3 sm:top-3">{p.number}</span>
      </div>
      <div className={`flex min-w-0 flex-col p-3.5 sm:flex-1 sm:p-4 lg:p-5 ${featured ? 'sm:justify-center' : ''}`}>
        <h3 className="font-display text-[15px] font-semibold leading-snug text-primary sm:text-lg">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-[13px] sm:leading-6">{p.text}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-medium text-primary sm:mt-3 sm:text-xs">
          <span className="inline-flex items-center gap-1"><Users className="size-3 shrink-0 text-gold-deep" />{p.age}</span>
          <span className="inline-flex min-w-0 items-center gap-1"><Clock className="size-3 shrink-0 text-gold-deep" /><span className="truncate">{p.duration}</span></span>
        </div>
        <span className={`mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-gold-deep sm:pt-3 ${featured ? '' : 'sm:mt-auto'}`}>বিস্তারিত দেখুন <ArrowUpRight className="size-3.5" /></span>
      </div>
    </Link>
  );
}

function GroupSection({ group, index }: { group: string; index: number }) {
  const items = programs.filter((p) => p.group === group);
  const image = items[0]?.image ?? facilityImages.classroom;
  return (
    <section className="px-3 py-5 sm:px-5 sm:py-7 lg:px-8" aria-labelledby={`group-${index}`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid min-h-28 grid-cols-[minmax(0,1fr)_105px] overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-elegant sm:min-h-36 sm:grid-cols-[minmax(0,1fr)_32%] sm:rounded-[1.25rem]">
          <div className="flex min-w-0 flex-col justify-center p-4 sm:p-7 lg:p-9">
            <span className="text-[11px] font-bold text-gold-light sm:text-xs">বিভাগ {(index + 1).toLocaleString('bn-BD')} / {items.length.toLocaleString('bn-BD')}টি কার্যক্রম</span>
            <h2 id={`group-${index}`} className="mt-1 font-display text-xl font-bold leading-tight sm:text-3xl">{group}</h2>
            <p className="mt-1 hidden text-sm sm:block">{items.map((p) => p.name).join(' · ')}</p>
          </div>
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className={`mt-4 grid gap-3 sm:mt-5 sm:gap-4 ${items.length === 1 ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>{items.map((p) => <ProgramCard key={p.slug} p={p} featured={items.length === 1} />)}</div>
      </div>
    </section>
  );
}

const highlights = [
  'জাতীয় পাঠক্রমের সঙ্গে কুরআন ও ইসলামি মূল্যবোধের সমন্বয়',
  'সীমিত শিক্ষার্থী সংখ্যায় ব্যক্তিগত মনোযোগ',
  'নিয়মিত মূল্যায়ন ও অগ্রগতি রিপোর্ট',
  'স্পোকেন ইংলিশ, আইসিটি ও জীবনদক্ষতার চর্চা',
];

function Academics() {
  return (
    <Site>
      <div className="px-2.5 pb-5 pt-2.5 sm:px-5 sm:pb-8 sm:pt-5"><AcademicsHero /></div>

      <div className="px-5 pb-1 pt-5 text-center sm:pt-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-gold"><Layers3 className="size-3.5" />পাঠক্রম</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-primary sm:text-4xl">প্রতিটি শিক্ষার্থীর জন্য শিক্ষার পথ</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">বিভাগ অনুযায়ী কার্যক্রম দেখুন এবং বিস্তারিত জানতে পছন্দের বিভাগে যান।</p>
      </div>
      {groups.map((group, index) => <GroupSection key={group} group={group} index={index} />)}

      <section className="px-3 py-8 sm:px-5 sm:py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl bg-secondary lg:grid-cols-[44%_56%] lg:rounded-[1.25rem]">
          <div className="relative min-h-48 sm:min-h-64 lg:min-h-full">
            <img src={facilityImages.library} alt="প্রতিষ্ঠানের লাইব্রেরি" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute bottom-3 left-3 rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-primary sm:bottom-5 sm:left-5 sm:text-sm">{programs.length.toLocaleString('bn-BD')}টি বিভাগ ও কার্যক্রম</span>
          </div>
          <div className="p-5 sm:p-8 lg:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-gold"><BookOpen className="size-3.5" />পাঠক্রমের বৈশিষ্ট্য</span>
            <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-primary sm:text-3xl">কেন আমাদের শিক্ষা কার্যক্রম আলাদা</h2>
            <ul className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">{highlights.map((text) => <li key={text} className="flex items-start gap-2.5 text-sm font-medium leading-6 text-primary"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-gold text-primary"><Check className="size-3.5" /></span>{text}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="px-3 pb-14 pt-3 sm:px-5 sm:pb-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-elegant sm:items-center sm:rounded-[1.25rem] sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><Sparkles className="size-3.5" />ভর্তি সম্পর্কে জানুন</span>
            <h2 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">আপনার সন্তানের জন্য সঠিক বিভাগ বেছে নিন</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 sm:text-base">বিভাগ নির্বাচন নিয়ে দ্বিধা থাকলে আমাদের সঙ্গে কথা বলুন—শিক্ষার্থীর বয়স ও যোগ্যতা অনুযায়ী পরামর্শ দেওয়া হবে।</p>
          </div>
          <div className="flex flex-wrap gap-2.5 lg:flex-col">
            <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><Link to="/admission">ভর্তি আবেদন <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact">পরামর্শ নিন</Link></Button>
          </div>
        </div>
      </section>

      <InstitutionSections kind="program" eyebrow="বিভাগভিত্তিক তথ্য" title="পাঠক্রমের অতিরিক্ত তথ্য" />
    </Site>
  );
}
