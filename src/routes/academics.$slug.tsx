import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowRight, CheckCircle2, Clock, Users, CalendarRange, BookOpen, Target, ListChecks, Star } from 'lucide-react';
import { Site, PageIntro, Heading } from '@/components/Site';
import { programs, facilityImageList, pick } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/academics/$slug')({
  loader: ({ params }) => {
    const program = programs.find((p) => p.slug === params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => loaderData ? seo(loaderData.program.name, loaderData.program.text, '/academics') : { meta: [{ title: 'বিভাগ পাওয়া যায়নি' }, { name: 'robots', content: 'noindex' }] },
  notFoundComponent: ProgramNotFound,
  component: ProgramDetail,
});

function ProgramNotFound() {
  return <Site><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl text-primary">বিভাগটি পাওয়া যায়নি</h1><Button asChild className="mt-6"><Link to="/academics">সব বিভাগ দেখুন</Link></Button></section></Site>;
}

function ProgramDetail() {
  const { program: p } = Route.useLoaderData();
  const idx = programs.findIndex((x) => x.slug === p.slug);
  const lists: [typeof Target, string, string[]][] = [[Target, 'শিক্ষার উদ্দেশ্য', p.goals], [ListChecks, 'কার্যক্রম', p.activities], [Star, 'শিক্ষার্থীর সুবিধা', p.benefits]];
  return (
    <Site>
      <PageIntro eyebrow={p.group} title={p.name} description={p.text} image={pick(facilityImageList, idx)} />
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.42fr]">
          <div className="space-y-6">
            {lists.map(([Icon, title, items]) => (
              <div key={title} className="rounded-2xl bg-secondary p-8">
                <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-primary"><span className="grid size-11 place-items-center rounded-xl bg-primary text-gold-light"><Icon className="size-5" /></span>{title}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">{items.map((x) => <li key={x} className="flex gap-2 leading-7 text-muted-foreground"><CheckCircle2 className="mt-1 size-5 shrink-0 text-gold" />{x}</li>)}</ul>
              </div>
            ))}
          </div>
          <aside className="h-fit space-y-4 rounded-2xl bg-primary p-7 text-primary-foreground shadow-elegant lg:sticky lg:top-28">
            <h2 className="font-display text-xl text-gold-light">এক নজরে</h2>
            {[[BookOpen, 'শ্রেণি / স্তর', p.classes], [Users, 'বয়স', p.age], [CalendarRange, 'মেয়াদ', p.duration], [Clock, 'সময়সূচি', p.schedule]].map(([Icon, l, v]) => { const I = Icon as typeof Clock; return <div key={l as string} className="flex gap-3 border-b border-primary-foreground/15 pb-4"><I className="mt-1 size-5 shrink-0 text-gold" /><div><div className="text-xs opacity-70">{l as string}</div><div className="font-semibold">{v as string}</div></div></div>; })}
            <Button asChild className="w-full bg-gold text-primary hover:bg-gold-light"><Link to="/admission">এই বিভাগে ভর্তি আবেদন <ArrowRight className="size-4 rtl:rotate-180" /></Link></Button>
          </aside>
        </div>
      </section>
      <section className="bg-secondary px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="আরও বিভাগ" title="অন্যান্য শিক্ষা কার্যক্রম" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{programs.filter((x) => x.slug !== p.slug).slice(0, 4).map((x) => <Link key={x.slug} to="/academics/$slug" params={{ slug: x.slug }} className="rounded-2xl bg-background p-6 shadow-elegant premium-card"><span className="text-xs font-semibold text-gold">{x.group}</span><h3 className="mt-2 font-display text-lg font-semibold text-primary">{x.name}</h3></Link>)}</div>
        </div>
      </section>
    </Site>
  );
}
