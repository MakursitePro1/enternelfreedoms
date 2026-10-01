import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, GraduationCap, Briefcase, BookOpen, BadgeCheck } from 'lucide-react';
import { Site, DemoNote } from '@/components/Site';
import { supabase } from '@/integrations/supabase/client';
import { parseLabeled, type InstitutionItem } from '@/lib/institution-content';
import { initials, isDemo } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/teachers/$id')({
  head: () => seo('শিক্ষকের প্রোফাইল', 'Eternal Freedom Institute Al Islamia-এর শিক্ষকের পূর্ণ পরিচিতি, যোগ্যতা ও অভিজ্ঞতা।'),
  component: TeacherProfile,
});

function TeacherProfile() {
  const { id } = Route.useParams();
  const [item, setItem] = useState<InstitutionItem | null | undefined>(undefined);
  useEffect(() => {
    supabase.from('institution_content').select('*').eq('id', id).eq('kind', 'teacher').maybeSingle().then(({ data }) => setItem((data as InstitutionItem) ?? null));
  }, [id]);
  if (item === undefined) return <Site><div className="mx-auto max-w-4xl px-5 py-24"><div className="h-64 animate-pulse rounded-2xl bg-secondary" /></div></Site>;
  if (!item) return <Site><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl text-primary">প্রোফাইল পাওয়া যায়নি</h1><Button asChild className="mt-6"><Link to="/teachers">সব শিক্ষক</Link></Button></section></Site>;
  const { fields, text } = parseLabeled(item.body);
  return (
    <Site>
      <section className="relative overflow-hidden bg-primary px-5 pb-32 pt-16 text-primary-foreground lg:px-8"><div className="islamic-pattern absolute inset-0 opacity-30" /><div className="relative mx-auto max-w-5xl"><Link to="/teachers" className="inline-flex items-center gap-2 text-sm text-gold-light"><ArrowLeft className="size-4 rtl:rotate-180" />সব শিক্ষক</Link></div></section>
      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto -mt-24 max-w-5xl rounded-3xl bg-background p-8 shadow-elegant sm:p-12">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-start">
            {item.image_url ? <img src={item.image_url} alt={item.title} className="size-40 rounded-3xl object-cover shadow-elegant" /> : <div className="grid size-40 shrink-0 place-items-center rounded-3xl bg-gold-gradient font-display text-5xl font-bold text-primary shadow-elegant">{initials(item.title)}</div>}
            <div>
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start"><span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">{item.category}</span><DemoNote show={isDemo(item.slug)} /></div>
              <h1 className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">{item.title}</h1>
              <p className="mt-1 text-lg text-gold">{item.detail}</p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[[GraduationCap, 'শিক্ষাগত যোগ্যতা', fields['যোগ্যতা']], [Briefcase, 'অভিজ্ঞতা', fields['অভিজ্ঞতা']], [BookOpen, 'বিভাগ / বিষয়', item.category]].map(([Icon, l, v]) => { const I = Icon as typeof BookOpen; return <div key={l as string} className="rounded-2xl bg-secondary p-5"><I className="size-6 text-gold" /><div className="mt-3 text-xs text-muted-foreground">{l as string}</div><div className="font-semibold text-primary">{(v as string) || '—'}</div></div>; })}
          </div>
          {text && <div className="mt-8"><h2 className="flex items-center gap-2 font-display text-xl font-semibold text-primary"><BadgeCheck className="size-5 text-gold" />পেশাগত পরিচিতি</h2><p className="mt-3 whitespace-pre-line leading-8 text-muted-foreground">{text}</p></div>}
        </div>
      </section>
    </Site>
  );
}
