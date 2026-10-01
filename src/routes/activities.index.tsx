import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Site, PageIntro, Heading } from '@/components/Site';
import { EventCard, AchievementsGrid } from '@/components/InstitutionSections';
import { useInstitutionContent } from '@/lib/institution-content';
import { photos } from '@/lib/content';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/activities/')({
  head: () => seo('খবর, অনুষ্ঠান ও অর্জন', 'বার্ষিক ক্রীড়া, কুরআন প্রতিযোগিতা, শিক্ষাসফর, বনভোজন ও নৌকা ভ্রমণ, অভিভাবক সভা, শিক্ষক প্রশিক্ষণ ও অর্জনের খবর।'),
  component: Activities,
});

function Activities() {
  const items = useInstitutionContent('event');
  const cats = ['সব', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))];
  const [cat, setCat] = useState('সব');
  const list = cat === 'সব' ? items : items.filter((i) => i.category === cat);
  return (
    <Site>
      <PageIntro eyebrow="খবর ও অনুষ্ঠান" title="প্রতিষ্ঠানের কার্যক্রম ও আনন্দের মুহূর্ত" description="প্রতিযোগিতা, শিক্ষাসফর, বনভোজন, নৌকা ভ্রমণ ও বিভিন্ন আয়োজনের নিয়মিত খবর।" image={photos[3]} />
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap gap-2">{cats.map((c) => <button key={c} type="button" onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${cat === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary hover:bg-accent'}`}>{c}</button>)}</div>
          {list.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((item, i) => <EventCard key={item.id} item={item} index={i} />)}</div> : <p className="text-muted-foreground">এই বিভাগে এখনো কোনো খবর নেই।</p>}
        </div>
      </section>
      <section className="bg-secondary px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><Heading eyebrow="সাফল্য" title="অর্জনসমূহ" /><AchievementsGrid /></div></section>
    </Site>
  );
}
