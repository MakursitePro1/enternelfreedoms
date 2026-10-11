import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';
import { Site, DemoNote } from '@/components/Site';
import { EventCard, itemImage } from '@/components/InstitutionSections';
import { supabase } from '@/integrations/supabase/client';
import { useInstitutionContent, type InstitutionItem } from '@/lib/institution-content';
import { isDemo } from '@/lib/content';
import { youtubeEmbed } from '@/lib/site-settings';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/activities/$id')({
  head: () => seo('খবর ও অনুষ্ঠানের বিস্তারিত', 'Eternal Freedom Institute Al Islamia-এর অনুষ্ঠান ও কার্যক্রমের বিস্তারিত খবর।', '/activities'),
  component: ActivityDetail,
});

function ActivityDetail() {
  const { id } = Route.useParams();
  const [item, setItem] = useState<InstitutionItem | null | undefined>(undefined);
  const others = useInstitutionContent('event').filter((e) => e.id !== id).slice(0, 3);
  useEffect(() => { supabase.from('institution_content').select('*').eq('id', id).maybeSingle().then(({ data }) => setItem((data as InstitutionItem) ?? null)); }, [id]);
  if (item === undefined) return <Site><div className="mx-auto max-w-4xl px-5 py-24"><div className="h-80 animate-pulse rounded-2xl bg-secondary" /></div></Site>;
  if (!item) return <Site><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl text-primary">খবরটি পাওয়া যায়নি</h1><Button asChild className="mt-6"><Link to="/activities">সব খবর</Link></Button></section></Site>;
  const embed = item.image_url ? youtubeEmbed(item.image_url) : null;
  return (
    <Site>
      <article className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link to="/activities" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold"><ArrowLeft className="size-4 rtl:rotate-180" />সব খবর ও অনুষ্ঠান</Link>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-gold" />{item.detail ?? new Date(item.created_at).toLocaleDateString('bn-BD')}</span>{item.category && <span className="flex items-center gap-1.5"><Tag className="size-4 text-gold" />{item.category}</span>}<DemoNote show={isDemo(item.slug)} /></div>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-primary sm:text-5xl">{item.title}</h1>
          <div className="mt-8 overflow-hidden rounded-3xl shadow-elegant">{embed ? <div className="aspect-video"><iframe title={item.title} src={embed} allowFullScreen className="h-full w-full" /></div> : <img src={itemImage(item)} alt={item.title} className="max-h-[520px] w-full object-cover" />}</div>
          <p className="mt-8 whitespace-pre-line text-lg leading-9 text-foreground/85">{item.body}</p>
        </div>
      </article>
      {others.length > 0 && <section className="bg-secondary px-5 py-16 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="mb-8 font-display text-2xl font-semibold text-primary">আরও খবর</h2><div className="grid gap-5 md:grid-cols-3">{others.map((o, i) => <EventCard key={o.id} item={o} index={i + 1} />)}</div></div></section>}
    </Site>
  );
}
