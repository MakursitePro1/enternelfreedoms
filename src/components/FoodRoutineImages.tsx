import { useState } from 'react';
import { Expand, UtensilsCrossed, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useLang } from '@/lib/i18n';
import { mealRoutineUrl, snackRoutineUrl } from '@/lib/food-routines';

export function FoodRoutineImage({ kind, enlarge = false }: { kind: 'meal' | 'snack'; enlarge?: boolean }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const title = kind === 'meal'
    ? (lang === 'en' ? 'Daily three-meal routine' : 'দৈনিক তিন বেলা খাবারের রুটিন')
    : (lang === 'en' ? 'Weekly three-snack routine' : 'সাপ্তাহিক তিন বেলা নাস্তার রুটিন');
  const src = kind === 'meal' ? mealRoutineUrl : snackRoutineUrl;
  return (
    <figure className="relative min-w-0 overflow-hidden rounded-lg border border-gold shadow-elegant">
      <img src={src} alt={title} loading="lazy" decoding="async" className="block h-auto w-full" />
      {enlarge && <>
        <Button variant="secondary" size="icon" aria-label={lang === 'en' ? `Enlarge ${title}` : `${title} বড় করে দেখুন`} onClick={() => setOpen(true)} className="absolute right-3 top-3 size-10 border border-gold bg-background text-primary hover:bg-gold"><Expand className="size-4" /></Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[94svh] max-w-5xl overflow-auto border-gold bg-background p-3 pt-12 sm:p-5 sm:pt-12">
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">{lang === 'en' ? 'Saturday to Friday' : 'শনিবার থেকে শুক্রবার'}</DialogDescription>
            <img src={src} alt={title} className="mx-auto max-h-[80svh] w-auto max-w-full object-contain" />
          </DialogContent>
        </Dialog>
      </>}
    </figure>
  );
}

export function FoodRoutineSection({ kind }: { kind: 'meal' | 'snack' }) {
  const { lang } = useLang();
  const Icon = kind === 'meal' ? UtensilsCrossed : Coffee;
  return (
    <section className="min-w-0" aria-labelledby={`${kind}-routine-title`}>
      <div className="mb-5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-gold pb-5 sm:gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary text-gold"><Icon className="size-5" /></span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">{lang === 'en' ? 'Saturday to Friday' : 'শনিবার থেকে শুক্রবার'}</p>
          <h2 id={`${kind}-routine-title`} className="mt-1 font-display text-xl font-semibold leading-snug text-primary sm:text-2xl">{kind === 'meal' ? (lang === 'en' ? 'Three daily meals' : 'তিন বেলা খাবারের রুটিন') : (lang === 'en' ? 'Three daily snacks' : 'তিন বেলা নাস্তার রুটিন')}</h2>
        </div>
      </div>
      <FoodRoutineImage kind={kind} enlarge />
    </section>
  );
}