import { useState } from 'react';
import { Expand, UtensilsCrossed, Coffee, Clock3, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useLang } from '@/lib/i18n';
import { mealRoutineUrl, snackRoutineUrl } from '@/lib/food-routines';

function routineTitle(kind: 'meal' | 'snack', lang: string) {
  return kind === 'meal'
    ? (lang === 'en' ? 'Daily three-meal routine' : 'দৈনিক তিন বেলা খাবারের রুটিন')
    : (lang === 'en' ? 'Weekly three-snack routine' : 'সাপ্তাহিক তিন বেলা নাস্তার রুটিন');
}

function RoutineDialog({ kind, open, onOpenChange }: { kind: 'meal' | 'snack'; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { lang } = useLang();
  const title = routineTitle(kind, lang);
  const src = kind === 'meal' ? mealRoutineUrl : snackRoutineUrl;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94svh] max-w-5xl overflow-auto border-gold bg-background p-3 pt-12 sm:p-5 sm:pt-12">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{lang === 'en' ? 'Saturday to Friday' : 'শনিবার থেকে শুক্রবার'}</DialogDescription>
        <img src={src} alt={title} className="mx-auto max-h-[80svh] w-auto max-w-full object-contain" />
      </DialogContent>
    </Dialog>
  );
}

export function FoodRoutineImage({ kind, enlarge = false }: { kind: 'meal' | 'snack'; enlarge?: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const title = routineTitle(kind, lang);
  const src = kind === 'meal' ? mealRoutineUrl : snackRoutineUrl;
  return (
    <figure className="relative min-w-0 overflow-hidden rounded-lg border border-gold shadow-elegant">
      <img src={src} alt={title} loading="lazy" decoding="async" className="block h-auto w-full" />
      {enlarge && <>
        <Button variant="secondary" size="icon" aria-label={lang === 'en' ? `Enlarge ${title}` : `${title} বড় করে দেখুন`} onClick={() => setOpen(true)} className="absolute right-3 top-3 size-10 border border-gold bg-background text-primary hover:bg-gold"><Expand className="size-4" /></Button>
        <RoutineDialog kind={kind} open={open} onOpenChange={setOpen} />
      </>}
    </figure>
  );
}

type Slot = { label: { bn: string; en: string }; time: { bn: string; en: string } };

const routineSlots: Record<'meal' | 'snack', Slot[]> = {
  meal: [
    { label: { bn: 'সকাল', en: 'Morning' }, time: { bn: '৮:০০ টা', en: '8:00 am' } },
    { label: { bn: 'দুপুর', en: 'Noon' }, time: { bn: '১:৫০ টা', en: '1:50 pm' } },
    { label: { bn: 'রাত', en: 'Night' }, time: { bn: '৯:১৫ টা', en: '9:15 pm' } },
  ],
  snack: [
    { label: { bn: '১ম বেলা', en: '1st snack' }, time: { bn: 'ফজরের নামাজের পর', en: 'After Fajr prayer' } },
    { label: { bn: '২য় বেলা', en: '2nd snack' }, time: { bn: 'সকাল ১১:০০ টা', en: '11:00 am' } },
    { label: { bn: '৩য় বেলা', en: '3rd snack' }, time: { bn: 'বিকেলে', en: 'Afternoon' } },
  ],
};

export function FoodRoutineSection({ kind, reverse = false }: { kind: 'meal' | 'snack'; reverse?: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const en = lang === 'en';
  const Icon = kind === 'meal' ? UtensilsCrossed : Coffee;
  const title = routineTitle(kind, lang);
  const src = kind === 'meal' ? mealRoutineUrl : snackRoutineUrl;
  const number = kind === 'meal' ? (en ? '01' : '০১') : (en ? '02' : '০২');
  const heading = kind === 'meal' ? (en ? 'Three daily meals' : 'তিন বেলা খাবারের রুটিন') : (en ? 'Three daily snacks' : 'তিন বেলা নাস্তার রুটিন');
  const intro = kind === 'meal'
    ? (en ? 'Morning, noon and night — a fixed weekly menu of rice, lentils, fish, chicken, meat, khichuri and biryani.' : 'সকাল, দুপুর ও রাত — ভাত, ডাল, মাছ, মুরগি, গোস্ত, খিচুড়ি ও বিরিয়ানিসহ নির্ধারিত সাপ্তাহিক মেনু।')
    : (en ? 'After Fajr, at 11 am and in the afternoon — eggs, bread, cake, biscuits, milk, payesh and more.' : 'ফজরের পর, সকাল ১১টায় ও বিকেলে — ডিম, রুটি, কেক, বিস্কুট, গরুর দুধ, পায়েসসহ নানা নাস্তা।');

  return (
    <section id={`${kind}-routine`} aria-labelledby={`${kind}-routine-title`} className="scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
      <div className={`grid min-w-0 ${reverse ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:[&>*:first-child]:order-2' : 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'}`}>
        <div className="relative flex min-w-0 flex-col border-b border-border p-5 sm:p-8 lg:border-b-0 lg:p-10">
          <div className="flex items-center justify-between gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-primary text-gold shadow-elegant sm:size-14"><Icon className="size-6" /></span>
            <span className="font-display text-5xl font-bold leading-none text-gold sm:text-6xl">{number}</span>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-gold-deep sm:text-sm"><CalendarDays className="size-4" />{en ? 'Saturday to Friday' : 'শনিবার থেকে শুক্রবার'}</p>
          <h2 id={`${kind}-routine-title`} className="mt-2 font-display text-2xl font-bold leading-snug text-primary sm:text-3xl lg:text-[2.1rem]">{heading}</h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-gold" />
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{intro}</p>
          <ul className="mt-6 hidden gap-2.5 md:grid">
            {routineSlots[kind].map((s, i) => (
              <li key={s.label.bn} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 transition-colors hover:border-gold">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold font-display text-sm font-bold text-primary">{en ? i + 1 : '১২৩'.charAt(i)}</span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-primary">{en ? s.label.en : s.label.bn}</span>
                <span className="flex items-center gap-1.5 text-right text-xs font-semibold text-gold-deep sm:text-sm"><Clock3 className="size-3.5 shrink-0" />{en ? s.time.en : s.time.bn}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" onClick={() => setOpen(true)} className="mt-7 self-start bg-primary text-primary-foreground hover:bg-primary-raised"><Expand className="size-4" />{en ? 'View full routine' : 'পুরো রুটিন বড় করে দেখুন'}</Button>
        </div>
        <div className="min-w-0 p-3 sm:p-6 lg:p-8">
          <figure className="relative overflow-hidden rounded-xl border-2 border-gold bg-card p-1.5 shadow-elegant sm:p-2">
            <button type="button" onClick={() => setOpen(true)} aria-label={en ? `Enlarge ${title}` : `${title} বড় করে দেখুন`} className="group block w-full overflow-hidden rounded-lg">
              <img src={src} alt={title} loading="lazy" decoding="async" className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]" />
            </button>
            <span className="pointer-events-none absolute right-3 top-3 grid size-10 place-items-center rounded-lg border border-gold bg-background text-primary shadow-sm sm:right-4 sm:top-4"><Expand className="size-4" /></span>
          </figure>
        </div>
      </div>
      <RoutineDialog kind={kind} open={open} onOpenChange={setOpen} />
    </section>
  );
}
