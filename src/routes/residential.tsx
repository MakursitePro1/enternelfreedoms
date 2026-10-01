import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle2, ChefHat, Croissant, UtensilsCrossed } from 'lucide-react';
import { Site, PageIntro, Heading, DemoNote } from '@/components/Site';
import { MealTable, SafetyGrid, itemImage } from '@/components/InstitutionSections';
import { useInstitutionContent } from '@/lib/institution-content';
import { dayTimeline, parentQuestions, facilityImages, isDemo } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/residential')({
  head: () => seo('আবাসিক জীবন, খাবার ও নিরাপত্তা', 'আবাসিক কক্ষ, তিন স্তরের বিছানা, খাবারের সাপ্তাহিক মেনু, রান্নাঘর ও বেকারি, দৈনিক রুটিন এবং শিক্ষার্থীর নিরাপত্তা ব্যবস্থা।'),
  component: Residential,
});

function Residential() {
  const facilities = useInstitutionContent('facility');
  return (
    <Site>
      <PageIntro eyebrow="আবাসিক জীবন" title="যত্নে গড়া প্রতিটি দিন" description="“আমার সন্তান কোথায় থাকবে, কী খাবে, সারাদিন কী করবে, নিরাপত্তা কেমন?”—প্রতিটি প্রশ্নের উত্তর ছবি ও তথ্যসহ।" image={facilityImages.dorm} />

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading center eyebrow="অভিভাবকের প্রশ্ন" title="আপনার প্রশ্ন, আমাদের উত্তর" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">{parentQuestions.map((q) => <div key={q.q} className="overflow-hidden rounded-2xl bg-secondary shadow-elegant"><img src={facilityImages[q.img]} alt={q.q} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="p-5"><h3 className="font-display text-lg font-semibold text-primary">{q.q}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{q.a}</p></div></div>)}</div>
        </div>
      </section>

      <section className="bg-secondary px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="আবাসিক সুবিধা" title="প্রতিটি সুবিধা আলাদাভাবে" description="আবাসিক কক্ষ, তিন স্তরের বিছানা, পাঠকক্ষ, লন্ড্রি, গরম/ঠান্ডা/সাধারণ পানি, ডাইনিং, রান্নাঘর, বেকারি, চিকিৎসা, নামাজ ও বিনোদন।" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f, k) => (
              <article key={f.id} className="overflow-hidden rounded-2xl bg-background shadow-elegant premium-card">
                <img src={itemImage(f, k)} alt={f.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <div className="p-6"><div className="flex items-center justify-between gap-2"><h3 className="font-display text-lg font-semibold text-primary">{f.title}</h3><DemoNote show={isDemo(f.slug)} /></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{f.body}</p>{f.detail && <ul className="mt-3 space-y-1">{f.detail.split(',').map((b) => <li key={b} className="flex items-center gap-2 text-xs font-medium text-primary"><CheckCircle2 className="size-3.5 text-gold" />{b.trim()}</li>)}</ul>}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="খাবার ও পুষ্টি" title="নিজস্ব রান্নাঘর, বেকারি ও ডাইনিং" description="স্বাস্থ্যসম্মত পরিবেশে তৈরি তিনবেলা পুষ্টিকর খাবার। সাপ্তাহিক মেনু অ্যাডমিন প্যানেল থেকে নিয়মিত হালনাগাদ করা হয়।" />
          <div className="mb-10 grid gap-5 md:grid-cols-3">
            {[[ChefHat, 'নিজস্ব রান্নাঘর', 'প্রশিক্ষিত বাবুর্চি, পরিচ্ছন্ন হাঁড়ি-পাতিল ও টাটকা বাজার।', facilityImages.dining], [Croissant, 'নিজস্ব বেকারি', 'নাশতার জন্য ভেজালমুক্ত রুটি ও বিস্কুট।', facilityImages.dining], [UtensilsCrossed, 'পরিচ্ছন্ন ডাইনিং', 'নির্ধারিত সময়ে শিক্ষকের তত্ত্বাবধানে খাবার পরিবেশন।', facilityImages.dining]].map(([Icon, t, d]) => { const I = Icon as typeof ChefHat; return <div key={t as string} className="flex gap-4 rounded-2xl bg-secondary p-6"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold text-primary"><I className="size-6" /></div><div><h3 className="font-semibold text-primary">{t as string}</h3><p className="mt-1 text-sm text-muted-foreground">{d as string}</p></div></div>; })}
          </div>
          <h3 className="mb-4 font-display text-2xl font-semibold text-primary">সাপ্তাহিক খাবারের মেনু</h3>
          <MealTable />
        </div>
      </section>

      <section className="bg-secondary px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="দৈনিক রুটিন" title="একটি দিন Eternal Freedom-এ" description="ফজর থেকে ঘুম পর্যন্ত সুশৃঙ্খল ও ভারসাম্যপূর্ণ দিন।" />
          <ol className="relative grid gap-4 md:grid-cols-2">
            {dayTimeline.map(([time, act, desc], k) => <li key={act} className="flex gap-4 rounded-2xl bg-background p-5 shadow-elegant"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary font-display text-gold-light">{(k + 1).toLocaleString('bn-BD')}</span><div><div className="text-xs font-semibold text-gold">{time}</div><div className="font-semibold text-primary">{act}</div><p className="text-sm text-muted-foreground">{desc}</p></div></li>)}
          </ol>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><Heading eyebrow="নিরাপত্তা" title="শিক্ষার্থীর নিরাপত্তা ও যত্ন" description="সিসিটিভি, নিয়ন্ত্রিত পরিবেশ, চিকিৎসা সহায়তা, তত্ত্বাবধান ও পরিচ্ছন্ন আবাসন।" /><SafetyGrid /><div className="mt-10 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/admission">ভর্তি আবেদন</Link></Button><Button asChild size="lg" variant="secondary"><Link to="/campus">পুরো ক্যাম্পাস দেখুন</Link></Button></div></div></section>
    </Site>
  );
}
