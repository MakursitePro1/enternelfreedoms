import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, BookOpen, Check, ChefHat, Croissant, Home, Layers3, Phone, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Site, DemoNote } from '@/components/Site';
import { StatsBar, MealTable, SafetyGrid, itemImage } from '@/components/InstitutionSections';
import { useInstitutionContent, type InstitutionItem } from '@/lib/institution-content';
import { dayTimeline, parentQuestions, facilityImages, isDemo } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/residential')({
  head: () => seo('আবাসিক জীবন, খাবার ও নিরাপত্তা', 'আবাসিক কক্ষ, তিন স্তরের বিছানা, খাবারের সাপ্তাহিক মেনু, রান্নাঘর ও বেকারি, দৈনিক রুটিন এবং শিক্ষার্থীর নিরাপত্তা ব্যবস্থা।'),
  component: Residential,
});

const bn = (n: number | string) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'.charAt(Number(d)));

function ResidentialHero() {
  return (
    <section className="relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-elegant sm:min-h-[540px] sm:rounded-[1.25rem] lg:min-h-[600px]">
      <img src={facilityImages.dorm} alt="ইটারনাল ফ্রিডমের আবাসিক কক্ষ" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-5 pt-12 sm:justify-center sm:px-8 sm:py-12 lg:px-12">
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-primary"><Home className="size-4" />আবাসিক জীবন</span>
        <p className="mt-4 text-xs font-semibold text-gold-light sm:text-sm">থাকা, খাবার ও নিরাপত্তা—প্রতিটি দিনে যত্ন</p>
        <h1 className="mt-2 max-w-3xl font-display text-[2rem] font-bold leading-[1.18] sm:text-5xl lg:text-6xl">যত্নে গড়া<br /><span className="text-gold-light">প্রতিটি দিন</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-6 sm:text-base sm:leading-8">আবাসিক কক্ষ, পুষ্টিকর খাবার, সুশৃঙ্খল রুটিন ও নিরাপদ পরিবেশ—সবকিছু এক ছাতার নিচে।</p>
        <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
          <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light"><Link to="/admission">ভর্তি আবেদন করুন <ArrowRight className="size-4" /></Link></Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact"><Phone className="size-4" />যোগাযোগ করুন</Link></Button>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-3 pb-3 sm:px-8 sm:pb-7 lg:px-12"><div className="overflow-hidden rounded-xl bg-primary shadow-elegant"><StatsBar hero /></div></div>
    </section>
  );
}

function QuestionCard({ q, index }: { q: (typeof parentQuestions)[number]; index: number }) {
  return (
    <article className="group grid h-full min-w-0 grid-cols-[100px_minmax(0,1fr)] overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-elegant sm:flex sm:flex-col">
      <div className="relative min-h-[110px] overflow-hidden sm:aspect-[4/3] sm:min-h-0">
        <img src={facilityImages[q.img]} alt={q.q} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-2 top-2 rounded-md bg-gold px-2 py-0.5 font-display text-[11px] font-bold text-primary sm:left-3 sm:top-3 sm:text-xs">{bn(index + 1)}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center p-3.5 sm:justify-start sm:p-4 lg:p-5">
        <h3 className="font-display text-[15px] font-semibold leading-snug text-primary sm:text-base lg:text-lg">{q.q}</h3>
        <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground sm:mt-1.5 sm:line-clamp-none sm:text-[13px] sm:leading-6">{q.a}</p>
      </div>
    </article>
  );
}

function FacilityCard({ f, index }: { f: InstitutionItem; index: number }) {
  return (
    <article className="group grid h-full min-w-0 grid-cols-[100px_minmax(0,1fr)] overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-elegant sm:flex sm:flex-col">
      <div className="relative min-h-[110px] overflow-hidden sm:aspect-[4/3] sm:min-h-0">
        <img src={itemImage(f, index)} alt={f.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-2 top-2 rounded-md bg-gold px-2 py-0.5 font-display text-[11px] font-bold text-primary sm:left-3 sm:top-3 sm:text-xs">{bn(index + 1)}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center p-3.5 sm:justify-start sm:p-4 lg:p-5">
        <div className="flex items-start justify-between gap-2"><h3 className="font-display text-[15px] font-semibold leading-snug text-primary sm:text-base lg:text-lg">{f.title}</h3><DemoNote show={isDemo(f.slug)} /></div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:mt-1.5 sm:text-[13px] sm:leading-6">{f.body}</p>
        {f.detail && <ul className="mt-2 hidden gap-1 sm:grid">{f.detail.split(',').slice(0, 3).map((b) => <li key={b} className="flex items-center gap-1.5 text-[11px] font-medium text-primary"><Check className="size-3.5 shrink-0 text-gold-deep" />{b.trim()}</li>)}</ul>}
      </div>
    </article>
  );
}

const foodItems = [
  { Icon: ChefHat, title: 'নিজস্ব রান্নাঘর', text: 'প্রশিক্ষিত বাবুর্চি, পরিচ্ছন্ন হাঁড়ি-পাতিল ও টাটকা বাজার।' },
  { Icon: Croissant, title: 'নিজস্ব বেকারি', text: 'নাশতার জন্য ভেজালমুক্ত রুটি ও বিস্কুট।' },
  { Icon: UtensilsCrossed, title: 'পরিচ্ছন্ন ডাইনিং', text: 'নির্ধারিত সময়ে শিক্ষকের তত্ত্বাবধানে খাবার পরিবেশন।' },
];

const safetyPoints = ['২৪ ঘণ্টা তত্ত্বাবধান', 'সিসিটিভি পর্যবেক্ষণ', 'নিয়ন্ত্রিত প্রবেশ', 'চিকিৎসা সহায়তা', 'পরিচ্ছন্ন আবাসন', 'শিক্ষকের সরাসরি তত্ত্বাবধান'];

function Residential() {
  const facilities = useInstitutionContent('facility');
  return (
    <Site>
      <div className="px-2.5 pb-5 pt-2.5 sm:px-5 sm:pb-8 sm:pt-5"><ResidentialHero /></div>

      <div className="px-5 pb-1 pt-5 text-center sm:pt-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-gold"><Home className="size-3.5" />অভিভাবকের প্রশ্ন</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-primary sm:text-4xl">আপনার প্রশ্ন, আমাদের উত্তর</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">“আমার সন্তান কোথায় থাকবে, কী খাবে, নিরাপত্তা কেমন?”—প্রতিটি প্রশ্নের সরাসরি উত্তর।</p>
      </div>
      <section className="px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {parentQuestions.map((q, i) => <QuestionCard key={q.q} q={q} index={i} />)}
        </div>
      </section>

      <section className="px-3 py-4 sm:px-5 sm:py-6 lg:px-8" aria-labelledby="residential-facilities">
        <div className="mx-auto grid max-w-7xl gap-3 sm:gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-5">
          <div className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-elegant sm:flex-row lg:flex-col">
            <div className="relative h-36 shrink-0 overflow-hidden sm:h-auto sm:w-[38%] lg:h-44 lg:w-full">
              <img src={facilityImages.dorm} alt="আবাসিক সুবিধা" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 font-display text-xs font-bold text-primary">আবাসিক সুবিধা</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-6">
              <span className="text-xs font-bold text-gold-light">{bn(facilities.length)}টি সুবিধা</span>
              <h2 id="residential-facilities" className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">প্রতিটি সুবিধা আলাদাভাবে</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {facilities.slice(0, 4).map((f) => <span key={f.id} className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-primary sm:text-xs">{f.title}</span>)}
              </div>
            </div>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-3 sm:gap-4">
            {facilities.slice(0, 3).map((f, k) => <FacilityCard key={f.id} f={f} index={k} />)}
          </div>
        </div>
        {facilities.length > 3 && (
          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {facilities.slice(3).map((f, k) => <FacilityCard key={f.id} f={f} index={k + 3} />)}
          </div>
        )}
      </section>

      <section className="px-3 py-8 sm:px-5 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-xl bg-secondary lg:grid-cols-[44%_56%] lg:rounded-[1.25rem]">
            <div className="relative min-h-48 sm:min-h-64 lg:min-h-full">
              <img src={facilityImages.dining} alt="প্রতিষ্ঠানের ডাইনিং ও রান্নাঘর" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute bottom-3 left-3 rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-primary sm:bottom-5 sm:left-5 sm:text-sm">{bn(3)} বেলা পুষ্টিকর খাবার</span>
            </div>
            <div className="p-5 sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-gold"><UtensilsCrossed className="size-3.5" />খাবার ও পুষ্টি</span>
              <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-primary sm:text-3xl">নিজস্ব রান্নাঘর, বেকারি ও ডাইনিং</h2>
              <ul className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1">
                {foodItems.map(({ Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background p-3.5 shadow-sm sm:p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold text-primary sm:size-10"><Icon className="size-4 sm:size-5" /></span>
                    <span className="min-w-0"><span className="block text-sm font-semibold text-primary">{title}</span><span className="mt-0.5 block text-xs leading-5 text-muted-foreground sm:text-[13px]">{text}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold text-primary sm:mb-4 sm:text-2xl"><BookOpen className="size-5 text-gold-deep" />সাপ্তাহিক খাবারের মেনু</h3>
            <MealTable />
          </div>
        </div>
      </section>

      <section className="px-3 pb-4 pt-4 sm:px-5 sm:pt-6 lg:px-8" aria-labelledby="residential-routine">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-xl bg-primary p-5 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:p-8 lg:p-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><Sparkles className="size-3.5" />দৈনিক রুটিন</span>
            <h2 id="residential-routine" className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">একটি দিন Eternal Freedom-এ</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-primary-foreground/85 sm:text-base">ফজর থেকে ঘুম পর্যন্ত সুশৃঙ্খল ও ভারসাম্যপূর্ণ দিন।</p>
          </div>
          <ol className="mt-6 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {dayTimeline.map(([time, act, desc], k) => (
              <li key={act} className="rounded-xl bg-primary-raised p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-gold font-display text-[11px] font-bold text-primary sm:size-8 sm:text-xs">{bn(k + 1)}</span>
                  <span className="truncate rounded-full bg-gold-soft px-2 py-0.5 text-[10.5px] font-bold text-gold-deep sm:text-xs">{time}</span>
                </div>
                <div className="mt-2 text-sm font-bold text-gold-light sm:text-[15px]">{act}</div>
                <p className="mt-0.5 text-xs leading-5 text-primary-foreground/80 sm:text-[13px]">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-3 py-8 sm:px-5 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-gold"><ShieldCheck className="size-3.5" />নিরাপত্তা</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-primary sm:text-4xl">শিক্ষার্থীর নিরাপত্তা ও যত্ন</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">সিসিটিভি, নিয়ন্ত্রিত পরিবেশ, চিকিৎসা সহায়তা ও তত্ত্বাবধানে পরিচ্ছন্ন আবাসন।</p>
            <div className="mx-auto mt-4 flex max-w-4xl flex-wrap justify-center gap-1.5">
              {safetyPoints.map((p) => <span key={p} className="rounded-full bg-gold-soft px-3 py-1 text-[11px] font-bold text-gold-deep sm:text-xs">{p}</span>)}
            </div>
          </div>
          <div className="mt-6 sm:mt-8"><SafetyGrid /></div>
        </div>
      </section>

      <section className="px-3 pb-14 pt-3 sm:px-5 sm:pb-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-elegant sm:items-center sm:rounded-[1.25rem] sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><Layers3 className="size-3.5" />ভর্তি সম্পর্কে জানুন</span>
            <h2 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">আপনার সন্তানের জন্য সঠিক সিদ্ধান্ত নিন</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 sm:text-base">আবাসন, খাবার ও ভর্তি প্রক্রিয়া নিয়ে যেকোনো প্রশ্নে আমাদের সঙ্গে কথা বলুন—পরামর্শ দেওয়া হবে।</p>
          </div>
          <div className="flex flex-wrap gap-2.5 lg:flex-col">
            <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><Link to="/admission">ভর্তি আবেদন <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact">পরামর্শ নিন</Link></Button>
          </div>
        </div>
      </section>

    </Site>
  );
}
