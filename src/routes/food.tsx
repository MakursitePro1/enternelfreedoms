import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowDown, ChevronRight, Clock3, Coffee, Croissant, Moon, Sun, Sunrise, UtensilsCrossed, CalendarDays, Soup } from 'lucide-react';
import { Site } from '@/components/Site';
import { FoodRoutineSection } from '@/components/FoodRoutineImages';
import { Button } from '@/components/ui/button';
import { facilityImages } from '@/lib/content';
import { useLang } from '@/lib/i18n';
import { pageSeo } from '@/lib/seo-pages';

export const Route = createFileRoute('/food')({
  head: (ctx) => pageSeo(ctx, '/food'),
  component: Food,
});

function FoodHero() {
  const { lang, t } = useLang();
  const en = lang === 'en';
  const stats = [
    { value: en ? '3' : '৩', label: en ? 'Meals daily' : 'বেলা খাবার' },
    { value: en ? '3' : '৩', label: en ? 'Snacks daily' : 'বেলা নাস্তা' },
    { value: en ? '7' : '৭', label: en ? 'Day routine' : 'দিনের রুটিন' },
    { value: en ? '6' : '৬', label: en ? 'Servings a day' : 'বার পরিবেশন' },
  ];
  return (
    <section className="relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-elegant sm:min-h-[540px] sm:rounded-[1.25rem] lg:min-h-[580px]">
      <img src={facilityImages.dining} alt={en ? 'Dining hall of Eternal Freedom' : 'ইটারনাল ফ্রিডমের ডাইনিং'} className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-5 pt-12 sm:justify-center sm:px-8 sm:py-12 lg:px-12">
        <nav aria-label={en ? 'Breadcrumb' : 'পেজের অবস্থান'} className="mb-5 flex items-center gap-1.5 text-xs font-medium text-gold-light">
          <Link to="/" className="hover:text-gold">{t('হোম')}</Link><ChevronRight className="size-3" /><span>{t('খাবার ও পুষ্টি')}</span>
        </nav>
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-primary"><UtensilsCrossed className="size-4" />{t('খাবার ও পুষ্টি')}</span>
        <p className="mt-4 text-xs font-semibold text-gold-light sm:text-sm">{en ? 'Saturday to Friday — on time, every day' : 'শনিবার থেকে শুক্রবার — প্রতিদিন নির্ধারিত সময়ে'}</p>
        <h1 className="mt-2 max-w-3xl font-display text-[2rem] font-bold leading-[1.18] sm:text-5xl lg:text-6xl">{en ? <>Weekly meal &<br /><span className="text-gold-light">snack routines</span></> : <>সাপ্তাহিক খাবার ও<br /><span className="text-gold-light">নাস্তার রুটিন</span></>}</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 sm:text-base sm:leading-8">{en ? 'Eternal Freedom Institute Al Islamia — three daily meals and three snacks, served on a fixed schedule.' : 'ইটার্নাল ফ্রিডম ইনস্টিটিউট আল ইসলামিয়া — প্রতিদিন তিন বেলা খাবার ও তিন বেলা নাস্তা, নির্ধারিত সময়সূচিতে।'}</p>
        <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
          <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light"><a href="#meal-routine"><UtensilsCrossed className="size-4" />{en ? 'Meal routine' : 'খাবারের রুটিন'}<ArrowDown className="size-4" /></a></Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href="#snack-routine"><Coffee className="size-4" />{en ? 'Snack routine' : 'নাস্তার রুটিন'}</a></Button>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-3 pb-3 sm:px-8 sm:pb-7 lg:px-12">
        <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-gold bg-primary shadow-elegant">
          {stats.map((s) => (
            <div key={s.label} className="min-w-0 border-r border-panel-green-border px-1 py-2.5 text-center last:border-r-0 sm:px-3 sm:py-4">
              <div className="font-display text-xl font-bold leading-tight text-gold sm:text-3xl">{s.value}</div>
              <div className="mt-0.5 text-[10px] font-semibold leading-tight sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DailyTimeline() {
  const { lang } = useLang();
  const en = lang === 'en';
  const slots = [
    { Icon: Sunrise, kind: 'snack', time: en ? 'After Fajr' : 'ফজরের পর', title: en ? '1st snack' : '১ম বেলা নাস্তা' },
    { Icon: Sun, kind: 'meal', time: en ? '8:00 am' : 'সকাল ৮:০০', title: en ? 'Breakfast meal' : 'সকালের খাবার' },
    { Icon: Croissant, kind: 'snack', time: en ? '11:00 am' : 'সকাল ১১:০০', title: en ? '2nd snack' : '২য় বেলা নাস্তা' },
    { Icon: Soup, kind: 'meal', time: en ? '1:50 pm' : 'দুপুর ১:৫০', title: en ? 'Lunch' : 'দুপুরের খাবার' },
    { Icon: Coffee, kind: 'snack', time: en ? 'Afternoon' : 'বিকেল', title: en ? 'Afternoon snack' : 'বিকেলের নাস্তা' },
    { Icon: Moon, kind: 'meal', time: en ? '9:15 pm' : 'রাত ৯:১৫', title: en ? 'Dinner' : 'রাতের খাবার' },
  ] as const;
  return (
    <section aria-labelledby="daily-timeline-title" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-deep"><Clock3 className="size-4" />{en ? 'A day at a glance' : 'এক নজরে সারাদিন'}</p>
        <h2 id="daily-timeline-title" className="mt-2 font-display text-2xl font-bold leading-snug text-primary sm:text-4xl">{en ? 'Daily food schedule' : 'দৈনিক খাবারের সময়সূচি'}</h2>
        <div className="mx-auto mt-4 flex items-center justify-center gap-2"><span className="h-px w-10 bg-gold" /><span className="size-2 rotate-45 bg-gold" /><span className="h-px w-10 bg-gold" /></div>
      </div>
      <ol className="relative mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        <span aria-hidden className="absolute left-[8%] right-[8%] top-7 hidden h-0.5 bg-gold lg:block" />
        {slots.map((s, i) => {
          const meal = s.kind === 'meal';
          return (
            <li key={s.title} className="relative flex min-w-0 flex-col items-center rounded-2xl border border-border bg-card px-3 pb-4 pt-0 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-elegant lg:border-0 lg:bg-transparent lg:shadow-none lg:hover:shadow-none">
              <span className={`relative -mt-px grid size-14 place-items-center rounded-full border-4 border-background ${meal ? 'bg-primary text-gold' : 'bg-gold text-primary'} shadow-elegant max-lg:mt-4`}><s.Icon className="size-6" /></span>
              <span className="mt-3 font-display text-xs font-bold text-gold-deep">{en ? `Step ${i + 1}` : `ধাপ ${'১২৩৪৫৬'.charAt(i)}`}</span>
              <span className="mt-1 font-display text-base font-bold leading-snug text-primary sm:text-lg">{s.time}</span>
              <span className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{s.title}</span>
              <span className={`mt-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meal ? 'bg-primary text-primary-foreground' : 'bg-gold-soft text-gold-deep'}`}>{meal ? (en ? 'Meal' : 'খাবার') : (en ? 'Snack' : 'নাস্তা')}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Food() {
  const { lang } = useLang();
  const en = lang === 'en';
  return (
    <Site>
      <div className="px-2.5 pb-2 pt-2.5 sm:px-5 sm:pt-5"><FoodHero /></div>
      <DailyTimeline />
      <div className="pb-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-deep"><CalendarDays className="size-4" />{en ? 'Saturday to Friday' : 'শনিবার থেকে শুক্রবার'}</p>
            <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-primary sm:text-4xl">{en ? 'Full weekly routines' : 'সম্পূর্ণ সাপ্তাহিক রুটিন'}</h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2"><span className="h-px w-10 bg-gold" /><span className="size-2 rotate-45 bg-gold" /><span className="h-px w-10 bg-gold" /></div>
          </div>
          <div className="grid gap-8 sm:gap-10">
            <FoodRoutineSection kind="meal" />
            <FoodRoutineSection kind="snack" reverse />
          </div>
        </div>
      </div>
    </Site>
  );
}
