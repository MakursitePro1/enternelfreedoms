import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight, UtensilsCrossed } from 'lucide-react';
import { Site } from '@/components/Site';
import { FoodRoutineSection } from '@/components/FoodRoutineImages';
import { useLang } from '@/lib/i18n';
import { pageSeo } from '@/lib/seo-pages';

export const Route = createFileRoute('/food')({
  head: (ctx) => pageSeo(ctx, '/food'),
  component: Food,
});

function Food() {
  const { lang, t } = useLang();
  return (
    <Site>
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
        <nav aria-label={lang === 'en' ? 'Breadcrumb' : 'পেজের অবস্থান'} className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t('হোম')}</Link><ChevronRight className="size-3" /><span>{t('খাবার ও পুষ্টি')}</span>
        </nav>
        <header className="mb-8 border-b border-border pb-7 pt-7 sm:mb-10 sm:pb-9 sm:pt-9">
          <p className="flex items-center gap-2 text-sm font-semibold text-gold-deep"><UtensilsCrossed className="size-4" />{t('খাবার ও পুষ্টি')}</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-snug text-primary sm:text-4xl">{lang === 'en' ? 'Weekly meal & snack routines' : 'সাপ্তাহিক খাবার ও নাস্তার রুটিন'}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{lang === 'en' ? 'Eternal Freedom Institute Al Islamia — three daily meals and three snacks, from Saturday to Friday.' : 'ইটার্নাল ফ্রিডম ইনস্টিটিউট আল ইসলামিয়া — শনিবার থেকে শুক্রবার, প্রতিদিনের তিন বেলা খাবার ও তিন বেলা নাস্তার তালিকা।'}</p>
        </header>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          <FoodRoutineSection kind="meal" />
          <FoodRoutineSection kind="snack" />
        </div>
      </div>
    </Site>
  );
}