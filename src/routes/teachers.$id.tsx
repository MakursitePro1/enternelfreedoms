import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, GraduationCap, BriefcaseBusiness, BookOpen, BadgeCheck } from 'lucide-react';
import { Site } from '@/components/Site';
import { supabase } from '@/integrations/supabase/client';
import { parseLabeled, type InstitutionItem } from '@/lib/institution-content';
import { initials } from '@/lib/content';
import { teacherPath } from '@/lib/teacher-links';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/teachers/$id')({
  head: () => seo('শিক্ষকের প্রোফাইল', 'Eternal Freedom Institute Al Islamia-এর শিক্ষকের পূর্ণ পরিচিতি, যোগ্যতা ও অভিজ্ঞতা।'),
  component: TeacherProfile,
});

function TeacherProfile() {
  const { id } = Route.useParams();
  const [teachers, setTeachers] = useState<InstitutionItem[] | null>(null);
  useEffect(() => {
    let alive = true;
    setTeachers(null);
    supabase.from('institution_content').select('*').eq('kind', 'teacher').eq('published', true)
      .order('sort_order', { ascending: true }).then(({ data }) => {
        if (alive) setTeachers((data ?? []) as InstitutionItem[]);
      });
    return () => { alive = false; };
  }, [id]);
  const item = teachers?.find((teacher) => teacherPath(teacher) === id || teacher.id === id || (teacher.slug && !teacher.slug.startsWith('demo-') && teacher.slug === id));
  if (!teachers) return <Site><div className="mx-auto max-w-7xl px-2.5 py-5 sm:px-5"><div className="h-72 animate-pulse rounded-xl bg-secondary" /></div></Site>;
  if (!item) return <Site><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl text-primary">প্রোফাইল পাওয়া যায়নি</h1><Button asChild className="mt-6"><Link to="/teachers">সব শিক্ষক</Link></Button></section></Site>;
  const { fields, text } = parseLabeled(item.body);
  const facts = [
    { icon: GraduationCap, label: 'শিক্ষাগত যোগ্যতা', value: fields['যোগ্যতা'] },
    { icon: BriefcaseBusiness, label: 'অভিজ্ঞতা', value: fields['অভিজ্ঞতা'] },
    { icon: BookOpen, label: 'বিভাগ / বিষয়', value: item.category },
  ].filter((fact) => fact.value);
  return (
    <Site>
      <div className="px-2.5 pt-2.5 sm:px-5 sm:pt-5">
        <section className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative mx-auto grid max-w-7xl min-w-0 gap-4 px-4 pb-5 pt-4 sm:gap-6 sm:px-8 sm:pb-6 sm:pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.5fr)] lg:items-center lg:gap-10 lg:px-12 lg:pb-8 lg:pt-7">
            <div className="min-w-0 lg:order-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link to="/teachers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light transition-colors hover:text-gold sm:text-sm"><ArrowLeft className="size-4 rtl:rotate-180" />সব শিক্ষক</Link>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold px-2.5 py-0.5 text-[10px] font-semibold text-gold-light sm:text-xs">আমাদের শিক্ষকমণ্ডলী</span>
              </div>
              {item.category && <p className="mt-3 text-[11px] font-semibold text-gold-light sm:mt-4 sm:text-sm">{item.category}</p>}
              <h1 className="mt-1.5 max-w-xl font-display text-[clamp(1.4rem,2.4vw,2.25rem)] font-bold leading-snug break-words sm:mt-2">{item.title}</h1>
              {item.detail && <p className="mt-1.5 text-xs font-semibold text-gold-light sm:mt-2 sm:text-base">{item.detail}</p>}
              <div className="mt-3 h-1 w-14 rounded-full bg-gold sm:mt-4" />
              <p className="mt-2.5 max-w-md text-[11px] font-medium leading-6 text-primary-foreground/90 sm:text-sm">Eternal Freedom Institute Al Islamia</p>
            </div>
            <div className="min-w-0 lg:order-2">
              <div className="mx-auto aspect-square w-full max-w-[190px] overflow-hidden rounded-lg border-2 border-gold bg-primary-raised sm:max-w-[240px] lg:max-w-[280px]">
                {item.image_url ? <img src={item.image_url} alt={item.title} className="h-full w-full object-cover object-top" /> : <div className="grid h-full w-full place-items-center font-display text-5xl font-bold text-gold-light">{initials(item.title)}</div>}
              </div>
            </div>
          </div>
        </section>
      </div>

      {facts.length > 0 && <div className="px-2.5 py-2.5 sm:px-5 sm:py-5"><section className="mx-auto max-w-7xl"><div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">{facts.map(({ icon: Icon, label, value }) => <div key={label} className="flex min-w-0 items-start gap-3 rounded-lg border border-border bg-secondary p-4 sm:flex-col sm:gap-4 sm:p-6"><div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-gold-light sm:size-12"><Icon className="size-5 sm:size-6" /></div><div className="min-w-0"><p className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</p><p className="mt-1 break-words font-display text-base font-semibold leading-snug text-primary sm:text-lg">{value}</p></div></div>)}</div></section></div>}

      {text && <div className="px-2.5 py-2.5 sm:px-5 sm:py-5"><section className="mx-auto max-w-7xl border-t border-border py-6 sm:py-10"><div className="grid gap-4 lg:grid-cols-[minmax(0,.6fr)_minmax(0,1fr)] lg:gap-12"><div><span className="text-xs font-bold text-gold-deep">শিক্ষক পরিচিতি</span><h2 className="mt-2 flex items-center gap-2 font-display text-2xl font-bold text-primary sm:text-3xl"><BadgeCheck className="size-6 shrink-0 text-gold-deep" />পেশাগত পরিচিতি</h2></div><p className="whitespace-pre-line text-sm leading-8 text-foreground sm:text-base sm:leading-9">{text}</p></div></section></div>}
    </Site>
  );
}
