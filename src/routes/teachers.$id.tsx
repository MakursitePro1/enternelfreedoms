import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, GraduationCap, BriefcaseBusiness, BookOpen, BadgeCheck, UsersRound, Sparkles } from 'lucide-react';
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
  if (!teachers) return <Site><div className="mx-auto max-w-7xl px-2.5 py-5 sm:px-5"><div className="h-96 animate-pulse rounded-xl bg-secondary" /></div></Site>;
  if (!item) return <Site><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl text-primary">প্রোফাইল পাওয়া যায়নি</h1><Button asChild className="mt-6"><Link to="/teachers">সব শিক্ষক</Link></Button></section></Site>;
  const { fields, text } = parseLabeled(item.body);
  const facts = [
    { icon: GraduationCap, label: 'শিক্ষাগত যোগ্যতা', value: fields['যোগ্যতা'] },
    { icon: BriefcaseBusiness, label: 'অভিজ্ঞতা', value: fields['অভিজ্ঞতা'] },
    { icon: BookOpen, label: 'বিভাগ / বিষয়', value: item.category },
  ].filter((fact) => fact.value);
  const related = teachers.filter((teacher) => teacher.id !== item.id).slice(0, 4);
  return (
    <Site>
      <div className="px-2.5 pt-2.5 sm:px-5 sm:pt-5">
        <section className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative mx-auto grid max-w-7xl min-w-0 gap-5 px-4 pb-6 pt-5 sm:gap-8 sm:px-8 sm:pb-10 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.78fr)] lg:items-center lg:gap-14 lg:px-12 lg:py-12">
            <div className="min-w-0 lg:order-1">
              <Link to="/teachers" className="inline-flex items-center gap-2 text-xs font-semibold text-gold-light transition-colors hover:text-gold sm:text-sm"><ArrowLeft className="size-4 rtl:rotate-180" />সব শিক্ষক</Link>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold px-3 py-1 text-[11px] font-semibold text-gold-light sm:mt-12 sm:text-xs"><Sparkles className="size-3.5" />আমাদের শিক্ষকমণ্ডলী</div>
              <p className="mt-4 text-xs font-semibold text-gold-light sm:text-sm">{item.category || 'শিক্ষক পরিচিতি'}</p>
              <h1 className="mt-2 max-w-2xl font-display text-[clamp(1.75rem,3vw,3.5rem)] font-bold leading-tight break-words">{item.title}</h1>
              {item.detail && <p className="mt-3 text-base font-semibold text-gold-light sm:text-xl">{item.detail}</p>}
              <div className="mt-6 h-1 w-16 rounded-full bg-gold sm:mt-9" />
              <p className="mt-4 max-w-md text-sm leading-7 text-primary-foreground sm:text-base">Eternal Freedom Institute Al Islamia</p>
            </div>
            <div className="min-w-0 lg:order-2">
              <div className="mx-auto aspect-[4/3] max-w-[470px] overflow-hidden rounded-lg border-4 border-gold bg-primary-raised sm:aspect-[5/4] lg:aspect-[4/5]">
                {item.image_url ? <img src={item.image_url} alt={item.title} className="h-full w-full object-cover object-top" /> : <div className="grid h-full w-full place-items-center font-display text-7xl font-bold text-gold-light">{initials(item.title)}</div>}
              </div>
            </div>
          </div>
        </section>
      </div>

      {facts.length > 0 && <div className="px-2.5 py-2.5 sm:px-5 sm:py-5"><section className="mx-auto max-w-7xl"><div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">{facts.map(({ icon: Icon, label, value }) => <div key={label} className="flex min-w-0 items-start gap-3 rounded-lg border border-border bg-secondary p-4 sm:flex-col sm:gap-4 sm:p-6"><div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-gold-light sm:size-12"><Icon className="size-5 sm:size-6" /></div><div className="min-w-0"><p className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</p><p className="mt-1 break-words font-display text-base font-semibold leading-snug text-primary sm:text-lg">{value}</p></div></div>)}</div></section></div>}

      {text && <div className="px-2.5 py-2.5 sm:px-5 sm:py-5"><section className="mx-auto max-w-7xl border-t border-border py-7 sm:py-12"><div className="grid gap-4 lg:grid-cols-[minmax(0,.6fr)_minmax(0,1fr)] lg:gap-12"><div><span className="text-xs font-bold text-gold-deep">শিক্ষক পরিচিতি</span><h2 className="mt-2 flex items-center gap-2 font-display text-2xl font-bold text-primary sm:text-3xl"><BadgeCheck className="size-6 shrink-0 text-gold-deep" />পেশাগত পরিচিতি</h2></div><p className="whitespace-pre-line text-sm leading-8 text-foreground sm:text-base sm:leading-9">{text}</p></div></section></div>}

      {related.length > 0 && <div className="px-2.5 py-2.5 sm:px-5 sm:py-5"><section className="relative overflow-hidden rounded-xl bg-primary px-4 py-7 text-primary-foreground sm:rounded-[1.25rem] sm:px-8 sm:py-11"><div className="islamic-pattern pointer-events-none absolute inset-0 opacity-20" /><div className="relative mx-auto max-w-7xl"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3"><div className="min-w-0"><p className="text-xs font-bold text-gold-light">শিক্ষকমণ্ডলী</p><h2 className="mt-1 font-display text-xl font-bold sm:text-3xl">আরও শিক্ষক পরিচিতি</h2></div><Link to="/teachers" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-gold-light hover:text-gold sm:text-sm">সব শিক্ষক <ArrowRight className="size-4 rtl:rotate-180" /></Link></div><div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:gap-4 lg:grid-cols-4">{related.map((teacher) => <Link key={teacher.id} to="/teachers/$id" params={{ id: teacherPath(teacher) }} className="group min-w-0 overflow-hidden rounded-lg bg-background text-primary transition-transform hover:-translate-y-1"><div className="aspect-[5/4] overflow-hidden bg-secondary">{teacher.image_url ? <img src={teacher.image_url} alt={teacher.title} loading="lazy" className="h-full w-full object-cover object-top transition-transform group-hover:scale-105" /> : <div className="grid h-full place-items-center font-display text-3xl">{initials(teacher.title)}</div>}</div><div className="p-2.5 sm:p-4"><h3 className="line-clamp-2 font-display text-xs font-bold leading-snug sm:text-base">{teacher.title}</h3><p className="mt-1 truncate text-[11px] text-muted-foreground sm:text-sm">{teacher.detail || teacher.category}</p></div></Link>)}</div></div></section></div>}
    </Site>
  );
}
