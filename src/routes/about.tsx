import { createFileRoute, Link } from '@tanstack/react-router';
import { Target, Eye, BookOpen, Sparkles, Rocket, CheckCircle2 } from 'lucide-react';
import { Site, PageIntro, Heading, TextLink } from '@/components/Site';
import { StatsBar, AchievementsGrid, TeachersGrid } from '@/components/InstitutionSections';
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

function About() {
  return (
    <Site>
      <PageIntro eyebrow="প্রতিষ্ঠান পরিচিতি" title="আমাদের গল্প, আমাদের লক্ষ্য" description="কুরআনের শিক্ষা ও সাধারণ জ্ঞানের সমন্বয়ে শিক্ষার্থীদের সুন্দর ভবিষ্যতের জন্য একটি যত্নশীল পরিবেশ।" image={photos[2]} />
      <section className="relative z-10 -mt-12 px-5 lg:px-8"><div className="mx-auto max-w-7xl"><StatsBar /></div></section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8">
        <img src={photos[0]} alt="প্রতিষ্ঠানের শিক্ষার্থীরা" className="h-[460px] w-full object-cover premium-image shadow-elegant" />
        <div>
          <Heading eyebrow="ইতিহাস" title="দ্বীনি ও সাধারণ শিক্ষার সমন্বয়ে পথচলা" />
          <p className="leading-8 text-muted-foreground">Eternal Freedom Institute Al Islamia গফরগাঁও, ময়মনসিংহে অবস্থিত একটি সমন্বিত ইসলামী ও সাধারণ শিক্ষার সম্পূর্ণ আবাসিক প্রতিষ্ঠান। প্লে থেকে দশম / দাখিল পর্যন্ত সাধারণ শিক্ষা, নূরানী, নাজেরা, হিফজ, হিফজ শুনানি ও কিতাব বিভাগের পাশাপাশি স্পোকেন ইংলিশ, আইসিটি ও জীবনদক্ষতার চর্চা হয়। পাঠদান, আবাসিক জীবন, আদব-আখলাক এবং দক্ষতা বিকাশকে একই শিক্ষাযাত্রার অংশ হিসেবে দেখা হয়।</p>
          <ol className="mt-8 space-y-5 border-s-2 border-gold/50 ps-6">
            {history.map(([y, t, d]) => <li key={y} className="relative"><span className="absolute -start-[33px] top-1 size-4 rounded-full border-4 border-background bg-gold" /><div className="text-sm font-bold text-gold">{y}</div><div className="font-semibold text-primary">{t}</div><p className="text-sm text-muted-foreground">{d}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="bg-secondary px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[[Target, 'লক্ষ্য ও উদ্দেশ্য', 'কুরআনের সঙ্গে গভীর সম্পর্ক, নৈতিক মূল্যবোধ, সাধারণ শিক্ষায় সক্ষমতা এবং জীবনদক্ষতা গড়ে তুলে দ্বীন ও দুনিয়ায় সফল মানুষ তৈরি করা।'], [Eye, 'শিক্ষাদর্শ', 'প্রতিটি শিক্ষার্থী একটি আমানত। পাঠের পাশাপাশি শৃঙ্খলা, অনুশীলন, বিশ্রাম ও খেলাধুলার ভারসাম্য এবং অভিভাবক-শিক্ষকের সম্মিলিত সহযোগিতা।'], [BookOpen, 'শিক্ষা ব্যবস্থার বৈশিষ্ট্য', 'সীমিত শিক্ষার্থী সংখ্যা, ব্যক্তিগত তত্ত্বাবধান, নিয়মিত মূল্যায়ন, মাসিক অগ্রগতি রিপোর্ট ও দ্বীনি পরিবেশে আধুনিক পাঠদান।']].map(([Icon, t, d]) => { const I = Icon as typeof Target; return <div key={t as string} className="rounded-2xl bg-background p-8 shadow-elegant"><div className="grid size-14 place-items-center rounded-2xl bg-primary text-gold-light"><I className="size-6" /></div><h3 className="mt-6 font-display text-2xl font-semibold text-primary">{t as string}</h3><p className="mt-3 leading-8 text-muted-foreground">{d as string}</p></div>; })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8">
        <div>
          <Heading eyebrow="Principal's Message" title="মোঃ আনছারুল হক (আনছার)" description="Founder Principal & Director" />
          <blockquote className="border-s-4 border-gold ps-6 font-display text-lg leading-9 text-primary">“আমরা বিশ্বাস করি, প্রকৃত শিক্ষা মানুষকে জ্ঞানী করার পাশাপাশি চরিত্রবান ও দায়িত্বশীল করে তোলে। কুরআনের আলোয় আলোকিত হৃদয় এবং আধুনিক জ্ঞানে সমৃদ্ধ মেধা—এই দুইয়ের সমন্বয়েই আমরা প্রতিটি শিক্ষার্থীকে গড়ে তুলতে চাই।”</blockquote>
          <p className="mt-6 leading-8 text-muted-foreground">প্রতিষ্ঠার শুরু থেকেই তিনি একটি স্বপ্ন লালন করেছেন—গ্রামীণ জনপদেও যেন শহরের মানসম্মত শিক্ষা ও নিরাপদ আবাসিক পরিবেশ পাওয়া যায়। তাঁর নেতৃত্বে প্রতিষ্ঠানটি আজ অভিভাবকদের আস্থার নাম।</p>
        </div>
        <img src={photos[5]} alt="মোঃ আনছারুল হক" className="h-[500px] w-full object-cover object-top premium-image shadow-elegant" />
      </section>

      <section className="relative overflow-hidden bg-primary px-5 py-24 text-primary-foreground lg:px-8">
        <div className="islamic-pattern absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl">
          <Heading light eyebrow="বিশেষত্ব" title="প্রতিষ্ঠানের বিশেষত্ব" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{whyCards.map((w) => <div key={w.title} className="flex gap-3 rounded-2xl bg-primary-foreground/5 p-6"><Sparkles className="size-6 shrink-0 text-gold" /><div><h3 className="font-semibold">{w.title}</h3><p className="mt-1 text-sm opacity-75">{w.text}</p></div></div>)}</div>
          <div className="mt-10 rounded-2xl bg-primary-foreground/10 p-6"><h3 className="font-semibold text-gold-light">কোন কোন ক্লাস ও বিভাগ রয়েছে</h3><div className="mt-3 flex flex-wrap gap-2">{programs.map((p) => <Link key={p.slug} to="/academics/$slug" params={{ slug: p.slug }} className="rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm hover:bg-gold hover:text-primary">{p.name}</Link>)}</div></div>
        </div>
      </section>

      <section className="px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><Heading eyebrow="শিক্ষকমণ্ডলী" title="আমাদের শিক্ষক" /><TextLink to="/teachers">সব শিক্ষক</TextLink></div><TeachersGrid limit={4} /></div></section>
      <section className="bg-secondary px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Heading eyebrow="অর্জন" title="গুরুত্বপূর্ণ অর্জন" /><AchievementsGrid /></div></section>

      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div><Heading eyebrow="ভবিষ্যৎ লক্ষ্য" title="আগামীর পরিকল্পনা" description="মানসম্মত শিক্ষা ও সুযোগ-সুবিধা আরও বিস্তৃত করার লক্ষ্যে আমাদের পরিকল্পনা।" /><Button asChild size="lg"><Link to="/admission">আমাদের পরিবারে যোগ দিন</Link></Button></div>
          <ul className="grid gap-3 sm:grid-cols-2">{futureGoals.map((g) => <li key={g} className="flex items-start gap-3 rounded-2xl bg-secondary p-5"><Rocket className="size-5 shrink-0 text-gold" /><span className="font-medium text-primary">{g}</span></li>)}</ul>
        </div>
        <p className="mx-auto mt-10 flex max-w-7xl items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-gold" />ইতিহাস ও সংখ্যাগুলো নমুনা হিসেবে দেওয়া—অ্যাডমিন প্যানেল থেকে আসল তথ্য দিয়ে বদলানো যাবে।</p>
      </section>
    </Site>
  );
}
