import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Search, CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Site, PageIntro } from '@/components/Site';
import { supabase } from '@/integrations/supabase/client';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/notices/')({
  head: () => seo('নোটিশ বোর্ড', 'ভর্তি, পরীক্ষা, ছুটি, অভিভাবক সভা ও গুরুত্বপূর্ণ ঘোষণা—Eternal Freedom Institute Al Islamia-এর সর্বশেষ নোটিশ।'),
  component: Notices,
});

type Notice = { id: string; title: string; body: string; category: string; published_at: string };
const categories = ['সব', 'ভর্তি', 'পরীক্ষা', 'ছুটি', 'অভিভাবক সভা', 'গুরুত্বপূর্ণ', 'সাধারণ'];
const PAGE = 6;

function Notices() {
  const [all, setAll] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('সব');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  useEffect(() => { supabase.from('notices').select('id,title,body,category,published_at').order('published_at', { ascending: false }).then(({ data }) => { setAll(data ?? []); setLoading(false); }); }, []);
  const filtered = useMemo(() => all.filter((n) => (cat === 'সব' || n.category === cat) && (!q.trim() || (n.title + n.body).toLowerCase().includes(q.trim().toLowerCase()))), [all, cat, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const list = filtered.slice(page * PAGE, page * PAGE + PAGE);
  useEffect(() => setPage(0), [cat, q]);
  return (
    <Site>
      <PageIntro eyebrow="নোটিশ" title="নোটিশ ও ঘোষণা" description="প্রতিষ্ঠানের সকল গুরুত্বপূর্ণ ঘোষণা এক জায়গায়—বিভাগ অনুযায়ী খুঁজুন।" />
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">{categories.map((c) => <button key={c} type="button" onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-medium ${cat === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary hover:bg-accent'}`}>{c}</button>)}</div>
            <label className="relative block md:w-72"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input aria-label="নোটিশ খুঁজুন" placeholder="নোটিশ খুঁজুন..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full bg-secondary py-3 pe-4 ps-10 outline-none focus:ring-2 focus:ring-ring" /></label>
          </div>
          <div className="mt-8 space-y-4">
            {loading ? [0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary" />) : list.length ? list.map((n) => { const d = new Date(n.published_at); return (
              <Link key={n.id} to="/notices/$id" params={{ id: n.id }} className="group flex gap-5 rounded-2xl bg-background p-5 shadow-elegant premium-card sm:p-6">
                <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary text-center text-primary-foreground"><div><div className="font-display text-2xl leading-none text-gold-light">{d.toLocaleDateString('bn-BD', { day: 'numeric' })}</div><div className="text-[11px]">{d.toLocaleDateString('bn-BD', { month: 'short' })}</div></div></div>
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-xs"><span className="rounded-full bg-accent px-2.5 py-0.5 font-semibold text-primary">{n.category}</span><span className="flex items-center gap-1 text-muted-foreground"><CalendarDays className="size-3" />{d.toLocaleDateString('bn-BD')}</span></div><h2 className="mt-2 font-display text-lg font-semibold text-primary group-hover:text-gold sm:text-xl">{n.title}</h2><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.body}</p></div>
                <ArrowRight className="hidden size-5 shrink-0 self-center text-primary sm:block rtl:rotate-180" />
              </Link>
            ); }) : <p className="rounded-2xl bg-secondary p-8 text-center text-muted-foreground">কোনো নোটিশ পাওয়া যায়নি।</p>}
          </div>
          {pages > 1 && <div className="mt-8 flex items-center justify-center gap-2"><Button variant="secondary" size="icon" aria-label="আগের পাতা" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4 rtl:rotate-180" /></Button>{Array.from({ length: pages }, (_, i) => <Button key={i} variant={i === page ? 'default' : 'secondary'} size="icon" onClick={() => setPage(i)}>{(i + 1).toLocaleString('bn-BD')}</Button>)}<Button variant="secondary" size="icon" aria-label="পরের পাতা" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><ChevronRight className="size-4 rtl:rotate-180" /></Button></div>}
        </div>
      </section>
    </Site>
  );
}
